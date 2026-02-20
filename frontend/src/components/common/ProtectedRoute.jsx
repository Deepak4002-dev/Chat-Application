import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn || !user?.role) {
    return <Navigate to={"/"} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/unauthorized"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
