// /server/rag/testRAGPipeline.js

// Import all required RAG components
import { embedText, loadEmbeddingModel } from '../llm/localEmbed.js';
import { insertDoc } from './insertDoc.js';
import { searchDocs } from './searchDocs.js';
import db from './client.js'; // The pg client wrapper

// --- Utility Function: Clean the table before each test run ---
async function cleanupDocsTable() {
    try {
        console.log("Cleaning up 'documents' table...");
        await db.query('TRUNCATE TABLE documents RESTART IDENTITY;');
        console.log("Table cleaned.");
    } catch (error) {
        console.error("Error cleaning table:", error.message);
    }
}

// --- Main Integration Test Function ---
async function runIntegrationTest() {
    console.log("--- Starting RAG Pipeline Integration Test ---");

    try {
        // 1. Load the embedding model (Developer A's job)
        console.log("1. Loading local embedding model...");
        await loadEmbeddingModel();
        console.log(" ✅ Model loaded successfully (384 dimensions).");

        // 2. Insert Seed Data (Developer B's job - Ingestion)
        await cleanupDocsTable();
        
        const docAContent = "The main topic of this project is **Retrieval-Augmented Generation (RAG)**, which combines an LLM with external knowledge via vector search.";
        const docBContent = "The team will go out for lunch next Friday to celebrate the successful migration to Node v22 and Astro.js, starting at 12:30 PM.";

        // Document A (High relevance to query)
        const embedA = await embedText(docAContent);
        const resultA = await insertDoc(docAContent, embedA);
        console.log(`   ✅ Inserted Doc A (ID: ${resultA.id}): RAG/Vector Search topic.`);

        // Document B (Low relevance - the 'distractor')
        const embedB = await embedText(docBContent);
        const resultB = await insertDoc(docBContent, embedB);
        console.log(`   ✅ Inserted Doc B (ID: ${resultB.id}): Lunch topic.`);
        console.log(`\nSuccessfully inserted 2 documents into the table.`);
        
        
        // 3. Perform Vector Retrieval (Developer B's job - Search)
        
        const queryText = "What is the core technology behind combining an LLM with external knowledge?";
        console.log(`\n3. Searching for query: "${queryText}"`);
        
        const queryEmbedding = await embedText(queryText);
        
        // Search for the top 2 documents
        const searchResults = await searchDocs(queryEmbedding, 2);

        // 4. Validation (Crucial Check)
        console.log(`\n4. Validating search results (k=2):`);

        if (searchResults.length !== 2) {
            throw new Error(`Expected 2 results, but received ${searchResults.length}`);
        }
        
        const topResult = searchResults[0];
        const secondResult = searchResults[1];

        console.log(`   - Top Result Score: ${topResult.similarity_score.toFixed(4)}`);
        console.log(`   - Second Result Score: ${secondResult.similarity_score.toFixed(4)}`);
        
        // Check if the highly relevant document (Doc A) is the top result
        if (topResult.content.includes("Retrieval-Augmented Generation (RAG)")) {
            console.log("   ✅ SUCCESS: Top result is the highly relevant RAG document (Doc A).");
            
            // Check ranking: Doc A score must be higher than Doc B score
            if (topResult.similarity_score > secondResult.similarity_score) {
                console.log("   ✅ SUCCESS: Ranking is correct (Top score > Second score).");
            } else {
                console.error("   ❌ FAILURE: Top result score was NOT higher than the second result score.");
            }
        } else {
            console.error("   ❌ FAILURE: Top result was NOT the expected RAG document.");
            console.log("   Top result content:", topResult.content);
        }

    } catch (error) {
        console.error("\n--- ❌ INTEGRATION TEST FAILED ---");
        console.error(error);
    } finally {
        // 5. Cleanup and exit
        await db.end(); // Close the database connection
        console.log("\n--- Test finished. Database connection closed. ---");
    }
}

// Execute the test
runIntegrationTest();