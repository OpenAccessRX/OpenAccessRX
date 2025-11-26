import { Router } from "express";
const router = Router();

router.post("/", (req, res) => { //test POST req/res cycle without server logic
    //TEMPORARY BYPASS FOR FRONT-END TESTING
    // if(!req.session.user) {
    //     return res.status(401).json({ error: "Not logged in "});
    // }
    
    res.json({reply: `Echo: ${req.body.message}`});

})
// router.post("/", async (req, res) => {
//     const userMessage = req.body.message;
    
//     //test response in place of RAG/LLM response:
//     const fakeReply = `You can purchase 16 bottles of IBUprofen for that.`;

//     res.json({ reply: fakeReply });
// })

router.post("/reset", (req, res) => {
    console.log("/reset resets ok");
    return res.json({ok: true});
});

export default router;