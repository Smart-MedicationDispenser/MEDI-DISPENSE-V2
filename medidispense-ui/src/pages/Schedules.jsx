import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../services/apiClient";
import SortableHeader from "../components/SortableHeader";
import { useTableControls } from "../hooks/useTableControls";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/schedules');
      setSchedules(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  const { search, setSearch, sort, toggleSort, paginated, filtered } = useTableControls(schedules, {
    searchFields: ["patient", "medication", "time"], sortDefault: { field: "time", dir: "asc" }, pageSize: 12, storageKey: "schedules",
  });

  return (
    <main className="main-content">
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="breadcrumb">MEDI-DISPENSE</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-active">Schedules</span>
        </div>
      </header>
      <section className="page-hero">
        <h1 className="page-title">Medication Schedule</h1>
        <p className="page-sub">View upcoming, missed, and completed doses.</p>
      </section>
      <div className="page-content">
        <div className="page-search-bar">
          <input className="page-search-input" type="text" placeholder="Search by patient, time..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="page-table-card">
          <table className="page-table">
            <thead>
              <tr>
                <SortableHeader field="time" label="Time" sort={sort} onSort={toggleSort} />
                <SortableHeader field="patient" label="Patient" sort={sort} onSort={toggleSort} />
                <SortableHeader field="prescriptionId" label="Rx ID" sort={sort} onSort={toggleSort} />
                <SortableHeader field="medication" label="Medication" sort={sort} onSort={toggleSort} />
                <SortableHeader field="deviceId" label="Device" sort={sort} onSort={toggleSort} />
                <SortableHeader field="status" label="Status" sort={sort} onSort={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="6" className="page-table-loading"><span className="spinner" /> Loading schedules…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan="6" className="page-table-empty">No schedules found.</td></tr>}
              {!loading && paginated.map(s => (
                <tr key={s.id} className="page-table-row">
                  <td className="page-table-mono">{s.time}</td>
                  <td className="page-table-name">{s.patient}</td>
                  <td className="page-table-id">{s.prescriptionId}</td>
                  <td>{s.medication}</td>
                  <td className="page-table-mono">{s.deviceId}</td>
                  <td><span className="page-status-chip">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
