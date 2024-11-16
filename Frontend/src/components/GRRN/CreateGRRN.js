import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function CreateGRRN({
  addGRRNModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext,
}) {
  const [grrn, setGRRN] = useState({
    userID: authContext.user,
    vendor: "",
    date: "",
  });
  const [productAdded, setProductAdded] = useState([]);
  const [productName, setProductName] = useState({});
  const [stockOrdered, setStockOrdered] = useState(0);
  const [duplicateItems, setDuplicateItems] = useState([]);
  const [store, setStore] = useState({});
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    setGRRN({ ...grrn, [key]: value });
  };

  // POST Data
  const createGRRN = () => {
    let myGRRN = {
      ...grrn,
      products: productAdded,
    };
    if (
      myGRRN.date === "" ||
      myGRRN.vendor === "" ||
      myGRRN.userID === "" ||
      productAdded.length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }

    fetch(`${process.env.REACT_APP_URL}/api/grrn/add`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myGRRN),
    })
      .then((result) => {
        alert("GRRN has been Created");
        handlePageUpdate();
        addGRRNModalSetting();
      })
      .catch((err) => {
        alert("Failed to Create GRRN");
        console.log(err);
      });
  };

  const addProduct = () => {
    if (JSON.stringify(productName) === "{}" || stockOrdered < 1) {
      return alert("Fields cannot be left Empty");
    }

    setProductAdded((prev) => {
      const isProductAdded = prev.find((product) => {
        return product.product._id === productName._id;
      });

      if (isProductAdded) {
        return prev.map((product) => {
          if (product.product._id === isProductAdded.product._id) {
            return {
              ...product,
              stockOrdered: Number(product.stockOrdered) + Number(stockOrdered),
            };
          }

          return product;
        });
      }

      return prev.concat({
        product: productName,
        stockOrdered: stockOrdered,
      });
    });
  };

  const warehouseSelection = (product) => {
    const sameProduct = products?.filter(
      (p) =>
        p?.items?.name &&
        p?.packSize?.packSize &&
        product?.items?.name &&
        product?.packSize?.packSize &&
        p.items.name === product.items.name &&
        p.packSize.packSize === product.packSize.packSize
    );
    setDuplicateItems(sameProduct || []);
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
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
                        className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                      >
                        Create GRRN
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="productID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name & Pack Size
                            </label>
                            <select
                              id="productID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="productID"
                              value={productName?._id}
                              onChange={(e) => {
                                const product = products.find(
                                  (prd) => prd._id === e.target.value
                                );
                                setProductName(product || {});
                                warehouseSelection(product);
                              }}
                            >
                              <option>
                                {productName.items?.name === undefined
                                  ? `Select Products`
                                  : `${productName.items?.name} - ${productName.packSize?.packSize}${productName.items?.units}`}
                              </option>
                              {[
                                ...new Set(
                                  products.map(
                                    (element) =>
                                      `${element.items.name}-${element.packSize.packSize}`
                                  )
                                ),
                              ].map((key) => {
                                const product = products.find(
                                  (element) =>
                                    `${element.items.name}-${element.packSize.packSize}` ===
                                    key
                                );
                                if (product && product.stock !== 0) {
                                  return (
                                    <option
                                      key={product._id}
                                      value={product._id}
                                    >
                                      {product.items.name} -{" "}
                                      {product.packSize.packSize}
                                      {product.items.units}
                                    </option>
                                  );
                                }
                                return null;
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="productID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Warehouse
                            </label>
                            <select
                              id="productID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="productID"
                              value={productName?._id}
                              onChange={(e) => {
                                const product = duplicateItems.find(
                                  (c) => c._id === e.target.value
                                );
                                console.log("New Product: ", product);
                                setProductName(product || {});
                              }}
                            >
                              <option>Select Warehouse</option>
                              {duplicateItems.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.city}, {element.area}, Warehouse{" "}
                                    {element.warehouseNumber}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="stockOrdered"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Quantity{" "}
                              {productName.stock &&
                                `(Current Stock: ${productName.stock})`}
                            </label>
                            <input
                              type="number"
                              name="stockOrdered"
                              id="stockOrdered"
                              value={stockOrdered}
                              onChange={(e) => setStockOrdered(e.target.value)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="1 - 999"
                            />
                          </div>
                          <div className="h-fit w-fit">
                            <label
                              className="block mb-2 text-sm font-medium text-gray-900"
                              htmlFor="orderDate"
                            >
                              Date
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="date"
                              id="date"
                              name="date"
                              value={grrn.date}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead>
                              <tr>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Name & Pack Size
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Warehouse
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                  Quantity
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {productAdded.map((productAdd) => {
                                return (
                                  <tr key={productAdd.product._id}>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {productAdd.product.items.name}
                                      {" - "}
                                      {productAdd.product.packSize.packSize}
                                      {productAdd.product.items.units}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      <>
                                        <p>{productAdd.product.city},</p>
                                        <p>{productAdd.product.area},</p>
                                        <p>
                                          Warehouse{" "}
                                          {productAdd.product.warehouseNumber}
                                        </p>
                                      </>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                      {productAdd.stockOrdered}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="flex items-center space-x-4 justify-end">
                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500"
                                onClick={addProduct}
                              >
                                <PlusIcon
                                  className="h-6 w-6 text-blue-50"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="storeID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Vendor's Name
                            </label>
                            <select
                              id="vendor"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="vendor"
                              value={store?._id}
                              onChange={(e) => {
                                const store = stores.find(
                                  (s) => s._id === e.target.value
                                );
                                setStore(store || {});
                                handleInputChange(e.target.name, store);
                              }}
                            >
                              <option>Select Vendor</option>
                              {stores.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                );
                              })}
                            </select>
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
                    onClick={createGRRN}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addGRRNModalSetting()}
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
