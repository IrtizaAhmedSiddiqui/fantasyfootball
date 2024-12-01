import React, { useState, useEffect } from "react";

function AddMatch({ addMatchModalSetting, handlePageUpdate }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [teams, setTeams] = useState([]); // To store teams from the API
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch teams from the API to populate the dropdown
    fetch("http://localhost:8800/team")
      .then((response) => response.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const handleAddMatch = () => {
    // Validation to check if all fields are filled
    if (!team1 || !team2 || !matchDate || !score1 || !score2) {
      setError("All fields are required!");
      return;
    }

    const matchData = {
      team1,
      team2,
      matchDate,
      score1,
      score2,
    };

    // Make an API call to save the match
    fetch("http://localhost:8800/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Match added successfully");
          handlePageUpdate(); // Refresh the data
          addMatchModalSetting(); // Close the modal
        } else {
          alert("Error adding match");
        }
      })
      .catch((error) => console.error("Error adding match:", error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Match</h2>
        {error && <p className="error">{error}</p>} {/* Error message */}
        <form>
          <div>
            <label>Team 1</label>
            <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
              <option value="">Select Team 1</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Team 2</label>
            <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
              <option value="">Select Team 2</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Match Date</label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
            />
          </div>
          <div>
            <label>Score 1</label>
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              placeholder="Enter Score 1"
            />
          </div>
          <div>
            <label>Score 2</label>
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              placeholder="Enter Score 2"
            />
          </div>
          <button type="button" onClick={handleAddMatch}>
            Add Match
          </button>
          <button type="button" onClick={addMatchModalSetting}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMatch;
