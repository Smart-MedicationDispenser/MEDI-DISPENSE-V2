<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../services/apiClient";
import ActionBtn from "../components/ActionBtn";       /* S3 — shared component    */
import FormField from "../components/FormField";       /* S4 — shared component    */
import { ModalShell, ModalHeader, ModalRow } from "../components/ModalShell"; /* S5 + S6 */
import ConfirmDialog from "../components/ConfirmDialog"; /* Sprint 3 — confirm delete */
import SortableHeader from "../components/SortableHeader";
import FilterPills from "../components/FilterPills";
import { useTableControls } from "../hooks/useTableControls";
import { notifier } from "../services/NotificationService";

function normalizePatient(raw) {
  return {
    id:         raw.id,
    name:       raw.name       ?? "",
    ward:       raw.ward       ?? "",
    medication: raw.medication ?? "",
    next:       raw.next       ?? "—",
    status:     raw.status     ?? "Active",
=======
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

function normalizePatient(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "",
    ward: raw.ward ?? "",
    medication: raw.medication ?? "",
    next: raw.next ?? "—",
    status: raw.status ?? "Active",
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  };
}

/* ─── Status colour map ────────────────────────────────────────── */
const STATUS_MAP = {
  Active:    { color: "var(--green)",  bg: "rgba(39,174,96,0.08)",   border: "rgba(39,174,96,0.20)"   },
  Scheduled: { color: "var(--cyan)",   bg: "rgba(58,141,255,0.08)",  border: "rgba(58,141,255,0.20)"  },
  Missed:    { color: "var(--orange)", bg: "rgba(230,126,34,0.08)",  border: "rgba(230,126,34,0.20)"  },
};

<<<<<<< HEAD


=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
/* ─── Feature 1: Countdown helper ─────────────────────────────── */
function calculateTimeLeft(nextDose, now) {
  if (!nextDose || nextDose === "—") return { label: "No Schedule", color: "var(--text-muted)" };

  const [hStr, mStr] = nextDose.split(":");
  if (!hStr || !mStr) return { label: "No Schedule", color: "var(--text-muted)" };

  const dose = new Date(now);
  dose.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

  const diffMs   = dose - now;
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0)  return { label: "Due Now",     color: "#E74C3C" };

  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;

  if (h === 0)        return { label: `${m}m left`,        color: diffMins <= 30 ? "var(--orange)" : "var(--text-secondary)" };
                      return { label: `${h}h ${m}m left`,  color: "var(--text-secondary)" };
}

<<<<<<< HEAD
/* ─── Feature 2: View Patient Modal ─────────────────────────────
   S5 — uses ModalShell + ModalHeader + ModalRow (shared components)
   S6 — Escape key handled automatically by ModalShell              */
=======
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

/* ─── FormField — module-level to keep identity stable ────────── */
function FormField({ label, value, onChange, placeholder, error, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase",
      }}>
        {label}{error && <span style={{ color: "#E74C3C", marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: "9px 12px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${error ? "#E74C3C" : "var(--border-soft)"}`,
          background: "var(--bg-void)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--text-primary)",
          outline: "none",
          transition: "border-color 0.16s ease",
          width: "100%",
          boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = "var(--cyan)"; }}
        onBlur={e  => { e.target.style.borderColor = error ? "#E74C3C" : "var(--border-soft)"; }}
      />
    </div>
  );
}

