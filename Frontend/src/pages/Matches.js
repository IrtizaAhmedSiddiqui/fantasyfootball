import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";

function Matches() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [gameweeks, setGameweeks] = useState([]);
  const [selectedGameweek, setSelectedGameweek] = useState("");
  const [matches, setMatches] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // State for reset button

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchGameweeks(); // Fetch available gameweeks on initial load
  }, []);

  useEffect(() => {
    if (selectedGameweek) {
      fetchMatchesForGameweek(selectedGameweek); // Fetch matches for the selected gameweek
    }
  }, [selectedGameweek]);

  // Fetch gameweeks from backend
  const fetchGameweeks = () => {
    fetch("http://localhost:8800/fantasy/get-gameweeks")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGameweeks(data.gameweeks); // Set the available gameweeks
      })
      .catch((error) => {
        console.error("Error fetching gameweeks:", error);
      });
  };

  // Fetch matches for a specific gameweek from backend
  const fetchMatchesForGameweek = (gameweek) => {
    fetch(`http://localhost:8800/fantasy/matches/${gameweek}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMatches(data.matches); // Set the fetched matches
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
      });
  };

  // Simulate all matches for the selected gameweek
  const simulateAllMatches = () => {
    setIsSimulating(true);
    fetch(`http://localhost:8800/fantasy/resolve-matches/${selectedGameweek}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setIsSimulating(false);
        fetchMatchesForGameweek(selectedGameweek); // Refresh matches after simulation
      })
      .catch((error) => {
        setIsSimulating(false);
        console.error("Error simulating matches:", error);
      });
  };

  // Reset season
  const resetSeason = () => {
    setIsResetting(true);
    fetch("http://localhost:8800/fantasy/reset-season", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setIsResetting(false);
        alert("Season has been reset!");
        // Optionally, fetch the latest data or refresh the page
      })
      .catch((error) => {
        setIsResetting(false);
        console.error("Error resetting season:", error);
        alert("An error occurred while resetting the season.");
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-red">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Matches</span>
              {/* Gameweek Filter */}
              <select
                onChange={(e) => setSelectedGameweek(e.target.value)}
                value={selectedGameweek}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gameweek</option>
                {gameweeks.map((gameweek) => (
                  <option key={gameweek.gameweek} value={gameweek.gameweek}>
                    Gameweek {gameweek.gameweek}
                  </option>
                ))}
              </select>
              {localStorageData.user_name === "Admin" ? (
                <>
                  {/* Simulate Matches Button */}
                  <button
                    onClick={simulateAllMatches}
                    disabled={isSimulating || !selectedGameweek}
                    className={`${
                      isSimulating ? "bg-gray-400" : "bg-blue-600"
                    } text-white px-4 py-2 rounded-md`}
                  >
                    {isSimulating ? "Simulating..." : "Simulate Matches"}
                  </button>
                  {/* Reset Season Button */}
                  <button
                    onClick={resetSeason}
                    disabled={isResetting}
                    className={`${
                      isResetting ? "bg-gray-400" : "bg-red-600"
                    } text-white px-4 py-2 rounded-md`}
                  >
                    {isResetting ? "Resetting..." : "Reset Season"}
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                No Matches Found!
              </h2>
              <p className="text-gray-600 mb-4">
                There are no matches available for this gameweek.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border shadow-lg bg-white border-gray-300">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    Match ID
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    Team 1
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    Team 2
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matches.map((match) => (
                  <tr
                    key={match.match_id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {match.match_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {match.team1_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {match.team2_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {match.winner_user_id === -1
                        ? "Draw"
                        : match.winner_name
                        ? match.winner_name
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;
