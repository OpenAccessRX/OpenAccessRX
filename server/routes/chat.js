import { Router } from "express";
import { rag } from "../rag/pipeline/orchestrator.js";

const router = Router();

router.post("/", async (req, res) => { //test POST req/res cycle without server logic
    const { message } = req.body;

    //TEMPORARY BYPASS FOR FRONT-END TESTING
    // if(!req.session.user) {
    //     return res.status(401).json({ error: "Not logged in "});
    // }

    try {
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        //const reply = await rag(message);
        const { answer, docs } = await rag(message);
        // res.json({ reply: result.answer });
        const payload = { reply: answer.content, sources: docs };
        console.log("Sending response to client: ", payload);
        
        return res.json(payload);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "RAG pipeline error" });{}
        // send { answer, docs } to the frontend
    }
    // res.json({reply: `Echo: ${req.body.message}`}); //keep for front-end testing

});

router.post("/reset", (req, res) => {
    console.log("/reset resets ok");
    return res.json({ok: true});
});

export default router;