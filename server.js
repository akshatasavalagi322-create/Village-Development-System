const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");
const { exec } = require("child_process");

// Import your route files
const userRoutes = require("./user");
const userschema = require("./userschemadet");
const scheme = require("./scheme");
const schemegetall = require("./getscheme");
const applyschema = require("./applyschema");
const villages = require("./villages");

// NEW route imports
const district = require("./district");
const getdistrict = require("./getdistrict");
const taluka = require("./taluka");
const gettaluka = require("./gettaluka");
const applyscheme = require("./applyscheme");
const update = require("./update");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "2005",
  port: 5432,
});

// Serve static files (login.html, user.html, etc.)
app.use(express.static(path.join(__dirname)));

// Optional: root redirects to login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Use imported routes
app.use("/", userRoutes);
app.use("/", userschema);
app.use("/", scheme);
app.use("/", schemegetall);
app.use("/", applyscheme);
app.use("/", applyschema);
app.use("/", villages);

// NEW route registration
app.use("/", district);
app.use("/", getdistrict);
app.use("/", taluka);
app.use("/", gettaluka);
app.use("/api/applications", update);

// REGISTER
app.post("/signup", async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, password,role, address, mobile, email, created_at) VALUES ($1, $2, $3, $4, $5, $6,$7)",
      [name, hashedPassword, role, null, null, email, new Date()]
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
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    res.json({
      message: "Login successful",
      user_id: user.user_id,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server and open login.html automatically
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}/login.html`);
});
