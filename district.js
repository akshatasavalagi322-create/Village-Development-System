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

/* 🔹 API to insert district */
router.post("/addDistrict", async (req, res) => {
  try {
    const { district_name } = req.body;

    if (!district_name)
      return res.status(400).json({ error: "District name required" });

    await pool.query(
      "INSERT INTO district (name) VALUES ($1)",
      [district_name]
    );

    res.json({ message: "District added successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* 🔹 API to get all districts */
router.get("/districts", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT district_id, name FROM district ORDER BY name"
    );
    res.json({ data: r.rows });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
