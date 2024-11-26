import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function AddPlayer({
  addPlayerModalSetting,
  handlePageUpdate,
  teams,
}) {
  const authContext = useContext(AuthContext);
  const [player, setPlayer] = useState({
    name: "",
    age: "",
    nationality: "",
    position: "",
    team_id: "",
    value: "",
    shirt_number: "",
    contract_length: "",
    status: "",
    salary: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setPlayer({ ...player, [key]: value });
  };

  const addPlayer = () => {
    // Check for empty fields
    if (
      player.name === "" ||
      player.age === "" ||
      player.nationality === "" ||
      player.position === "" ||
      player.team_id === "" ||
      player.value === "" ||
      player.shirt_number === "" ||
      player.contract_length === "" ||
      player.status === "" ||
      player.salary === ""
    ) {
      return alert("Fields cannot be left Empty");
    }

    console.log("Player object being sent:", player);

    // API call to update player
    fetch(`http://localhost:8800/player/`, {
      // Use PUT method with player ID in the URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player), // Send the player object in the body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add player");
        }
        return response.json();
      })
      .then((data) => {
        alert(data); // Notify success response from the server
        handlePageUpdate(); // Refresh the page or state
        setOpen(false); // Close the form/modal
      })
      .catch((err) => {
        console.error("Error adding player:", err);
        alert("An error occurred while adding the player");
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
                        Add Player
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={player.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Player's Name"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="age"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Age
                            </label>
                            <input
                              type="number"
                              name="age"
                              id="age"
                              value={player.age}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Age"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="nationality"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Nationality
                            </label>
                            <input
                              type="text"
                              name="nationality"
                              id="nationality"
                              value={player.nationality}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Nationality"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="position"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Position
                            </label>
                            <input
                              type="text"
                              name="position"
                              id="position"
                              value={player.position}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Position"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Team
                            </label>
                            <select
                              id="team_id"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="team_id"
                              value={player.team_id}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option>Select Team</option>
                              {teams.map((team) => (
                                <option key={team.team_id} value={team.team_id}>
                                  {team.team_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="value"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Value
                            </label>
                            <input
                              type="text"
                              name="value"
                              id="value"
                              value={player.value}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Value"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="shirt_number"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Shirt Number
                            </label>
                            <input
                              type="number"
                              name="shirt_number"
                              id="shirt_number"
                              value={player.shirt_number}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Shirt Number"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="contract_length"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Contract Length
                            </label>
                            <input
                              type="number"
                              name="contract_length"
                              id="contract_length"
                              value={player.contract_length}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Contract Length"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="status"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Status
                            </label>
                            <input
                              type="text"
                              name="status"
                              id="status"
                              value={player.status}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Status"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="salary"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Salary
                            </label>
                            <input
                              type="number"
                              name="salary"
                              id="salary"
                              value={player.salary}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Salary"
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
                    onClick={addPlayer}
                  >
                    Add Player
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addPlayerModalSetting()}
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
