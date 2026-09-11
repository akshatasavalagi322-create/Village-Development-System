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

// Dashboard – Fetch applications with username, scheme and village names
router.get("/dashboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.application_id,
             u.name AS username,
             s.name AS scheme_name,
             v.name AS village_name,
             a.status,
             a.created_at
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN schemes s ON a.scheme_id = s.scheme_id
      JOIN villages v ON a.village_id = v.village_id
      ORDER BY a.application_id DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error occurred" });
  }
});

module.exports = router;
