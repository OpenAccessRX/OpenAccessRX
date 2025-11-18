import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/test-db", testRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));