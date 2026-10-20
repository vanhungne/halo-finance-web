export function AdminV2State({ title, children, tone = "neutral", action }) {
  return <div className="admin-v2-state" data-tone={tone} role={tone === "danger" ? "alert" : undefined}>
    <strong>{title}</strong><div>{children}</div>{action}
  </div>;
}

export function AdminV2PageHeader({ title, description, freshness }) {
  return <div className="admin-v2-page-header">
    <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {freshness && <span className="admin-v2-freshness">{freshness}</span>}
  </div>;
}
