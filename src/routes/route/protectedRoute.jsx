import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  const userRoles = Array.isArray(auth?.roleName) ? auth.roleName : [auth?.roleName];
  if (allowedRoles && !allowedRoles.some(r => userRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
