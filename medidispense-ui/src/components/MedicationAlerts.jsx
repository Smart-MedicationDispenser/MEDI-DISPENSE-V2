export default function MedicationAlerts() {
  return (
    <div className="med-alert-card">
      <div className="card-header">
        <span className="card-header-title">Medication Alerts</span>
        <span className="card-header-badge">3 ACTIVE</span>
      </div>

      <div className="alert-row">
        <span className="alert-stripe warn" aria-hidden="true" />
        <div className="alert-body">
          <span className="alert-name">Metformin</span>
          <span className="alert-detail">Stock below ward threshold</span>
        </div>
        <span className="alert-chip warn">Low Stock</span>
      </div>

      <div className="alert-row">
        <span className="alert-stripe info" aria-hidden="true" />
        <div className="alert-body">
          <span className="alert-name">Insulin</span>
          <span className="alert-detail">Scheduled refill window</span>
        </div>
        <span className="alert-chip info">Refill Needed</span>
      </div>

      <div className="alert-row">
        <span className="alert-stripe critical" aria-hidden="true" />
        <div className="alert-body">
          <span className="alert-name">Paracetamol</span>
          <span className="alert-detail">Immediate review required</span>
        </div>
        <span className="alert-chip critical">Critical</span>
      </div>
    </div>
  );
}
