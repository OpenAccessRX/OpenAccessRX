// import { embedText } from "../llm/localEmbed.js"; //match function&filename and add when ready
import { embedText } from "../stubs/localEmbed.stub.js";
// import { searchDocs } from "../db/searchDocs.js"; //match function&filename and add when ready
import { searchDocs } from "../stubs/searchDocs.stub.js";
import { buildPrompt } from "./buildPrompt.js";
// import { generateAnswer } from "../llm/generateAnswer.js"; //match function&filename and add when ready

//temp variables:
const embedText = async function(question){};
const searchDocs = async function(qEmbedding, num){};
const generateAnswer = async function(prompt){};

export async function rag(question) {
    const qEmbedding = await embedText(question);
    const docs = await searchDocs(qEmbedding, 5);
    const prompt = buildPrompt(question, docs);
    const answer = await generateAnswer(prompt);
    return { answer, docs };

}