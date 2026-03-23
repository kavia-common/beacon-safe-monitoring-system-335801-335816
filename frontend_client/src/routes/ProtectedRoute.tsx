import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../state/AppContext";

/**
 * PUBLIC_INTERFACE
 * Route guard.
 *
 * Contract:
 * - If token is missing, redirects to /login.
 * - Otherwise renders nested routes via <Outlet/>.
 */
export function ProtectedRoute() {
  const { token } = useApp();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
