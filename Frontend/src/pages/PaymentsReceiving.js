import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";

function PaymentsReceiving() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {}, []);

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center items-center">
      <div className="flex flex-row gap-4">
        <Link to="/accountsPayable">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Accounts Payable
          </button>
        </Link>
        <Link to="/accountsReceivable">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Accounts Receivable
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentsReceiving;
