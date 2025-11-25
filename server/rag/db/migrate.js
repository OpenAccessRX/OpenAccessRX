import fs from 'fs/promises';
import path from 'path';
import db from './client.js'; // Your pg client wrapper

async function runSchemaMigration() {
    try {
        // Read the schema.sql file content
        const sqlFilePath = path.resolve(process.cwd(), 'server/rag/db/schema.sql');
        const sql = await fs.readFile(sqlFilePath, 'utf-8');

        console.log("Starting database migration...");
        
        // Execute the full SQL content. 
        // This is safe for DDL like CREATE EXTENSION/TABLE
        await db.query(sql);

        console.log("✅ Schema migration complete! 'documents' table and 'pgvector' extension are set up.");
    } catch (error) {
        console.error("❌ Database Migration Failed:", error);
    } finally {
        // Close the database connection once done
        await db.end();
    }
}

runSchemaMigration();