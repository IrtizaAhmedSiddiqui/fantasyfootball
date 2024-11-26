import express from "express";
import mysql from "mysql";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xboxone2003",
  database: "project",
});

// Get all users
router.get("/", (req, res) => {
  const q = "SELECT * FROM users";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add a new user (Sign Up)
router.post("/signup", (req, res) => {
  const q = "INSERT INTO users (`user_name`, `password`) VALUES (?, ?)";
  const values = [req.body.user_name, req.body.password];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("User added successfully.");
  });
});

// Sign In
router.post("/signin", (req, res) => {
  console.log("body:", req.body);
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json("Username and password are required.");
  }

  const q = "SELECT * FROM users WHERE user_name = ? AND password = ?";
  const values = [user_name, password];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);

    if (data.length > 0) {
      return res.json({
        message: "Sign in successful.",
        user: data[0],
      });
    } else {
      return res.status(401).json("Invalid username or password.");
    }
  });
});

export default router;
