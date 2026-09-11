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

// Dashboard summary
router.get("/summary/:userId", async (req, res) => {
  try {
    const result = await pool.query("SELECT status, COUNT(*) as count FROM applications GROUP BY status");
    let total = 0, pending = 0, ongoing = 0, completed = 0;
    result.rows.forEach(row => {
      total += parseInt(row.count);
      if (row.status === "Pending") pending = parseInt(row.count);
      if (row.status === "Ongoing") ongoing = parseInt(row.count);
      if (row.status === "Completed") completed = parseInt(row.count);
    });
    res.json({ total, pending, ongoing, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Applications list
router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM applications WHERE officer_id = $1", [req.params.userId]);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Single application
router.get("/details/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM applications WHERE application_id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Application not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update application
router.put("/update/:id", async (req, res) => {
  const { status} = req.body;
  const id = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE applications SET  status = $1 WHERE application_id = $2 RETURNING *",
      [status,id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application updated successfully", application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Approve application
router.put("/approve/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE applications SET status = 'Approved' WHERE application_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application approved successfully", application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
