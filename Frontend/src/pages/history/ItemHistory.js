import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ItemHistory() {
  const [items, setItems] = useState([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Item History");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const uniqueItemNames = new Set();
  const uniqueCategory = new Set();
  const uniqueRequests = new Set();
  const uniquePackSizes = new Set();

  useEffect(() => {
    // Fetching Data of All Order History items
    const fetchItemHistoryData = () => {
      fetch(
        `${process.env.REACT_APP_URL}/api/itemHistory/get/${authContext.user}`
      )
        .then((response) => response.json())
        .then((data) => {
          setItems(data);
        })
        .catch((err) => console.log(err));
    };
    fetchItemHistoryData();
  }, [authContext.user]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Navigate to the selected page
    if (selectedValue === "Order History") {
      navigate("/history");
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

  const generatePDF = (filteredItemHistory) => {
    const pdf = new jsPDF("landscape"); // Specify landscape mode

    // Add content to the PDF
    const headingText = "Item History";
    const headingHeight = 15; // Adjust as needed
    pdf.text(headingText, 15, headingHeight);

    const tableData = [];
    const tableHeaders = ["Item's Name", "Category", "Pack Size(s)", "Request"];

    // Add table headers to the data
    tableData.push(tableHeaders);

    // Extracted summary information
    const summary = {
      totalItems: filteredItemHistory.length,
      totalRequests: 0,
    };

    // Loop through the filteredItemHistory and add it to the PDF and update summary
    filteredItemHistory.forEach((element) => {
      const rowData = [
        element.name,
        element.category,
        element.packSize
          .map((packSize) => `${packSize.packSize} ${element.units}`)
          .join(", "),
        element.requestType,
      ];

      tableData.push(rowData);

      // Update summary
      summary.totalRequests += 1;
    });

    // Generate the table in the PDF with adjusted startY
    const tableOptions = {
      head: [tableHeaders],
      body: tableData.slice(1), // Exclude headers from the body
      startY: headingHeight + 5, // Adjust startY to avoid overlap with the heading
    };

    pdf.autoTable(tableOptions);

    // Add summary to the PDF
    const summaryText = `Summary:\nTotal Items: ${summary.totalItems}\nTotal Requests: ${summary.totalRequests}`;
    pdf.text(summaryText, 15, pdf.autoTable.previous.finalY + 10);

    // Save the PDF with a specific filename
    pdf.save("item_history.pdf");
  };

  const handleSearchInputChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRequestsChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handlePackSizeChange = (event) => {
    setSelectedPackSize(event.target.value);
  };

  const filteredItemHistory = items.filter((element) => {
    const itemNameMatches = element.name
      .toLowerCase()
      .includes(selectedItem.toLowerCase());

    const categoryMatches = element.category
      .toLowerCase()
      .includes(selectedCategory.toLowerCase());

    const requestMatches = element.requestType.includes(selectedRequest);

    const packSizeMatches = element.packSize.some((packSize) =>
      packSize.packSize.toLowerCase().includes(selectedPackSize.toLowerCase())
    );

    return (
      itemNameMatches && categoryMatches && requestMatches && packSizeMatches
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
              <option>Item History</option>
              <option value="Order History">Order History</option>
              <option value="Product History">Product History</option>
              <option value="Vendor History">Vendor History</option>
              <option value="Supplier History">Supplier History</option>
              <option value="Warehouse History">Warehouse History</option>
              <option value="GRN History">GRN History</option>
              <option value="GRRN History">GRRN History</option>
            </select>
          </div>
        </div>

        {/* Item History Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex gap-4 pt-2 justify-center items-center ">
            <span className="font-bold">Item History</span>
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
                {items.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueItemNames.add(element.name);
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
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value={""}>Select Category</option>
                {items.map((element, index) => {
                  // Add unique item names to the Set
                  uniqueCategory.add(element.category);
                })}
                {/* Render the options for the dropdown */}
                {Array.from(uniqueCategory).map((category, index) => (
                  <option key={index} value={category}>
                    {category}
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
                  items.map((element) => {
                    element.packSize.map((packSize) => {
                      uniquePackSizes.add(packSize.packSize);
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
              <select
                id="items"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="items"
                value={selectedRequest}
                onChange={handleRequestsChange}
              >
                <option value={""}>Select Request</option>
                {items.map((element, index) => {
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
            <div>
              <button
                onClick={() => generatePDF(filteredItemHistory)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Download PDF
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Item's Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Category
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Pack Size(s)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Request
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredItemHistory.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.packSize.map((packSize) => {
                        return (
                          <p>
                            {packSize.packSize}
                            {element.units}
                          </p>
                        );
                      })}
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

export default ItemHistory;
