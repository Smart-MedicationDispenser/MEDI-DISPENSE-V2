import { useState } from "react";

/* ─── Demo data ────────────────────────────────────────────────── */
const INITIAL_ALERTS = [
  { id: "ALR-301", type: "Medication", patient: "Ahmad Faris",   device: "DEV-7F3A", ward: "Ward 3B",  desc: "Missed dose detected",         time: "09:32", status: "Active"   },
  { id: "ALR-302", type: "Device",     patient: "—",             device: "DEV-9A12", ward: "Ward 2A",  desc: "Device offline",               time: "09:20", status: "Critical" },
  { id: "ALR-303", type: "Medication", patient: "Sarah Khan",    device: "DEV-5C8D", ward: "Ward 4C",  desc: "Low medication stock",          time: "08:55", status: "Active"   },
  { id: "ALR-304", type: "Device",     patient: "—",             device: "DEV-2B19", ward: "Ward ICU", desc: "Battery below 15%",             time: "08:40", status: "Warning"  },
  { id: "ALR-305", type: "Medication", patient: "Nurul Huda",    device: "DEV-1E4F", ward: "Ward 1D",  desc: "Overdose threshold exceeded",   time: "08:22", status: "Critical" },
  { id: "ALR-306", type: "Device",     patient: "—",             device: "DEV-4F6E", ward: "Ward 2A",  desc: "Heartbeat timeout (>10 min)",   time: "08:10", status: "Warning"  },
  { id: "ALR-307", type: "Medication", patient: "Lee Chong Wei", device: "DEV-3C7B", ward: "Ward 5B",  desc: "Medication slot empty",         time: "07:58", status: "Active"   },
  { id: "ALR-308", type: "Device",     patient: "—",             device: "DEV-8D2A", ward: "Ward 3B",  desc: "Sensor calibration failed",     time: "07:45", status: "Resolved" },
  { id: "ALR-309", type: "Medication", patient: "Priya Nair",    device: "DEV-6A1C", ward: "Ward ICU", desc: "Dose dispensed without confirm",time: "07:30", status: "Resolved" },
  { id: "ALR-310", type: "Device",     patient: "—",             device: "DEV-7E8A", ward: "Ward 5B",  desc: "Battery critical — 8%",         time: "07:15", status: "Warning"  },
];

/* ─── Status colour map ────────────────────────────────────────── */
const STATUS_MAP = {
  Active:   { color: "var(--cyan)",   bg: "rgba(58,141,255,0.08)",  border: "rgba(58,141,255,0.20)"  },
  Warning:  { color: "var(--orange)", bg: "rgba(230,126,34,0.08)",  border: "rgba(230,126,34,0.20)"  },
  Critical: { color: "#E74C3C",       bg: "rgba(231,76,60,0.07)",   border: "rgba(231,76,60,0.18)"   },
  Resolved: { color: "var(--green)",  bg: "rgba(39,174,96,0.08)",   border: "rgba(39,174,96,0.20)"   },
};

/* ─── Type colour map ──────────────────────────────────────────── */
const TYPE_MAP = {
  Medication: { color: "var(--violet)", bg: "rgba(142,140,255,0.08)", border: "rgba(142,140,255,0.20)" },
  Device:     { color: "var(--teal)",   bg: "rgba(74,163,162,0.08)",  border: "rgba(74,163,162,0.20)"  },
};

