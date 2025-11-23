// temporary stub — switch when Dev B finishes searchDocs()

export async function searchDocs(embedding, k = 5) {
  console.warn("[STUB] searchDocs() called — returning fake documents.");

  // Fake documents with IDs and content
  return [
    {
      id: 1,
      content: "This common cold can happen to anyone."
    },
    {
      id: 2,
      content: "Sometimes you have a cough, a runny nose, a headache."
    }
  ].slice(0, k);
}