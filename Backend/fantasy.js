import express from "express";
import mysql from "mysql";

const router = express.Router();

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xboxone2003", // Secure your password
  database: "project",
});

router.get("/team-details/:user_id", (req, res) => {
  const { user_id } = req.params;

  // Query to get team and players details
  const teamQuery = `
    SELECT 
      ft.user_id, 
      ft.team_name,
      ft.team_points,
      ft.team_wins, 
      fp.player_id, 
      p.name AS player_name,
      p.value AS player_value
    FROM 
      fantasy_teams ft
    JOIN 
      fantasy_players fp ON ft.user_id = fp.user_id
    JOIN 
      players p ON fp.player_id = p.player_id
    WHERE 
      ft.user_id = ?`;

  db.query(teamQuery, [user_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to fetch team details." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .send({ error: "No team found for the given user." });
    }

    // Build the response
    const { team_name, team_wins, team_points } = results[0];
    const players = results.map((row) => ({
      player_id: row.player_id,
      player_name: row.player_name,
      player_value: row.player_value,
    }));

    res.status(200).send({
      user_id: parseInt(user_id),
      team_name,
      team_points,
      team_wins,
      players,
    });
  });
});

router.post("/add-team", (req, res) => {
  const { user_id, team_name, player_ids } = req.body;

  if (!user_id || !team_name || !player_ids || player_ids.length !== 11) {
    return res.status(400).send({
      error: "Invalid input. Provide user_id, team_name, and 11 players.",
    });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send({ error: "Transaction failed to start." });
    }

    // Step 1: Insert team
    db.query(
      "INSERT INTO fantasy_teams (user_id, team_name) VALUES (?, ?)",
      [user_id, team_name],
      (err, teamResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send({ error: "Failed to add team." });
          });
        }

        // Step 2: Insert players
        const values = player_ids.map((player_id) => [user_id, player_id]);
        db.query(
          "INSERT INTO fantasy_players (user_id, player_id) VALUES ?",
          [values],
          (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send({ error: "Failed to add players." });
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .send({ error: "Failed to commit transaction." });
                });
              }
              res
                .status(200)
                .send({ message: "Team added successfully!", user_id });
            });
          }
        );
      }
    );
  });
});

router.put("/update-team", (req, res) => {
  const { user_id, team_name, player_ids } = req.body;

  if (!user_id || !player_ids || player_ids.length !== 11) {
    return res.status(400).send({
      error: "Invalid input. Provide user_id, and exactly 11 players.",
    });
  }

  // Check for duplicate player IDs
  const uniquePlayers = new Set(player_ids);
  if (uniquePlayers.size !== player_ids.length) {
    return res.status(400).json("Error: Duplicate players add.");
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Transaction failed to start." });
    }

    // Step 1: Validate team ownership
    db.query(
      "SELECT COUNT(*) AS count FROM fantasy_teams WHERE user_id = ?",
      [user_id],
      (err, results) => {
        if (err) {
          console.error(err);
          return db.rollback(() => {
            res
              .status(500)
              .send({ error: "Failed to validate team ownership." });
          });
        }

        if (results[0].count === 0) {
          return db.rollback(() => {
            res.status(404).send({
              error: "Team not found or does not belong to the user.",
            });
          });
        }

        // Step 2: Update team name if provided
        const updateTeamName = team_name
          ? (callback) =>
              db.query(
                "UPDATE fantasy_teams SET team_name = ? WHERE user_id = ?",
                [team_name, user_id],
                callback
              )
          : (callback) => callback(null);

        updateTeamName((err) => {
          if (err) {
            console.error(err);
            return db.rollback(() => {
              res.status(500).send({ error: "Failed to update team name." });
            });
          }

          // Step 3: Delete existing players
          db.query(
            "DELETE FROM fantasy_players WHERE user_id = ?",
            [user_id],
            (err) => {
              if (err) {
                console.error(err);
                return db.rollback(() => {
                  res
                    .status(500)
                    .send({ error: "Failed to delete existing players." });
                });
              }

              // Step 4: Insert new players
              const playerValues = player_ids.map((player_id) => [
                user_id,
                player_id,
              ]);
              db.query(
                "INSERT INTO fantasy_players (user_id, player_id) VALUES ?",
                [playerValues],
                (err) => {
                  if (err) {
                    console.error(err);
                    return db.rollback(() => {
                      res
                        .status(500)
                        .send({ error: "Failed to insert new players." });
                    });
                  }

                  // Commit the transaction
                  db.commit((err) => {
                    if (err) {
                      console.error(err);
                      return db.rollback(() => {
                        res
                          .status(500)
                          .send({ error: "Failed to commit transaction." });
                      });
                    }

                    res
                      .status(200)
                      .send({ message: "Team updated successfully!" });
                  });
                }
              );
            }
          );
        });
      }
    );
  });
});

