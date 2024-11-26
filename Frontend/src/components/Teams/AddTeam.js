import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function AddTeam({
  addTeamModalSetting,
  handlePageUpdate,
  managers,
}) {
  const authContext = useContext(AuthContext);
  const [team, setTeam] = useState({
    team_name: "",
    stadium_name: "",
    manager_id: "",
    owner: "",
    budget: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setTeam({ ...team, [key]: value });
  };

  const addTeam = () => {
    // Check for empty fields
    if (
      team.team_name === "" ||
      team.stadium_name === "" ||
      team.owner === "" ||
      team.budget === ""
    ) {
      return alert("Fields cannot be left Empty");
    }

    console.log("Player object being sent:", team);

    // API call to update team
    fetch(`http://localhost:8800/team/`, {
      // Use PUT method with team ID in the URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team), // Send the team object in the body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add team");
        }
        return response.json();
      })
      .then((data) => {
        alert(data); // Notify success response from the server
        handlePageUpdate(); // Refresh the page or state
        setOpen(false); // Close the form/modal
      })
      .catch((err) => {
        console.error("Error adding team:", err);
        alert("An error occurred while adding the team");
      });
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 "
                      >
                        Add Team
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="team_name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="team_name"
                              id="team_name"
                              value={team.team_name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Team's Name"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="stadium_name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stadium
                            </label>
                            <input
                              type="text"
                              name="stadium_name"
                              id="stadium_name"
                              value={team.stadium_name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Stadium"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="manager_id"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Manager
                            </label>
                            <select
                              id="manager_id"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="manager_id"
                              value={team.manager_id}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option>Select Manager</option>
                              {managers.map((manager) => (
                                <option
                                  key={manager.manager_id}
                                  value={manager.manager_id}
                                >
                                  {manager.manager_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="owner"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Owner
                            </label>
                            <input
                              type="text"
                              name="owner"
                              id="owner"
                              value={team.owner}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Owner"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="budget"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Budget
                            </label>
                            <input
                              type="number"
                              name="budget"
                              id="budget"
                              value={team.budget}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Budget"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addTeam}
                  >
                    Add Team
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addTeamModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
