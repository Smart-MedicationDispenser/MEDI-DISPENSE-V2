import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import "./App.css";
import DispenseChart from "./components/DispenseChart";
import DeviceHealth from "./components/DeviceHealth";
import MedicationAlerts from "./components/MedicationAlerts";
import WardNurse from "./components/WardNurse";
import {  Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Patients from "./pages/Patients"
import Medications from "./pages/Medications"
import Devices from "./pages/Devices"
import Alerts from "./pages/Alerts"
import { useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

// SVG Icons
const IconPatients = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconDevices = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
    <circle cx="12" cy="10" r="2"/>
    <path d="M12 6v2M12 12v2M8 10h2M14 10h2"/>
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconDispense = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

function ProfileModal({ onClose }) {
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
        onClick={(e) => e.stopPropagation()}
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
            }}>Profile</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              User details · MEDI-DISPENSE
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

        <Row label="Name" value="Dr. System Admin" />
        <Row label="Role" value="Ward Monitor" />
        <Row label="Status" value="Online" />

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

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  const [time, setTime] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [stats, setStats] = useState({
    patients: 0,
    devices: 0,
    lowstockMedications: 0,
    todayDispenses: 0,
  });
  const [dashboardReady, setDashboardReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [patientsRes, devicesRes, alertsRes] = await Promise.all([
          fetch(`${API_BASE}/patients`),
          fetch(`${API_BASE}/devices`),
          fetch(`${API_BASE}/alerts`),
        ]);

        if (cancelled) return;

        const patients = await patientsRes.json();
        const devices = await devicesRes.json();
        const alerts = await alertsRes.json();

        const patientList = Array.isArray(patients) ? patients : [];
        const deviceList = Array.isArray(devices) ? devices : [];
        const alertList = Array.isArray(alerts) ? alerts : [];

        const onlineDevices = deviceList.filter((d) => d.status === "online").length;

        setStats({
          patients: patientList.length,
          devices: onlineDevices,
          lowstockMedications: alertList.length,
          todayDispenses: 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        if (!cancelled) {
          setStats({
            patients: 0,
            devices: 0,
            lowstockMedications: 0,
            todayDispenses: 0,
          });
        }
      } finally {
        if (!cancelled) setDashboardReady(true);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: "Total Patients",
      value: stats.patients,
      icon: <IconPatients />,
      accent: "#00d4ff",
      glow: "rgba(0,212,255,0.15)",
      tag: "REGISTERED",
    },
    {
      label: "Active Devices",
      value: stats.devices,
      icon: <IconDevices />,
      accent: "#00ff9d",
      glow: "rgba(0,255,157,0.15)",
      tag: "ONLINE",
    },
    {
      label: "Low Stock Alerts",
      value: stats.lowstockMedications,
      icon: <IconAlert />,
      accent: "#ff6b35",
      glow: "rgba(255,107,53,0.15)",
      tag: "CRITICAL",
    },
    {
      label: "Today's Dispenses",
      value: stats.todayDispenses,
      icon: <IconDispense />,
      accent: "#b06fff",
      glow: "rgba(176,111,255,0.15)",
      tag: "TODAY",
    },
  ];

  return (
    <div className="app-shell">
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      <Sidebar onProfileClick={() => setShowProfileModal(true)} />

      <Routes>
          <Route path="/" element={null} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>

      {isDashboard && (
      <main className="main-content">

        {/* Header */}
        <header className="dash-header">
          <div className="dash-header-left">
            <span className="breadcrumb">MEDI-DISPENSE</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-active">Dashboard</span>
          </div>

          <div className="dash-header-right">
            <div className="status-pill">
              <span className="pulse-dot" />
              System Online
            </div>

            <div className="time-display">
              {time}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="dash-hero">
          <div className="hero-line" />

          <div className="hero-text">
            <h1 className="hero-title">System Overview</h1>
            <p className="hero-sub">
              Real-time telemetry · Ward monitoring · Dispense analytics
            </p>
          </div>

          <div className="hero-badge">LIVE</div>
        </section>

        {/* Stat Cards */}
        <section className="cards-grid">
          {!dashboardReady ? (
            <div
              className="stat-card"
              style={{ gridColumn: "1 / -1", textAlign: "center", padding: "28px 20px" }}
            >
              <span className="chart-sub">Loading dashboard data…</span>
            </div>
          ) : (
            cards.map((card, i) => (
              <StatCard key={card.label} {...card} index={i} />
            ))
          )}
        </section>

        <DispenseChart />

        {/* Bottom row */}
        <div className="bottom-row">

          {/* Activity */}
          <section className="activity-strip">
            <div className="strip-header">
              <span className="strip-title">Recent Activity</span>
              <span className="strip-dot" />
              <span className="strip-live">Live Feed</span>
            </div>

            <div className="activity-rows">
              {[
                { time: "08:42", msg: "Slot 3 — Metformin 500mg dispensed", type: "ok" },
                { time: "08:30", msg: "Device DEV-7F3A — Heartbeat received", type: "info" },
                { time: "08:15", msg: "Slot 6 — Stock below threshold (3 units)", type: "warn" },
                { time: "08:00", msg: "Paracetamol 1000mg scheduled for Ward 3B", type: "ok" },
                { time: "07:55", msg: "Patient Ahmad Faris — Dose confirmed ✓", type: "ok" },
              ].map((row, i) => (
                <div className="activity-row" key={i} style={{ "--row-i": i }}>
                  <span className={`row-indicator row-${row.type}`} />
                  <span className="row-time">{row.time}</span>
                  <span className="row-msg">{row.msg}</span>
                  <span className={`row-badge badge-${row.type}`}>
                    {row.type === "ok" ? "OK" : row.type === "warn" ? "WARN" : "INFO"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="qs-header">System Stats</div>

            <div className="qs-row">
              <span className="qs-label">Devices Online</span>
              <span className="qs-value">{dashboardReady ? stats.devices : "—"}</span>
            </div>

            <div className="qs-row">
              <span className="qs-label">Patients</span>
              <span className="qs-value">{dashboardReady ? stats.patients : "—"}</span>
            </div>

            <div className="qs-row">
              <span className="qs-label">Low Stock</span>
              <span className="qs-value">{dashboardReady ? stats.lowstockMedications : "—"}</span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="dash-footer">
          <span>MEDI-DISPENSE v1.1</span>
          <span className="footer-sep">·</span>
          <span>AI-Powered Medication Monitoring</span>
          <span className="footer-sep">·</span>
          <span>© 2025</span>
        </footer>

      </main>
      )}

      {/* RIGHT PANEL — sibling of main-content, third grid column */}
      {isDashboard && (
      <aside className="right-panel">
        <DeviceHealth />
        <MedicationAlerts />
        <WardNurse />
      </aside>
      )}

    </div>
  );
}

export default App;