/* ─── Feature 2: View Patient Modal ───────────────────────────── */
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
function ViewPatientModal({ patient, now, onClose }) {
  if (!patient) return null;

  const s = STATUS_MAP[patient.status] || STATUS_MAP.Scheduled;
  const { label: timeLabel, color: timeColor } = calculateTimeLeft(patient.next, now);

<<<<<<< HEAD
  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <ModalHeader title="Patient Details" sub="Read-only record · MEDI-DISPENSE" onClose={onClose} />

      <ModalRow label="Patient ID">
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontSize: 12 }}>
          {patient.id}
        </span>
      </ModalRow>
      <ModalRow label="Name">{patient.name}</ModalRow>
      <ModalRow label="Ward">
        <span className="page-ward-chip">{patient.ward}</span>
      </ModalRow>
      <ModalRow label="Medication">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{patient.medication}</span>
      </ModalRow>
      <ModalRow label="Next Dose">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: timeColor }}>
          {patient.next !== "—" ? `${patient.next}  ·  ${timeLabel}` : timeLabel}
        </span>
      </ModalRow>
      <ModalRow label="Status">
        <span className="page-status-chip" style={{
          color: s.color, background: s.bg, border: `1px solid ${s.border}`,
        }}>
          {patient.status}
        </span>
      </ModalRow>

      {/* Close button */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{
          padding: "9px 28px", borderRadius: "var(--radius-sm)",
          border: "none", background: "var(--cyan)",
          fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
          color: "#fff", cursor: "pointer",
          boxShadow: "0 2px 10px rgba(58,141,255,0.25)",
        }}>Close</button>
      </div>
    </ModalShell>
  );
}

/* ─── Edit Patient Modal ─────────────────────────────────────────
   Sprint 3 — onSave now calls PUT /patients/:id via the page.
   Shows saving state + server-side error inside the modal.
   S4 — shared FormField
   S5/S6 — ModalShell (backdrop + Escape key)                     */
=======
  const Row = ({ label, children }) => (
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
        {children}
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
          display: "flex", flexDirection: "column", gap: 0,
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>Patient Details</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              Read-only record · MEDI-DISPENSE
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>✕</button>
        </div>

        <div style={{ height: 1, background: "var(--border-dim)", marginBottom: 4 }} />

        {/* Detail rows */}
        <Row label="Patient ID">
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontSize: 12 }}>
            {patient.id}
          </span>
        </Row>
        <Row label="Name">{patient.name}</Row>
        <Row label="Ward">
          <span className="page-ward-chip">{patient.ward}</span>
        </Row>
        <Row label="Medication">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{patient.medication}</span>
        </Row>
        <Row label="Next Dose">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: timeColor }}>
            {patient.next !== "—" ? `${patient.next}  ·  ${timeLabel}` : timeLabel}
          </span>
        </Row>
        <Row label="Status">
          <span className="page-status-chip" style={{
            color: s.color, background: s.bg, border: `1px solid ${s.border}`,
          }}>
            {patient.status}
          </span>
        </Row>

        {/* Close button */}
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

