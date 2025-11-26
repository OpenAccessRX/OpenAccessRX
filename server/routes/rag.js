import { Router } from "express";
import { rag } from "../rag/pipeline/orchestrator.js";

const router = Router();

router.post("/rag", async (req, res) => {    
    const { message } = req.body;

    try {

        if(!message) {
            return res.status(400).json({ error: "Missing query"}); //redo error handling
        }

        const reply = await rag(message);

        return res.json({
            reply
        });

    } catch(err) {
        console.error("RAG error: ", err);
        res.status(500).json({error: "Internal RAG pipeline failure"}); //doublecheck that errors fall through to express handler
    }
})

export default router;