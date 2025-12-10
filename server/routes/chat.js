import { Router } from "express";
import { rag } from "../rag/pipeline/orchestrator.js";

const router = Router();

router.post("/", async (req, res) => { 
    const { message } = req.body;

    //TEMPORARY BYPASS FOR FRONT-END TESTING
    // if(!req.session.user) {
    //     return res.status(401).json({ error: "Not logged in "});
    // }

    try {
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const { answer, docs } = await rag(message);
        const payload = { reply: answer.content, sources: docs };
        console.log("Sending response to client: ", payload);
        
        return res.json(payload);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "RAG pipeline error" });{}
    }
});

router.post("/reset", (req, res) => {
    console.log("/reset resets ok");
    return res.json({ok: true});
});

export default router;