/* ─── Edit Patient Modal ───────────────────────────────────────── */
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
function EditPatientModal({ patient, onClose, onSave }) {
  const [editName,       setEditName]       = useState(patient.name);
  const [editWard,       setEditWard]       = useState(patient.ward);
  const [editMedication, setEditMedication] = useState(patient.medication);
  const [editNext,       setEditNext]       = useState(patient.next === "—" ? "" : patient.next);
  const [errors,         setErrors]         = useState({});
<<<<<<< HEAD
  const [saving,         setSaving]         = useState(false);
  const [saveError,      setSaveError]      = useState(null);
=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04

  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: false }));

  const validate = () => {
    const e = {};
    if (!editName.trim())       e.name       = true;
    if (!editWard.trim())       e.ward       = true;
    if (!editMedication.trim()) e.medication = true;
<<<<<<< HEAD
    /* next dose format check */
    const next = editNext.trim();
    if (next && next !== "—" && !/^\d{1,2}:\d{2}$/.test(next)) {
      e.next = true;
    }
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    setSaveError(null);

    const result = await onSave({
=======
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
      name:       editName.trim(),
      ward:       editWard.trim(),
      medication: editMedication.trim(),
      next:       editNext.trim() || "—",
    });
<<<<<<< HEAD

    setSaving(false);

    if (result?.error) {
      setSaveError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth={480} gap={20}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>Edit Patient</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
            {patient.id} · MEDI-DISPENSE
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
          color: "var(--text-muted)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
        }}>✕</button>
      </div>

      <div style={{ height: 1, background: "var(--border-dim)" }} />

      {/* Server-side save error */}
      {saveError && (
        <p style={{
          margin: 0, fontSize: 13, color: "#E74C3C",
          padding: "8px 12px", borderRadius: "var(--radius-sm)",
          background: "rgba(231,76,60,0.07)", border: "1px solid rgba(231,76,60,0.18)",
        }}>{saveError}</p>
      )}

      {/* Fields — S4: shared FormField */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FormField
          label="Full Name"
          value={editName}
          onChange={e => { setEditName(e.target.value); clearError("name"); setSaveError(null); }}
          placeholder="e.g. Ahmad Faris"
          error={errors.name}
        />
        <FormField
          label="Ward"
          value={editWard}
          onChange={e => { setEditWard(e.target.value); clearError("ward"); setSaveError(null); }}
          placeholder="e.g. 3B"
          error={errors.ward}
        />
        <FormField
          label="Medication"
          value={editMedication}
          onChange={e => { setEditMedication(e.target.value); clearError("medication"); setSaveError(null); }}
          placeholder="e.g. Metformin 500mg"
          error={errors.medication}
        />
        <FormField
          label="Next Dose (HH:MM, optional)"
          value={editNext}
          onChange={e => { setEditNext(e.target.value); clearError("next"); setSaveError(null); }}
          placeholder="e.g. 09:00"
          error={errors.next}
          helpText={errors.next ? "Must be in HH:MM format" : ""}
        />
      </div>

      <div style={{ height: 1, background: "var(--border-dim)" }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} disabled={saving} style={{
          padding: "9px 20px", borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-soft)", background: "var(--bg-overlay)",
          fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
          color: "var(--text-secondary)", cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.55 : 1,
        }}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{
          padding: "9px 24px", borderRadius: "var(--radius-sm)",
          border: "none", background: "var(--teal)",
          fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
          color: "#fff", cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.75 : 1,
          boxShadow: "0 2px 10px rgba(74,163,162,0.25)",
          minWidth: 110,
        }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </ModalShell>
