import { createBrowserRouter, Navigate } from "react-router-dom";
import adminRoute from "./route/adminRoute";
import ROUTES from ".";
import LoginPage from "../pages/authenPage/LoginPage";
import publicRoute from "./route/publicRoute";
import AdminLayout from "../layout/adminLayout";
import ProtectedRoute from "./route/protectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import ConfirmEmailSuccess from "../pages/ConfirmEmailSuccess";
import ConfirmEmailFail from "../pages/ConfirmEmailFail";

export const router = createBrowserRouter([
    {
        path: "/",
        // element: <Navigate to={ROUTES.HOME} />,
        children: [...publicRoute]
    },
    {
        path: ROUTES.LOGIN_PAGE,
        element: <LoginPage />,
    },
    {
        path: ROUTES.CONFIRM_EMAIL_SUCCESS_PAGE,
        element: <ConfirmEmailSuccess />,
    },
    {
        path: ROUTES.CONFIRM_EMAIL_FAIL_PAGE,
        element: <ConfirmEmailFail />,
    },
    {
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [...adminRoute],
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
])