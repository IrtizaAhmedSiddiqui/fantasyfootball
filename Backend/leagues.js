import express from "express";
import mysql from "mysql";

const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xboxone2003",
  database: "project", // Replace with your actual database name
});

// Get all league standings with team names
router.get("/", (req, res) => {
  const q = `
      SELECT 
        l.team_id,
        t.team_name,
        l.matches_played,
        l.wins,
        l.draws,
        l.losses,
        l.goals_scored,
        l.goals_conceded,
        l.goal_difference,
        l.points
      FROM league_table l
      JOIN teams t ON l.team_id = t.team_id
      ORDER BY l.points DESC, l.goal_difference DESC
    `;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update league table for a specific team
router.put("/:team_id", (req, res) => {
  const teamId = req.params.team_id;
  const {
    matches_played,
    wins,
    draws,
    losses,
    goals_scored,
    goals_conceded,
    points,
  } = req.body;

  const q = `
    UPDATE league_table 
    SET 
      matches_played = ?, 
      wins = ?, 
      draws = ?, 
      losses = ?, 
      goals_scored = ?, 
      goals_conceded = ?, 
      points = ?
    WHERE team_id = ?`;

  const values = [
    matches_played,
    wins,
    draws,
    losses,
    goals_scored,
    goals_conceded,
    points,
    teamId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("League table updated successfully.");
  });
});

// Add a new team to the league table
router.post("/", (req, res) => {
  const q = `
      INSERT INTO league_table (
        team_id, matches_played, wins, draws, losses, goals_scored, goals_conceded, points
      ) VALUES (?)`;

  const values = [
    "22", // Replace with a valid team_id from your teams table
    10, // matches_played
    3, // wins
    4, // draws
    3, // losses
    17, // goals_scored
    13, // goals_conceded
    12, // points (calculated based on wins/draws if necessary)
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Test data inserted successfully.");
  });
});

// Delete a team from the league table
router.delete("/:team_id", (req, res) => {
  const teamId = req.params.team_id;
  const q = "DELETE FROM league_table WHERE team_id = ?";

  db.query(q, [teamId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Team removed from league table.");
  });
});

export default router;
