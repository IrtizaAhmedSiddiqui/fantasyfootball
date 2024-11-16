import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import LineBreak from "../../components/LineBreak";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ProductHistory() {
  const [productHistory, setAllProductHistoryData] = useState([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Product History");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [selectedWarehouseNumber, setSelectedWarehouseNumber] = useState("");
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
    // Fetching Data of All Product History items
    const fetchProductHistoryData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/productHistory/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllProductHistoryData(data);
        })
        .catch((err) => console.log(err));
    };

    fetchProductHistoryData();
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
    } else if (selectedValue === "GRN History") {
      navigate("/grnHistory");
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

  const generatePDF = () => {
    const pdf = new jsPDF();

    // Add content to the PDF
    pdf.text("Inventory History", 15, 15);

    const tableData = [];
    const tableHeaders = [
      "Row Number",
      "Item's Name",
      "Pack Size",
      "Stock",
      "Supplier",
      "Warehouse",
      "Production",
      "Expiration",
      "Availability",
      "Request",
    ];

    // Add table headers to the data
    tableData.push(tableHeaders);

    // Initialize total stock
    let totalStock = 0;

    // Loop through the table data and add it to the PDF
    filteredProductHistory.forEach((element, index) => {
      const rowData = [
        index + 1, // Row number
        element.items?.name,
        `${element.packSize?.packSize} ${element.items?.units}`,
        element.stock,
        element.supplier,
        `${element.city}, ${element.area}, Warehouse ${element.warehouseNumber}`,
        element.production,
        element.expirationDate,
        element.stock > 0 ? "In Stock" : "Not in Stock",
        element.requestType,
      ];

      // Increment total stock
      totalStock += element.stock;

      tableData.push(rowData);
    });

    // Generate the table in the PDF
    pdf.autoTable({
      head: [tableHeaders],
      body: tableData.slice(1), // Exclude headers from the body
      startY: 30, // Adjust the starting Y position for the table
    });

    // Add summary information
    const summaryText = `Total Entries: ${filteredProductHistory.length}\nTotal Stock in Report: ${totalStock}`;
    pdf.text(summaryText, 15, pdf.autoTable.previous.finalY + 10);

    // Save the PDF with a specific filename
    pdf.save("product_history.pdf");
  };

  // Filter productHistory based on search input
  const filteredProductHistory = productHistory.filter((element) => {
    const itemNameMatches = element.items?.name
      .toLowerCase()
      .includes(selectedItem.toLowerCase());

    const packSizeMatches =
      element.packSize?.packSize.includes(selectedPackSize);

    const stockLessThanFilter =
      stockFilter !== "" ? element.stock < parseInt(stockFilter, 10) : true;

    const supplierMatches = element.supplier.includes(selectedSupplier);

    const cityMatches = element.city.includes(selectedCity);

    const areaMatches = element.area.includes(selectedArea);

    const requestMatches = element.requestType.includes(selectedRequest);

    const warehouseNumberMatches = element.warehouseNumber
      .toString()
      .includes(selectedWarehouseNumber);

    let productionDateInRange = true;
    if (startProductionDate && endProductionDate) {
      const productionDate = new Date(element.production);
      const startDateObj = new Date(startProductionDate);
      const endDateObj = new Date(endProductionDate);
      productionDateInRange =
        productionDate >= startDateObj && productionDate <= endDateObj;
    }

    let expirationDateInRange = true;
    if (startExpirationDate && endExpirationDate) {
      const expirationDate = new Date(element.expirationDate);
      const startDateObj = new Date(startExpirationDate);
      const endDateObj = new Date(endExpirationDate);
      expirationDateInRange =
        expirationDate >= startDateObj && expirationDate <= endDateObj;
    }

    return (
      itemNameMatches &&
      packSizeMatches &&
      stockLessThanFilter &&
      supplierMatches &&
      cityMatches &&
      areaMatches &&
      warehouseNumberMatches &&
      requestMatches &&
      productionDateInRange &&
      expirationDateInRange
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
              <option>Product History</option>
              <option value="Item History">Item History</option>
              <option value="Order History">Order History</option>
              <option value="Vendor History">Vendor History</option>
              <option value="Supplier History">Supplier History</option>
              <option value="Warehouse History">Warehouse History</option>
              <option value="GRN History">GRN History</option>
              <option value="GRRN History">GRRN History</option>
            </select>
          </div>
        </div>

        {/* Product History Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex gap-4 pt-4 justify-center items-center ">
            <span className="font-bold">Product History</span>
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
                {productHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueItemNames.add(element.items?.name);
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
                {productHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniquePackSizes.add(element.packSize?.packSize);

                  return null; // No need to render anything here
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
                placeholder="Stock less than"
                value={stockFilter}
                onChange={handleStockFilterChange}
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
                {productHistory.map((element, index) => {
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
                {productHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueCities.add(element.city);

                  return null; // No need to render anything here
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
                {productHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueAreas.add(element.area);

                  return null; // No need to render anything here
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
                {productHistory.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueWarehouseNumbers.add(element.warehouseNumber);

                  return null; // No need to render anything here
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
                {productHistory.map((element, index) => {
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
              onClick={generatePDF}
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
                  Supplier
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
                  Availibility
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Request
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredProductHistory.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.items?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.packSize?.packSize}
                      {element.items?.units}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <LineBreak text={element.supplier} n={1} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <>
                        <p>{element.city},</p>
                        <p>{element.area},</p>
                        <p>Warehouse {element.warehouseNumber}</p>
                      </>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.production}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.expirationDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock > 0 ? "In Stock" : "Not in Stock"}
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

export default ProductHistory;
