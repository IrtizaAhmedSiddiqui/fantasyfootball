import React, { useState, useEffect, useContext } from "react";
import AddSupplier from "../components/Supplier/AddSupplier";
import AuthContext from "../AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AddPayableEntry from "../components/PaymentsReceiving/AddPayableEntry";

function AccountsPayable() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [suppliers, setAllSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [account, setAccount] = useState([]);
  const [cities, setAllCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Fetching Data of All Suppliers
    const fetchSuppliersData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/supplier/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllSuppliers(data);
        })
        .catch((err) => console.log(err));
    };

    fetchSuppliersData();
  }, [authContext.user, updatePage]);

  // Fetching Data of Search Suppliers
  const fetchSearchData = () => {
    fetch(
      `${process.env.REACT_APP_URL}/api/supplier/search?searchTerm=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllSuppliers(data);
      })
      .catch((err) => console.log(err));
  };

  // Modal for Supplier ADD
  const addSupplierModalSetting = () => {
    setShowSupplierModal(!showSupplierModal);
  };

  // Get Supplier by Name
  const getSupplier = (name) => {
    const encodedName = encodeURIComponent(name);
    const url = `${process.env.REACT_APP_URL}/api/account/payable?encodedName=${encodedName}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAccount(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
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

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  // Filter transactions based on the selected dates
  const filterTransactionsByDate = () => {
    if (startDate && endDate) {
      const filteredTransactions = account[0]?.transactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate >= new Date(startDate) &&
            transactionDate <= new Date(endDate)
          );
        }
      );
      return filteredTransactions;
    }
    return account[0]?.transactions;
  };

  const downloadPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("accounts_payable.pdf");
    });
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {/* {showSupplierModal && (
          <AddSupplier
            cities={cities}
            addSupplierModalSetting={addSupplierModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )} */}
        {showSupplierModal && (
          <AddPayableEntry
            selectedSupplier={selectedSupplier}
            addSupplierModalSetting={addSupplierModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Accounts Payable</span>
            </div>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 w-[60rem]"
              value={selectedSupplier}
              onChange={handleSupplierChange}
            >
              <option>Select Supplier</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={() => {
                  getSupplier(selectedSupplier);
                  setShowTable(true);
                }}
              >
                Search
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSupplierModalSetting}
                disabled={!showTable}
              >
                Add Entry
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={downloadPDF}
                disabled={!showTable}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        {/* Table  */}

        {showTable && (
          <>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {account[0]?.name}
              </h1>
              <h1 className="text-xl font-bold text-gray-900">
                Total: {account[0]?.total}
              </h1>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
              />
            </div>
            <div
              id="pdf-content"
              className="overflow-x-auto rounded-lg border bg-white border-gray-200 "
            >
              <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Bill ID
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Debit
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Credit
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filterTransactionsByDate()?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="whitespace-nowrap px-4 py-2 text-center text-gray-900"
                      >
                        No Records Found!
                      </td>
                    </tr>
                  ) : (
                    filterTransactionsByDate()?.map((element, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                          {new Date(element.date).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element._id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.debit}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.credit}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AccountsPayable;
