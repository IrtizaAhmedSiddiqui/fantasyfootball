import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import Items from "./pages/Items";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Store from "./pages/Store";
import StockHistory from "./pages/StockHistory";
import OrderDetails from "./pages/OrderDetails";
import Warehouse from "./pages/Warehouse";
import Supplier from "./pages/Supplier";
import ItemHistory from "./pages/history/ItemHistory";
import ProductHistory from "./pages/history/ProductHistory";
import StoreHistory from "./pages/history/StoreHistory";
import SupplierHistory from "./pages/history/SupplierHistory";
import WarehouseHistory from "./pages/history/WarehouseHistory";
import GRN from "./pages/GRN";
import GRNHistory from "./pages/history/GRNHistory";
import GRRN from "./pages/GRRN";
import GRRNHistory from "./pages/history/GRRNHistory";
import PaymentsReceiving from "./pages/PaymentsReceiving";
import AccountsPayable from "./pages/AccountsPayable";
import AccountsReceivable from "./pages/AcountsReceivable";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/history" element={<StockHistory />} />
            <Route path="/vendor" element={<Store />} />
            <Route path="/itemHistory" element={<ItemHistory />} />
            <Route path="/productHistory" element={<ProductHistory />} />
            <Route path="/storeHistory" element={<StoreHistory />} />
            <Route path="/supplierHistory" element={<SupplierHistory />} />
            <Route path="/warehouseHistory" element={<WarehouseHistory />} />
            <Route path="/grrn" element={<GRRN />} />
            <Route path="/grn" element={<GRN />} />
            <Route path="/grrnHistory" element={<GRRNHistory />} />
            <Route path="/grnHistory" element={<GRNHistory />} />
            <Route path="/paymentsReceiving" element={<PaymentsReceiving />} />
            <Route path="/accountsPayable" element={<AccountsPayable />} />
            <Route
              path="/accountsReceivable"
              element={<AccountsReceivable />}
            />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
