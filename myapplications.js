const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({ user: "postgres", host:"localhost", database:"postgres", password:"2005", port:5432 });

// Get applications for a user, with username/scheme/village names
router.get("/myapplications/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT a.application_id, a.status, a.remarks, a.details, a.documents, a.created_at,
             u.username,
             s.name AS scheme_name,
             v.name AS village_name
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN schemes s ON a.scheme_id = s.scheme_id
      JOIN villages v ON a.village_id = v.village_id
      WHERE a.user_id = $1
      ORDER BY a.application_id DESC
    `, [user_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
