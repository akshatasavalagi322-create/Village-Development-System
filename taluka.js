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

/* 🔹 API to insert Taluka */
router.post("/addTaluka", async (req, res) => {
  try {
    const { district_id, taluka_name } = req.body;

    if (!district_id || !taluka_name)
      return res.status(400).json({ error: "District and Taluka name required" });

    await pool.query(
      "INSERT INTO taluka (district_id, name) VALUES ($1, $2)",
      [district_id, taluka_name]
    );

    res.json({ message: "Taluka added successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* 🔹 API to fetch talukas by district */
router.get("/talukas/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const result = await pool.query(
      "SELECT taluka_id, name FROM taluka WHERE district_id = $1 ORDER BY name",
      [districtId]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* 🔹 API to fetch all talukas (if needed in dropdown) */
router.get("/talukas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.taluka_id, t.name, d.name as district_name
       FROM taluka t 
       JOIN district d ON d.district_id = t.district_id
       ORDER BY d.name, t.name`
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
