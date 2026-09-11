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

/* 🔹 API to get talukas by district */
router.get("/talukas/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;

    const result = await pool.query(
      "SELECT taluka_id, taluka_name FROM talukas WHERE district_id = $1 ORDER BY taluka_name",
      [districtId]
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("Taluka Fetch Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* 🔹 API to get all talukas (optional) */
router.get("/talukas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.taluka_id, t.taluka_name, d.district_name
       FROM talukas t
       JOIN districts d ON d.district_id = t.district_id
       ORDER BY d.district_name, t.taluka_name`
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("Taluka List Error:", err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
