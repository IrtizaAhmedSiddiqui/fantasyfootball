import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Managers from "./pages/Managers";
import "./index.css";
import Fantasy from "./pages/Fantasy";
import Matches from "./pages/Matches";

const App = () => {
  const [user, setUser] = useState(null); // Change to null initially
  const [loader, setLoader] = useState(true);

  // Load user data from localStorage
  let myLoginUser = JSON.parse(localStorage.getItem("user"));
  // console.log("myLoginUser", myLoginUser);
  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser.user_id); // Set the full user object
      setLoader(false);
    } else {
      setUser(null); // No user found
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser.user_id);
    console.log("newUser", newUser);
    // Save the full user object to localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    callback();
  };

  const signout = () => {
    setUser(null);
    // Remove the full user object from localStorage
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
            <Route path="/players" element={<Players />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/managers" element={<Managers />} />
            <Route path="/fantasy" element={<Fantasy />} />
            <Route path="/matches" element={<Matches />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
