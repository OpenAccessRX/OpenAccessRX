// temporary stub — switch when Dev A finishes embedText()

// Choose a dimension for now; match Developer A's final model later.
const EMBEDDING_DIM = 384;

export async function embedText(text) {
  console.warn("[STUB] embedText() called — returning fake embedding.");

  // Generate a deterministic fake vector based on input length
  const arr = new Float32Array(EMBEDDING_DIM);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    arr[i] = (text.length % 7) * 0.01 + Math.random() * 0.001;
  }

  return arr;
}