import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function GRRNHistory() {
  const [grrnHistory, setAllGRRNHistoryData] = useState([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("GRRN History");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedWarehouseNumber, setSelectedWarehouseNumber] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const uniqueVendors = new Set();
  const uniqueItemNames = new Set();
  const uniquePackSizes = new Set();
  const uniqueWarehouseNumbers = new Set();
  const uniqueAreas = new Set();
  const uniqueCities = new Set();
  const uniqueRequests = new Set();

  useEffect(() => {
    // Fetching Data of All GRRN History items
    const fetchGRRNHistoryData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/grrnHistory/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllGRRNHistoryData(data);
        })
        .catch((err) => console.log(err));
    };
    fetchGRRNHistoryData();
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
    } else if (selectedValue === "GRN History") {
      navigate("/grnHistory");
    }
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

  const handleRequestsChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredGRRNHistory = grrnHistory.filter((element) => {
    const vendorMatches = element.vendor?.name
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
        ? product.stockOrdered <= parseInt(quantityFilter, 10)
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

    const requestMatches = element.requestType.includes(selectedRequest);

    let dateInRange = true;
    if (startDate && endDate) {
      const date = new Date(element.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      dateInRange = date >= startDateObj && date <= endDateObj;
    }

    return (
      vendorMatches &&
      itemNameMatches &&
      packSizeMatches &&
      quantityLessThanFilter &&
      cityMatches &&
      areaMatches &&
      warehouseNumberMatches &&
      requestMatches &&
      dateInRange
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
              <option>GRRN History</option>
              <option value="Item History">Item History</option>
              <option value="Order History">Order History</option>
              <option value="Vendor History">Vendor History</option>
              <option value="Supplier History">Supplier History</option>
              <option value="Warehouse History">Warehouse History</option>
              <option value="Product History">Product History</option>
              <option value="GRN History">GRN History</option>
            </select>
          </div>
        </div>

        {/* GRRN History Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex gap-4 justify-center items-center ">
            <span className="font-bold">GRRN History</span>
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
                {grrnHistory.map((element, index) =>
                  uniqueVendors.add(element.vendor?.name)
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
                  grrnHistory.map((element) => {
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
                  grrnHistory.map((element) => {
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
                  grrnHistory.map((element) => {
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
                  grrnHistory.map((element) => {
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
                  grrnHistory.map((element) => {
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
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedRequest}
                onChange={handleRequestsChange}
              >
                <option value={""}>Select Request</option>
                {grrnHistory.map((element, index) => {
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
            <label htmlFor="startDate">Date (Start):</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <label htmlFor="endDate">Date (End):</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
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
                  Warehouse
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Request
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredGRRNHistory.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.vendor?.name}
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
                        : element.date}
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

export default GRRNHistory;
