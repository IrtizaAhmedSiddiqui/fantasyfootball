import express from "express";
import mysql from "mysql";
const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xboxone2003",
  database: "project",
});

// Get all managers
router.get("/", (req, res) => {
  const q = "SELECT * FROM managers";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add new manager
router.post("/", (req, res) => {
  const q =
    "INSERT INTO managers (`manager_name`, `manager_nationality`, `salary`) VALUES (?)";
  const values = [
    req.body.manager_name,
    req.body.manager_nationality,
    req.body.salary,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update manager details
router.put("/:id", (req, res) => {
  const managerId = req.params.id;
  const q =
    "UPDATE managers SET `manager_name`=?, `manager_nationality`=?, `salary`=? WHERE `manager_id`=?";
  const values = [
    req.body.manager_name,
    req.body.manager_nationality,
    req.body.salary,
  ];
  db.query(q, [...values, managerId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Manager updated successfully.");
  });
});

// Delete a manager
router.delete("/:id", (req, res) => {
  const managerId = req.params.id;
  const q = "DELETE FROM managers WHERE `manager_id`=?";
  db.query(q, [managerId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Manager deleted successfully.");
  });
});

export default router;
