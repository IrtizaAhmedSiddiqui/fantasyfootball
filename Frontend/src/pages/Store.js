import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddStore from "../components/Vendor/AddStore";
import AuthContext from "../AuthContext";
import AddItemPriceInfo from "../components/Vendor/AddItemPriceInfo";

function Store() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateItem, setUpdateItem] = useState([]);
  const [items, setAllItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  let [isOpen, setIsOpen] = useState(false);
  const [storeId, setStoreId] = useState("");
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Fetching all stores data
    const fetchData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/store/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllStores(data);
        });
    };
    // Fetching Data of All Items
    const fetchItemsData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/item/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllItems(data);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
    fetchItemsData();
  }, [authContext.user, updatePage]);

  // Delete Store
  const deleteStore = (id) => {
    fetch(`${process.env.REACT_APP_URL}/api/store/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(id) {
    setStoreId(id);
    setIsOpen(true);
  }

  const updateItemModalSetting = (selectedStoreData) => {
    console.log("Clicked: edit");
    setUpdateItem(selectedStoreData);
    setShowUpdateModal(!showUpdateModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center ">
      <div className=" flex flex-col gap-1 w-11/12 border-2">
        {showUpdateModal && (
          <AddItemPriceInfo
            Items={items}
            updateItemData={updateItem}
            updateModalSetting={updateItemModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3 items-center">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Manage Vendors</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={modalSetting}
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
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
                      Delete Vendor
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this Vendor?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeModal();
                          deleteStore(storeId);
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
        {showModal && <AddStore handlePageUpdate={handlePageUpdate} />}
        {stores.map((element, index) => {
          return (
            <div
              className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
              key={element._id}
            >
              <div className="flex flex-col gap-3 justify-between items-start">
                <span className="font-bold">{element.name}</span>
                <div className="flex">
                  <img
                    alt="location-icon"
                    className="h-6 w-6"
                    src={require("../assets/location-icon.png")}
                  />
                  <span>{element.address + ", " + element.city}</span>
                </div>
                <div>
                  <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                          Item Name
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                          Pack Size
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                          Price
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      <tr key={element._id}>
                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                          {element.items?.map((i) => {
                            return <p>{i.name.name}</p>;
                          })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.items?.map((i) => {
                            return (
                              <p>
                                {i.packSize.packSize}
                                {i.name.units}
                              </p>
                            );
                          })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.items?.map((i) => {
                            return <p>{i.packPrice}</p>;
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <span
                    className="text-green-600 px-2 cursor-pointer font-bold"
                    onClick={() => updateItemModalSetting(element)}
                  >
                    Add Item Info
                  </span>
                  <span
                    className="text-red-600 px-2 cursor-pointer font-bold"
                    onClick={() => openModal(element._id)}
                  >
                    {localStorageData.firstName === "Azhar"
                      ? "Remove Vendor"
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Store;
