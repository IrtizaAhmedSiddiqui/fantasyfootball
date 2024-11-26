import express from "express";
import mysql from "mysql";
const router = express.Router();

// MySQL connection (make sure this matches your database credentials)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xboxone2003", // Ensure the password is correct
  database: "project", // Replace with your actual database name
});

// Get all players
router.get("/", (req, res) => {
  const q = `SELECT 
    players.player_id,
    players.name,
    players.age,
    players.nationality,
    players.position,
    teams.team_id,
    teams.team_name,
    players.value,
    players.shirt_number,
    players.contract_length,
    players.status,
    players.salary
FROM 
    players
JOIN 
    teams
ON 
    players.team_id = teams.team_id
`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/active", (req, res) => {
  const q = `SELECT 
    players.player_id,
    players.name,
    players.age,
    players.nationality,
    players.position,
    teams.team_id,
    teams.team_name,
    players.value,
    players.shirt_number,
    players.contract_length,
    players.status,
    players.salary
FROM 
    players
JOIN 
    teams
ON 
    players.team_id = teams.team_id
WHERE 
    players.status = 'active';
`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add new player
router.post("/", (req, res) => {
  const q =
    "INSERT INTO players (`name`, `age`, `nationality`, `position`, `team_id`, `value`, `shirt_number`, `contract_length`, `status`, `salary`) VALUES (?)";

  const values = [
    req.body.name,
    req.body.age,
    req.body.nationality,
    req.body.position,
    req.body.team_id,
    req.body.value,
    req.body.shirt_number,
    req.body.contract_length,
    req.body.status,
    req.body.salary,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update player details
router.put("/:id", (req, res) => {
  console.log("Request received with ID:", req.params.id);
  console.log("Request body:", req.body);

  const playerId = req.params.id;
  const q =
    "UPDATE players SET `name`=?, `age`=?, `nationality`=?, `position`=?, `team_id`=?, `value`=?, `shirt_number`=?, `contract_length`=?, `status`=?, `salary`=? WHERE `player_id`=?";

  const values = [
    req.body.name,
    req.body.age,
    req.body.nationality,
    req.body.position,
    req.body.team_id,
    req.body.value,
    req.body.shirt_number,
    req.body.contract_length,
    req.body.status,
    req.body.salary,
  ];

  db.query(q, [...values, playerId], (err, data) => {
    if (err) {
      console.error("Error updating player:", err);
      return res.status(500).json(err);
    }
    console.log("Player updated successfully:", data);
    return res.json("Player updated successfully.");
  });
});

// Delete player
router.delete("/:id", (req, res) => {
  const playerId = req.params.id;
  const q = "DELETE FROM players WHERE `player_id`=?";
  db.query(q, [playerId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Player deleted successfully.");
  });
});

export default router;
