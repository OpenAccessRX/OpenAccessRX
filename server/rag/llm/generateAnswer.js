import { InferenceClient } from "@huggingface/inference";
import { LLM_MODEL } from "./models";

const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);

export async function generateAnswer(prompt) {
    try {
        const response = await client.textGeneration({
            model: HF_ACCESS_TOKEN,
            inputs: prompt,
            parameters: {
                max_new_tokens: 256,
                temperature: 0.3,
                do_sample: false
            }
        });
        // HF returns: { generated_text: "..." }
        return response.generated_text;
    } catch(err) {
        console.error("Error generating answer: ", err);
        throw new Error("LLM generation failed");
    }
} 