import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/",
    end: true,
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/patients",
    label: "Patients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/medications",
    label: "Medications",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
        <path d="m18 15-2-2m-3 3-2-2" />
      </svg>
    ),
  },
  {
    to: "/devices",
    label: "Devices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10" r="2" />
        <path d="M12 6v2M12 12v2M8 10h2M14 10h2" />
      </svg>
    ),
  },
  {
    to: "/alerts",
    label: "Alerts",
    badge: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export default function Sidebar({ onProfileClick }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  /* Close drawer whenever the route changes */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Hamburger button — rendered into the page flow so it    ──
          sits at the top of the content area. On desktop (>768px)
          it is hidden via CSS. On mobile it appears top-left.      */}
      <button
        className="sidebar-hamburger"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(true)}
      >
        <span /><span /><span />
      </button>

      {/* ── Overlay — closes drawer when tapped ────────────────── */}
      <div
        className={`sidebar-overlay${open ? " sidebar-overlay--visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ──────────────────────────────────────── */}
      <aside className={`sidebar${open ? " sidebar--open" : ""}`}>

        {/* Close button — only useful on mobile inside the drawer */}
        <button
          className="sidebar-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#lg)" />
              <path d="M16 8v16M8 16h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0080ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">MEDI</span>
            <span className="logo-accent">DISPENSE</span>
          </div>
        </div>

        <div className="sidebar-version">v1.1 · IoT Platform</div>
        <div className="sidebar-divider" />
        <span className="nav-section-label">NAVIGATION</span>

        <div className="sidebar-nav-scroll">
          <nav className="sidebar-nav">
            {navItems.map(({ to, end, label, icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-item${isActive ? " nav-item--active" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{label}</span>
                    {badge != null && (
                      <span className="nav-badge">{badge}</span>
                    )}
                    {isActive && <span className="nav-active-bar" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div
          className="sidebar-profile"
          onClick={onProfileClick}
          style={{ cursor: "pointer" }}
        >
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="profile-info">
            <span className="profile-name">Dr. System Admin</span>
            <span className="profile-role">Ward Monitor</span>
          </div>
          <div className="profile-status-dot" />
        </div>

      </aside>
    </>
  );
}
