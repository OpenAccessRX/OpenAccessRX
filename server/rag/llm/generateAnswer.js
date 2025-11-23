// generateAnswer.js
import { HF_CHAT_MODEL } from "../llm/models.js";
import { InferenceClient } from "@huggingface/inference";

// // Initialize the HuggingFace InferenceClient with your API
//  key
const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);

export async function generateAnswer(prompt) {
  try {
    const result = await client.chatCompletion({
      model: HF_CHAT_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            }
        ]
    });

    return result.choices[0].message || "No response from model";
  } catch (err) {
    console.error("Error generating answer:", err);
    throw new Error("LLM generation failed");
  }
}
