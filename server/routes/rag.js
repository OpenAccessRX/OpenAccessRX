import express from "express";
import { rag } from "../rag/pipeline/orchestrator.js";

const router = express.Router();

router.post("/rag", async (req, res) => {
    try {
        const { query } = req.body;
        if(!query) {
            return res.status(400).json({ error: "Missing query"}); //redo error handling
        }
        const result = await rag(query);
        res.json(result);
    } catch(err) {
        console.error("RAG error: ", err);
        res.status(500).json({error: "Internal RAG pipeline failure"}); //doublecheck that errors fall through to express handler
    }
})

export default router;