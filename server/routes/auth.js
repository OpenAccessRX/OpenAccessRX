import { Router } from "express";
const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

//   // Demo: always succeed
//   return res.json({
//     user: { id: 1, email },
//     token: "demo-token"
//   });
  
  // DEMO LOGIN: always accept anything
  // You can later add DB lookup or real auth here
  console.log("Login attempt:", username, password);

  // DEMO: Set a simple cookie to simulate login
  res.cookie("demoUser", username, { httpOnly: true });

  // Redirect to chat page
  return res.redirect("http://localhost:4321/chat"); 
});

export default router;
