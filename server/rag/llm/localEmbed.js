import { pipeline } from "@huggingface/transformers"; 

// Load model once at startup.
let embedder;

export async function loadEmbeddingModel() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function embedText(text) {
  if (!embedder) await loadEmbeddingModel();

  const output = await embedder(text, { pooling: "mean", normalize: true });
  // output.data is a Float32Array
  return output.data;
}
