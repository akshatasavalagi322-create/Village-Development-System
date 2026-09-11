const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "2005",
  port: 5432,
});

/* 🔹 API to get all districts */
router.get("/districts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT district_id, district_name FROM districts ORDER BY district_name"
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("District Fetch Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
