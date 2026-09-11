const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",       
  host: "localhost",
  database: "postgres",   
  password: "2005", 
  port: 5432,
});

// REGISTER
app.post("/signup", async (req, res) => {
  const { name, email,role, password, confirmPassword, address, mobile } = req.body;

  try {
    // 1. check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. insert into db
    await pool.query(
      "INSERT INTO users (name, password,role, address, mobile, gmail, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, hashedPassword,role, address || null, mobile || null, email, new Date()]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or database error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    // use $1 since only one parameter is passed
    //const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
	
	const result = await pool.query("SELECT * FROM users WHERE LOWER(gmail) = LOWER($1)", [email]);


    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
