// the main entrypoint 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/test.js";
import ragRoute from "./routes/rag.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/test-db", testRoute); //keep to test db connection
app.use("/api/rag", ragRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));