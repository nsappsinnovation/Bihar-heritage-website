import React from "react";
import "./adminFonts";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/auth";

/**
 * Route protection wrapper for administrative pages.
 * The token is only a UI gate — every admin API call is authorised server-side.
 */
const AdminGuard = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminGuard;
