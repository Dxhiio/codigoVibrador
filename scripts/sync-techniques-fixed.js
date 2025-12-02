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
const RATE_LIMIT_DELAY = 2000;
const BATCH_SIZE = 50;

const args = process.argv.slice(2);
const batchNumber = args[0] ? parseInt(args[0]) : 1;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeApiRequest(url, retries = 0) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && retries < 3) {
            const delay = RATE_LIMIT_DELAY * Math.pow(2, retries + 1);
            console.warn(`  ⚠️  Rate limited. Retrying in ${delay}ms...`);
            await sleep(delay);
            return makeApiRequest(url, retries + 1);
        }
        throw error;
    }
}

async function syncTechniques() {
    try {
        console.log("🔍 Fetching all machines from database...\n");
        
        const { data: machines, error: machinesError } = await supabase
            .from('htb_machines')
            .select('id, name')
            .order('id');

        if (machinesError) {
            throw machinesError;
        }

        const totalMachines = machines.length;
        const totalBatches = Math.ceil(totalMachines / BATCH_SIZE);
        
        const startIndex = (batchNumber - 1) * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, totalMachines);
        const batchMachines = machines.slice(startIndex, endIndex);
        
        console.log(`📦 Total machines in database: ${totalMachines}`);
        console.log(`🔢 Total batches: ${totalBatches}`);
        console.log(`📍 Current batch: ${batchNumber}`);
        console.log(`🎯 Processing machines: ${startIndex + 1} to ${endIndex} (${batchMachines.length} machines)\n`);
        
        if (batchMachines.length === 0) {
            console.log(`⚠️  No machines in this batch.`);
            return;
        }

        const allTechniques = new Map();
        const machineTechniquesMap = new Map();

        let processedCount = 0;
        let errorCount = 0;

        for (const machine of batchMachines) {
            try {
                const currentIndex = startIndex + processedCount + 1;
                console.log(`[${currentIndex}/${totalMachines}] Processing: ${machine.name} (ID: ${machine.id})`);
                
                await sleep(RATE_LIMIT_DELAY);
                
                const tagsData = await makeApiRequest(`${BASE_URL}/machine/tags/${machine.id}`);
                
                if (tagsData && tagsData.info && Array.isArray(tagsData.info)) {
                    const techniques = tagsData.info.filter(tag => tag.category === "Technique");
                    
                    if (techniques.length > 0) {
                        console.log(`  ✓ Found ${techniques.length} techniques: ${techniques.map(t => t.name).join(', ')}`);
                        
                        techniques.forEach(tech => {
                            if (!allTechniques.has(tech.id)) {
                                allTechniques.set(tech.id, {
                                    id: tech.id,
                                    name: tech.name,
                                    category: tech.category
                                });
                            }
                        });

                        if (!machineTechniquesMap.has(machine.id)) {
                            machineTechniquesMap.set(machine.id, new Set());
                        }
                        techniques.forEach(tech => {
                            machineTechniquesMap.get(machine.id).add(tech.id);
                        });
                    } else {
                        console.log(`  ℹ️  No techniques found`);
                    }
                }

                processedCount++;
                
            } catch (error) {
                console.log(`  ✗ Error: ${error.message}`);
                errorCount++;
                processedCount++;
            }
        }

        console.log(`\n\n📊 Batch ${batchNumber} Summary:`);
        console.log(`  • Machines processed: ${processedCount}/${batchMachines.length}`);
        console.log(`  • Errors: ${errorCount}`);
        console.log(`  • Unique techniques found: ${allTechniques.size}`);
        console.log(`  • Machine-technique relationships: ${Array.from(machineTechniquesMap.values()).reduce((sum, set) => sum + set.size, 0)}`);

        console.log(`\n💾 Inserting techniques into database...`);
        const techniquesArray = Array.from(allTechniques.values());
        
        if (techniquesArray.length > 0) {
            const { error: techError } = await supabase
                .from('techniques')
                .upsert(techniquesArray, { onConflict: 'id', ignoreDuplicates: false });

            if (techError) {
                console.error("  ✗ Error inserting techniques:", techError.message);
            } else {
                console.log(`  ✓ Inserted/updated ${techniquesArray.length} techniques`);
            }
        }

        console.log(`\n🔗 Inserting machine-technique relationships...`);
        const relationships = [];
        
        for (const [machineId, techniqueIds] of machineTechniquesMap.entries()) {
            for (const techniqueId of techniqueIds) {
                relationships.push({
                    machine_id: machineId,
                    technique_id: techniqueId
                });
            }
        }

        if (relationships.length > 0) {
            const machineIds = Array.from(machineTechniquesMap.keys());
            const { error: deleteError } = await supabase
                .from('machine_techniques')
                .delete()
                .in('machine_id', machineIds);

            if (deleteError) {
                console.error("  ✗ Error deleting old relationships:", deleteError.message);
            }

            const { error: relError } = await supabase
                .from('machine_techniques')
                .insert(relationships);

            if (relError) {
                console.error("  ✗ Error inserting relationships:", relError.message);
            } else {
                console.log(`  ✓ Inserted ${relationships.length} machine-technique relationships`);
            }
        }

        console.log(`\n✅ Batch ${batchNumber} completed!`);
        
        if (batchNumber < totalBatches) {
            console.log(`\n📌 Next batch: node scripts/sync-techniques-fixed.js ${batchNumber + 1}`);
        } else {
            console.log(`\n🎉 All batches completed!`);
        }

    } catch (error) {
        console.error("\n❌ Fatal error during sync:", error);
        process.exit(1);
    }
}

syncTechniques();
