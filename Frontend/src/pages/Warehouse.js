import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddWarehouse from "../components/Warehouse/AddWarehouse";
import AuthContext from "../AuthContext";
import UpdateWarehouse from "../components/Warehouse/UpdateWarehouse";
import LineBreak from "../components/LineBreak";

function Warehouse() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  const [showItemModal, setShowWarehouseModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateWarehouse, setUpdateWarehouse] = useState([]);
  const [warehouses, setAllWarehouses] = useState([]);
  const [cities, setAllCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [warehouseToBeDeleted, setWarehouseToBeDeleted] = useState("");
  let [isOpen, setIsOpen] = useState(false);

  const authContext = useContext(AuthContext);
  console.log("====================================");
  console.log(authContext);
  console.log("====================================");

  useEffect(() => {
    // Fetching Data of All Warehouses
    const fetchWarehouseData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/warehouse/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllWarehouses(data);
        })
        .catch((err) => console.log(err));
    };
    // Fetching Data of All Cities
    const fetchCityData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/warehouse/get/city/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllCities(data);
        })
        .catch((err) => console.log(err));
    };
    fetchWarehouseData();
    fetchCityData();
  }, [authContext.user, updatePage]);

  // Fetching Data of Search Warehouses
  const fetchSearchData = () => {
    fetch(
      `${process.env.REACT_APP_URL}/api/warehouse/search?searchTerm=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllWarehouses(data);
      })
      .catch((err) => console.log(err));
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(id) {
    setWarehouseToBeDeleted(id);
    setIsOpen(true);
  }

  // Modal for Warehouse ADD
  const addWarehouseModalSetting = () => {
    setShowWarehouseModal(!showItemModal);
  };

  // Modal for Warehouse UPDATE
  const updateWarehouseModalSetting = (selectedWarehouseData) => {
    console.log("Clicked: edit");
    setUpdateWarehouse(selectedWarehouseData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete Warehouse
  const deleteWarehouse = (id) => {
    fetch(`${process.env.REACT_APP_URL}/api/warehouse/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showItemModal && (
          <AddWarehouse
            warehouses={warehouses}
            cities={cities}
            addWarehouseModalSetting={addWarehouseModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateWarehouse
            warehouses={warehouses}
            cities={cities}
            updateWarehouseData={updateWarehouse}
            updateModalSetting={updateWarehouseModalSetting}
            handlePageUpdate={handlePageUpdate}
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
                      Delete Item
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this warehouse?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeModal();
                          deleteWarehouse(warehouseToBeDeleted);
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
              <span className="font-bold">Warehouse</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addWarehouseModalSetting}
              >
                Add Warehouse
              </button>
            </div>
          </div>
        </div>
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  City
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Area
                </th>
                <th className="flex flex-col items-center whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Address
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {warehouses.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.city}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.area}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.warehouseNumber.map((warehouseNumber) => {
                        return (
                          <div className="py-8">
                            <p className="flex flex-col justify-start items-center">
                              {warehouseNumber.warehouseNumber}
                            </p>
                          </div>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.warehouseNumber.map((address) => {
                        return (
                          <div className=" py-2">
                            <LineBreak text={address.address} n={5} />
                          </div>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateWarehouseModalSetting(element)}
                      >
                        {localStorageData.firstName === "Azhar" ? "Edit" : ""}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => openModal(element._id)}
                      >
                        {localStorageData.firstName === "Azhar" ? "Delete" : ""}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Warehouse;
