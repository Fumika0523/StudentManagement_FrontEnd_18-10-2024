import { useState, useEffect, useRef } from "react";
import { FaPowerOff } from "react-icons/fa";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DARKER = "#030920";
const DARK   = "#1734a8";
const TEXT   = "rgba(255,255,255,0.78)";
const MUTED  = "rgba(255,255,255,0.38)";

const WIDTH_DURATION = 400;
const LABEL_DURATION = 160;

// ─── Colorful icons8 flat-color icons ────────────────────────────────────────
const IC = (name, size = 24) => (
  <img
    width={size}
    height={size}
    src={`https://img.icons8.com/color/${size * 2}/${name}.png`}
    alt={name}
    style={{ display: "block", flexShrink: 0 }}
  />
);

const ICONS = {
  dashboard:   () => IC("speed",                      24),
  student:     () => IC("student-male",               22),
  batch:       () => IC("group",                      22),
  course:      () => IC("book-shelf",                 22),
  admission:   () => IC("enter-2",                    22),
  task:        () => IC("task",                       22),
  attendance:  () => IC("calendar",                   22),
  viewBatch:   () => IC("conference-call",            22),
  viewAtten:   () => IC("planner",                    22),
  submitTask:  () => IC("submit-document",            22),
  raiseQuery:  () => IC("ask-question",               22),
  certificate: () => IC("certificate",                22),
  invoice:     () => IC("invoice",                    22),
  settings:    () => IC("settings",                   22),
  logo:        () => IC("graduation-cap",             30),
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  sidebar: {
    background: `linear-gradient(180deg, ${DARK} 0%, ${DARKER} 100%)`,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: `width ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
    boxShadow: "4px 0 28px rgba(0,0,0,0.5)",
    flexShrink: 0,
    zIndex: 100,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    padding: "10px 10px 0",
  },
  toggleBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    transition: "background 0.2s",
    flexShrink: 0,
    padding: 0,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    flexShrink: 0,
    minHeight: "52px",
    overflow: "hidden",
  },
  logoText: {
    color: "#f1f5f9",
    fontWeight: 700,
    fontSize: "15px",
    whiteSpace: "nowrap",
    letterSpacing: "0.4px",
    transition: `opacity ${LABEL_DURATION}ms ease, transform ${LABEL_DURATION}ms ease`,
    transformOrigin: "left center",
    overflow: "hidden",
  },
  nav: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "6px 0",
    scrollbarWidth: "none",
  },
  sectionLabel: {
    color: MUTED,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.6px",
    textTransform: "uppercase",
    padding: "14px 18px 5px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    transition: `opacity ${LABEL_DURATION}ms ease`,
  },
  divider: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    margin: "6px 14px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: TEXT,
    fontSize: "13.5px",
    fontWeight: 500,
    borderRadius: "9px",
    transition: `background 0.18s, color 0.18s,
                 padding ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1),
                 margin  ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
  },
  iconWrap: {
    flexShrink: 0,
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    transition: `opacity ${LABEL_DURATION}ms ease, transform ${LABEL_DURATION}ms ease`,
    transformOrigin: "left center",
    overflow: "hidden",
  },
  signout: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#f87171",
    fontSize: "13.5px",
    fontWeight: 500,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexShrink: 0,
    transition: `background 0.18s,
                 padding ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
  },
  tooltip: {
    position: "absolute",
    left: "54px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#0a1020",
    color: "#f1f5f9",
    padding: "5px 11px",
    borderRadius: "7px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
    transition: "opacity 0.15s ease",
  },
};

// ─── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({ icon, label, onClick, isCollapsed, labelVisible }) {
  const [hovered,        setHovered]        = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timer = useRef(null);

  const onEnter = () => {
    setHovered(true);
    if (isCollapsed) timer.current = setTimeout(() => setTooltipVisible(true), 120);
  };
  const onLeave = () => {
    setHovered(false);
    clearTimeout(timer.current);
    setTooltipVisible(false);
  };

  return (
    <div
      style={{
        ...S.item,
        background: hovered ? "rgba(255,255,255,0.1)" : "transparent",
        color: hovered ? "#fff" : TEXT,
        padding: isCollapsed ? "8px 0"   : "8px 12px",
        margin:  isCollapsed ? "2px 6px" : "2px 8px",
        justifyContent: isCollapsed ? "center" : "flex-start",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <span style={S.iconWrap}>{icon}</span>

      <span style={{
        ...S.itemLabel,
        opacity:    labelVisible ? 1 : 0,
        transform:  labelVisible ? "translateX(0)" : "translateX(-8px)",
        maxWidth:   isCollapsed ? "0" : "190px",
        pointerEvents: isCollapsed ? "none" : "auto",
      }}>
        {label}
      </span>

      <span style={{ ...S.tooltip, opacity: tooltipVisible && isCollapsed ? 1 : 0 }}>
        {label}
      </span>
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
function SectionLabel({ label, isCollapsed, labelVisible }) {
  if (isCollapsed) return <div style={S.divider} />;
  return <div style={{ ...S.sectionLabel, opacity: labelVisible ? 1 : 0 }}>{label}</div>;
}

// ─── Main SideBar ─────────────────────────────────────────────────────────────
function SideBar({ isSidebarVisible = true }) {
  const navigate = useNavigate();
  const role     = localStorage.getItem("role") || "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenWidth,   setScreenWidth]   = useState(window.innerWidth);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [labelVisible,  setLabelVisible]  = useState(true);
  const labelTimer = useRef(null);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (screenWidth >= 1024) doToggle(true);
    else doToggle(false);
  }, [screenWidth]);

  const doToggle = (open) => {
    clearTimeout(labelTimer.current);
    if (open) {
      setIsSidebarOpen(true);
      labelTimer.current = setTimeout(() => setLabelVisible(true), WIDTH_DURATION - 80);
    } else {
      setLabelVisible(false);
      labelTimer.current = setTimeout(() => setIsSidebarOpen(false), LABEL_DURATION + 40);
    }
  };

  const isMobile    = screenWidth < 768;
  const isCollapsed = isMobile ? true : !isSidebarOpen;
  const sidebarWidth = isMobile
    ? (mobileOpen ? "64px" : "0px")
    : (isSidebarOpen ? "248px" : "64px");

  const navProps = { isCollapsed, labelVisible };

  // ── Role-based ACADEMIC items ──────────────────────────────────────────────
  const adminItems = [
    { icon: ICONS.student(),     label: "Student",           path: "/studentdata" },
    { icon: ICONS.batch(),       label: "Batch",             path: "/batchdata" },
    { icon: ICONS.course(),      label: "Course",            path: "/coursedata" },
    { icon: ICONS.admission(),   label: "Admission",         path: "/admissiondata" },
    { icon: ICONS.task(),        label: "Task",              path: "/task" },
    { icon: ICONS.attendance(),  label: "Update Attendance", path: "/attendance" },
  ];

  const studentItems = [
    { icon: ICONS.viewBatch(),   label: "View Batch",          path: "/batchdata" },
    { icon: ICONS.viewAtten(),   label: "View Attendance",     path: "/coursedata" },
    { icon: ICONS.submitTask(),  label: "Submit Task",         path: "/coursedata" },
    { icon: ICONS.raiseQuery(),  label: "Raise Query",         path: "/raise-query" },
    { icon: ICONS.certificate(), label: "Download Certificate",path: "/" },
    { icon: ICONS.invoice(),     label: "Invoice Download",    path: "/" },
  ];

  const academicItems = (role === "admin" || role === "staff") ? adminItems : studentItems;

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed", top: "12px", left: "12px", zIndex: 200,
            background: DARK, border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", color: "#fff",
            width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", cursor: "pointer",
          }}
        >☰</button>
      )}

      <div style={{ ...S.sidebar, width: sidebarWidth }}>

        {/* ── Toggle ────────────────────────────────────────────────────────── */}
        <div style={{ ...S.toggleRow, justifyContent: isCollapsed ? "center" : "flex-end" }}>
          {!isMobile && (
            <button
              style={S.toggleBtn}
              onClick={() => doToggle(!isSidebarOpen)}
              title={isSidebarOpen ? "Collapse" : "Expand"}
            >
              {isSidebarOpen
                ? <MdKeyboardDoubleArrowLeft className="fs-5" />
                : <MdKeyboardDoubleArrowRight className="fs-5" />}
            </button>
          )}
          {isMobile && mobileOpen && (
            <button
              style={{ ...S.toggleBtn, color: "#f87171", borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)" }}
              onClick={() => setMobileOpen(false)}
            >✕</button>
          )}
        </div>

        {/* ── Logo ──────────────────────────────────────────────────────────── */}
        <div style={{ ...S.logoRow, justifyContent: isCollapsed ? "center" : "flex-start" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {ICONS.logo()}
          </span>
          <span style={{
            ...S.logoText,
            opacity:   labelVisible ? 1 : 0,
            transform: labelVisible ? "translateX(0)" : "translateX(-8px)",
            maxWidth:  isCollapsed ? "0" : "180px",
          }}>
            School Portal
          </span>
        </div>

        {/* ── Nav ───────────────────────────────────────────────────────────── */}
        <div style={S.nav}>

          {/* Dashboard */}
          <NavItem
            {...navProps}
            icon={ICONS.dashboard()}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          <div style={S.divider} />
          <SectionLabel label="ACADEMIC" {...navProps} />

          {/* Flat list — role-based */}
          {academicItems.map((item) => (
            <NavItem
              key={item.label}
              {...navProps}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.path)}
            />
          ))}

          <div style={S.divider} />
          <SectionLabel label="SETTINGS" {...navProps} />

          <NavItem
            {...navProps}
            icon={ICONS.settings()}
            label="Account Settings"
            onClick={() => navigate("/settings")}
          />
        </div>

        {/* ── Sign Out ──────────────────────────────────────────────────────── */}
        <div
          style={{
            ...S.signout,
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "13px 0" : "12px 12px",
          }}
          onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <span style={{ ...S.iconWrap }}>
            <FaPowerOff style={{ fontSize: "17px", color: "#f87171" }} />
          </span>
          <span style={{
            opacity:   labelVisible ? 1 : 0,
            transform: labelVisible ? "translateX(0)" : "translateX(-6px)",
            transition: `opacity ${LABEL_DURATION}ms ease, transform ${LABEL_DURATION}ms ease`,
            maxWidth:  isCollapsed ? "0" : "180px",
            overflow: "hidden", whiteSpace: "nowrap",
          }}>
            Sign Out
          </span>
        </div>

      </div>
    </>
  );
}

export default SideBar;