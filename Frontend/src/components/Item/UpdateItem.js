import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function UpdateItem({
  updateItemData,
  updateModalSetting,
  handlePageUpdate,
}) {
  const { _id, name, category, units, packSize } = updateItemData;
  const authContext = useContext(AuthContext);
  const [item, setItem] = useState({
    userId: authContext.user,
    itemID: _id,
    name: name,
    category: category,
    units: units,
    packSize: packSize,
  });
  const [open, setOpen] = useState(true);
  const [newPackSize, setNewPackSize] = useState(0);
  const [addPacks, setAddPacks] = useState([]);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    console.log(key);
    setItem({ ...item, [key]: value });
  };

  const addPackSize = () => {
    if (newPackSize < 1) {
      return alert("Fields cannot be left Empty");
    }
    setAddPacks((prev) => {
      return prev.concat({
        id: "packsize" + Date.now(),
        packSize: newPackSize,
      });
    });
  };

  const deleteItem = (id) => {
    setAddPacks((prev) => prev.filter((items) => items.id !== id));
  };

  const deleteExistingItem = (index) => {
    const updatedItems = [...item.packSize];
    updatedItems.splice(index, 1);

    setItem({ ...item, packSize: updatedItems });
  };

  const updateItem = () => {
    const mergedItems = [...item.packSize, ...addPacks];

    let myItem = {
      ...item,
      packSize: mergedItems,
    };

    if (
      myItem.category === "" ||
      myItem.name === "" ||
      myItem.units === "" ||
      mergedItems.length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }
    fetch(`${process.env.REACT_APP_URL}/api/item/update`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myItem),
    })
      .then((result) => {
        alert("Item Updated");
        handlePageUpdate();
        setOpen(false);
      })
      .catch((err) => console.log(err));
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
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
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
                        Update Item
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
                              value={item.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Product's Name"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Category
                            </label>
                            <select
                              id="category"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="category"
                              value={item.category}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option>Select Category</option>
                              <option value="Sweets">Sweets</option>
                              <option value="Snacks">Snacks</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="packSize"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Pack Size
                            </label>
                            <input
                              type="number"
                              name="packSize"
                              id="packSize"
                              value={newPackSize}
                              onChange={(e) => setNewPackSize(e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Pack Size"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="units"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Units
                            </label>
                            <select
                              id="units"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="units"
                              value={item.units}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option>eg. Kg, g, L, mL</option>
                              <option value="Kg">Kg</option>
                              <option value="g">g</option>
                              <option value="L">L</option>
                              <option value="mL">mL</option>
                            </select>
                          </div>
                          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead>
                              <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Pack Size(s)
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {item.packSize.map((element, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {element.packSize}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                      <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() =>
                                          deleteExistingItem(index)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                              {addPacks.map((element, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {element.packSize}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                      <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => deleteItem(element.id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 ">
                            <button
                              type="button"
                              className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 "
                              onClick={addPackSize}
                            >
                              <PlusIcon
                                className="h-6 w-6 text-blue-50"
                                aria-hidden="true"
                              />
                            </button>
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
                    onClick={updateItem}
                  >
                    Update Item
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => updateModalSetting()}
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