=======
    onClose();
  };

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
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>Edit Patient</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
              {patient.id} · MEDI-DISPENSE
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}>✕</button>
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField
            label="Full Name"
            value={editName}
            onChange={e => { setEditName(e.target.value); clearError("name"); }}
            placeholder="e.g. Ahmad Faris"
            error={errors.name}
          />
          <FormField
            label="Ward"
            value={editWard}
            onChange={e => { setEditWard(e.target.value); clearError("ward"); }}
            placeholder="e.g. 3B"
            error={errors.ward}
          />
          <FormField
            label="Medication"
            value={editMedication}
            onChange={e => { setEditMedication(e.target.value); clearError("medication"); }}
            placeholder="e.g. Metformin 500mg"
            error={errors.medication}
          />
          <FormField
            label="Next Dose"
            value={editNext}
            onChange={e => setEditNext(e.target.value)}
            placeholder="e.g. 09:00 (optional)"
            error={false}
          />
        </div>

        <div style={{ height: 1, background: "var(--border-dim)" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-soft)", background: "var(--bg-overlay)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
            color: "var(--text-secondary)", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: "9px 24px", borderRadius: "var(--radius-sm)",
            border: "none", background: "var(--teal)",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(74,163,162,0.25)",
          }}>Save Changes</button>
        </div>
      </div>
    </div>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function Patients() {
  const [patients,         setPatients]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [fetchError,       setFetchError]       = useState(null);
<<<<<<< HEAD
  const [showModal,        setShowModal]        = useState(false);
  const [formData,         setFormData]         = useState({
    name: "", ward: "", medication: "",
=======
  const [search,           setSearch]           = useState("");
  const [showModal,        setShowModal]        = useState(false);
  const [formData,         setFormData]         = useState({
    name: "",
    ward: "",
    medication: "",
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  });
  const [addErrors,        setAddErrors]        = useState({});
  const [addSubmitting,    setAddSubmitting]    = useState(false);
  const [addError,         setAddError]         = useState(null);
  const [selectedPatient,  setSelectedPatient]  = useState(null);
  const [editingPatient,   setEditingPatient]   = useState(null);
<<<<<<< HEAD
  const [now,              setNow]              = useState(new Date());

  /* Sprint 3 — confirmation pending: { patient } | null */
  const [deletePending, setDeletePending] = useState(null);

  /* ── Load patients ──────────────────────────────────────────── */
  const loadPatients = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient.get('/patients');
      const list = Array.isArray(data) ? data : [];
      setPatients(list.map(normalizePatient));
    } catch (e) {
      setFetchError(e.message || "Could not load patients.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPatients(); }, [loadPatients]);
=======
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let cancelled = false;

    async function loadPatients() {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API_BASE}/patients`);
        if (!res.ok) throw new Error("Could not load patients.");
        const data = await res.json();
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setPatients(list.map(normalizePatient));
      } catch (e) {
        if (!cancelled) {
          setFetchError(e.message || "Could not load patients.");
          setPatients([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPatients();
    return () => {
      cancelled = true;
    };
  }, []);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

<<<<<<< HEAD
=======
  /* Derived counts */
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  const active    = patients.filter(p => p.status === "Active").length;
  const scheduled = patients.filter(p => p.status === "Scheduled").length;
  const missed    = patients.filter(p => p.status === "Missed").length;

<<<<<<< HEAD
  const {
    search, setSearch,
    activeFilter, setFilter,
    sort, toggleSort,
    filtered
  } = useTableControls(patients, {
    searchFields: ["name", "id", "ward", "medication"],
    filterField: "status",
    sortDefault: { field: "name", dir: "asc" },
    storageKey: "patients"
  });

  /* ── Add patient ────────────────────────────────────────────── */
=======
  const q = search.toLowerCase();
  /* Search filter */
  const filtered = patients.filter(p =>
    (p.name || "").toLowerCase().includes(q)       ||
    String(p.id || "").toLowerCase().includes(q)   ||
    (p.ward || "").toLowerCase().includes(q)      ||
    (p.medication || "").toLowerCase().includes(q)
  );

>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  const openAddModal = () => {
    setFormData({ name: "", ward: "", medication: "" });
    setAddErrors({});
    setAddError(null);
    setShowModal(true);
  };

  const closeAddModal = () => {
    setShowModal(false);
    setFormData({ name: "", ward: "", medication: "" });
    setAddErrors({});
    setAddError(null);
  };

  const clearAddFieldError = (field) =>
    setAddErrors((prev) => ({ ...prev, [field]: false }));

  const handleAddSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault();

    const next = {};
    if (!formData.name.trim())       next.name       = true;
    if (!formData.ward.trim())       next.ward       = true;
    if (!formData.medication.trim()) next.medication = true;

    if (Object.keys(next).length) { setAddErrors(next); return; }

    setAddErrors({});
    setAddSubmitting(true);
    setAddError(null);

    try {
      const data = await apiClient.post('/patients', {
        name:       formData.name,
        ward:       formData.ward,
        medication: formData.medication,
      });

      await loadPatients();
      closeAddModal();
      notifier.success(`Patient "${formData.name}" added successfully.`);
    } catch (err) {
      setAddError(err.message || "Could not add patient.");
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ── Edit patient — Sprint 3: calls PUT /patients/:id ────────── */
  const handleEdit = useCallback(async (updates) => {
    try {
      const data = await apiClient.put(`/patients/${editingPatient.id}`, updates);

      await loadPatients();
      notifier.success(`Patient "${data.data?.name ?? updates.name}" updated successfully.`);
      return {}; /* success */
    } catch (err) {
      return { error: err.message || "Network error. Could not update patient." };
    }
  }, [editingPatient, loadPatients]);

  /* ── Delete patient — Sprint 3: ConfirmDialog + DELETE ──────── */
  const askDelete  = (patient) => setDeletePending(patient);
  const cancelDelete = () => setDeletePending(null);

  const commitDelete = async () => {
    const patient = deletePending;
    setDeletePending(null);
    try {
      await apiClient.delete(`/patients/${patient.id}`);
      await loadPatients();
      notifier.success(`Patient "${patient.name}" deleted.`);
    } catch (err) {
      notifier.error(err.message || "Network error. Could not delete patient.");
    }
  };

  const handleView = (patient) => setSelectedPatient(patient);

  return (
    <>


      {/* Sprint 3 — Confirm delete dialog */}
      {deletePending && (
        <ConfirmDialog
          title="Delete Patient"
          message={`Permanently remove "${deletePending.name}" (${deletePending.id})? This cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={commitDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Add Patient modal — S5: ModalShell handles backdrop/panel/Escape (S6) */}
      {showModal && (
        <ModalShell onClose={closeAddModal} maxWidth={480} gap={20}>
          <form onSubmit={handleAddSubmit} style={{ display: "contents" }}>
=======
  e.preventDefault();

  const next = {};

  if (!formData.name.trim()) next.name = true;
  if (!formData.ward.trim()) next.ward = true;
  if (!formData.medication.trim()) next.medication = true;

  if (Object.keys(next).length) {
    setAddErrors(next);
    return;
  }

  setAddErrors({});
  setAddSubmitting(true);
  setAddError(null);

  try {
    const res = await fetch(`${API_BASE}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        ward: formData.ward,
        medication: formData.medication,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Could not add patient.");
    }

    // Refresh from backend (single source of truth)
    const refreshed = await fetch(`${API_BASE}/patients`);
    const refreshedData = await refreshed.json();

    setPatients(refreshedData.map(normalizePatient));

    closeAddModal();

  } catch (err) {
    setAddError(err.message || "Could not add patient.");
  } finally {
    setAddSubmitting(false);
  }
};

  const handleView   = (patient) => {
    setSelectedPatient(patient);
  };
  const handleEdit   = (updates) =>
    setPatients(prev =>
      prev.map(p => p.id === editingPatient.id ? { ...p, ...updates } : p)
    );

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete patient.");
      }

      // Refresh from backend
      const refreshed = await fetch(`${API_BASE}/patients`);
      const refreshedData = await refreshed.json();

      setPatients(refreshedData.map(normalizePatient));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Add Patient modal */}
      {showModal && (
        <div
          onClick={closeAddModal}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(44,62,80,0.35)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleAddSubmit}
            onClick={(e) => e.stopPropagation()}
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
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
                  color: "var(--text-primary)", letterSpacing: "-0.02em",
                }}>Add Patient</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
                  New patient registration · MEDI-DISPENSE
                </div>
              </div>
              <button type="button" onClick={closeAddModal} style={{
                background: "var(--bg-overlay)", border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)", width: 32, height: 32, cursor: "pointer",
                color: "var(--text-muted)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
              }}>✕</button>
            </div>

            <div style={{ height: 1, background: "var(--border-dim)" }} />

            {addError && (
              <p style={{ margin: 0, fontSize: 13, color: "#E74C3C" }}>{addError}</p>
            )}

<<<<<<< HEAD
            {/* Fields — S4: shared FormField */}
=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FormField
                label="Full Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((f) => ({ ...f, name: e.target.value }));
                  clearAddFieldError("name");
                }}
                placeholder="e.g. Ahmad Faris"
                error={addErrors.name}
              />
              <FormField
                label="Ward"
                value={formData.ward}
                onChange={(e) => {
                  setFormData((f) => ({ ...f, ward: e.target.value }));
                  clearAddFieldError("ward");
                }}
                placeholder="e.g. 3B"
                error={addErrors.ward}
              />
              <FormField
                label="Medication"
                value={formData.medication}
                onChange={(e) => {
                  setFormData((f) => ({ ...f, medication: e.target.value }));
                  clearAddFieldError("medication");
                }}
                placeholder="e.g. Metformin 500mg"
                error={addErrors.medication}
              />
            </div>

            <div style={{ height: 1, background: "var(--border-dim)" }} />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={closeAddModal} style={{
                padding: "9px 20px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-soft)", background: "var(--bg-overlay)",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                color: "var(--text-secondary)", cursor: "pointer",
              }}>Cancel</button>
              <button
                type="submit"
                disabled={addSubmitting}
                style={{
                  padding: "9px 24px", borderRadius: "var(--radius-sm)",
                  border: "none", background: "var(--cyan)",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                  color: "#fff", cursor: addSubmitting ? "not-allowed" : "pointer",
                  opacity: addSubmitting ? 0.55 : 1,
                  boxShadow: "0 2px 10px rgba(58,141,255,0.25)",
                }}
              >
                {addSubmitting ? "Adding..." : "Add Patient"}
              </button>
            </div>
          </form>
<<<<<<< HEAD
        </ModalShell>
=======
        </div>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
      )}

      {/* Feature 2: View Patient modal */}
      {selectedPatient && (
        <ViewPatientModal
          patient={selectedPatient}
          now={now}
          onClose={() => setSelectedPatient(null)}
        />
      )}

<<<<<<< HEAD
      {/* Edit Patient modal — Sprint 3: onSave calls PUT /patients/:id */}
=======
      {/* Edit Patient modal */}
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleEdit}
        />
      )}

      <main className="main-content page-main">

        {/* ── Header ────────────────────────────────────────────── */}
        <header className="dash-header">
          <div className="dash-header-left">
            <span className="breadcrumb">MEDI-DISPENSE</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-active">Patients</span>
          </div>
          <div className="dash-header-right">
            <div className="status-pill">
              <span className="pulse-dot" />
              {active} Active
            </div>
            <button type="button" className="page-add-btn" onClick={openAddModal}>
              + Add Patient
            </button>
          </div>
        </header>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="dash-hero">
          <div className="hero-line" />
          <div className="hero-text">
            <h1 className="hero-title">Patient Records</h1>
            <p className="hero-sub">
              Registered patients · Ward assignments · Medication schedule
            </p>
          </div>
          <div className="hero-badge">{patients.length} TOTAL</div>
        </section>

        {/* ── Summary chips ─────────────────────────────────────── */}
        <div className="page-summary-row">
          <div className="page-summary-chip page-summary-chip--green">
            <span className="page-summary-val">{active}</span>
            <span className="page-summary-lbl">ACTIVE</span>
          </div>
          <div className="page-summary-chip page-summary-chip--blue">
            <span className="page-summary-val">{scheduled}</span>
            <span className="page-summary-lbl">SCHEDULED</span>
          </div>
          <div className="page-summary-chip page-summary-chip--orange">
            <span className="page-summary-val">{missed}</span>
            <span className="page-summary-lbl">MISSED</span>
          </div>
          <div className="page-summary-chip page-summary-chip--default">
            <span className="page-summary-val">{patients.length}</span>
            <span className="page-summary-lbl">TOTAL</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* ── Filters & Search ──────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <FilterPills
            options={["Active", "Scheduled", "Missed"]}
            active={activeFilter}
            onChange={setFilter}
            counts={{ Active: active, Scheduled: scheduled, Missed: missed }}
          />
        </div>

=======
        {/* ── Search ────────────────────────────────────────────── */}
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
        <div className="page-search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="page-search-input"
            type="text"
            placeholder="Search by name, ID, ward or medication…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="page-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* ── Table card ────────────────────────────────────────── */}
        <div className="page-table-card">
          <table className="page-table">
            <thead>
              <tr>
<<<<<<< HEAD
                <SortableHeader field="id" label="Patient ID" sort={sort} onSort={toggleSort} />
                <SortableHeader field="name" label="Name" sort={sort} onSort={toggleSort} />
                <SortableHeader field="ward" label="Ward" sort={sort} onSort={toggleSort} />
                <SortableHeader field="medication" label="Medication" sort={sort} onSort={toggleSort} />
                <SortableHeader field="next" label="Next Dose" sort={sort} onSort={toggleSort} />
                <SortableHeader field="status" label="Status" sort={sort} onSort={toggleSort} />
=======
                <th>Patient ID</th>
                <th>Name</th>
                <th>Ward</th>
                <th>Medication</th>
                <th>Next Dose</th>
                <th>Status</th>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
<<<<<<< HEAD
                /* S10 — CSS spinner instead of plain loading text */
                <tr>
                  <td colSpan="7" className="page-table-loading">
                    <span className="spinner" />{" "}Loading patients…
=======
                <tr>
                  <td colSpan="7" className="page-table-empty">
                    Loading patients...
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan="7" className="page-table-empty">
<<<<<<< HEAD
                    {fetchError}{" "}
                    <button
                      onClick={loadPatients}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--cyan)", fontSize: 13, fontFamily: "var(--font-body)",
                        textDecoration: "underline", padding: 0,
                      }}
                    >Retry</button>
=======
                    {fetchError}
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
                  </td>
                </tr>
              ) : (
                <>
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan="7" className="page-table-empty">
                        No patients added yet. Click <strong>+ Add Patient</strong> to register one.
                      </td>
                    </tr>
                  )}
                  {patients.length > 0 && filtered.length === 0 && (
                    <tr>
                      <td colSpan="7" className="page-table-empty">
                        No patients match your search.
                      </td>
                    </tr>
                  )}

                  {filtered.map(p => {
                    const s = STATUS_MAP[p.status] || STATUS_MAP.Scheduled;
                    const { label: timeLabel, color: timeColor } = calculateTimeLeft(p.next, now);
                    return (
                      <tr key={p.id} className="page-table-row">
                        <td className="page-table-id">{p.id}</td>
                        <td className="page-table-name">{p.name}</td>
                        <td>
                          <span className="page-ward-chip">{p.ward}</span>
                        </td>
                        <td className="page-table-mono">{p.medication}</td>
                        <td className="page-table-mono" style={{ color: timeColor }}>
                          {timeLabel}
                        </td>
                        <td>
                          <span
                            className="page-status-chip"
                            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
<<<<<<< HEAD
                          {/* S3 — shared ActionBtn */}
                          <div className="page-action-group">
                            <ActionBtn label="View"   variant="view"   onClick={() => handleView(p)} aria-label={`View patient ${p.name}`} />
                            <ActionBtn label="Edit"   variant="edit"   onClick={() => setEditingPatient(p)} aria-label={`Edit patient ${p.name}`} />
                            {/* Sprint 3 — Delete now shows ConfirmDialog */}
                            <ActionBtn label="Delete" variant="delete" onClick={() => askDelete(p)} aria-label={`Delete patient ${p.name}`} />
=======
                          <div className="page-action-group">
                            <ActionBtn label="View"   variant="view"   onClick={() => handleView(p)} />
                            <ActionBtn label="Edit"   variant="edit"   onClick={() => setEditingPatient(p)} />
                            <ActionBtn label="Delete" variant="delete" onClick={() => handleDelete(p.id)} />
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>

<<<<<<< HEAD
        {/* ── Footer — S7: year updated to 2026 ─────────────────── */}
=======
        {/* ── Footer ────────────────────────────────────────────── */}
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
        <footer className="dash-footer">
          <span>MEDI-DISPENSE v1.1</span>
          <span className="footer-sep">·</span>
          <span>AI-Powered Medication Monitoring</span>
          <span className="footer-sep">·</span>
<<<<<<< HEAD
          <span>© 2026</span>
=======
          <span>© 2025</span>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
        </footer>

      </main>
    </>
  );
}
