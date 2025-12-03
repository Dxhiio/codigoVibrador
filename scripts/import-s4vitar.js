import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.replace(/"/g, '');
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)?.replace(/"/g, '');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: Supabase configuration is missing");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importS4vitarData() {
    try {
        console.log("🚀 Starting S4vitar Data Import...");

        // 1. Read JSON
        const jsonPath = path.join(process.cwd(), 's4vitar300.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        // The file might contain multiple JSON objects not in an array, or a proper array.
        // Based on the view_file output, it looks like a list of objects separated by commas but maybe not wrapped in []?
        // Let's check the file content structure again.
        // Line 2 starts with {, line 10 ends with }, line 11 starts with {, etc.
        // It looks like a valid JSON array if wrapped in [].
        // Wait, the view_file output showed:
        // 1: 
        // 2:  {
        // ...
        // 10:  },
        // 11:  {
        // It seems it's missing the opening [ and closing ].
        // Let's try to parse it as is, or wrap it.
        
        let machinesData;
        try {
            machinesData = JSON.parse(rawData);
        } catch (e) {
            // Try wrapping in []
            try {
                machinesData = JSON.parse(`[${rawData}]`);
            } catch (e2) {
                console.error("Error parsing JSON. Attempting to fix format...");
                // If it's just a sequence of objects like {}, {}, ...
                // We can wrap it in [].
                // But the file content shown has commas between objects.
                // So `[ ... ]` should work if the file content is `{}, {}, ...`
                // Let's assume it's a valid JSON array or close to it.
                // If it fails, we might need manual fix.
                throw e;
            }
        }

        if (!Array.isArray(machinesData)) {
            console.error("Error: JSON data is not an array");
            return;
        }

        console.log(`📦 Loaded ${machinesData.length} machines from JSON.`);

        let updatedCount = 0;
        let notFoundCount = 0;

        for (const item of machinesData) {
            const name = item["Máquina"];
            const video = item["Video"];
            const certsRaw = item["Cert"];
            const techniquesRaw = item["Técnicas Vistas"];

            // 2. Find Machine in DB
            const { data: machine, error } = await supabase
                .from('htb_machines')
                .select('id, name')
                .ilike('name', name) // Case insensitive match
                .maybeSingle();

            if (error) {
                console.error(`Error searching for ${name}:`, error.message);
                continue;
            }

            if (!machine) {
                console.log(`⚠️ Machine not found in DB: ${name}`);
                notFoundCount++;
                continue;
            }

            console.log(`Processing: ${name} (ID: ${machine.id})`);

            // 3. Update Video URL
            if (video) {
                const { error: updateError } = await supabase
                    .from('htb_machines')
                    .update({ video_url: video })
                    .eq('id', machine.id);

                if (updateError) console.error(`  ❌ Error updating video:`, updateError.message);
                else console.log(`  ✓ Video updated`);
            }

            // 4. Process Certifications
            if (certsRaw) {
                const certs = certsRaw.split('\n').map(c => c.trim()).filter(c => c);
                
                for (const certName of certs) {
                    // Upsert Certification
                    // We need to get the ID.
                    // First try to select
                    let { data: certData, error: certError } = await supabase
                        .from('certifications')
                        .select('id')
                        .eq('name', certName)
                        .maybeSingle();

                    if (!certData) {
                        // Insert
                        const { data: newCert, error: insertError } = await supabase
                            .from('certifications')
                            .insert({ name: certName })
                            .select('id')
                            .single();
                        
                        if (insertError) {
                            // Maybe race condition, try select again
                             const { data: retryCert } = await supabase
                                .from('certifications')
                                .select('id')
                                .eq('name', certName)
                                .maybeSingle();
                             certData = retryCert;
                        } else {
                            certData = newCert;
                        }
                    }

                    if (certData) {
                        // Link Machine to Cert
                        const { error: linkError } = await supabase
                            .from('machine_certifications')
                            .upsert({ 
                                machine_id: machine.id, 
                                certification_id: certData.id 
                            }, { onConflict: 'machine_id, certification_id' }); // Assuming PK
                        
                        if (linkError) console.error(`  ❌ Error linking cert ${certName}:`, linkError.message);
                    }
                }
                console.log(`  ✓ Processed ${certs.length} certifications`);
            }

            // 5. Process Techniques (S4vitar specific)
            if (techniquesRaw) {
                const techniques = techniquesRaw.split('\n').map(t => t.trim()).filter(t => t);
                
                for (const techName of techniques) {
                    // Upsert Technique
                    let { data: techData } = await supabase
                        .from('techniques')
                        .select('id')
                        .eq('name', techName)
                        .maybeSingle();

                    if (!techData) {
                        // Insert new technique (using a large random ID or letting DB handle it if not auto-increment?
                        // The 'techniques' table uses 'id' which comes from HTB (integer).
                        // If we insert new ones, we need to ensure IDs don't clash.
                        // HTB IDs are usually < 10000. We can use a sequence or random large number?
                        // Or better, let the DB handle it if it's IDENTITY.
                        // Let's check the schema of 'techniques' table.
                        // If it's not IDENTITY, we might have a problem.
                        // Assuming it handles inserts without ID or we generate one.
                        // Let's try inserting without ID.
                        
                        // Generate a random ID for custom techniques (range 1,000,000+) to avoid collision with HTB IDs
                        const customId = Math.floor(Math.random() * 1000000) + 1000000;

                        const { data: newTech, error: insertTechError } = await supabase
                            .from('techniques')
                            .insert({ 
                                id: customId,
                                name: techName, 
                                category: 'S4vitar' // Custom category to distinguish
                            })
                            .select('id')
                            .single();

                        if (insertTechError) {
                            // If ID is required and not auto-generated, we might need to provide one.
                            // But usually we set it to IDENTITY or similar.
                            // If it fails, we skip.
                            // console.error(`  ⚠️ Could not insert technique ${techName}:`, insertTechError.message);
                        } else {
                            techData = newTech;
                        }
                    }

                    if (techData) {
                        const { error: linkTechError } = await supabase
                            .from('machine_techniques')
                            .upsert({
                                machine_id: machine.id,
                                technique_id: techData.id
                            }, { onConflict: 'machine_id, technique_id' });
                    }
                }
                console.log(`  ✓ Processed ${techniques.length} techniques`);
            }

            updatedCount++;
        }

        console.log(`\n🎉 Import Completed!`);
        console.log(`  • Updated: ${updatedCount}`);
        console.log(`  • Not Found: ${notFoundCount}`);

    } catch (error) {
        console.error("Fatal error:", error);
    }
}

importS4vitarData();
