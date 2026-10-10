import { createContext, useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshTokenApi, logoutApi } from "../services/auth";
import FullPageLoader from "../components/common/FullPageLoader";

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
  const refreshTimerRef = useRef(null);

  // ================= LOGOUT =================
  const logout = async (callApi = true) => {
    if (callApi) {
      try {
        await logoutApi();
      } catch (err) {
        console.log("logout api fail (có thể token hết hạn)", err);
      }
    }
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setAuth(null);
  };

  // ================= REFRESH ACCESS TOKEN =================
  const refreshAccessToken = async () => {
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await refreshTokenApi({ refreshToken });

      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      const decoded = jwtDecode(response.accessToken);
      const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isAdmin = Array.isArray(roleClaim) ? roleClaim.includes("Admin") : roleClaim === "Admin";
      const primaryRole = isAdmin ? "Admin" : (Array.isArray(roleClaim) ? roleClaim[0] : roleClaim);
      const newAuth = {
        isLoggedIn: true,
        userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        roleName: primaryRole,
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        avatar: decoded["avatar"],
        fullName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      };
      setAuth(newAuth);

      // setup refresh cho token mới
      setupTokenRefresh(response.accessToken);

      console.log("refresh token successful");
      return response.accessToken;
    } catch (error) {
      console.log("refresh token fail");
      logout(false);
      throw error;
    }
  };

  // ================= SETUP PROACTIVE TOKEN REFRESH =================
  const setupTokenRefresh = (token) => {
    if (!token) return;
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // giây
      let timeUntilExpiry = (decoded.exp - currentTime) * 1000; // ms

      // Nếu token đã hết hạn, refresh ngay
      if (timeUntilExpiry <= 0) {
        refreshAccessToken().catch(() => logout(false));
        return;
      }

      // refresh sớm 60 giây trước khi token hết hạn
      const refreshTime = Math.max(timeUntilExpiry - 60 * 1000, 0);

      refreshTimerRef.current = setTimeout(() => {
        refreshAccessToken().catch(() => logout(false));
      }, refreshTime);
    } catch (err) {
      console.error("setupTokenRefresh error:", err);
      logout(false);
    }
  };

  // ================= INITIALIZE AUTH =================
  useEffect(() => {
    const initializeAuth = async () => {
      if (!refreshToken) {
        setAuth(null);
        setLoading(false);
        return;
      }

      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            // access token còn hạn
            const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const isAdmin = Array.isArray(roleClaim) ? roleClaim.includes("Admin") : roleClaim === "Admin";
            const primaryRole = isAdmin ? "Admin" : (Array.isArray(roleClaim) ? roleClaim[0] : roleClaim);
            setAuth({
              isLoggedIn: true,
              userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
              roleName: primaryRole,
              email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
              avatar: decoded["avatar"],
              fullName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            });
            setupTokenRefresh(accessToken);
          } else {
            // access token expired → refresh ngay
            await refreshAccessToken();
          }
        } catch {
          logout(false);
        }
      } else {
        // không có access token nhưng còn refresh token → refresh ngay
        await refreshAccessToken().catch(() => logout(false));
      }

      setLoading(false);
    };

    initializeAuth();
  }, []); // chỉ chạy 1 lần khi mount

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      logout(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => clearTimeout(refreshTimerRef.current);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        auth,
        setAuth,
        loading,
        logout,
        refreshAccessToken,
      }}
    >
      {loading ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
}
