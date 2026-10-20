import ROUTES from "..";
import AdminLegacyContentRedirect from "../../adminV2/AdminLegacyContentRedirect";
import DashboardPage from "../../pages/adminPage/DashboardPage";
import RevenuePage from "../../pages/adminPage/RevenuePage";
import TransactionPage from "../../pages/adminPage/TransactionPage";
import UserPage from "../../pages/adminPage/UserPage";
import AdvertisePage from "../../pages/adminPage/AdvertisePage";
import ReportPage from "../../pages/adminPage/ReportPage";
import PackagePage from "../../pages/adminPage/PackagePage";
import ConfigurationPage from "../../pages/adminPage/ConfigurationPage";
import ReceiptClassificationPage from "../../pages/adminPage/ReceiptClassificationPage";

const adminRoute = [
    { path: ROUTES.HOME_PAGE, element: <DashboardPage /> },
    { path: ROUTES.USER_PAGE, element: <UserPage /> },
    { path: ROUTES.REVENUE_PAGE, element: <RevenuePage /> },
    { path: ROUTES.TRANSACTION_PAGE, element: <TransactionPage /> },
    { path: ROUTES.REPORT_PAGE, element: <ReportPage /> },
    { path: ROUTES.BLOG_PAGE, element: <AdminLegacyContentRedirect /> },
    { path: ROUTES.BLOG_DETAIL_PAGE, element: <AdminLegacyContentRedirect /> },
    { path: ROUTES.CREATE_BLOG_PAGE, element: <AdminLegacyContentRedirect /> },
    { path: ROUTES.ADVERTISE_PAGE, element: <AdvertisePage /> },
    { path: ROUTES.PACKAGE_PAGE, element: <PackagePage /> },
    { path: ROUTES.CONFIGURATION_PAGE, element: <ConfigurationPage /> },
    { path: ROUTES.RECEIPT_CLASSIFICATION_PAGE, element: <ReceiptClassificationPage /> },
]

export default adminRoute
