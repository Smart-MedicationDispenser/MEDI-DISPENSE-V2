import { useState } from "react";

/* ─── Demo data ────────────────────────────────────────────────── */
const INITIAL_MEDS = [
  { id: "MED-201", name: "Metformin",     dosage: "500mg", stock: 24, threshold: 10, expiry: "2026-04-01", status: "OK"       },
  { id: "MED-202", name: "Paracetamol",   dosage: "1g",    stock:  5, threshold: 10, expiry: "2025-11-02", status: "Low Stock" },
  { id: "MED-203", name: "Insulin",       dosage: "10U",   stock: 12, threshold:  8, expiry: "2025-12-10", status: "OK"       },
  { id: "MED-204", name: "Amlodipine",    dosage: "5mg",   stock:  3, threshold:  6, expiry: "2025-10-01", status: "Critical"  },
  { id: "MED-205", name: "Atorvastatin",  dosage: "20mg",  stock: 31, threshold: 12, expiry: "2026-08-15", status: "OK"       },
  { id: "MED-206", name: "Metoprolol",    dosage: "25mg",  stock:  7, threshold: 10, expiry: "2025-10-20", status: "Low Stock" },
  { id: "MED-207", name: "Lisinopril",    dosage: "10mg",  stock: 18, threshold:  8, expiry: "2026-01-30", status: "OK"       },
  { id: "MED-208", name: "Omeprazole",    dosage: "20mg",  stock:  2, threshold:  8, expiry: "2025-09-05", status: "Critical"  },
  { id: "MED-209", name: "Amoxicillin",   dosage: "250mg", stock: 45, threshold: 15, expiry: "2026-06-12", status: "OK"       },
  { id: "MED-210", name: "Prednisolone",  dosage: "5mg",   stock:  6, threshold: 10, expiry: "2025-11-28", status: "Low Stock" },
];

/* ─── Status colour map ────────────────────────────────────────── */
const STATUS_MAP = {
  "OK":        { color: "var(--green)",  bg: "rgba(39,174,96,0.08)",   border: "rgba(39,174,96,0.20)"   },
  "Low Stock": { color: "var(--orange)", bg: "rgba(230,126,34,0.08)",  border: "rgba(230,126,34,0.20)"  },
  "Critical":  { color: "#E74C3C",       bg: "rgba(231,76,60,0.07)",   border: "rgba(231,76,60,0.18)"   },
};

/* ─── Stock level bar ──────────────────────────────────────────── */
function StockBar({ stock, threshold }) {
  const pct    = Math.min((stock / (threshold * 2)) * 100, 100);
  const isLow  = stock <= threshold;
  const isCrit = stock <= Math.floor(threshold / 2);
  const fill   = isCrit ? "#E74C3C" : isLow ? "var(--orange)" : "var(--green)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 80 }}>
      <div style={{
        flex: 1, height: 5, borderRadius: 10,
        background: "var(--bg-overlay)", border: "1px solid var(--border-dim)", overflow: "hidden",
      }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 10, background: fill, transition: "width 0.4s ease" }} />
      </div>
      <span className="page-table-mono" style={{ minWidth: 22, textAlign: "right" }}>{stock}</span>
    </div>
  );
}

