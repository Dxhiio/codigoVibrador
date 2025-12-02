import "dotenv/config";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Configuration - remove quotes if present
const API_KEY = process.env.HTB_API_KEY?.replace(/"/g, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.replace(/"/g, '');
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)?.replace(/"/g, '');

if (!API_KEY) {
    console.error("Error: HTB_API_KEY is not defined");
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: Supabase configuration is missing");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Constants
const BASE_URL = "https://labs.hackthebox.com/api/v4";
const RATE_LIMIT_DELAY = 2000; // 2 seconds delay between requests
const MAX_RETRIES = 10; // High retry count for robustness

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeApiRequest(url, retries = 0) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            },
            timeout: 30000 // 30s timeout
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            // If rate limited, wait and retry indefinitely (or up to MAX_RETRIES)
            const delay = RATE_LIMIT_DELAY * Math.pow(2, retries + 1);
            console.warn(`  ⚠️  Rate limited on ${url}. Retrying in ${delay/1000}s... (attempt ${retries + 1})`);
            await sleep(delay);
            return makeApiRequest(url, retries + 1);
        }
        
        // Handle 403/401 (Unauthorized/Forbidden) - likely no access to this specific resource
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.warn(`  ⚠️  Access denied (403/401) for ${url}. Skipping.`);
            return null;
        }

        // For other errors (500, etc), we might want to retry a few times too
        if (retries < 3 && error.response?.status >= 500) {
             const delay = 2000 * (retries + 1);
             console.warn(`  ⚠️  Server error ${error.response?.status}. Retrying in ${delay/1000}s...`);
             await sleep(delay);
             return makeApiRequest(url, retries + 1);
        }
        throw error;
    }
}

