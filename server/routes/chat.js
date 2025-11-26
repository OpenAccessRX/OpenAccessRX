import { Router } from "express";
const router = Router();

router.post("/", async (req, res) => {
    const userMessage = req.body.message;
    
    //test response in place of RAG/LLM response:
    const fakeReply = `You can purchase 16 bottles of IBUprofen for that.`;

    res.json({ reply: fakeReply });
})

router.post("/reset", (req, res) => {
    return res.json({ok: true});
});

export default router;