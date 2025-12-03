
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'Missing');


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase public credentials');
  process.exit(1);
}

const cleanUrl = supabaseUrl?.replace(/["']/g, '');
const cleanKey = supabaseAnonKey?.replace(/["']/g, '');

const supabase = createClient(cleanUrl, cleanKey);

async function testPublicAccess() {
  console.log('Testing public access to techniques...');

  // 1. Try to fetch a technique
  const { data: machines, error: mError } = await supabase
    .from('htb_machines')
    .select('*')
    .limit(1);

  if (mError) {
    console.error('❌ Error reading machines:', mError.message);
  } else if (machines.length > 0) {
    console.log('✅ Columns in htb_machines:', Object.keys(machines[0]).join(', '));
  }

  // 2. Try to fetch machine_techniques
  const { data: mt, error: mtError } = await supabase
    .from('machine_techniques')
    .select('count')
    .limit(1);

  // 3. Try the exact query used in the hook
  const testTechnique = "Reconnaissance";
  console.log(`\nTesting hook query for: ${testTechnique}`);
  
  const { data, error } = await supabase
    .from('machine_techniques')
    .select(`
      htb_machines (
        id,
        name,
        os,
        points,
        difficulty_text,
        avatar,
        status,
        video_url,
        ip,
        release_date,
        user_owns_count,
        root_owns_count,
        feedback_for_chart,
        stars,
        maker,
        maker2
      ),
      techniques!inner (name)
    `)
    .eq('techniques.name', testTechnique)
    .limit(5);

  if (error) {
    console.log('THE_ERROR:', error.message);
  } else {
    console.log(`✅ Hook query success. Found ${data.length} machines.`);
    if (data.length > 0) {
      console.log('Sample:', JSON.stringify(data[0], null, 2));
    }
  }
}

testPublicAccess();
