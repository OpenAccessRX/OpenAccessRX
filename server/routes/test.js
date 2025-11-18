import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/test-db
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default router;