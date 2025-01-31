import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import AddFantasy from "../components/Fantasy/AddFantasy";
import UpdateFantasy from "../components/Fantasy/UpdateFantasy";

function Fantasy() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  console.log("localStorageData", localStorageData);

  const [showFantasyModal, setShowFantasyModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFantasy, setUpdateFantasy] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);
  console.log("====================================");
  console.log(authContext);
  console.log("====================================");

  useEffect(() => {
    fetchActivePlayers();
    fetchFantasy();
  }, [authContext.user, updatePage]);

  const fetchActivePlayers = () => {
    fetch("http://localhost:8800/player/active")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllPlayers(data); // Set the data to state
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
        // setLoading(false);
      });
  };

  const fetchFantasy = () => {
    fetch(
      `http://localhost:8800/fantasy/team-details/${localStorageData.user_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFantasy(data); // Set the data to state
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
        // setLoading(false);
      });
  };

  // Modal for Item ADD
  const addFantasyModalSetting = () => {
    setShowFantasyModal(!showFantasyModal);
  };

  // Modal for Item UPDATE
  const updateFantasyModalSetting = (selectedData) => {
    const updateData = {
      user_id: selectedData.user_id,
      team_name: selectedData.team_name,
      player_ids: selectedData.players,
    };
    console.log("Clicked: edit");
    setUpdateFantasy(updateData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showFantasyModal && (
          <AddFantasy
            addFantasyModalSetting={addFantasyModalSetting}
            handlePageUpdate={handlePageUpdate}
            players={allPlayers}
          />
        )}
        {showUpdateModal && (
          <UpdateFantasy
            updateFantasyData={updateFantasy}
            updateModalSetting={updateFantasyModalSetting}
            handlePageUpdate={handlePageUpdate}
            players={allPlayers}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Fantasy</span>
            </div>
          </div>
        </div>
        {/* Table  */}
        {fantasy.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-16 h-16 text-red-500 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m2-10h.01M3 10h.01M17 21h-2a2 2 0 01-2-2v-1a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2zm-8-3a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                No Fantasy Team Found!
              </h2>
              <p className="text-gray-600 mb-4">
                You haven’t created a fantasy team yet. Get started now to build
                your dream team!
              </p>
              <button
                onClick={addFantasyModalSetting}
                className="inline-flex items-center justify-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-lg"
              >
                Create Fantasy Team
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Team Overview Section */}
            <div className="overflow-x-auto rounded-lg border shadow-lg bg-white border-gray-300 mb-6">
              <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      Fantasy ID
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      Team Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      Team Value
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      Points
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      Wins
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                      More
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr
                    key={fantasy.user_id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {fantasy.user_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {fantasy.team_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-green-700 font-bold">
                      {fantasy.players.reduce(
                        (acc, player) => acc + player.player_value,
                        0
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {fantasy.team_points}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                      {fantasy.team_wins}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className="cursor-pointer text-blue-700 hover:text-blue-900 hover:underline"
                        onClick={() => updateFantasyModalSetting(fantasy)}
                      >
                        Edit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Players Table Section */}
            <div className="overflow-x-auto rounded-lg border shadow-lg bg-white border-gray-300">
              <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-green-900">
                      Player ID
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-green-900">
                      Player Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-green-900">
                      Player Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fantasy.players.map((player) => (
                    <tr
                      key={player.player_id}
                      className="hover:bg-green-50 transition-colors duration-150"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                        {player.player_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                        {player.player_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-blue-700 font-medium">
                        {player.player_value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Fantasy;
