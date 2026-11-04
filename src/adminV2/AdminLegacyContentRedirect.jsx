import { Navigate, useParams } from "react-router-dom";

export default function AdminLegacyContentRedirect() {
  const { id } = useParams();
  const selected = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id ?? "") ? `?blogId=${id.toLowerCase()}` : "";
  return <Navigate to={`/admin-v2/content${selected}`} replace />;
}
