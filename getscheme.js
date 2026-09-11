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

// ✅ Get all scheme details
router.get("/schemegetall", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schemes ORDER BY scheme_id ASC");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No schemes found" });
    }

    res.json({
      message: "✅ Scheme details fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching scheme data:", err);
    res.status(500).json({ error: "Database error while fetching schemes" });
  }
});

module.exports = router;
