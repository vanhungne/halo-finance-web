import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(auth.roleName)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