router.post("/resolve-matches/:gameweek", (req, res) => {
  const gameweek = req.params.gameweek;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send({ error: "Transaction failed to start." });
    }

    // Fetch all matches for the given gameweek
    db.query(
      "SELECT * FROM fantasy_matches WHERE gameweek = ?",
      [gameweek],
      (err, matches) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send({ error: "Failed to fetch matches." });
          });
        }

        if (matches.length === 0) {
          return db.rollback(() => {
            res
              .status(404)
              .send({ error: "No matches found for the given gameweek." });
          });
        }

        // Process each match
        matches.forEach((match, index) => {
          const winner =
            Math.random() < 0.5 ? match.team1_user_id : match.team2_user_id;
          const isDraw = Math.random() < 0.1; // 10% chance of a draw

          if (isDraw) {
            // Update match as draw
            db.query(
              "UPDATE fantasy_matches SET winner_user_id = -1 WHERE match_id = ?",
              [match.match_id],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).send({ error: "Failed to update match." });
                  });
                }

                // Award 1 point to both teams
                db.query(
                  "UPDATE fantasy_teams SET team_points = team_points + 1 WHERE user_id IN (?, ?)",
                  [match.team1_user_id, match.team2_user_id],
                  (err) => {
                    if (err) {
                      return db.rollback(() => {
                        res
                          .status(500)
                          .send({ error: "Failed to update teams' points." });
                      });
                    }
                  }
                );
              }
            );
          } else {
            // Update match with a winner
            db.query(
              "UPDATE fantasy_matches SET winner_user_id = ? WHERE match_id = ?",
              [winner, match.match_id],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .send({ error: "Failed to update match winner." });
                  });
                }

                // Award 3 points to winner and increment wins
                db.query(
                  "UPDATE fantasy_teams SET team_points = team_points + 3, team_wins = team_wins + 1 WHERE user_id = ?",
                  [winner],
                  (err) => {
                    if (err) {
                      return db.rollback(() => {
                        res.status(500).send({
                          error: "Failed to update winning team's stats.",
                        });
                      });
                    }
                  }
                );
              }
            );
          }

          // Check if it's the last match in the loop to commit transaction
          if (index === matches.length - 1) {
            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .send({ error: "Failed to commit transaction." });
                });
              }
              res.send({
                success: true,
                message: `Matches for gameweek ${gameweek} resolved.`,
              });
            });
          }
        });
      }
    );
  });
});

router.post("/reset-season", (req, res) => {
  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send({ error: "Transaction failed to start." });
    }

    // Step 1: Truncate the fantasy_matches table
    db.query("TRUNCATE TABLE fantasy_matches", (err) => {
      if (err) {
        return db.rollback(() => {
          res
            .status(500)
            .send({ error: "Failed to truncate fantasy_matches table." });
        });
      }

      // Step 2: Reset team points and wins
      db.query(
        "UPDATE fantasy_teams SET team_points = 0, team_wins = 0",
        (err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .send({ error: "Failed to reset team points and wins." });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res
                  .status(500)
                  .send({ error: "Failed to commit transaction." });
              });
            }

            // Send the initial success response
            res.send({ success: true, message: "Season reset successfully." });

            // Delay calling the stored procedure
            setTimeout(() => {
              // Get the total number of teams
              db.query(
                "SELECT COUNT(*) AS total_teams FROM fantasy_teams",
                (err, result) => {
                  if (err) {
                    console.error("Error fetching team count:", err);
                    return;
                  }

                  const totalTeams = result[0].total_teams;

                  // Call the stored procedure with the total number of teams
                  db.query("CALL generate_matches(?)", [totalTeams], (err) => {
                    if (err) {
                      console.error(
                        "Error calling generate_matches procedure:",
                        err
                      );
                    } else {
                      console.log("Matches generated successfully.");
                    }
                  });
                }
              );
            }, 3000); // 3-second delay
          });
        }
      );
    });
  });
});

router.get("/get-gameweeks", (req, res) => {
  // Query to fetch all distinct gameweeks
  db.query(
    "SELECT DISTINCT gameweek FROM fantasy_matches ORDER BY gameweek ASC",
    (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log the error for debugging
        return res.status(500).send({ error: "Failed to fetch gameweeks." });
      }

      // Check if results contain data
      if (!results || results.length === 0) {
        return res.status(404).send({ error: "No gameweeks found." });
      }

      // Send the gameweeks data back to the frontend
      res.send({ gameweeks: results });
    }
  );
});

router.get("/matches/:gameweek", (req, res) => {
  const { gameweek } = req.params;

  // Query to fetch matches for the given gameweek
  db.query(
    `SELECT 
    fm.match_id,
    fm.team1_user_id,
    team1.team_name AS team1_name,
    fm.team2_user_id,
    team2.team_name AS team2_name,
    fm.winner_user_id,
    winner.team_name AS winner_name
  FROM 
    fantasy_matches fm
  LEFT JOIN 
    fantasy_teams team1 ON fm.team1_user_id = team1.user_id
  LEFT JOIN 
    fantasy_teams team2 ON fm.team2_user_id = team2.user_id
  LEFT JOIN 
    fantasy_teams winner ON fm.winner_user_id = winner.user_id
  WHERE 
    fm.gameweek = ?`,
    [gameweek],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ error: "Failed to fetch matches." });
      }

      // Check if results contain data
      if (!results || results.length === 0) {
        return res
          .status(404)
          .send({ error: "No matches found for this gameweek." });
      }

      // Send the matches data back to the frontend
      res.send({ matches: results });
    }
  );
});

export default router;
