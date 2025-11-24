import db from "./client.js";

/**
 * Inserts a document and its embedding into the documents table.
 * @param {string} content - The raw text content of the document.
 * @param {Float32Array | number[]} embedding - The vector embedding (384 dimensions).
 * @returns {Promise<object>} - The inserted row from the database.
 */

export async function insertDoc(content, embedding) {
    const vectorLiteral = `[${Array.from(embedding).join(",")}]`;
    const result = await db.query(
    `
    INSERT INTO documents (content, embedding)
    VALUES ($1, $2)
    RETURNING id, content;
    `,
    [content, vectorLiteral]
  );

  return result.rows[0];
// embedding is Float32Array → convert to Postgres vector
}