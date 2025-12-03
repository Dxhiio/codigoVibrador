
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

// Remove quotes if present
const cleanUrl = supabaseUrl.replace(/["']/g, '');
const cleanKey = supabaseKey.replace(/["']/g, '');

const supabase = createClient(cleanUrl, cleanKey);

async function analyzeTechniques() {
  console.log('Analyzing techniques distribution...');

  // Get all techniques with their machine counts
  const { data: techniques, error } = await supabase
    .from('techniques')
    .select(`
      id,
      name,
      machine_techniques (count)
    `);

  if (error) {
    console.error('Error fetching techniques:', error);
    return;
  }

  // Process and sort
  const stats = techniques
    .map(t => ({
      name: t.name,
      count: t.machine_techniques[0].count
    }))
    .sort((a, b) => b.count - a.count)
    .filter(t => t.count > 0);

  console.log('--- Potential Tier 1 Techniques ---');
  const keywords = ['Weak', 'Default', 'Clear', 'Anonymous', 'Public', 'Misconfiguration', 'Enumeration', 'FTP', 'SMB', 'Telnet', 'Login'];
  
  console.log('--- Specific Weakness Techniques ---');
  const specific = stats.filter(t => 
    ['Weak', 'Default', 'Clear', 'Anonymous'].some(k => t.name.includes(k))
  );
  specific.forEach(t => console.log(`${t.name} (${t.count})`));
}

analyzeTechniques();
