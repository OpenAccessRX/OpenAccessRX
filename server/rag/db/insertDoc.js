
export async function insertDoc([content, vectorLiteral]) {
    const vectorLiteral = `[${Array.from(embedding).join(",")}]`;

// embedding is Float32Array → convert to Postgres vector
}