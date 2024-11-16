import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

function StockHistory() {
  const [stockHistory, setAllStockHistoryData] = useState([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Order History");
  const [code, setCode] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedWarehouseNumber, setSelectedWarehouseNumber] = useState("");
  const [totalPriceFilter, setTotalPriceFilter] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedRider, setSelectedRider] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [startOrderDate, setStartOrderDate] = useState("");
  const [endOrderDate, setEndOrderDate] = useState("");
  const uniqueVendors = new Set();
  const uniqueItemNames = new Set();
  const uniquePackSizes = new Set();
  const uniqueWarehouseNumbers = new Set();
  const uniqueAreas = new Set();
  const uniqueCities = new Set();
  const uniqueRiders = new Set();
  const uniqueRequests = new Set();
  const uniquePaymentMethods = new Set();

  useEffect(() => {
    // Fetching Data of All Order History items
    const fetchStockHistoryData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/stockHistory/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllStockHistoryData(data);
        })
        .catch((err) => console.log(err));
    };
    fetchStockHistoryData();
  }, [authContext.user]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Navigate to the selected page
    if (selectedValue === "Item History") {
      navigate("/itemHistory");
    } else if (selectedValue === "Product History") {
      navigate("/productHistory");
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

  const generatePDF = () => {
    const pdf = new jsPDF("landscape"); // Specify landscape mode

    // Add content to the PDF
    const headingText = "Order History";
    const headingHeight = 15; // Adjust as needed
    pdf.text(headingText, 15, headingHeight);

    const tableData = [];
    const tableHeaders = [
      "Row Number",
      "Vendor",
      "Item",
      "Pack Size",
      "Quantity",
      "Price (Rs)",
      "Warehouse",
      "Order Date",
      "Total (Rs)",
      "Rider",
      "Order By",
      "Request",
    ];

    // Add table headers to the data
    tableData.push(tableHeaders);

    // Initialize total stock and total price
    let totalStock = 0;
    let totalPrice = 0;

    // Keep track of unique order indices to display row number only once per order
    const uniqueOrderIndices = new Set();

    // Keep track of items and their count and prices
    const itemCounts = {};
    const itemPrices = {};
    const itemTotalSales = {}; // Added for tracking total sales of each item

    // Loop through the filteredOrderHistory and add it to the PDF
    filteredOrderHistory.forEach((element, orderIndex) => {
      let orderTotal = 0; // Initialize order total for each order

      element.products.forEach((product, productIndex) => {
        const itemName = product.product.items?.name;

        // Increment item count or initialize it to 1
        itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;

        // Accumulate prices for the item
        itemPrices[itemName] = (itemPrices[itemName] || 0) + product.price;

        // Accumulate total sales for the item
        itemTotalSales[itemName] =
          (itemTotalSales[itemName] || 0) + Number(element.totalAmount);

        const rowData = [
          uniqueOrderIndices.has(orderIndex) ? "" : orderIndex + 1,
          element.StoreID?.name,
          itemName,
          `${product.product.packSize?.packSize} ${product.product.items?.units}`,
          product.stockOrdered,
          product.price,
          `${product.product.city}, ${product.product.area}, Warehouse ${product.product.warehouseNumber}`,
          element.orderDate,
          productIndex === 0 ? element.totalAmount : "", // Display order total only once
          element.riderName,
          `${element.userID?.firstName} ${element.userID?.lastName}`,
          element.requestType,
        ];

        // Increment total stock
        totalStock += Number(product.stockOrdered);

        // Accumulate order total
        orderTotal += Number(element.totalAmount);

        // Add order index to the set to avoid repetition of row numbers for the same order
        uniqueOrderIndices.add(orderIndex);

        tableData.push(rowData);
      });

      // Update the total price for the entire report
      totalPrice += orderTotal;
    });

    // Generate the table in the PDF with adjusted startY
    const tableOptions = {
      head: [tableHeaders],
      body: tableData.slice(1), // Exclude headers from the body
      startY: headingHeight + 5, // Adjust startY to avoid overlap with the heading
    };

    pdf.autoTable(tableOptions);

    // After the table, add a new page for the summary
    pdf.addPage();

    // Add detailed summary information on the new page
    const summaryText = [
      `Total Entries: ${filteredOrderHistory.length}`,
      `Total Stock in Report: ${totalStock}`,
      `Total Amount in Report: Rs. ${totalPrice.toFixed(2)}`,
      // ... (add other summary information as needed)
    ];

    // Add item-wise summary including individual prices and total sales
    Object.entries(itemCounts).forEach(([itemName, count]) => {
      const averagePrice = itemPrices[itemName] / count; // Calculate average price
      const totalSales = itemTotalSales[itemName] || 0;
      summaryText.push(
        `${itemName}: ${count} times ordered, Average Price: ${averagePrice.toFixed(
          2
        )} Rs, Total Sales: Rs. ${totalSales.toFixed(2)}`
      );
    });

    // Set Y position for the summary to start at the top of the page
    const summaryStartY = 15;

    // Add summary information to the new page
    pdf.text(summaryText, 15, summaryStartY);

    // Save the PDF with a specific filename
    pdf.save("order_history.pdf");
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleVendorChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handlePackSizeChange = (event) => {
    setSelectedPackSize(event.target.value);
  };

  const handleQuantityFilterChange = (event) => {
    setQuantityFilter(event.target.value);
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

  const handleTotalPriceFilterChange = (event) => {
    setTotalPriceFilter(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleRiderChange = (event) => {
    setSelectedRider(event.target.value);
  };

  const handleRequestsChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handleStartOrderDateChange = (event) => {
    setStartOrderDate(event.target.value);
  };

  const handleEndOrderDateChange = (event) => {
    setEndOrderDate(event.target.value);
  };

  const filteredOrderHistory = stockHistory.filter((element) => {
    const filterCode = element.code.toLowerCase().includes(code.toLowerCase());

    const paymentMethodFilter = element.paymentMethod
      .toLowerCase()
      .includes(selectedPaymentMethod.toLowerCase());

    const vendorMatches = element.StoreID?.name
      .toLowerCase()
      .includes(selectedVendor.toLowerCase());

    const itemNameMatches = element.products.some(
      (product) =>
        product.product.items?.name
          .toLowerCase()
          .includes(selectedItem.toLowerCase()) &&
        product.product.packSize?.packSize
          .toLowerCase()
          .includes(selectedPackSize.toLowerCase()) &&
        product.product.city
          .toLowerCase()
          .includes(selectedCity.toLowerCase()) &&
        product.product.area
          .toLowerCase()
          .includes(selectedArea.toLowerCase()) &&
        product.product.warehouseNumber
          .toString()
          .includes(selectedWarehouseNumber)
    );

    const packSizeMatches = element.products.some((product) =>
      product.product.packSize?.packSize
        .toLowerCase()
        .includes(selectedPackSize.toLowerCase())
    );

    const quantityLessThanFilter = element.products.some((product) =>
      quantityFilter !== ""
        ? product.stockOrdered < parseInt(quantityFilter, 10)
        : true
    );

    const cityMatches = element.products.some((product) =>
      product.product.city.toLowerCase().includes(selectedCity.toLowerCase())
    );

    const areaMatches = element.products.some((product) =>
      product.product.area.toLowerCase().includes(selectedArea.toLowerCase())
    );

    const warehouseNumberMatches = element.products.some((product) =>
      product.product.warehouseNumber
        .toString()
        .includes(selectedWarehouseNumber)
    );

    const totalPriceLessThanFilter =
      totalPriceFilter !== ""
        ? element.totalAmount < parseInt(totalPriceFilter, 10)
        : true;

    const riderMatches = element.riderName
      .toLowerCase()
      .includes(selectedRider.toLowerCase());

    const requestMatches = element.requestType.includes(selectedRequest);

    let orderDateInRange = true;
    if (startOrderDate && endOrderDate) {
      const orderDate = new Date(element.orderDate);
      const startDateObj = new Date(startOrderDate);
      const endDateObj = new Date(endOrderDate);
      orderDateInRange = orderDate >= startDateObj && orderDate <= endDateObj;
    }

    return (
      paymentMethodFilter &&
      filterCode &&
      vendorMatches &&
      itemNameMatches &&
      packSizeMatches &&
      quantityLessThanFilter &&
      cityMatches &&
      areaMatches &&
      warehouseNumberMatches &&
      totalPriceLessThanFilter &&
      riderMatches &&
      requestMatches &&
      orderDateInRange
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
              <option>Order History</option>
              <option value="Item History">Item History</option>
              <option value="Product History">Product History</option>
              <option value="Vendor History">Vendor History</option>
              <option value="Supplier History">Supplier History</option>
              <option value="Warehouse History">Warehouse History</option>
              <option value="GRN History">GRN History</option>
              <option value="GRRN History">GRRN History</option>
            </select>
          </div>
        </div>

        {/* Order History Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex gap-4 pt-4 justify-center items-center ">
            <span className="font-bold">Order History</span>
          </div>
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div>
              <select
                id="vendor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="vendor"
                value={selectedVendor}
                onChange={handleVendorChange}
              >
                <option value={""}>Select Vendor</option>
                {stockHistory.map((element, index) =>
                  uniqueVendors.add(element.StoreID?.name)
                )}

                {Array.from(uniqueVendors).map((vendor, index) => (
                  <option key={index} value={vendor}>
                    {vendor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedItem}
                onChange={handleSearchInputChange}
              >
                <option value={""}>Select Item</option>
                {
                  // Add unique item names to the Set
                  stockHistory.map((element) => {
                    element.products.map((product) => {
                      uniqueItemNames.add(product.product.items?.name);
                    });
                  })
                }
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
                {
                  // Add unique item names to the Set
                  stockHistory.map((element) => {
                    element.products.map((product) => {
                      uniquePackSizes.add(product.product.packSize?.packSize);
                    });
                  })
                }
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
                placeholder="Quantity less than"
                value={quantityFilter}
                onChange={handleQuantityFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
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
                {
                  // Add unique item names to the Set
                  stockHistory.map((element) => {
                    element.products.map((product) => {
                      uniqueCities.add(product.product.city);
                    });
                  })
                }
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
                {
                  // Add unique item names to the Set
                  stockHistory.map((element) => {
                    element.products.map((product) => {
                      uniqueAreas.add(product.product.area);
                    });
                  })
                }
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
                {
                  // Add unique item names to the Set
                  stockHistory.map((element) => {
                    element.products.map((product) => {
                      uniqueWarehouseNumbers.add(
                        product.product.warehouseNumber
                      );
                    });
                  })
                }
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
              <input
                type="number"
                placeholder="Price less than"
                value={totalPriceFilter}
                onChange={handleTotalPriceFilterChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <div>
              <input
                type="String"
                placeholder="ID"
                value={code}
                onChange={handleCodeChange}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-20" // Adjusted width to w-20
              />
            </div>
            <div>
              <select
                id="paymentMethod"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="paymentMethod"
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <option value={""}>Payment Method</option>
                {stockHistory.map((element, index) =>
                  uniquePaymentMethods.add(element.paymentMethod)
                )}

                {Array.from(uniquePaymentMethods).map((methods, index) => (
                  <option key={index} value={methods}>
                    {methods}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center pt-2">
            <label htmlFor="startDate">Order Date (Start):</label>
            <input
              type="date"
              id="startDate"
              value={startOrderDate}
              onChange={handleStartOrderDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <label htmlFor="endDate">Order Date (End):</label>
            <input
              type="date"
              id="endDate"
              value={endOrderDate}
              onChange={handleEndOrderDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <div className="flex gap-4 pt-3 justify-center items-center">
            <div>
              <select
                id="vendor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="vendor"
                value={selectedRider}
                onChange={handleRiderChange}
              >
                <option value={""}>Select Rider</option>
                {stockHistory.map((element, index) => {
                  uniqueRiders.add(element.riderName);
                })}

                {Array.from(uniqueRiders).map((rider, index) => (
                  <option key={index} value={rider}>
                    {rider}
                  </option>
                ))}
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
                {stockHistory.map((element, index) => {
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
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Vendor
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Pack Size
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Quantity
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Price(Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Order Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total(Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Payment Method
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Rider
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Order By
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Request
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredOrderHistory.map((element, index) => {
                return (
                  <tr key={element._id}>
                    {console.log("Element: ", element)}
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.StoreID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.products.map((product) => {
                        return <p>{product.product.items?.name}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.products.map((product) => {
                        return (
                          <p>
                            {product.product.packSize?.packSize}
                            {product.product.items?.units}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return <p>{product.stockOrdered}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return <p>{product.price}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return (
                          <p>
                            {product.product.city}, {product.product.area},
                            Warehouse {product.product.warehouseNumber}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.PurchaseDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element.orderDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.totalAmount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.riderName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.userID?.firstName} {element.userID?.lastName}
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

export default StockHistory;
