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


// 🔹 GET all villages

router.get("/villages", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT village_id, district_id, taluka_id, name AS village, population
       FROM villages
       ORDER BY village_id ASC`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No villages found" });
    }

    res.json({
      message: "🏡 Village details fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching villages:", err);
    res.status(500).json({ error: "Database error while fetching villages" });
  }
});

// 🔹 ADD new village

router.post("/addVillage", async (req, res) => {
  try {
    const { districtId, talukaId, village, population } = req.body;

    if (!districtId || !talukaId || !village || !population) {
      return res.status(400).json({
        error: "District, Taluka, Village and Population required",
      });
    }

    const query = `
      INSERT INTO villages (name, population, taluka_id, district_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      village.trim(),          // name
      Number(population),      // population
      Number(talukaId),        // taluka_id
      Number(districtId)       // district_id
    ];

    const result = await pool.query(query, values);

    res.json({
      message: "✅ Village added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding village →", err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
