import { Component, Suspense } from "react";
import { AdminV2State } from "./AdminV2State";
import { useAdminLocale } from "./AdminV2LocaleContext";

function PageLoading() {
  const { t } = useAdminLocale();
  return <div className="admin-v2-content" role="status" aria-busy="true">
    <AdminV2State title={t("route.loading")}>{t("route.loadingDescription")}</AdminV2State>
  </div>;
}

function PageFailure() {
  const { t } = useAdminLocale();
  return <div className="admin-v2-content">
    <AdminV2State title={t("route.failed")} tone="danger" action={
      <button type="button" className="admin-v2-primary-button" onClick={() => window.location.reload()}>{t("route.reload")}</button>
    }>{t("route.failedDescription")}</AdminV2State>
  </div>;
}

class PageBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <PageFailure /> : this.props.children; }
}

/** Loading/render failure replaces the page; the session, shell and recovery stay mounted. */
export default function AdminV2RouteView({ page, routeId }) {
  const Page = page;
  return <PageBoundary key={routeId}><Suspense fallback={<PageLoading />}><Page /></Suspense></PageBoundary>;
}
