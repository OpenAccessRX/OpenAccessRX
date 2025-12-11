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