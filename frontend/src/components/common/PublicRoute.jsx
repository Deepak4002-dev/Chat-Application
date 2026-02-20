import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/chat" />;
  }
  return <>{children}</>;
};

export default PublicRoute;
