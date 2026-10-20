import { AlertTriangle } from "lucide-react";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";

export default function AdminV2CapabilityGapPage({ title = "Operations" }) {
  return <div className="admin-v2-content">
    <AdminV2PageHeader title={title} description="This surface is mapped in the Admin V2 navigation but its authoritative backend projection is not available yet." />
    <AdminV2State title="Backend contract required" tone="neutral">
      <span><AlertTriangle size={15} aria-hidden="true" /> The console will not create a client-side command or infer lifecycle state. See `docs/admin-contract-gaps.md` before opening this module.</span>
    </AdminV2State>
  </div>;
}
