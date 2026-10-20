import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import images from "../../assets/image";
import { authSessionMessage } from "../../services/auth/sessionMessages";
import { readAdminLocale } from "../../adminV2/adminMessages";
import { AuthContext } from "../../contexts/AuthSessionContext.js";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFactor, setTwoFactor] = useState(null);
  const { auth, login, verifyTwoFactor, sessionError } = useContext(AuthContext);
  const locale = readAdminLocale(() => window.localStorage);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (twoFactor) await verifyTwoFactor({ challenge: twoFactor.challenge, otpCode: form.otpCode });
      else await login(form);
    } catch (err) {
      if (err.code === "AUTH_TWO_FACTOR_REQUIRED" && err.details?.challenge) {
        setTwoFactor(err.details);
        setForm((current) => ({ ...current, otpCode: "" }));
      }
      setError(authSessionMessage(err.code, locale));
    } finally {
      setForm((current) => ({ ...current, password: "" }));
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
  }, [auth, navigate]);

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
              Quản lý hệ thống ViNance.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {twoFactor && <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              Nhập mã {twoFactor.method === "authenticator" ? "trong ứng dụng xác thực" : "được gửi qua SMS"} để tiếp tục.
            </div>}
            {twoFactor ? <input
              name="otpCode" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
              placeholder="Mã xác thực 6 số" value={form.otpCode ?? ""} onChange={handleChange} autoComplete="one-time-code" required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
            /> : <>
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
            </div></>}

            {(error || sessionError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600" role="alert">{error || authSessionMessage(sessionError, locale)}</p>
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
                twoFactor ? "Xác nhận mã" : "Đăng nhập"
              )}
            </button>
          </form>
          {twoFactor && <button type="button" onClick={() => { setTwoFactor(null); setError(""); setForm((current) => ({ ...current, otpCode: "" })); }} className="mt-3 w-full text-sm text-gray-600 hover:text-yellow-600">Quay lại đăng nhập</button>}
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
