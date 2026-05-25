export default function DeviceHealth() {
  return (
    <div className="device-health-card">
      <div className="card-header">
        <span className="card-header-title">Device Health</span>
        <span className="card-header-badge">LIVE</span>
      </div>

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
    </div>
  );
}
