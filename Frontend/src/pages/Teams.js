import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddPlayer from "../components/Players/AddPlayer";
import AuthContext from "../AuthContext";
import UpdatePlayer from "../components/Players/UpdatePlayer";
import AddTeam from "../components/Teams/AddTeam";
import UpdateTeam from "../components/Teams/UpdateTeam";

function Teams() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTeam, setUpdateTeam] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [teamToBeDeleted, setTeamToBeDeleted] = useState("");
  let [isOpen, setIsOpen] = useState(false);

  const authContext = useContext(AuthContext);
  console.log("====================================");
  console.log(authContext);
  console.log("====================================");

  useEffect(() => {
    fetchTeamsWithManagers();
    fetchManagers();
  }, [authContext.user, updatePage]);

  const fetchTeamsWithManagers = () => {
    fetch("http://localhost:8800/team/teamWithManager")
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

  const fetchManagers = () => {
    fetch("http://localhost:8800/manager/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllManagers(data); // Set the data to state
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching manager data:", error);
        // setLoading(false);
      });
  };

  // Delete item
  const deleteTeam = (id) => {
    fetch(`http://localhost:8800/team/${id}`, {
      method: "DELETE", // Use DELETE method
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete team");
        }
        return response.json();
      })
      .then((data) => {
        alert(data); // Notify the success response from the server
        handlePageUpdate(); // Refresh the page or state to reflect deletion
      })
      .catch((err) => {
        console.error("Error deleting team:", err);
        alert("An error occurred while deleting the team");
      });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(id) {
    setTeamToBeDeleted(id);
    setIsOpen(true);
  }

  // Modal for Item ADD
  const addTeamModalSetting = () => {
    setShowTeamModal(!showTeamModal);
  };

  // Modal for Item UPDATE
  const updateTeamModalSetting = (selectedData) => {
    console.log("Clicked: edit");
    setUpdateTeam(selectedData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showTeamModal && (
          <AddTeam
            addTeamModalSetting={addTeamModalSetting}
            handlePageUpdate={handlePageUpdate}
            managers={allManagers}
          />
        )}
        {showUpdateModal && (
          <UpdateTeam
            updateTeamData={updateTeam}
            updateModalSetting={updateTeamModalSetting}
            handlePageUpdate={handlePageUpdate}
            managers={allManagers}
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
                      Delete Team
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this team?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeModal();
                          deleteTeam(teamToBeDeleted);
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
              <span className="font-bold">Teams</span>
            </div>
            <div className="flex gap-4">
              {localStorageData.user_name === "Admin" ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                  onClick={addTeamModalSetting}
                >
                  Add Team
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
                  Stadium
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Manager
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Owner
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                  Budget
                </th>
                {localStorageData.user_name === "Admin" && (
                  <th className="whitespace-nowrap px-6 py-4 text-left font-semibold text-blue-900">
                    More
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allTeams.map((team, index) => {
                return (
                  <tr
                    key={team.team_id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {team.team_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {team.team_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {team.stadium_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {team.manager_name
                        ? team.manager_name
                        : "No Manager Assigned"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {team.owner}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-green-700 font-bold">
                      ${team.budget.toLocaleString()}
                    </td>
                    {localStorageData.user_name === "Admin" && (
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className="text-green-700 cursor-pointer hover:text-green-900 hover:underline"
                          onClick={() => updateTeamModalSetting(team)}
                        >
                          Edit
                        </span>
                        <span
                          className="text-red-600 px-2 cursor-pointer hover:text-red-900"
                          onClick={() => openModal(team.team_id)}
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

export default Teams;
