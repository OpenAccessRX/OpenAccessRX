// import { embedText } from "../llm/localEmbed.js"; //match function&filename and add when ready
import { embedText } from "../testing/localEmbed.stub.js";
// import { searchDocs } from "../db/searchDocs.js"; //match function&filename and add when ready
import { searchDocs } from "../testing/searchDocs.stub.js";
import { buildPrompt } from "./buildPrompt.js";
import { generateAnswer } from "../llm/generateAnswer.js"; //match function&filename and add when ready

//placeholder prompt content 
const prompt = buildPrompt("What are common cold symptoms?", [
  { id: 1, content: "The common cold often includes coughing, sneezing, and congestion." },
  { id: 2, content: "Colds are typically mild and resolve within a week." }
]);

console.log("prompt: ", prompt);

export async function rag(question) {
    const qEmbedding = await embedText(question);
    const docs = await searchDocs(qEmbedding, 5);
    const prompt = buildPrompt(question, docs);
    const answer = await generateAnswer(prompt);
    return { answer, docs };
}