// /server/rag/db/seed.js

import { embedText, loadEmbeddingModel } from '../llm/localEmbed.js'; // Developer A's functions
import { insertDoc } from './insertDoc.js'; // Developer B's function
import db from './client.js'; // The pg client wrapper
import fs from "fs"; // works with files
import path from "path";
import { fileURLToPath } from "url";

// Load your KB from a text file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../../docs/Pharmacy_Policy.txt");
const kbText = fs.readFileSync(filePath, "utf-8");

// Simple fixed-size chunking
const chunkSize = 300;
const SEED_DOCUMENTS = [];

for (let i = 0; i < kbText.length; i += chunkSize) {
  SEED_DOCUMENTS.push(kbText.slice(i, i + chunkSize));
}

/**
 * Clears the documents table and inserts a new set of seed data.
 */
async function seedDocuments() {
    console.log("--- Starting Database Seeding ---");
    
    try {
        // 1. Load Model (Necessary for embedding the seed data)
        console.log("1. Loading local embedding model...");
        await loadEmbeddingModel();
        console.log("   ✅ Model loaded.");

        // 2. Cleanup (Ensure a fresh start)
        console.log("\n2. Cleaning up 'documents' table...");
        // TRUNCATE removes all data and resets the primary key ID
        await db.query('TRUNCATE TABLE documents RESTART IDENTITY;');
        console.log("   ✅ Table cleaned.");

        // 3. Insert Seed Data
        console.log("\n3. Inserting seed documents...");
        for (const [index, chunk] of SEED_DOCUMENTS.entries()) {
            // Get the embedding from Developer A's function
            const embedding = await embedText(chunk);
            
            // Insert the document using Developer B's function
            const insertedRow = await insertDoc(chunk, embedding);
            
            console.log(`   [${index + 1}/${SEED_DOCUMENTS.length}] Inserted Doc ID: ${insertedRow.id}`);
        }
        
        console.log(`\n✅ Successfully inserted ${SEED_DOCUMENTS.length} documents.`);

    } catch (error) {
        console.error("\n--- ❌ DATABASE SEEDING FAILED ---");
        console.error(error);
        process.exit(1); // Exit with an error code
    } finally {
        // 4. Close connection
        await db.end();
        console.log("\n--- Seeding finished. Database connection closed. ---");
    }
}

seedDocuments();