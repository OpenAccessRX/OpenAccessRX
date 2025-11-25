import db from "./client.js"; // your pg client wrapper

/**
 * Search the documents table for the k most similar embeddings
 * @param {Float32Array} queryEmbedding - embedding from local model
 * @param {number} k - number of results to return
 * @returns {Array<{id: number, content: string}>} - top k matching documents
 */
export async function searchDocs(queryEmbedding, k = 5) {
  // Convert Float32Array to Postgres vector literal
  const vectorLiteral = `[${Array.from(queryEmbedding).join(",")}]`;

  const result = await db.query(
    `
    SELECT id, content
    FROM documents
    ORDER BY embedding <-> $1  -- cosine distance (assumes normalized embeddings)
    LIMIT $2
    `,
    [vectorLiteral, k]
  );

  return result.rows;
}