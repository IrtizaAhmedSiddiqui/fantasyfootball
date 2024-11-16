import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function AddItem({ addItemModalSetting, handlePageUpdate }) {
  const authContext = useContext(AuthContext);
  const [item, setItem] = useState({
    userId: authContext.user,
    name: "",
    category: "",
    units: "",
  });
  const [open, setOpen] = useState(true);
  const [packSize, setPackSize] = useState(0);
  const [addPacks, setAddPacks] = useState([]);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setItem({ ...item, [key]: value });
  };

  const addPackSize = () => {
    if (packSize < 1) {
      return alert("Fields cannot be left Empty");
    }
    setAddPacks((prev) => {
      return prev.concat({
        id: "packsize" + Date.now(),
        packSize: packSize,
      });
    });
  };

  const addItem = () => {
    let myItem = {
      ...item,
      packSize: addPacks,
    };

    if (
      myItem.category === "" ||
      myItem.name === "" ||
      myItem.units === "" ||
      addPacks.length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }
    fetch(`${process.env.REACT_APP_URL}/api/item/add`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myItem),
    })
      .then((result) => {
        alert("Item Created");
        handlePageUpdate();
        addItemModalSetting();
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
                        Add Item
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Item's Name
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
                              value={packSize}
                              onChange={(e) => setPackSize(e.target.value)}
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
                              {addPacks.map((element, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {element.packSize}
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
                        <div className="flex items-center space-x-4"></div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addItem}
                  >
                    Add Item
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addItemModalSetting()}
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
