import ROUTES from "..";
import DashboardPage from "../../pages/adminPage/DashboardPage";
import RevenuePage from "../../pages/adminPage/RevenuePage";
import TransactionPage from "../../pages/adminPage/TransactionPage";
import UserPage from "../../pages/adminPage/UserPage";
import BlogPage from "../../pages/adminPage/BlogPage";
import AdvertisePage from "../../pages/adminPage/AdvertisePage";
import ReportPage from "../../pages/adminPage/ReportPage";
import PackagePage from "../../pages/adminPage/PackagePage";
import ConfigurationPage from "../../pages/adminPage/ConfigurationPage";
import CreateBlogPage from "../../pages/adminPage/CreateBlogPage";
import BlogDetailPage from "../../pages/adminPage/BlogDetailPage";
import AiManagementPage from "../../pages/adminPage/AiManagementPage";

const adminRoute = [
    { path: ROUTES.HOME_PAGE, element: <DashboardPage /> },
    { path: ROUTES.USER_PAGE, element: <UserPage /> },
    { path: ROUTES.REVENUE_PAGE, element: <RevenuePage /> },
    { path: ROUTES.TRANSACTION_PAGE, element: <TransactionPage /> },
    { path: ROUTES.REPORT_PAGE, element: <ReportPage /> },
    { path: ROUTES.BLOG_PAGE, element: <BlogPage /> },
    { path: ROUTES.BLOG_DETAIL_PAGE, element: <BlogDetailPage /> },
    { path: ROUTES.CREATE_BLOG_PAGE, element: <CreateBlogPage /> },
    { path: ROUTES.ADVERTISE_PAGE, element: <AdvertisePage /> },
    { path: ROUTES.PACKAGE_PAGE, element: <PackagePage /> },
    { path: ROUTES.CONFIGURATION_PAGE, element: <ConfigurationPage /> },
    { path: ROUTES.AI_MANAGEMENT_PAGE, element: <AiManagementPage /> },
]

export default adminRoute