import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedWrapper = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children; // If user is authenticated, show the child routes (Dashboard, etc.)
};

export default ProtectedWrapper;