/* ─── Action button ────────────────────────────────────────────── */
function ActionBtn({ label, variant, onClick }) {
  const styles = {
    view:   { color: "var(--cyan)",  bg: "rgba(58,141,255,0.08)", border: "rgba(58,141,255,0.20)" },
    edit:   { color: "var(--teal)",  bg: "rgba(74,163,162,0.08)", border: "rgba(74,163,162,0.20)" },
    delete: { color: "#E74C3C",      bg: "rgba(231,76,60,0.07)",  border: "rgba(231,76,60,0.18)"  },
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

function getMedicationStatus(stock, threshold) {
  const stockNum = Number(stock);
  const thresholdNum = Number(threshold);
  if (stockNum <= Math.floor(thresholdNum / 2)) return "Critical";
  if (stockNum <= thresholdNum) return "Low Stock";
  return "OK";
}

function ViewMedicationModal({ medication, onClose }) {
  if (!medication) return null;

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
            }}>Medication Details</div>
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

        <Row label="Name" value={medication.name} />
        <Row label="Dosage" value={medication.dosage} />
        <Row label="Stock" value={medication.stock} />
        <Row label="Threshold" value={medication.threshold} />
        <Row label="Expiry" value={medication.expiry} />

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

function EditMedicationModal({ editFormData, setEditFormData, onClose, onSave }) {
  const Field = ({ label, name, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={editFormData[name]}
        onChange={(e) => setEditFormData(prev => ({ ...prev, [name]: e.target.value }))}
        style={{
          padding: "9px 12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-soft)",
          background: "var(--bg-void)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--text-primary)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
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
          width: "100%", maxWidth: 480,
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>Edit Medication</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              Update inventory details · MEDI-DISPENSE
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Name" name="name" />
          <Field label="Dosage" name="dosage" />
          <Field label="Stock" name="stock" type="number" />
          <Field label="Threshold" name="threshold" type="number" />
          <Field label="Expiry" name="expiry" type="date" />
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-soft)", background: "var(--bg-overlay)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
            color: "var(--text-secondary)", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onSave} style={{
            padding: "9px 24px", borderRadius: "var(--radius-sm)",
            border: "none", background: "var(--teal)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(74,163,162,0.25)",
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function AddMedicationModal({ formData, setFormData, onClose, onSave }) {
  const Field = ({ label, name, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={formData[name]}
        onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
        style={{
          padding: "9px 12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-soft)",
          background: "var(--bg-void)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--text-primary)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
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
          width: "100%", maxWidth: 480,
          display: "flex", flexDirection: "column", gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>Add Medication</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              New inventory record · MEDI-DISPENSE
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Name" name="name" />
          <Field label="Dosage" name="dosage" />
          <Field label="Stock" name="stock" type="number" />
          <Field label="Threshold" name="threshold" type="number" />
          <Field label="Expiry" name="expiry" type="date" />
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-soft)", background: "var(--bg-overlay)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
            color: "var(--text-secondary)", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onSave} style={{
            padding: "9px 24px", borderRadius: "var(--radius-sm)",
            border: "none", background: "var(--cyan)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(58,141,255,0.25)",
          }}>Add Medication</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function Medications() {
  const [search, setSearch] = useState("");
  const [meds, setMeds]     = useState(INITIAL_MEDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    stock: "",
    threshold: "",
    expiry: "",
  });
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    dosage: "",
    stock: "",
    threshold: "",
    expiry: "",
  });

  /* Derived counts */
  const totalMeds     = meds.length;
  const lowStock      = meds.filter(m => m.status === "Low Stock").length;
  const critical      = meds.filter(m => m.status === "Critical").length;
  const dispensedToday = 47; // static demo value — replace with API data

  /* Search filter */
  const filtered = meds.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())   ||
    m.id.toLowerCase().includes(search.toLowerCase())     ||
    m.dosage.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => setMeds(prev => prev.filter(m => m.id !== id));
  const handleAddOpen = () => {
    setFormData({
      name: "",
      dosage: "",
      stock: "",
      threshold: "",
      expiry: "",
    });
    setShowAddModal(true);
  };
  const handleView = (med) => {
    setSelectedMedication(med);
    setShowViewModal(true);
  };
  const handleEdit = (med) => {
    setSelectedMedication(med);
    setEditFormData({
      name: med.name,
      dosage: med.dosage,
      stock: med.stock,
      threshold: med.threshold,
      expiry: med.expiry,
    });
    setShowEditModal(true);
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedMedication(null);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedMedication(null);
    setEditFormData({ name: "", dosage: "", stock: "", threshold: "", expiry: "" });
  };
  const closeAddModal = () => {
    setShowAddModal(false);
  };
  const handleAddSave = () => {
    const stock = Number(formData.stock);
    const threshold = Number(formData.threshold);
    const newMed = {
      id: "M-" + Date.now(),
      ...formData,
      stock,
      threshold,
      status: getMedicationStatus(stock, threshold),
    };

    setMeds(prev => [...prev, newMed]);
    setShowAddModal(false);
  };
  const handleSaveEdit = () => {
    if (!selectedMedication) return;

    const nextMedication = {
      ...editFormData,
      stock: Number(editFormData.stock),
      threshold: Number(editFormData.threshold),
    };

    setMeds(prev =>
      prev.map(item =>
        item.id === selectedMedication.id
          ? {
              ...item,
              ...nextMedication,
              status: getMedicationStatus(nextMedication.stock, nextMedication.threshold),
            }
          : item
      )
    );

    closeEditModal();
  };

  return (
    <>
      {showAddModal && (
        <AddMedicationModal
          formData={formData}
          setFormData={setFormData}
          onClose={closeAddModal}
          onSave={handleAddSave}
        />
      )}

      {showViewModal && (
        <ViewMedicationModal
          medication={selectedMedication}
          onClose={closeViewModal}
        />
      )}

      {showEditModal && (
        <EditMedicationModal
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}

      <main className="main-content page-main">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="breadcrumb">MEDI-DISPENSE</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-active">Medications</span>
        </div>
        <div className="dash-header-right">
          <div className="status-pill">
            <span className="pulse-dot" />
            {critical} Critical
          </div>
          <button className="page-add-btn" onClick={handleAddOpen}>+ Add Medication</button>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="dash-hero">
        <div className="hero-line" />
        <div className="hero-text">
          <h1 className="hero-title">Medication Inventory</h1>
          <p className="hero-sub">
            Hospital pharmacy stock · IoT dispenser supply · Expiry tracking
          </p>
        </div>
        <div className="hero-badge">{totalMeds} TOTAL</div>
      </section>

      {/* ── Summary chips ───────────────────────────────────────── */}
      <div className="page-summary-row">
        <div className="page-summary-chip page-summary-chip--default">
          <span className="page-summary-val">{totalMeds}</span>
          <span className="page-summary-lbl">TOTAL MEDS</span>
        </div>
        <div className="page-summary-chip page-summary-chip--orange">
          <span className="page-summary-val">{lowStock}</span>
          <span className="page-summary-lbl">LOW STOCK</span>
        </div>
        <div className="page-summary-chip" style={{ borderColor: "rgba(231,76,60,0.20)" }}>
          <span className="page-summary-val" style={{ color: "#E74C3C" }}>{critical}</span>
          <span className="page-summary-lbl">CRITICAL</span>
        </div>
        <div className="page-summary-chip page-summary-chip--green">
          <span className="page-summary-val">{dispensedToday}</span>
          <span className="page-summary-lbl">DISPENSED TODAY</span>
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
          placeholder="Search medication by name, ID or dosage…"
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
              <th>Medication ID</th>
              <th>Name</th>
              <th>Dosage</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const s = STATUS_MAP[m.status] || STATUS_MAP["OK"];
              return (
                <tr key={m.id} className="page-table-row">
                  <td className="page-table-id">{m.id}</td>
                  <td className="page-table-name">{m.name}</td>
                  <td>
                    <span className="page-ward-chip">{m.dosage}</span>
                  </td>
                  <td>
                    <StockBar stock={m.stock} threshold={m.threshold} />
                  </td>
                  <td className="page-table-mono">{m.threshold}</td>
                  <td className="page-table-mono">{m.expiry}</td>
                  <td>
                    <span
                      className="page-status-chip"
                      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div className="page-action-group">
                      <ActionBtn label="View"   variant="view"   onClick={() => handleView(m)} />
                      <ActionBtn label="Edit"   variant="edit"   onClick={() => handleEdit(m)} />
                      <ActionBtn label="Delete" variant="delete" onClick={() => handleDelete(m.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="page-table-empty">
                  No medications match your search.
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
