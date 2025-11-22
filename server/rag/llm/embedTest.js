// import { describe, it, expect, beforeAll } from "vitest";
// import { loadEmbeddingModel, embedText } from "./localEmbed.js";

// let embedder;

// beforeAll(async () => {
//   embedder = await loadEmbeddingModel();
// });

// describe("Embedding tests", () => {

//   it("embeds text and returns correct dtype", async () => {
//     const emb = await embedText("Hello world");

//     // dtype check
//     expect(emb).toBeInstanceOf(Float32Array);
//   });

//   it("returns expected embedding dimension", async () => {
//     const emb = await embedText("Hello world");

//     // MiniLM-L6-v2 should output 384 dims with pooling=mean
//     expect(emb.length).toBe(384);
//   });

//   it("returns embedding of correct shape", async () => {
//     const emb = await embedText("Hello world");

//     // pooled output should be 1D
//     expect(Array.isArray(emb)).toBe(false);
//     expect(emb.length).toBe(384);
//   });

// });

import { loadEmbeddingModel, embedText } from "./localEmbed.js";

async function main() {
  await loadEmbeddingModel();

  const text = "Hello world, this is a test embedding.";
  const embedding = await embedText(text);

  console.log("Raw embedding:", embedding);

  console.log("Type:", embedding.constructor.name);
  console.log("Length:", embedding.length);

  // Check if it's Float32Array
  console.log("Is Float32Array:", embedding instanceof Float32Array);
}

main();