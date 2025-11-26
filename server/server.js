// the main entrypoint 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
import ragRoute from "./routes/rag.js";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/rag", ragRoute);
app.use("/api/test-db", testRoute); //keep to test db connection

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));