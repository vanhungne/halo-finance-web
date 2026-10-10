import { lazy, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import images from "../../assets/image";
import { loginApi } from "../../services/auth";
import { AuthContext } from "../../contexts/AuthContext";

const AdminLoginScene = lazy(() => import("../../components/auth/AdminLoginScene.jsx"));
const Motion = motion;

const roleClaimKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const idClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const emailClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const nameClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

function isAdminToken(decoded) {
  const roleClaim = decoded[roleClaimKey];
  return Array.isArray(roleClaim) ? roleClaim.includes("Admin") : roleClaim === "Admin";
}

function authFromToken(decoded) {
  return {
    isLoggedIn: true,
    userId: decoded[idClaimKey],
    roleName: "Admin",
    email: decoded[emailClaimKey],
    avatar: decoded.avatar,
    fullName: decoded[nameClaimKey],
  };
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.9 6.9 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l2.85-2.22.81-.63Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
    </svg>
  );
}

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const saveAdminSession = useCallback((accessToken, refreshToken, decoded) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    setAuth(authFromToken(decoded));
  }, [setAuth]);

  const clearSession = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);
      const decoded = jwtDecode(data.accessToken);

      if (!isAdminToken(decoded)) {
        clearSession();
        setError("Tài khoản này không có quyền truy cập khu vực quản trị.");
        return;
      }

      saveAdminSession(data.accessToken, data.refreshToken, decoded);
      navigate("/admin", { replace: true });
    } catch (err) {
      clearSession();
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    const apiUrl = (import.meta.env.VITE_APP_URL_API || "https://trolytaichinh.amz.io.vn/api/").replace(/\/+$/, "");
    const returnUrl = encodeURIComponent(`${window.location.origin}/login`);
    window.location.href = `${apiUrl}/auth/oauth-login?provider=Google&returnUrl=${returnUrl}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);

        if (!isAdminToken(decoded)) {
          clearSession();
          setError(`Tài khoản ${decoded[emailClaimKey] || "Google"} không có quyền Quản trị viên.`);
        } else {
          saveAdminSession(accessToken, refreshToken, decoded);
          navigate("/admin", { replace: true });
        }
      } catch {
        clearSession();
        setError("Đăng nhập Google thất bại. Token không hợp lệ.");
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearSession, navigate, saveAdminSession]);

  useEffect(() => {
    if (auth?.roleName === "Admin") navigate("/admin", { replace: true });
  }, [auth, navigate]);

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#020617]" />}>
          <AdminLoginScene paused={reduceMotion} />
        </Suspense>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_19%_45%,rgba(14,165,233,0.1),transparent_27%),radial-gradient(circle_at_73%_20%,rgba(37,99,235,0.12),transparent_24%),linear-gradient(90deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.08)_48%,rgba(2,6,23,0.42)_100%)]" />
      <div className="auth-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_right,black,transparent_88%)]" />

      {!reduceMotion && (
        <>
          <Motion.div
            className="absolute -left-28 top-[12%] h-80 w-80 rounded-full bg-sky-500/15 blur-[100px]"
            animate={{ x: [0, 90, 0], y: [0, 60, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <Motion.div
            className="absolute bottom-[-12rem] left-[38%] h-96 w-96 rounded-full bg-amber-300/10 blur-[120px]"
            animate={{ x: [0, -70, 0], y: [0, -45, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <Motion.div
            className="pointer-events-none absolute -left-1/4 top-0 h-px w-[78%] origin-left bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent shadow-[0_0_35px_rgba(34,211,238,0.65)]"
            animate={{ y: [80, 820, 80], opacity: [0, 0.7, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <header className="absolute inset-x-0 top-0 z-30 px-5 py-5 sm:px-8 sm:py-7 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 shadow-[0_18px_55px_-28px_rgba(14,165,233,0.85)] backdrop-blur-2xl transition hover:border-sky-400/35 hover:bg-slate-900/65"
            aria-label="Về trang chủ"
          >
            <img src={images.logo} alt="Trợ Lý Tài Chính" className="h-9 w-auto sm:h-10" />
            <span className="mx-3 h-6 w-px bg-white/10" />
            <ArrowLeft className="h-4 w-4 text-slate-400 transition group-hover:-translate-x-1 group-hover:text-sky-300" />
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3.5 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-emerald-300/90 backdrop-blur-xl sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Kết nối được mã hóa
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[100svh] items-center px-4 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1500px] justify-center lg:justify-end lg:pr-[4vw] xl:pr-[7vw]">
          <Motion.section
            initial={reduceMotion ? false : { y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[490px] overflow-hidden rounded-[2rem] border border-white/[0.14] bg-[#07101f]/70 p-6 shadow-[0_40px_120px_-35px_rgba(0,0,0,0.9),0_0_70px_-40px_rgba(14,165,233,0.75)] backdrop-blur-[30px] sm:p-9 xl:p-10"
            aria-labelledby="login-title"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/85 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative mb-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.17em] text-sky-300">
                <Sparkles className="h-3.5 w-3.5" /> Cổng quản trị
              </div>
              <h1 id="login-title" className="text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                Chào mừng trở lại.
              </h1>
              <p className="mt-3 max-w-sm leading-7 text-slate-400">
                Đăng nhập để tiếp tục quản trị hệ thống Trợ Lý Tài Chính.
              </p>
            </div>

            <form className="relative space-y-4" onSubmit={handleSubmit} noValidate>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Email quản trị</span>
                <span className="group flex items-center rounded-2xl border border-white/10 bg-white/[0.065] px-4 transition focus-within:border-sky-400/80 focus-within:bg-white/[0.1] focus-within:ring-4 focus-within:ring-sky-400/10">
                  <Mail className="h-5 w-5 shrink-0 text-slate-500 transition group-focus-within:text-sky-400" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="admin@trolytaichinh.vn"
                    value={form.email}
                    onChange={handleChange}
                    className="h-14 w-full bg-transparent px-3 text-base text-white outline-none placeholder:text-slate-600"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Mật khẩu</span>
                <span className="group flex items-center rounded-2xl border border-white/10 bg-white/[0.065] px-4 transition focus-within:border-sky-400/80 focus-within:bg-white/[0.1] focus-within:ring-4 focus-within:ring-sky-400/10">
                  <LockKeyhole className="h-5 w-5 shrink-0 text-slate-500 transition group-focus-within:text-sky-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={form.password}
                    onChange={handleChange}
                    className="h-14 w-full bg-transparent px-3 text-base text-white outline-none placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-sky-500/10 hover:text-sky-400"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-3 py-1">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-400">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-600 accent-sky-500"
                  />
                  Duy trì đăng nhập
                </label>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> Bảo mật
                </span>
              </div>

              <AnimatePresence initial={false}>
                {error && (
                  <Motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    className="overflow-hidden"
                    role="alert"
                  >
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3.5 text-sm leading-6 text-rose-300">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 font-extrabold text-white shadow-[0_18px_42px_-15px_rgba(14,165,233,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-14px_rgba(14,165,233,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 translate-x-[-110%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[110%]" />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <><LoaderCircle className="h-5 w-5 animate-spin" /> Đang xác thực...</>
                  ) : (
                    <>Đăng nhập hệ thống <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>
                  )}
                </span>
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center"><span className="bg-[#08111f] px-4 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500">Hoặc tiếp tục với</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.065] font-bold text-white transition hover:-translate-y-0.5 hover:border-sky-400/35 hover:bg-white/[0.1]"
            >
              <GoogleIcon /> Đăng nhập bằng Google
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="group mx-auto mt-7 flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-sky-300"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Về trang giới thiệu
            </button>
          </Motion.section>
        </div>
      </main>

      <div className="pointer-events-none absolute bottom-6 left-8 z-20 hidden items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600 lg:flex">
        <span className="h-px w-12 bg-gradient-to-r from-sky-400/60 to-transparent" />
        Admin workspace · Trợ Lý Tài Chính
      </div>
    </div>
  );
}

export default LoginPage;
