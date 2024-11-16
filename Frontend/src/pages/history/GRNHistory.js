import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import LineBreak from "../../components/LineBreak";

function GRNHistory() {
  const [grnHistory, setAllGRNHistoryData] = useState([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("GRN History");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [transportCostFilter, setTransportCostFilter] = useState("");
  const [laborCostFilter, setLaborCostFilter] = useState("");
  const [totalFilter, setTotalFilter] = useState("");
  const [selectedWarehouseNumber, setSelectedWarehouseNumber] = useState("");
  const [startPurchaseDate, setStartPurchaseDate] = useState("");
  const [endPurchaseDate, setEndPurchaseDate] = useState("");
  const [startProductionDate, setStartProductionDate] = useState("");
  const [endProductionDate, setEndProductionDate] = useState("");
  const [startExpirationDate, setStartExpirationDate] = useState("");
  const [endExpirationDate, setEndExpirationDate] = useState("");
  const uniqueRequests = new Set();
  const uniqueWarehouseNumbers = new Set();
  const uniqueAreas = new Set();
  const uniqueCities = new Set();
  const uniqueSuppliers = new Set();
  const uniqueItemNames = new Set();
  const uniquePackSizes = new Set();

  useEffect(() => {
    // Fetching Data of All GRN History items
    const fetchGRNHistoryData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/grnHistory/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllGRNHistoryData(data);
        })
        .catch((err) => console.log(err));
    };
    fetchGRNHistoryData();
  }, [authContext.user]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Navigate to the selected page
    if (selectedValue === "Item History") {
      navigate("/itemHistory");
    } else if (selectedValue === "Order History") {
      navigate("/history");
    } else if (selectedValue === "Vendor History") {
      navigate("/storeHistory");
    } else if (selectedValue === "Supplier History") {
      navigate("/supplierHistory");
    } else if (selectedValue === "Warehouse History") {
      navigate("/warehouseHistory");
    } else if (selectedValue === "Product History") {
      navigate("/productHistory");
    } else if (selectedValue === "GRRN History") {
      navigate("/grrnHistory");
    }
  };

  const handleSearchInputChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handlePackSizeChange = (event) => {
    setSelectedPackSize(event.target.value);
  };

  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
  };

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleTransportCostFilterChange = (event) => {
    setTransportCostFilter(event.target.value);
  };

  const handleLaborCostFilterChange = (event) => {
    setLaborCostFilter(event.target.value);
  };

  const handleTotalFilterChange = (event) => {
    setTotalFilter(event.target.value);
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const handleWarehouseNumberChange = (event) => {
    setSelectedWarehouseNumber(event.target.value);
  };

  const handleRequestsChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handleStartProductionDateChange = (event) => {
    setStartProductionDate(event.target.value);
  };

  const handleEndProductionDateChange = (event) => {
    setEndProductionDate(event.target.value);
  };

  const handleStartExpirationDateChange = (event) => {
    setStartExpirationDate(event.target.value);
  };

  const handleEndExpirationDateChange = (event) => {
    setEndExpirationDate(event.target.value);
  };

  const handleStartPurchaseDateChange = (event) => {
    setStartPurchaseDate(event.target.value);
  };

  const handleEndPurchaseDateChange = (event) => {
    setEndPurchaseDate(event.target.value);
  };

  const filteredGRNHistory = grnHistory.filter((element) => {
    // Check if item name matches
    const itemNameMatches = selectedItem
      ? element.items.some(
          (item) => item.item.name.toLowerCase() === selectedItem.toLowerCase()
        )
      : true;

    // Check if pack size matches
    const packSizeMatches = selectedPackSize
      ? element.items.some((item) =>
          item.packSize?.packSize
            .toLowerCase()
            .includes(selectedPackSize.toLowerCase())
        )
      : true;

    // Check if city matches
    const cityMatches = selectedCity
      ? element.items.some(
          (item) =>
            item.city &&
            item.city.toLowerCase().includes(selectedCity.toLowerCase())
        )
      : true;

    // Check if area matches
    const areaMatches = selectedArea
      ? element.items.some(
          (item) =>
            item.area &&
            item.area.toLowerCase().includes(selectedArea.toLowerCase())
        )
      : true;

    // Check if supplier matches
    const supplierMatches = selectedSupplier
      ? element.supplier &&
        element.supplier.toLowerCase().includes(selectedSupplier.toLowerCase())
      : true;

    // Check if warehouse number matches
    const warehouseNumberMatches = selectedWarehouseNumber
      ? element.items.some(
          (item) =>
            item.warehouseNumber &&
            item.warehouseNumber.toString().includes(selectedWarehouseNumber)
        )
      : true;

    // Stock filter
    const stockLessThanFilter =
      stockFilter !== ""
        ? element.items.some((item) => item.stock <= parseInt(stockFilter, 10))
        : true;

    // Price filter
    const priceLessThanFilter =
      priceFilter !== ""
        ? element.items.some((item) => item.price <= parseInt(priceFilter, 10))
        : true;

    // Transport cost filter
    const transportCostLessThanFilter =
      transportCostFilter !== ""
        ? element.transportCost <= parseInt(transportCostFilter, 10)
        : true;

    // Labor cost filter
    const laborCostThanFilter =
      laborCostFilter !== ""
        ? element.laborCost <= parseInt(laborCostFilter, 10)
        : true;

    // Total filter
    const totalLessThanFilter =
      totalFilter !== "" ? element.total <= parseInt(totalFilter, 10) : true;

    // Request type filter
    const requestMatches = selectedRequest
      ? element.requestType
          .toLowerCase()
          .includes(selectedRequest.toLowerCase())
      : true;

    // Date filters
    let productionDateInRange = true;
    if (startProductionDate && endProductionDate) {
      const productionDates = element.items.map(
        (item) => new Date(item.production)
      );
      const startDateObj = new Date(startProductionDate);
      const endDateObj = new Date(endProductionDate);
      productionDateInRange = productionDates.some(
        (productionDate) =>
          productionDate >= startDateObj && productionDate <= endDateObj
      );
    }

    let expirationDateInRange = true;
    if (startExpirationDate && endExpirationDate) {
      const expirationDates = element.items.map(
        (item) => new Date(item.expirationDate)
      );
      const startDateObj = new Date(startExpirationDate);
      const endDateObj = new Date(endExpirationDate);
      expirationDateInRange = expirationDates.some(
        (expirationDate) =>
          expirationDate >= startDateObj && expirationDate <= endDateObj
      );
    }

    let purchaseDateInRange = true;
    if (startPurchaseDate && endPurchaseDate) {
      const purchaseDate = new Date(element.purchaseDate);
      const startDateObj = new Date(startPurchaseDate);
      const endDateObj = new Date(endPurchaseDate);
      purchaseDateInRange =
        purchaseDate >= startDateObj && purchaseDate <= endDateObj;
    }

    // Combine all the conditions to filter data
    return (
      itemNameMatches &&
      packSizeMatches &&
      cityMatches &&
      areaMatches &&
      supplierMatches &&
      warehouseNumberMatches &&
      stockLessThanFilter &&
      priceLessThanFilter &&
      transportCostLessThanFilter &&
      laborCostThanFilter &&
      totalLessThanFilter &&
      requestMatches &&
      productionDateInRange &&
      expirationDateInRange &&
      purchaseDateInRange
    );
  });

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3 items-center">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Select History</span>
            </div>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-40"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option>GRN History</option>
              <option value="Item History">Item History</option>
              <option value="Order History">Order History</option>
              <option value="Vendor History">Vendor History</option>
              <option value="Supplier History">Supplier History</option>
              <option value="Warehouse History">Warehouse History</option>
              <option value="Product History">Product History</option>
              <option value="GRRN History">GRRN History</option>
            </select>
          </div>
        </div>

        {/* Product History Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex gap-4 justify-center items-center ">
            <span className="font-bold pt-2">GRN History</span>
          </div>
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedItem}
                onChange={handleSearchInputChange}
              >
                <option value={""}>Select Item</option>
                {grnHistory.map((element) => {
                  element.items.map((item) => {
                    uniqueItemNames.add(item.item.name);
                  });
                })}
                {/* Render the options for the dropdown */}
                {Array.from(uniqueItemNames).map((itemName, index) => (
                  <option key={index} value={itemName}>
                    {itemName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedPackSize}
                onChange={handlePackSizeChange}
              >
                <option value={""}>Select Pack Size</option>
                {grnHistory.map((element) => {
                  element.items.map((item) => {
                    uniquePackSizes.add(item.packSize.packSize);
                  });
                })}

                {/* Render the options for the dropdown */}
                {Array.from(uniquePackSizes).map((packSize, index) => (
                  <option key={index} value={packSize}>
                    {packSize}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Stock"
                value={stockFilter}
                onChange={handleStockFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Price"
                value={priceFilter}
                onChange={handlePriceFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedSupplier}
                onChange={handleSupplierChange}
              >
                <option value={""}>Select Supplier</option>
                {grnHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueSuppliers.add(element.supplier);

                  return null; // No need to render anything here
                })}
                {/* Render the options for the dropdown */}
                {Array.from(uniqueSuppliers).map((supplier, index) => (
                  <option key={index} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedCity}
                onChange={handleCityChange}
              >
                <option value={""}>Select City</option>
                {grnHistory.map((element) => {
                  element.items.map((item) => {
                    uniqueCities.add(item.city);
                  });
                })}

                {/* Render the options for the dropdown */}
                {Array.from(uniqueCities).map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedArea}
                onChange={handleAreaChange}
              >
                <option value={""}>Select Area</option>
                {grnHistory.map((element) => {
                  element.items.map((item) => {
                    uniqueAreas.add(item.area);
                  });
                })}

                {/* Render the options for the dropdown */}
                {Array.from(uniqueAreas).map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedWarehouseNumber}
                onChange={handleWarehouseNumberChange}
              >
                <option value={""}>Warehouse #</option>
                {grnHistory.map((element) => {
                  element.items.map((item) => {
                    uniqueWarehouseNumbers.add(item.warehouseNumber);
                  });
                })}

                {/* Render the options for the dropdown */}
                {Array.from(uniqueWarehouseNumbers).map(
                  (warehouseNumber, index) => (
                    <option key={index} value={warehouseNumber}>
                      {warehouseNumber}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedRequest}
                onChange={handleRequestsChange}
              >
                <option value={""}>Select Request</option>
                {grnHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueRequests.add(element.requestType);

                  return null; // No need to render anything here
                })}
                {/* Render the options for the dropdown */}
                {Array.from(uniqueRequests).map((requestType, index) => (
                  <option key={index} value={requestType}>
                    {requestType}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <div>
              <input
                type="number"
                placeholder="Transport Cost"
                value={transportCostFilter}
                onChange={handleTransportCostFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Labor Cost"
                value={laborCostFilter}
                onChange={handleLaborCostFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Total"
                value={totalFilter}
                onChange={handleTotalFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center pt-2">
            <label htmlFor="startDate">Purchase Date (Start):</label>
            <input
              type="date"
              id="startDate"
              value={startPurchaseDate}
              onChange={handleStartPurchaseDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <label htmlFor="endDate">Purchase Date (End):</label>
            <input
              type="date"
              id="endDate"
              value={endPurchaseDate}
              onChange={handleEndPurchaseDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <div className="flex gap-4 justify-center items-center pt-2">
            <label htmlFor="startDate">Production Date (Start):</label>
            <input
              type="date"
              id="startDate"
              value={startProductionDate}
              onChange={handleStartProductionDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <label htmlFor="endDate">Production Date (End):</label>
            <input
              type="date"
              id="endDate"
              value={endProductionDate}
              onChange={handleEndProductionDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <div className="flex gap-4 pt-2 justify-center items-center">
            <label htmlFor="startDate">Expiration Date (Start):</label>
            <input
              type="date"
              id="startDate"
              value={startExpirationDate}
              onChange={handleStartExpirationDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <label htmlFor="endDate">Expiration Date (End):</label>
            <input
              type="date"
              id="endDate"
              value={endExpirationDate}
              onChange={handleEndExpirationDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <div className="flex justify-center pt-4 pb-3 items-center">
            <button
              // onClick={generatePDF}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Download PDF
            </button>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Item's Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Pack Size
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Price (Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Production Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Expiration Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Supplier
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Transport Cost (Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Labor Cost (Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total (Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Purchase Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Request Type
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredGRNHistory.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.items.map((item) => {
                        return <p>{item.item.name}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.items.map((item) => {
                        return (
                          <p>
                            {item.packSize.packSize}
                            {item.item.units}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.items.map((item) => {
                        return <p>{item.stock}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.items.map((item) => {
                        return <p>{item.price}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.items.map((item) => {
                        return (
                          <p>
                            {item.city}, {item.area}, Warehouse{" "}
                            {item.warehouseNumber}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.items.map((item) => {
                        return <p>{item.production}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.items.map((item) => {
                        return <p>{item.expirationDate}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <LineBreak text={element.supplier} n={1} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.transportCost}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.laborCost}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.total}
                    </td>

                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.purchaseDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.requestType}
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

export default GRNHistory;
