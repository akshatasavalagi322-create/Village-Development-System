const express = require("express");
const router = express.Router();

// Import the same pool from your DB connection
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "2005",
  port: 5432,
});

// USER DETAILS BY ID
router.get("/userschemadet", async (req, res) => {
  const { email } = req.query;   // ✅ use query params

  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "✅ User details fetched successfully",
      data: result.rows,   // ✅ send all row
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Database error while fetching user" });
  }
});


module.exports = router;
