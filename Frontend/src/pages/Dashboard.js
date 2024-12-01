import React, { useState, useEffect } from "react";
import {
  ChartPieIcon,
  UserGroupIcon,
  TrophyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const user_id = 1; // Replace with the actual user ID, e.g., from auth context

  useEffect(() => {
    // Fetch team details for the user using the fetch API
    fetch(`http://localhost:8800/fantasy/team-details/${user_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch team details.");
        }
        return response.json();
      })
      .then((data) => {
        setTeamDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching team details:", error);
        setLoading(false);
      });
  }, [user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get the top 3 players (or you can modify this based on your logic)
  const topPlayers = teamDetails.players
    ? teamDetails.players.slice(0, 5) // Get top 5 players
    : [];

  return (
    <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
      {/* Team Performance Card */}
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-blue-100 p-1 text-blue-600">
          <ChartPieIcon className="h-5 w-5" />
          <span className="text-xs font-medium"> 85% Efficiency </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Team Performance
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              {teamDetails.team_name}
            </span>
            <span className="text-xs text-gray-500">
              {" "}
              with {teamDetails.team_points} points
            </span>
          </p>
        </div>
      </article>

      {/* Top Players Card */}
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
          <UserGroupIcon className="h-5 w-5" />
          <span className="text-xs font-medium"> 5 Star Players </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Top Players
          </strong>
        </div>
        <ul className="block text-sm font-medium text-blue-500">
          {topPlayers.map((player) => (
            <li key={player.player_id}>{player.player_name}</li>
          ))}
        </ul>
      </article>

      {/* Total Matches Played Card */}
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-yellow-100 p-1 text-yellow-600">
          <TrophyIcon className="h-5 w-5" />
          <span className="text-xs font-medium"> 25 Matches </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Matches Played
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              {" "}
              25 Matches
            </span>
            <span className="text-xs text-gray-500"> this season</span>
          </p>
        </div>
      </article>

      {/* League Points */}
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
          <UserIcon className="h-5 w-5" />
          <span className="text-xs font-medium"> 320 Points </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            League Points
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              {" "}
              {teamDetails.team_points} Points
            </span>
            <span className="text-xs text-gray-500"> ranked #1</span>
          </p>
        </div>
      </article>

      {/* Chart Section */}
      <div className="flex flex-wrap justify-around bg-white rounded-lg py-8 col-span-full">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-600 mb-2">
            Performance Chart
          </span>
          <div className="bg-blue-50 rounded-lg w-80 h-60 flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              <span className="text-2xl font-medium text-gray-900">
                {teamDetails.team_name}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-600 mb-2">
            Top Scorers
          </span>
          <div className="bg-green-50 rounded-lg w-80 h-60 flex items-center justify-center">
            <ul>
              {topPlayers.map((player) => (
                <li key={player.player_id} className="text-blue-500 text-sm">
                  {player.player_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
