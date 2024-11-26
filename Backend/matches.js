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

// Get all matches
router.get("/", (req, res) => {
  const q = "SELECT * FROM matches";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add new match
router.post("/", (req, res) => {
  const q =
    "INSERT INTO matches (`match_id`, `home_team_id`, `away_team_id`, `match_date`, `match_time`, `stadium_name`, `home_team_score`, `away_team_score`, `team_id`) VALUES (?)";

  const values = [
    "m2", // match_id
    "2", // home_team_id
    "1", // away_team_id
    "2024-11-20", // match_date (format: YYYY-MM-DD)
    "2024-11-20 18:30:00", // match_time (timestamp format)
    "Pakistan Stadium", // stadium_name
    5, // home_team_score
    5, // away_team_score
    "3", // team_id (replace with relevant team_id if needed)
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update match details
router.put("/:id", (req, res) => {
  const matchId = req.params.id;
  const q =
    "UPDATE matches SET `home_team_id`=?, `away_team_id`=?, `match_date`=?, `match_time`=?, `stadium_name`=?, `home_team_score`=?, `away_team_score`=?, `team_id`=? WHERE `match_id`=?";

  const values = [
    req.body.home_team_id,
    req.body.away_team_id,
    req.body.match_date,
    req.body.match_time,
    req.body.stadium_name,
    req.body.home_team_score,
    req.body.away_team_score,
    req.body.team_id,
  ];

  db.query(q, [...values, matchId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Match updated successfully.");
  });
});

// Delete match
router.delete("/:id", (req, res) => {
  const matchId = req.params.id;
  const q = "DELETE FROM matches WHERE `match_id` = ?";

  db.query(q, [matchId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Match deleted successfully.");
  });
});

export default router;
