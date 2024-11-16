import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddSupplier from "../components/Supplier/AddSupplier";
import AuthContext from "../AuthContext";
import UpdateSupplier from "../components/Supplier/UpdateSupplier";

function Supplier() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSupplier, setUpdateSupplier] = useState([]);
  const [suppliers, setAllSuppliers] = useState([]);
  const [cities, setAllCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [supplierToBeDeleted, setSupplierToBeDeleted] = useState("");
  let [isOpen, setIsOpen] = useState(false);

  const authContext = useContext(AuthContext);
  console.log("====================================");
  console.log(authContext);
  console.log("====================================");

  useEffect(() => {
    // Fetching Data of All Suppliers
    const fetchSuppliersData = () => {
      fetch(`http://localhost:4000/api/supplier/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllSuppliers(data);
        })
        .catch((err) => console.log(err));
    };
    // Fetching Data of All Cities
    const fetchCityData = () => {
      fetch(`http://localhost:4000/api/warehouse/get/city/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllCities(data);
        })
        .catch((err) => console.log(err));
    };
    fetchSuppliersData();
    fetchCityData();
  }, [authContext.user, updatePage]);

  // Fetching Data of Search Suppliers
  const fetchSearchData = () => {
    fetch(`http://localhost:4000/api/supplier/search?searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSuppliers(data);
      })
      .catch((err) => console.log(err));
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(id) {
    setSupplierToBeDeleted(id);
    setIsOpen(true);
  }

  // Modal for Supplier ADD
  const addSupplierModalSetting = () => {
    setShowSupplierModal(!showSupplierModal);
  };

  // Modal for Supplier UPDATE
  const updateSupplierModalSetting = (selectedSupplierData) => {
    console.log("Clicked: edit");
    setUpdateSupplier(selectedSupplierData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete Supplier
  const deleteSupplier = (id) => {
    fetch(`${process.env.REACT_APP_URL}/api/supplier/delete/${id}`)
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
        {showSupplierModal && (
          <AddSupplier
            cities={cities}
            addSupplierModalSetting={addSupplierModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateSupplier
            cities={cities}
            updateSupplierData={updateSupplier}
            updateModalSetting={updateSupplierModalSetting}
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
                      Delete Supplier
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this supplier?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeModal();
                          deleteSupplier(supplierToBeDeleted);
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
              <span className="font-bold">Suppliers</span>
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
                onClick={addSupplierModalSetting}
              >
                Add Supplier
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
                  Supplier's Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  City
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
              {suppliers.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.city}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.address}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateSupplierModalSetting(element)}
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
      </div>
    </div>
  );
}

export default Supplier;
