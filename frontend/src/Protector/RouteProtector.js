// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token is found, redirect to the sign-in page
    return <Navigate to="/" replace />;
  }

  // If token exists, allow access to the route
  return children;
};

export default ProtectedRoute;
