import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function UpdateProduct({
  suppliers,
  cities,
  warehouses,
  updateProductData,
  updateModalSetting,
  handlePageUpdate,
}) {
  const {
    _id,
    items,
    packSize,
    stock,
    supplier,
    production,
    expirationDate,
    city,
    area,
    warehouseNumber,
  } = updateProductData;
  const authContext = useContext(AuthContext);
  const [product, setProduct] = useState({
    userId: authContext.user,
    productID: _id,
    items: items,
    packSize: packSize,
    stock: stock,
    supplier: supplier,
    production: production,
    expirationDate: expirationDate,
    city: city,
    area: area,
    warehouseNumber: warehouseNumber,
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [updateCity, setUpdateCity] = useState({});
  const [sameCityWarehouses, setSameCityWarehouses] = useState({});
  const [updateSupplier, setUpdateSupplier] = useState({});
  let warehouse = {};

  const handleInputChange = (key, value) => {
    console.log(key);
    setProduct({ ...product, [key]: value });
  };

  const updateProduct = () => {
    if (
      product.expirationDate === "" ||
      product.production === "" ||
      product.stock === "" ||
      product.supplier === "" ||
      product.items === "" ||
      product.packSize === "" ||
      Object.keys(updateCity).length === 0 ||
      product.area === "" ||
      Object.keys(sameCityWarehouses).length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }
    fetch(`${process.env.REACT_APP_URL}/api/product/update`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((result) => {
        alert("Product Updated");
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
                        Update Product
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="items"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Item's Name
                            </label>
                            <input
                              type="text"
                              name="items"
                              id="items"
                              value={product.items.name}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Item's Name"
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="packSize"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Pack Size
                            </label>
                            <input
                              type="text"
                              name="packSize"
                              id="packSize"
                              value={
                                product.packSize.packSize + product.items.units
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Pack Size"
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="stock"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Stock
                            </label>
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              value={product.stock}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Stock Amount"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="supplier"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Suppliers's Name
                            </label>
                            <select
                              id="supplier"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="supplier"
                              value={updateSupplier?._id}
                              onChange={(e) => {
                                const supplier = suppliers.find(
                                  (s) => s._id === e.target.value
                                );
                                setUpdateSupplier(supplier || {});
                                handleInputChange(
                                  e.target.name,
                                  supplier?.name
                                );
                              }}
                            >
                              <option>{product.supplier}</option>
                              {suppliers.map((element, index) => {
                                if (product.supplier !== element.name) {
                                  return (
                                    <option
                                      key={element._id}
                                      value={element._id}
                                    >
                                      {element.name}
                                    </option>
                                  );
                                } else {
                                  return null;
                                }
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              <>
                                <p>Warehouse City</p>
                                <p className="font-normal">
                                  Current City: {product.city}
                                </p>
                              </>
                            </label>
                            <select
                              id="city"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="city"
                              value={updateCity?._id}
                              onChange={(e) => {
                                const currentCity = cities.find(
                                  (c) => c._id === e.target.value
                                );

                                setUpdateCity(currentCity || {});
                                handleInputChange(
                                  e.target.name,
                                  currentCity?.city
                                );
                              }}
                            >
                              <option value="">Select City</option>
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
                              <>
                                <p>Warehouse Area</p>
                                <p className="font-normal">
                                  Current Area: {product.area}
                                </p>
                              </>
                            </label>
                            <select
                              id="area"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="area"
                              value={warehouse?.area}
                              onChange={(e) => {
                                const sameCityWarehouse = warehouses.find(
                                  (i) => i.area === e.target.value
                                );

                                setSameCityWarehouses(sameCityWarehouse || {});

                                handleInputChange(
                                  e.target.name,
                                  sameCityWarehouse.area
                                );
                              }}
                            >
                              <option value="">Select Area</option>
                              {warehouses.map((element, index) => {
                                if (element.city === updateCity?.city) {
                                  return (
                                    <option
                                      key={element._id}
                                      value={element.area}
                                    >
                                      {element.area}
                                    </option>
                                  );
                                } else {
                                  return null;
                                }
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="warehouseNumber"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              <>
                                <p>Warehouse Number</p>
                                <p className="font-normal">
                                  Current Number: {product.warehouseNumber}
                                </p>
                              </>
                            </label>
                            <select
                              id="warehouseNumber"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="warehouseNumber"
                              value={sameCityWarehouses.warehouseNumber?.id}
                              defaultValue={product.warehouseNumber}
                              onChange={(e) => {
                                const currWarehouse =
                                  sameCityWarehouses.warehouseNumber?.find(
                                    (w) => w.id === e.target.value
                                  );
                                handleInputChange(
                                  e.target.name,
                                  currWarehouse?.warehouseNumber
                                );
                              }}
                            >
                              <option>Select Warehouse #</option>
                              {sameCityWarehouses.warehouseNumber?.map(
                                (element, index) => {
                                  return (
                                    <option key={element.id} value={element.id}>
                                      {element.warehouseNumber}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="production"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Production Date
                            </label>
                            <input
                              type="date"
                              name="production"
                              id="production"
                              value={product.production}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Product's Purchase Date"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="expirationDate"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Expiration Date
                            </label>
                            <input
                              type="date"
                              name="expirationDate"
                              id="expirationDate"
                              value={product.expirationDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Product's Expiration Date"
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
                    onClick={updateProduct}
                  >
                    Update Product
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
