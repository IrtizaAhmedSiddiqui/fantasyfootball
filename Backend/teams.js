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

// Get all teams
router.get("/", (req, res) => {
  const q = `Select * from teams`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get all teams with managers
router.get("/teamWithManager", (req, res) => {
  const q = `SELECT 
    teams.team_id,
    teams.team_name,
    teams.stadium_name,
    teams.manager_id,
    managers.manager_name,
    teams.owner,
    teams.budget
FROM 
    teams
LEFT JOIN 
    managers
ON 
    teams.manager_id = managers.manager_id;
`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add new team
router.post("/", (req, res) => {
  const q =
    "INSERT INTO teams (`team_name`, `stadium_name`, `manager_id`, `owner`, `budget`) VALUES (?)";

  // Replace with dynamic values from req.body if necessary
  const values = [
    req.body.team_name,
    req.body.stadium_name,
    req.body.manager_id || null,
    req.body.owner,
    req.body.budget,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update team details
router.put("/:id", (req, res) => {
  const teamId = req.params.id;
  const q =
    "UPDATE teams SET `team_name`=?, `stadium_name`=?, `manager_id`=?, `owner`=?, `budget`=? WHERE `team_id`=?";

  const values = [
    req.body.team_name,
    req.body.stadium_name,
    req.body.manager_id || null,
    req.body.owner,
    req.body.budget,
  ];

  db.query(q, [...values, teamId], (err, data) => {
    if (err) {
      // Check if the error is caused by a UNIQUE constraint violation
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json(
            "Error: This manager is already assigned to a team. Please select a different manager."
          );
      }
      // Handle other errors
      return res.status(500).json(err);
    }

    res.json("Team updated successfully.");
  });
});

// Delete team
router.delete("/:id", (req, res) => {
  const teamId = req.params.id;
  const q = "DELETE FROM teams WHERE `team_id` = ?";

  db.query(q, [teamId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Team deleted successfully.");
  });
});

export default router;