async function fetchMachinesList(endpoint, status) {
    let allMachines = [];
    let page = 1;
    let hasMore = true;

    console.log(`\n📥 Fetching ${status} machines list...`);

    while (hasMore) {
        try {
            const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`;
            const data = await makeApiRequest(url);

            if (data && data.data && data.data.length > 0) {
                allMachines = allMachines.concat(data.data);
                process.stdout.write(`  Page ${page}: ${data.data.length} machines. Total so far: ${allMachines.length}\r`);

                if (data.data.length < 100) {
                    hasMore = false;
                } else {
                    page++;
                    await sleep(RATE_LIMIT_DELAY);
                }
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(`\n  ❌ Error fetching page ${page}:`, error.message);
            // If we fail to fetch a page list, we probably should stop or retry that page.
            // For now, let's stop to avoid infinite loops on broken endpoints.
            hasMore = false; 
        }
    }
    console.log(`\n  ✅ Retrieved ${allMachines.length} ${status} machines.`);
    return allMachines;
}

async function syncAll() {
    try {
        console.log("🚀 Starting Full Unified Sync...");

        // 1. Fetch Lists
        const activeMachines = await fetchMachinesList("/machine/paginated", "active");
        await sleep(RATE_LIMIT_DELAY);
        const retiredMachines = await fetchMachinesList("/machine/list/retired/paginated", "retired");

        const allMachines = [
            ...activeMachines.map(m => ({ ...m, status_override: 'active' })),
            ...retiredMachines.map(m => ({ ...m, status_override: 'retired' }))
        ];

        console.log(`\n📦 Total machines to process: ${allMachines.length}`);

        // 2. Process Each Machine
        let processedCount = 0;
        let errorCount = 0;

        // Master list of techniques to avoid repeated DB upserts for same technique
        const allTechniques = new Map(); 

        for (const machine of allMachines) {
            try {
                processedCount++;
                console.log(`\n[${processedCount}/${allMachines.length}] Processing: ${machine.name} (ID: ${machine.id})`);

                // A. Sync Basic Info (htb_machines)
                // We use the data from the list, plus potentially extra info if we wanted to fetch profile
                // For now, list data + techniques is what we have.
                
                let avatarUrl = machine.avatar;
                if (avatarUrl && !avatarUrl.startsWith('http')) {
                    avatarUrl = `https://htb-mp-prod-public-storage.s3.eu-central-1.amazonaws.com${avatarUrl}`;
                }

                const machineRecord = {
                    id: machine.id,
                    name: machine.name,
                    os: machine.os,
                    ip: machine.ip,
                    avatar: avatarUrl,
                    points: machine.points,
                    difficulty_text: machine.difficultyText || machine.difficulty_text,
                    status: machine.status_override,
                    release_date: machine.release,
                    user_owns_count: machine.user_owns_count,
                    root_owns_count: machine.root_owns_count,
                    free: machine.free,
                    stars: machine.stars,
                    last_updated: new Date().toISOString()
                };

                const { error: upsertError } = await supabase
                    .from('htb_machines')
                    .upsert(machineRecord, { onConflict: 'id' });

                if (upsertError) {
                    console.error(`  ❌ Error upserting machine info:`, upsertError.message);
                    errorCount++;
                    continue; // Skip techniques if machine insert failed (FK constraint)
                } else {
                    console.log(`  ✓ Info updated`);
                }

                // B. Sync Techniques
                await sleep(RATE_LIMIT_DELAY); // Wait before hitting tags endpoint
                
                const tagsData = await makeApiRequest(`${BASE_URL}/machine/tags/${machine.id}`);
                
                if (tagsData && tagsData.info && Array.isArray(tagsData.info)) {
                    const techniques = tagsData.info.filter(tag => tag.category === "Technique");
                    
                    if (techniques.length > 0) {
                        // 1. Upsert Techniques to 'techniques' table
                        const techniquesToUpsert = [];
                        techniques.forEach(tech => {
                            // Only add if we haven't seen it in this run (optimization)
                            // Or just always upsert to be safe
                            techniquesToUpsert.push({
                                id: tech.id,
                                name: tech.name,
                                category: tech.category
                            });
                        });

                        if (techniquesToUpsert.length > 0) {
                            const { error: techError } = await supabase
                                .from('techniques')
                                .upsert(techniquesToUpsert, { onConflict: 'id', ignoreDuplicates: true });
                            
                            if (techError) console.error(`  ⚠️ Error upserting techniques:`, techError.message);
                        }

                        // 2. Upsert Relationships
                        // First delete old ones for this machine to ensure clean slate?
                        // Or just insert. To be safe/clean, let's delete old ones for this machine first.
                        // But deleting every time might be heavy. Upsert is better if we have a unique constraint.
                        // The table has PK (machine_id, technique_id), so upsert works.
                        // However, if a technique was REMOVED from HTB, upsert won't delete it.
                        // So delete-then-insert is more accurate for "sync".
                        
                        const { error: delError } = await supabase
                            .from('machine_techniques')
                            .delete()
                            .eq('machine_id', machine.id);
                        
                        if (delError) console.error(`  ⚠️ Error clearing old techniques:`, delError.message);

                        const relationships = techniques.map(tech => ({
                            machine_id: machine.id,
                            technique_id: tech.id
                        }));

                        const { error: relError } = await supabase
                            .from('machine_techniques')
                            .insert(relationships);

                        if (relError) {
                            console.error(`  ⚠️ Error linking techniques:`, relError.message);
                        } else {
                            console.log(`  ✓ Linked ${relationships.length} techniques`);
                        }

                    } else {
                        console.log(`  ℹ️  No techniques found`);
                    }
                }

            } catch (err) {
                console.error(`  ❌ Error processing machine ${machine.id}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n\n🎉 Full Sync Completed!`);
        console.log(`  • Total Machines: ${allMachines.length}`);
        console.log(`  • Processed: ${processedCount}`);
        console.log(`  • Errors: ${errorCount}`);

    } catch (error) {
        console.error("\n❌ Fatal error during sync:", error);
        process.exit(1);
    }
}

syncAll();
