import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";
import Select from "react-select";

export default function AddFantasy({
  addFantasyModalSetting,
  handlePageUpdate,
  players,
}) {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  const [fantasy, setFantasy] = useState({
    user_id: localStorageData.user_id,
    team_name: "",
    player_id1: "",
    player_id2: "",
    player_id3: "",
    player_id4: "",
    player_id5: "",
    player_id6: "",
    player_id7: "",
    player_id8: "",
    player_id9: "",
    player_id10: "",
    player_id11: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setFantasy({ ...fantasy, [key]: value });
  };

  const addFantasy = () => {
    const data = {
      user_id: fantasy.user_id,
      team_name: fantasy.team_name,
      player_ids: [
        fantasy.player_id1,
        fantasy.player_id2,
        fantasy.player_id3,
        fantasy.player_id4,
        fantasy.player_id5,
        fantasy.player_id6,
        fantasy.player_id7,
        fantasy.player_id8,
        fantasy.player_id9,
        fantasy.player_id10,
        fantasy.player_id11,
      ],
    };
    // Check for empty fields
    if (
      fantasy.user_id === "" ||
      fantasy.team_name === "" ||
      fantasy.team_value === "" ||
      fantasy.player_id1 === "" ||
      fantasy.player_id2 === "" ||
      fantasy.player_id3 === "" ||
      fantasy.player_id4 === "" ||
      fantasy.player_id5 === "" ||
      fantasy.player_id6 === "" ||
      fantasy.player_id7 === "" ||
      fantasy.player_id8 === "" ||
      fantasy.player_id9 === "" ||
      fantasy.player_id10 === "" ||
      fantasy.player_id11 === ""
    ) {
      return alert("Fields cannot be left Empty");
    }

    console.log("Fantasy object being sent:", data);

    // API call to update fantasy
    fetch(`http://localhost:8800/fantasy/add-team`, {
      // Use PUT method with fantasy ID in the URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send the fantasy object in the body
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert(data); // Notify success response from the server
        handlePageUpdate(); // Refresh the page or state
        setOpen(false); // Close the form/modal
      })
      .catch((err) => {
        console.error("Error updating team:", err);
        alert(err.message);
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
                        Add Fantasy
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="team_name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Team Name
                            </label>
                            <input
                              type="text"
                              name="team_name"
                              id="team_name"
                              value={fantasy.team_name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Team's Name"
                            />
                          </div>

                          {Array.from({ length: 11 }, (_, index) => {
                            const playerId = `player_id${index + 1}`;
                            const selectedPlayer = players.find(
                              (player) => player.player_id === fantasy[playerId]
                            );

                            return (
                              <div key={playerId}>
                                <label
                                  htmlFor={playerId}
                                  className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                  Player {index + 1}
                                </label>
                                <Select
                                  inputId={playerId}
                                  name={playerId}
                                  value={
                                    selectedPlayer
                                      ? {
                                          value: selectedPlayer.player_id,
                                          label: selectedPlayer.name,
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) => {
                                    handleInputChange(
                                      playerId,
                                      selectedOption ? selectedOption.value : ""
                                    );
                                  }}
                                  options={players.map((player) => ({
                                    value: player.player_id,
                                    label: player.name,
                                  }))}
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                  placeholder="Select Player"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addFantasy}
                  >
                    Add Fantasy Team
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addFantasyModalSetting()}
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
