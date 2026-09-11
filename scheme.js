const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "2005",
  port: 5432,
});

// Add scheme details (POST API)
router.post("/scheme", async (req, res) => {
  const { name, budget } = req.body;

  try {
    await pool.query(
      "INSERT INTO schemes (name, budget) VALUES ($1, $2)",
      [name, budget]
    );
    res.json({ message: "Scheme added successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(400).json({ error: "Scheme already exists or database error" });
  }
});

module.exports = router;
