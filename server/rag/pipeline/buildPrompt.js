//this function does formatting to guarantee a consistent output string
//it does not do "business logic"- no retrieval, embedding, or generation

/**
 * Build the final prompt sent to the LLM.
 * Combines:
 *   - system instructions
 *   - retrieved document context
 *   - the user’s message
 *   - the final task directive
 *
 * @param {string} userMessage
 * @param {Array<{ id: number, content: string }>} docs
 * @returns {string} prompt for the LLM
 */

export function buildPrompt(userMessage, docs) {
    // use a fixed system instruction
    const systemInstruction = `
You are a helpful, safety-conscious medical assistant.
Use ONLY the information provided in the retrieved context to answer the user's question.
If the answer is not in the context, say: "I don't know based on the provided information."
Do not hallucinate or invent facts.
Keep your answer clear and concise.
  `.trim();
    // iterate over docs and clean them
        //trim whitespace
        //avoid empty docs
        //normalize line breaks
    const formattedDocs = docs
    .map((doc, i) => {
      const cleaned = (doc.content || "").trim();
      return `[Document ${i + 1}] ${cleaned}`;
    })
    .join("\n\n");
    
    const finalPrompt = `
        ${systemInstruction}
        --- Retrieved Context ---
        ${formattedDocs || "No context retrieved."}
        --- User Question ---
        ${userMessage}
        --- Task ---
        Provide the best possible answer using only the context above.
        `.trim();

  //return prompt string
  return finalPrompt;
}