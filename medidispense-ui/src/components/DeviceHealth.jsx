<<<<<<< HEAD
/**
 * DeviceHealth — Sprint 4
 *
 * Accepts live device counts as props from App.jsx.
 * Falls back to "—" when data is still loading.
 *
 * Props:
 *   online   number  — count of Online devices
 *   offline  number  — count of Offline devices
 *   low      number  — count of Battery Low devices
 *   loading  boolean — show skeleton while loading
 */
export default function DeviceHealth({ online = 0, offline = 0, low = 0, loading = false }) {
  const rows = [
    { label: "Online Devices", value: online,  dot: "online"  },
    { label: "Offline Devices", value: offline, dot: "offline" },
    { label: "Battery Low",     value: low,     dot: "warning" },
  ];

=======
export default function DeviceHealth() {
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  return (
    <div className="device-health-card">
      <div className="card-header">
        <span className="card-header-title">Device Health</span>
        <span className="card-header-badge">LIVE</span>
      </div>

<<<<<<< HEAD
      {rows.map(({ label, value, dot }) => (
        <div className="device-row" key={label}>
          <span className={`device-status-dot ${dot}`} aria-hidden="true" />
          <span className="device-name">{label}</span>
          <span className="device-uptime">
            {loading ? <span style={{ color: "var(--text-muted)", fontSize: 11 }}>—</span> : value}
          </span>
        </div>
      ))}
=======
      <div className="device-row">
        <span className="device-status-dot online" aria-hidden="true" />
        <span className="device-name">Online Devices</span>
        <span className="device-uptime">5</span>
      </div>

      <div className="device-row">
        <span className="device-status-dot offline" aria-hidden="true" />
        <span className="device-name">Offline Devices</span>
        <span className="device-uptime">1</span>
      </div>

      <div className="device-row">
        <span className="device-status-dot warning" aria-hidden="true" />
        <span className="device-name">Battery Low</span>
        <span className="device-uptime">1</span>
      </div>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
    </div>
  );
}
