import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import images from "../../assets/image";
import { loginApi } from "../../services/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { auth, setAuth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);

      localStorage.setItem("access_token", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);

      const decoded = jwtDecode(data.accessToken);
      if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin") {
        setAuth({
          isLoggedIn: true,
          userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          roleName: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          avatar: decoded["avatar"],
          fullName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        });
      } else {
        setError("Bạn không có thẩm quyền để truy cập trang này.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      console.log(err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (auth?.roleName === "Admin") {
      navigate("/admin");
    }
  }, [auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
        <div className="hidden lg:flex w-full lg:w-1/2 bg-blue-50 items-center justify-center p-6 sm:p-8">
          <img src={images.login_hero} alt="login" className="max-h-80 sm:max-h-96 object-contain" />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <img src={images.logo} alt="logo" className="w-16 h-16 sm:w-64 sm:h-16" />
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 mt-4">
              Xin chào quản trị viên!
            </h2>
            <p className="text-gray-500 text-center mb-4 text-sm sm:text-base">
              Quản lý hệ thống Trợ Lý Tài Chính.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
              required
            />

            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-yellow-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
          <div className="text-center mt-6">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-black px-5 py-2 rounded-lg hover:text-yellow-500 transition-colors"
            >
              <ArrowLeft size={16} />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
