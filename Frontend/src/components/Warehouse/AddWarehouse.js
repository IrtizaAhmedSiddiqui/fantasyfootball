import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";
import LineBreak from "../LineBreak";

export default function AddWarehouse({
  warehouses,
  cities,
  addWarehouseModalSetting,
  handlePageUpdate,
}) {
  const authContext = useContext(AuthContext);
  const [warehouse, setWarehouse] = useState({
    userId: authContext.user,
    city: "",
    area: "",
  });
  const [open, setOpen] = useState(true);
  const [warehouseNumber, setWarehouseNumber] = useState(0);
  const [addWarehouseNumber, setAddWarehouseNumber] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState({});
  const [area, setArea] = useState({});
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setWarehouse({ ...warehouse, [key]: value });
  };

  const addWarehouse = () => {
    if (warehouseNumber < 1) {
      return alert("Fields cannot be left Empty");
    }
    setAddWarehouseNumber((prev) => {
      return prev.concat({
        id: "warehouse" + Date.now(),
        address: address,
        warehouseNumber: warehouseNumber,
      });
    });
  };

  const addFinalWarehouse = () => {
    let myWarehouse = {
      ...warehouse,
      warehouseNumber: addWarehouseNumber,
    };

    if (
      myWarehouse.city === "" ||
      myWarehouse.area === "" ||
      addWarehouseNumber.length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }
    fetch(`${process.env.REACT_APP_URL}/api/warehouse/add`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myWarehouse),
    })
      .then((result) => {
        alert("Warehouse Created");
        handlePageUpdate();
        addWarehouseModalSetting();
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
                        Add Warehouse
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              City
                            </label>
                            <select
                              id="city"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="city"
                              value={city?._id}
                              onChange={(e) => {
                                const currentCity = cities.find(
                                  (c) => c._id === e.target.value
                                );
                                // const currentWarehouse = warehouses.find(
                                //   (w) => w.city === currentCity.city
                                // );

                                setCity(currentCity || {});
                                handleInputChange(
                                  e.target.name,
                                  currentCity.city
                                );
                              }}
                            >
                              <option>Select City</option>
                              {cities.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.city}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="area"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Area
                            </label>
                            <select
                              id="area"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="area"
                              value={area?.id}
                              onChange={(e) => {
                                const currentArea = city.areas?.find(
                                  (a) => a.id === e.target.value
                                );

                                // If the area is not present in the addWarehouseNumber array, set it as the current area
                                if (
                                  !addWarehouseNumber.some(
                                    (w) => w.area === currentArea?.area
                                  )
                                ) {
                                  setArea(currentArea || {});
                                  handleInputChange(
                                    e.target.name,
                                    currentArea?.area
                                  );
                                }
                              }}
                            >
                              <option>Select Area</option>
                              {city.areas
                                ?.filter(
                                  (element) =>
                                    !warehouses.some(
                                      (w) => w.area === element.area
                                    )
                                )
                                .map((element) => (
                                  <option key={element.id} value={element.id}>
                                    {element.area}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="units"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Warehouse #
                            </label>
                            <select
                              id="warehouseNumber"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="warehouseNumber"
                              value={warehouseNumber}
                              onChange={(e) =>
                                setWarehouseNumber(e.target.value)
                              }
                            >
                              <option>Select a Warehouse #</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="address"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Address"
                            />
                          </div>
                          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead>
                              <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Warehouse #
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Address
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {addWarehouseNumber.map((element, index) => {
                                return (
                                  <tr key={element.id}>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {element.warehouseNumber}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      <LineBreak text={element.address} n={5} />
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
                              onClick={addWarehouse}
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
                    onClick={addFinalWarehouse}
                  >
                    Add Warehouse
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addWarehouseModalSetting()}
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
