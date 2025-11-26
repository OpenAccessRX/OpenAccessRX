// the main entrypoint 
import express from "express";
import session from "express-session";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
import ragRoute from "./routes/rag.js";
import testRoute from "./routes/test.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1); //for cookies + sessions

app.use(cors({ //this setting happens before sessions and routes
    origin: "http://localhost:4321", //Astro port
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json()); //JSON parsing
app.use(express.urlencoded({ extended: true }));

const chatLimiter = rateLimit({
    windowMs: 1000 * 30, //30 seconds
    max: 10,            //max 10 seconds per 30 seconds
    message: { error: "Too many requests, please slow down." }
});

app.use("/api/", chatLimiter);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "dev-secret-change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // TRUE in production w/HTTPS
            sameSite: "lax", //required for cross-origin w/redirects/login flows
            maxAge: 1000*60*60 //1 hour
        }
    })
)
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/rag", ragRoute);
app.use("/api/test-db", testRoute); //keep to test db connection


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));