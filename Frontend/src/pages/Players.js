import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddPlayer from "../components/Players/AddPlayer";
import AuthContext from "../AuthContext";
import UpdatePlayer from "../components/Players/UpdatePlayer";

function Players() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  console.log("localStorageData", localStorageData);

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePlayer, setUpdatePlayer] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");
  let [isOpen, setIsOpen] = useState(false);

  const authContext = useContext(AuthContext);
  console.log("====================================");
  console.log(authContext);
  console.log("====================================");

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, [authContext.user, updatePage]);

  const fetchPlayers = () => {
    fetch("http://localhost:8800/player/")
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

  const fetchTeams = () => {
    fetch("http://localhost:8800/team/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllTeams(data); // Set the data to state
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
        // setLoading(false);
      });
  };

  // Delete item
  const deletePlayer = (id) => {
    fetch(`http://localhost:8800/player/${id}`, {
      method: "DELETE", // Use DELETE method
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete player");
        }
        return response.json();
      })
      .then((data) => {
        alert(data); // Notify the success response from the server
        handlePageUpdate(); // Refresh the page or state to reflect deletion
      })
      .catch((err) => {
        console.error("Error deleting player:", err);
        alert("An error occurred while deleting the player");
      });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(id) {
    setItemToBeDeleted(id);
    setIsOpen(true);
  }

  // Modal for Item ADD
  const addPlayersModalSetting = () => {
    setShowPlayerModal(!showPlayerModal);
  };

  // Modal for Item UPDATE
  const updatePlayerModalSetting = (selectedData) => {
    console.log("Clicked: edit");
    setUpdatePlayer(selectedData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showPlayerModal && (
          <AddPlayer
            addPlayerModalSetting={addPlayersModalSetting}
            handlePageUpdate={handlePageUpdate}
            teams={allTeams}
          />
        )}
        {showUpdateModal && (
          <UpdatePlayer
            updatePlayerData={updatePlayer}
            updateModalSetting={updatePlayerModalSetting}
            handlePageUpdate={handlePageUpdate}
            teams={allTeams}
          />
        )}

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Delete Player
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this player?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeModal();
                          deletePlayer(itemToBeDeleted);
                        }}
                      >
                        Delete
                      </button>

                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Players</span>
            </div>
            <div className="flex gap-4">
              {localStorageData.user_name === "Admin" ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                  onClick={addPlayersModalSetting}
                >
                  Add Player
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border shadow-lg bg-white border-gray-300 mb-6">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Age
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Nationality
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Position
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Team
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Fantasy Value
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Shirt Number
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Contract (yrs)
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Status
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Salary
                </th>
                {localStorageData.user_name === "Admin" && (
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    More
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allPlayers.map((player, index) => {
                return (
                  <tr
                    key={player.player_id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {player.player_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.age}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.position}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.team_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-green-700 font-bold">
                      ${player.value.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.shirt_number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.contract_length}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {player.status}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      ${player.salary.toLocaleString()}
                    </td>
                    {localStorageData.user_name === "Admin" && (
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className="text-green-700 cursor-pointer hover:text-green-900 hover:underline"
                          onClick={() => updatePlayerModalSetting(player)}
                        >
                          Edit
                        </span>
                        <span
                          className="text-red-600 px-2 cursor-pointer hover:text-red-900"
                          onClick={() => openModal(player.player_id)}
                        >
                          Delete
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Players;
