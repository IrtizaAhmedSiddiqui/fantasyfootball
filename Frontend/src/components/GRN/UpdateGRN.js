import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../AuthContext";

export default function UpdateGRN({
  updateGRNData,
  suppliers,
  cities,
  warehouses,
  products,
  items,
  addProductModalSetting,
  handlePageUpdate,
}) {
  // console.log("warehouses: ", warehouses);

  const authContext = useContext(AuthContext);
  const [itemsArray, setItemsArray] = useState([]);

  const [item, setItem] = useState({});
  const [packSize, setPackSize] = useState({});
  const [supplier, setSupplier] = useState({});

  const [city, setCity] = useState({});
  const [sameCityWarehouses, setSameCityWarehouses] = useState({});
  const [total, setTotal] = useState(0);

  // const [item, setItem] = useState({
  //   userId: authContext.user,
  //   itemID: _id,
  //   name: name,
  //   category: category,
  //   units: units,
  //   packSize: packSize,
  // });

  const [product, setProduct] = useState({
    userId: authContext.user,
    id: updateGRNData._id,
    items: updateGRNData.items,
    supplier: updateGRNData.supplier,
    transportCost: updateGRNData.transportCost,
    laborCost: updateGRNData.laborCost,
    total: updateGRNData.total,
    purchaseDate: updateGRNData.purchaseDate,
  });
  console.log("----", product);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct((prevProduct) => {
      const updatedProduct = { ...prevProduct, [key]: value };

      // Calculate total from the itemsArray (sum of prices in the array)
      const totalPriceFromItems = itemsArray.reduce(
        (total, item) => total + Number(item.price),
        0
      );

      // Calculate total using price from itemsArray, transportCost, and laborCost
      const { transportCost, laborCost } = updatedProduct;
      const newTotal =
        totalPriceFromItems + Number(transportCost) + Number(laborCost);

      // Update total in the product state
      return { ...updatedProduct, total: newTotal };
    });
  };

  const handleAddItem = () => {
    const {
      items,
      packSize,
      stock,
      price,
      city,
      area,
      warehouseNumber,
      production,
      expirationDate,
    } = product;

    // Check for empty fields
    if (
      !items ||
      !packSize ||
      !stock ||
      !price ||
      !city ||
      !area ||
      !warehouseNumber ||
      !production ||
      !expirationDate
    ) {
      alert(
        "All fields are required. Please fill in all fields before adding."
      );
      return;
    }

    // Check if item with the same item name, pack size, warehouseNumber, city, area, production, and expirationDate already exists
    const existingItemIndex = itemsArray.findIndex(
      (i) =>
        i.item === items &&
        i.packSize === packSize &&
        i.warehouseNumber === warehouseNumber &&
        i.city === city &&
        i.area === area &&
        i.production === production &&
        i.expirationDate === expirationDate
    );

    if (existingItemIndex !== -1) {
      // Item exists, so update the stock and price
      const updatedItems = [...itemsArray];
      updatedItems[existingItemIndex].stock =
        Number(updatedItems[existingItemIndex].stock) + Number(stock);
      updatedItems[existingItemIndex].price =
        Number(updatedItems[existingItemIndex].price) + Number(price);

      setItemsArray(updatedItems);
    } else {
      // Item does not exist, so add new item to array
      setItemsArray((prevItems) => [
        ...prevItems,
        {
          item: items,
          packSize,
          stock: Number(stock),
          price: Number(price),
          city,
          area,
          warehouseNumber,
          production,
          expirationDate,
        },
      ]);
    }

    // Reset fields related to item details
    setProduct((prevProduct) => ({
      ...prevProduct,
    }));
  };

  console.log("itemsArray: ", itemsArray);

  const addProduct = () => {
    let myGRN = {
      userId: product.userId,
      items: itemsArray,
      supplier: product.supplier,
      transportCost: product.transportCost,
      laborCost: product.laborCost,
      total: product.total,
      purchaseDate: product.purchaseDate,
    };
    if (
      product.purchaseDate === "" ||
      product.supplier === "" ||
      product.transportCost === "" ||
      product.total === "" ||
      product.laborCost === "" ||
      itemsArray.length === 0
    ) {
      return alert("Fields cannot be left Empty");
    }

    fetch(`${process.env.REACT_APP_URL}/api/grn/add`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myGRN),
    })
      .then((result) => {
        alert("GRN Added");
        handlePageUpdate();
        addProductModalSetting();
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center justify-center">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 "
                      >
                        Create GRN
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-5">
                          <div>
                            <label
                              htmlFor="storeID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Item
                            </label>
                            <select
                              id="items"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="items"
                              value={item?._id}
                              onChange={(e) => {
                                const item = items.find(
                                  (i) => i._id === e.target.value
                                );
                                // const currentProd = products.find(
                                //   (product) => product.items._id === item._id
                                // );

                                setItem(item || {});
                                handleInputChange(e.target.name, item);
                              }}
                            >
                              <option>Select Item</option>
                              {items.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="storeID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Pack Size
                            </label>
                            <select
                              id="packSize"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="packSize"
                              value={packSize?.id}
                              onChange={(e) => {
                                const packSizeSelected = item.packSize?.find(
                                  (i) => i.id === e.target.value
                                );

                                setPackSize(packSizeSelected || {});
                                handleInputChange(
                                  e.target.name,
                                  packSizeSelected
                                );
                              }}
                            >
                              <option>Select Pack Size</option>
                              {item.packSize?.map((element, index) => {
                                return (
                                  <option key={element.id} value={element.id}>
                                    {element.packSize}
                                    {item?.units}
                                  </option>
                                );
                              })}
                            </select>
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
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Price
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              value={product.price}
                              onChange={(e) => {
                                handleInputChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Price"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Warehouse City
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
                              Warehouse Area
                            </label>
                            <select
                              id="area"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="area"
                              value={product.area}
                              onChange={(e) => {
                                const sameCityWarehouse = warehouses.find(
                                  (i) => i.area === e.target.value
                                );
                                console.log(
                                  "Same City Warehouses: ",
                                  sameCityWarehouse
                                );
                                setSameCityWarehouses(sameCityWarehouse || {});

                                handleInputChange(
                                  e.target.name,
                                  sameCityWarehouse.area
                                );
                              }}
                            >
                              <option>Select Area</option>
                              {warehouses.map((element, index) => {
                                if (element.city === city?.city) {
                                  return (
                                    <option
                                      key={element._id}
                                      value={element.area}
                                    >
                                      {element.area}
                                    </option>
                                  );
                                }
                                return null;
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="warehouseNumber"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Warehouse #
                            </label>
                            <select
                              id="warehouseNumber"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="warehouseNumber"
                              value={sameCityWarehouses.warehouseNumber?.id}
                              onChange={(e) => {
                                const currWarehouse =
                                  sameCityWarehouses.warehouseNumber?.find(
                                    (w) => w.id === e.target.value
                                  );
                                handleInputChange(
                                  e.target.name,
                                  currWarehouse.warehouseNumber
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
                              placeholder="Enter Product's Production Date"
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
                              placeholder="Enter Item's Expiration Date"
                            />
                          </div>
                        </div>
                        <div className="rounded-lg shadow-md border border-gray-200 mt-4">
                          <table className="min-w-[900px] divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Pack Size
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Stock
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Price
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Warehouse
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Production
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">
                                  Expiration
                                </th>
                                <th>
                                  <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500"
                                    onClick={handleAddItem}
                                  >
                                    <PlusIcon
                                      className="h-6 w-6 text-blue-50"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {itemsArray.map((item, index) => (
                                <tr key={index}>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {item.item.name}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    <p>
                                      {item.packSize.packSize}
                                      {item.item.units}
                                    </p>
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {item.stock}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {item.price}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    <p>{item.city},</p>
                                    <p>{item.area},</p>
                                    <p>Warehouse {item.warehouseNumber}</p>
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {item.production}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {item.expirationDate}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="grid gap-4 mb-4 sm:grid-cols-5 pt-6">
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
                              value={supplier?._id}
                              onChange={(e) => {
                                const supplier = suppliers.find(
                                  (s) => s._id === e.target.value
                                );
                                setSupplier(supplier || {});
                                handleInputChange(e.target.name, supplier.name);
                              }}
                            >
                              <option>Select Supplier</option>
                              {suppliers.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="transportCost"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Transport Cost (Rs)
                            </label>
                            <input
                              type="number"
                              name="transportCost"
                              id="transportCost"
                              value={product.transportCost}
                              onChange={(e) => {
                                handleInputChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Price"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="laborCost"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Labor Cost (Rs)
                            </label>
                            <input
                              type="number"
                              name="laborCost"
                              id="laborCost"
                              value={product.laborCost}
                              onChange={(e) => {
                                handleInputChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Price"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="total"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Total (Rs)
                            </label>
                            <input
                              type="number"
                              disabled
                              name="total"
                              id="total"
                              value={
                                itemsArray.reduce(
                                  (total, item) => total + Number(item.price),
                                  0
                                ) +
                                Number(product.transportCost) +
                                Number(product.laborCost)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Total"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="purchaseDate"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Purchase Date
                            </label>
                            <input
                              type="date"
                              name="purchaseDate"
                              id="purchaseDate"
                              value={product.purchaseDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter Purchase Date"
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
                    onClick={() => {
                      addProduct();
                    }}
                  >
                    Create GRN
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addProductModalSetting()}
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
