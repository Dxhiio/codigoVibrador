import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const { Client } = pg;

// Default local Supabase DB credentials
const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
};

async function applyMigration() {
    const client = new Client(DB_CONFIG);
    
    try {
        await client.connect();
        console.log('Connected to database.');

        const migrationPath = path.join(process.cwd(), 'supabase/migrations/20251202050000_add_video_and_certs.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Applying migration...');
        await client.query(sql);
        console.log('Migration applied successfully!');

    } catch (err) {
        console.error('Error applying migration:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
