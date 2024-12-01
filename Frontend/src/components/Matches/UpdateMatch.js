import React, { useState, useEffect } from "react";

function UpdateMatch({
  updateMatchData,
  updateModalSetting,
  handlePageUpdate,
}) {
  const [team1, setTeam1] = useState(updateMatchData.team1 || "");
  const [team2, setTeam2] = useState(updateMatchData.team2 || "");
  const [matchDate, setMatchDate] = useState(updateMatchData.matchDate || "");
  const [score1, setScore1] = useState(updateMatchData.score1 || "");
  const [score2, setScore2] = useState(updateMatchData.score2 || "");

  useEffect(() => {
    if (updateMatchData) {
      setTeam1(updateMatchData.team1);
      setTeam2(updateMatchData.team2);
      setMatchDate(updateMatchData.matchDate);
      setScore1(updateMatchData.score1);
      setScore2(updateMatchData.score2);
    }
  }, [updateMatchData]);

  const handleUpdateMatch = () => {
    const updatedMatchData = {
      team1,
      team2,
      matchDate,
      score1,
      score2,
    };

    // Make an API call to update the match
    fetch(`http://localhost:8800/match/${updateMatchData.match_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMatchData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Match updated successfully");
          handlePageUpdate(); // Refresh the data
          updateModalSetting(); // Close the modal
        } else {
          alert("Error updating match");
        }
      })
      .catch((error) => console.error("Error updating match:", error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Match</h2>
        <form>
          <div>
            <label>Team 1</label>
            <input
              type="text"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              placeholder="Enter Team 1"
            />
          </div>
          <div>
            <label>Team 2</label>
            <input
              type="text"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              placeholder="Enter Team 2"
            />
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
          <button type="button" onClick={handleUpdateMatch}>
            Update Match
          </button>
          <button type="button" onClick={updateModalSetting}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateMatch;
