const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({ user: "postgres", host:"localhost", database:"postgres", password:"2005", port:5432 });

router.get("/schemegetall", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM schemes ORDER BY scheme_id ASC");
    res.json({ message: "Scheme details fetched successfully", data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while fetching schemes" });
  }
});

module.exports = router;
