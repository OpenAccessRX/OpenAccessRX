// temporary stub — switch when Dev B finishes searchDocs()

export async function searchDocs(embedding, k = 5) {
  console.warn("[STUB] searchDocs() called — returning fake documents.");

  // Fake documents with IDs and content
  return [
    {
      id: 1,
      content: "This is a fake document chunk used for testing the RAG pipeline."
    },
    {
      id: 2,
      content: "Another placeholder chunk to simulate retrieval results."
    }
  ].slice(0, k);
}