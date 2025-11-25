// /server/rag/db/seed.js

import { embedText, loadEmbeddingModel } from '../llm/localEmbed.js'; // Developer A's functions
import { insertDoc } from './insertDoc.js'; // Developer B's function
import db from './client.js'; // The pg client wrapper

// 384-dimension vector from all-MiniLM-L6-v2 model
const SEED_DOCUMENTS = [
    { content: "The Retrieval-Augmented Generation (RAG) pipeline involves four main steps: embedding, search, prompt construction, and LLM generation. This approach ensures the LLM's answers are grounded in external knowledge." },
    { content: "The embedding model chosen for this project is 'Xenova/all-MiniLM-L6-v2', which generates a 384-dimensional vector. This dimension is crucial and must match the database schema." },
    { content: "PostgreSQL with the pgvector extension is used for the storage layer. The vector similarity search is performed using the cosine distance operator (<->) in an ORDER BY clause." },
    { content: "The final assembled RAG function will take a user question, embed it, retrieve the top 5 documents, build a contextual prompt, and then call the external LLM to generate the final answer." },
    { content: "Security is a critical component, requiring Express rate limiting, input validation, and ensuring the Hugging Face API key is never exposed to the client-side frontend." },
];

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
        for (const [index, doc] of SEED_DOCUMENTS.entries()) {
            // Get the embedding from Developer A's function
            const embedding = await embedText(doc.content);
            
            // Insert the document using Developer B's function
            const insertedRow = await insertDoc(doc.content, embedding);
            
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