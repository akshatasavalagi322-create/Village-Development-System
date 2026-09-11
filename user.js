const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({ user: "postgres", host:"localhost", database:"postgres", password:"2005", port:5432 });

// Get single user by id
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const r = await pool.query("SELECT user_id, name, email FROM users WHERE user_id = $1", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ data: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
