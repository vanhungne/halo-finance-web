import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function NotFoundPage() {
  const { auth } = useContext(AuthContext);

  const redirectPath = auth?.roleName === "Admin" ? "/admin" : "/";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Trang bạn tìm không tồn tại.</p>
      <Link
        to={redirectPath}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Quay về {auth?.roleName === "Admin" ? "Dashboard Admin" : "trang chủ"}
      </Link>
    </div>
  );
}
