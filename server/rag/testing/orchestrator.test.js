// test for orchestrator.js
import "dotenv/config";   // so HF_API_KEY loads
import { runRAGPipeline } from "../pipeline/orchestrator.js";

async function main() {
  try {
    const query = "Are there common cold symptoms?";
    console.log("query: ", query);
    const result = await runRAGPipeline(query);
    console.log("\n=== result peepin====");
    console.log("result: ", result)
    console.log("\n=== RAG RESULT ===");
    console.log("Answer:\n", result.answer);

    console.log("\n=== CONTEXT USED ===");
    console.log(result.contextUsed);

  } catch (err) {
    console.error("RAG Test Error:", err);
  }
}

main();
