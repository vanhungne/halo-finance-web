import { lazy } from "react";
import AdminV2RouteView from "../../adminV2/AdminV2RouteView";
import { adminRouteSegment } from "../../adminV2/adminNavigation";

const AdminV2OverviewPage = lazy(() => import("../../adminV2/AdminV2OverviewPage"));
const AdminV2UsersPage = lazy(() => import("../../adminV2/AdminV2UsersPage"));
const AdminV2ReportsPage = lazy(() => import("../../adminV2/AdminV2ReportsPage"));
const AdminV2ContentPage = lazy(() => import("../../adminV2/AdminV2ContentPage"));
const AdminV2AdvertisingPage = lazy(() => import("../../adminV2/AdminV2AdvertisingPage"));
const AdminV2SubscriptionsPage = lazy(() => import("../../adminV2/AdminV2SubscriptionsPage"));
const AdminV2AuditPage = lazy(() => import("../../adminV2/AdminV2AuditPage"));
const AdminV2ConfigurationPage = lazy(() => import("../../adminV2/AdminV2ConfigurationPage"));
const AdminV2OperationsPage = lazy(() => import("../../adminV2/AdminV2OperationsPage"));
const AdminV2PlatformPage = lazy(() => import("../../adminV2/AdminV2PlatformPage"));

const adminV2Route = [
  { index: true, element: <AdminV2RouteView routeId="command-center" page={AdminV2OverviewPage} /> },
  { path: adminRouteSegment("accounts"), element: <AdminV2RouteView routeId="accounts" page={AdminV2UsersPage} /> },
  { path: adminRouteSegment("reports"), element: <AdminV2RouteView routeId="reports" page={AdminV2ReportsPage} /> },
  { path: adminRouteSegment("content"), element: <AdminV2RouteView routeId="content" page={AdminV2ContentPage} /> },
  { path: adminRouteSegment("advertising"), element: <AdminV2RouteView routeId="advertising" page={AdminV2AdvertisingPage} /> },
  { path: adminRouteSegment("subscriptions"), element: <AdminV2RouteView routeId="subscriptions" page={AdminV2SubscriptionsPage} /> },
  { path: adminRouteSegment("audit"), element: <AdminV2RouteView routeId="audit" page={AdminV2AuditPage} /> },
  { path: adminRouteSegment("operations"), element: <AdminV2RouteView routeId="operations" page={AdminV2OperationsPage} /> },
  { path: adminRouteSegment("platform"), element: <AdminV2RouteView routeId="platform" page={AdminV2PlatformPage} /> },
  { path: adminRouteSegment("configuration"), element: <AdminV2RouteView routeId="configuration" page={AdminV2ConfigurationPage} /> },
];

export default adminV2Route;