/* ─── Alert type icon ──────────────────────────────────────────── */
function TypeIcon({ type }) {
  if (type === "Medication") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        width="13" height="13" style={{ flexShrink: 0 }}>
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      width="13" height="13" style={{ flexShrink: 0 }}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

/* ─── Action button ────────────────────────────────────────────── */
function ActionBtn({ label, variant, onClick }) {
  const styles = {
    view:    { color: "var(--cyan)",   bg: "rgba(58,141,255,0.08)", border: "rgba(58,141,255,0.20)" },
    resolve: { color: "var(--green)",  bg: "rgba(39,174,96,0.08)",  border: "rgba(39,174,96,0.20)"  },
    ignore:  { color: "var(--text-muted)", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.20)" },
  };
  const s = styles[variant];
  return (
    <button
      className="page-action-btn"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ViewAlertModal({ alert, onClose }) {
  if (!alert) return null;

  const Row = ({ label, value }) => (
    <div style={{
      display: "flex", alignItems: "flex-start",
      padding: "12px 0", borderBottom: "1px solid var(--border-dim)",
      gap: 16,
    }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase",
        minWidth: 110, paddingTop: 2, flexShrink: 0,
      }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-primary)", flex: 1 }}>
        {value}
      </span>
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(44,62,80,0.35)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 64px rgba(44,62,80,0.18)",
          padding: "32px 28px 28px",
          width: "100%", maxWidth: 440,
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>Alert Details</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              Read-only record · MEDI-DISPENSE
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ height: 1, background: "var(--border-dim)", marginBottom: 4 }} />

        <Row label="Alert ID" value={alert.id} />
        <Row label="Type" value={alert.type} />
        <Row label="Message" value={alert.desc} />
        <Row label="Status" value={alert.status} />
        <Row label="Timestamp" value={alert.time} />

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 28px", borderRadius: "var(--radius-sm)",
            border: "none", background: "var(--cyan)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(58,141,255,0.25)",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function Alerts() {
  const [search, setSearch]   = useState("");
  const [alerts, setAlerts]   = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  /* Derived counts */
  const active     = alerts.filter(a => a.status !== "Resolved").length;
  const critical   = alerts.filter(a => a.status === "Critical").length;
  const deviceAlts = alerts.filter(a => a.type === "Device" && a.status !== "Resolved").length;
  const medAlts    = alerts.filter(a => a.type === "Medication" && a.status !== "Resolved").length;

  /* Search filter */
  const filtered = alerts.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.device.toLowerCase().includes(search.toLowerCase())  ||
    a.type.toLowerCase().includes(search.toLowerCase())    ||
    a.desc.toLowerCase().includes(search.toLowerCase())    ||
    a.ward.toLowerCase().includes(search.toLowerCase())
  );

  const handleResolve = (id) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "Resolved" } : a));

  const handleIgnore = (id) =>
    setAlerts(prev => prev.filter(a => a.id !== id));
  const handleView = (alert) => {
    setSelectedAlert(alert);
    setShowViewModal(true);
  };

  return (
    <>
      {showViewModal && (
        <ViewAlertModal
          alert={selectedAlert}
          onClose={() => setShowViewModal(false)}
        />
      )}

      <main className="main-content page-main">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="breadcrumb">MEDI-DISPENSE</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-active">Alerts</span>
        </div>
        <div className="dash-header-right">
          <div className="status-pill" style={{
            color: critical > 0 ? "#E74C3C" : "var(--green)",
            background: critical > 0 ? "rgba(231,76,60,0.08)" : "rgba(39,174,96,0.08)",
            border: `1px solid ${critical > 0 ? "rgba(231,76,60,0.20)" : "rgba(39,174,96,0.20)"}`,
          }}>
            <span className="pulse-dot" style={{ background: critical > 0 ? "#E74C3C" : "var(--green)" }} />
            {critical > 0 ? `${critical} Critical` : "All Clear"}
          </div>
          <button className="page-add-btn">+ Create Alert</button>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="dash-hero">
        <div className="hero-line" style={{ background: `linear-gradient(to bottom, ${critical > 0 ? "#E74C3C" : "var(--cyan)"}, transparent)` }} />
        <div className="hero-text">
          <h1 className="hero-title">System Alerts</h1>
          <p className="hero-sub">
            Medication warnings · Device issues · Patient safety monitoring
          </p>
        </div>
        <div className="hero-badge" style={critical > 0 ? {
          color: "#E74C3C",
          background: "rgba(231,76,60,0.08)",
          border: "1px solid rgba(231,76,60,0.20)",
        } : {}}>
          {active > 0 ? `${active} ACTIVE` : "ALL CLEAR"}
        </div>
      </section>

      {/* ── Summary chips ───────────────────────────────────────── */}
      <div className="page-summary-row">
        <div className="page-summary-chip page-summary-chip--blue">
          <span className="page-summary-val">{active}</span>
          <span className="page-summary-lbl">ACTIVE</span>
        </div>
        <div className="page-summary-chip" style={{ borderColor: "rgba(231,76,60,0.20)" }}>
          <span className="page-summary-val" style={{ color: "#E74C3C" }}>{critical}</span>
          <span className="page-summary-lbl">CRITICAL</span>
        </div>
        <div className="page-summary-chip" style={{ borderColor: "rgba(74,163,162,0.20)" }}>
          <span className="page-summary-val" style={{ color: "var(--teal)" }}>{deviceAlts}</span>
          <span className="page-summary-lbl">DEVICE</span>
        </div>
        <div className="page-summary-chip" style={{ borderColor: "rgba(142,140,255,0.20)" }}>
          <span className="page-summary-val" style={{ color: "var(--violet)" }}>{medAlts}</span>
          <span className="page-summary-lbl">MEDICATION</span>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="page-search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="page-search-input"
          type="text"
          placeholder="Search alerts by patient, device or alert type…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="page-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* ── Table card ──────────────────────────────────────────── */}
      <div className="page-table-card">
        <table className="page-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Type</th>
              <th>Patient</th>
              <th>Device</th>
              <th>Ward</th>
              <th>Description</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const st = STATUS_MAP[a.status] || STATUS_MAP.Active;
              const tp = TYPE_MAP[a.type]     || TYPE_MAP.Device;
              const isResolved = a.status === "Resolved";
              return (
                <tr key={a.id} className="page-table-row" style={{ opacity: isResolved ? 0.55 : 1 }}>
                  <td className="page-table-id">{a.id}</td>
                  <td>
                    <span
                      className="page-status-chip"
                      style={{
                        color: tp.color, background: tp.bg, border: `1px solid ${tp.border}`,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <TypeIcon type={a.type} />
                      {a.type}
                    </span>
                  </td>
                  <td className="page-table-name" style={{ color: a.patient === "—" ? "var(--text-muted)" : undefined }}>
                    {a.patient}
                  </td>
                  <td className="page-table-id">{a.device}</td>
                  <td>
                    <span className="page-ward-chip">{a.ward}</span>
                  </td>
                  <td className="page-table-mono" style={{
                    fontSize: 12, color: "var(--text-secondary)",
                    maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {a.desc}
                  </td>
                  <td className="page-table-mono">{a.time}</td>
                  <td>
                    <span
                      className="page-status-chip"
                      style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="page-action-group">
                      <ActionBtn label="View"    variant="view"    onClick={() => handleView(a)} />
                      {!isResolved && (
                        <ActionBtn label="Resolve" variant="resolve" onClick={() => handleResolve(a.id)} />
                      )}
                      <ActionBtn label="Ignore"  variant="ignore"  onClick={() => handleIgnore(a.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="page-table-empty">
                  No alerts match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="dash-footer">
        <span>MEDI-DISPENSE v1.1</span>
        <span className="footer-sep">·</span>
        <span>AI-Powered Medication Monitoring</span>
        <span className="footer-sep">·</span>
        <span>© 2025</span>
      </footer>

      </main>
    </>
  );
}
