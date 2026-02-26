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
  dashboard:   () => IC("speed",                24),
  student:     () => IC("student-male",         22),
  batch:       () => IC("classmates-sitting",   22),
  course:      () => IC("book-shelf",           22),
  admission:   () => IC("enter-2",              22),
  task:        () => IC("task",                 22),
  attendance:  () => IC("calendar",             22),
  viewBatch:   () => IC("conference-call",      22),
  viewAtten:   () => IC("planner",              22),
  submitTask:  () => IC("submit-document",      22),
  raiseQuery:  () => IC("ask-question",         22),
  certificate: () => IC("certificate",          22),
  invoice:     () => IC("invoice",              22),
  settings:    () => IC("settings",             22),
  logo:        () => IC("graduation-cap",       30),
};

const S = {
  sidebar: {
    background: `linear-gradient(180deg, ${DARK} 0%, ${DARKER} 100%)`,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "4px 0 28px rgba(0,0,0,0.5)",
    flexShrink: 0,
    zIndex: 100,
    // transition applied inline so we can vary duration
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
  },
  divider: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
      margin: "10px 0",  
  },
  item: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: TEXT,
    fontSize: "13.5px",
    fontWeight: 500,
    borderRadius: "9px",
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
function NavItem({ icon, label, onClick, isCollapsed, labelVisible, widthDuration, labelDuration }) {
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
        padding:        isCollapsed ? "8px 0"   : "8px 12px",
        margin:         isCollapsed ? "2px 6px" : "2px 8px",
        justifyContent: isCollapsed ? "center"  : "flex-start",
        transition: `background 0.18s, color 0.18s,
                     padding ${widthDuration}ms cubic-bezier(0.4,0,0.2,1),
                     margin  ${widthDuration}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <span style={S.iconWrap}>{icon}</span>

      <span style={{
        ...S.itemLabel,
        opacity:       labelVisible ? 1 : 0,
        transform:     labelVisible ? "translateX(0)" : "translateX(-8px)",
        maxWidth:      isCollapsed ? "0" : "190px",
        pointerEvents: isCollapsed ? "none" : "auto",
        transition:    `opacity ${labelDuration}ms ease, transform ${labelDuration}ms ease`,
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
function SectionLabel({ label, isCollapsed, labelVisible, labelDuration }) {
  if (isCollapsed) return <div style={S.divider} />;
  return (
    <div style={{
      ...S.sectionLabel,
      opacity:    labelVisible ? 1 : 0,
      transition: `opacity ${labelDuration}ms ease`,
    }}>
      {label}
    </div>
  );
}

// ─── Main SideBar ─────────────────────────────────────────────────────────────
//
// Props:
//   isSidebarVisible  — boolean from App.jsx (NavBar hamburger toggle)
//   onCloseMobile     — callback so App.jsx state stays in sync when user
//                       closes sidebar from inside (✕ button, nav click, etc.)
//
function SideBar({ isSidebarVisible = false, onCloseMobile }) {
  const navigate = useNavigate();
  const role     = localStorage.getItem("role") || "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenWidth,   setScreenWidth]   = useState(window.innerWidth);
  const [labelVisible,  setLabelVisible]  = useState(true);
  const labelTimer = useRef(null);

  // ── Responsive resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-collapse on tablet, expand on desktop
  useEffect(() => {
    if (screenWidth >= 1024) doToggle(true);
    else if (screenWidth >= 768) doToggle(false);
    // mobile width handled purely by isSidebarVisible prop
  }, [screenWidth]);

  // ── Escape key closes on mobile ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Desktop expand/collapse with sequenced label fade ──────────────────────
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

  const closeMobile = () => {
    onCloseMobile?.(); // tell App.jsx to set isSidebarVisible = false
  };

  const isMobile    = screenWidth < 768;
  const isCollapsed = isMobile ? true : !isSidebarOpen;

  // ── Width calculation ───────────────────────────────────────────────────────
  // Desktop/tablet: animate width
  // Mobile: width is always 64px (icons only); visibility = isSidebarVisible
  //   We use width 0 when hidden so it doesn't take space in the flex layout
  let sidebarWidth;
  if (isMobile) {
    sidebarWidth = isSidebarVisible ? "64px" : "0px";
  } else {
    sidebarWidth = isSidebarOpen ? "248px" : "64px";
  }

  // Labels never show on mobile (icons-only sidebar)
  const effectiveLabelVisible = isMobile ? false : labelVisible;

  const navProps = {
    isCollapsed,
    labelVisible:  effectiveLabelVisible,
    widthDuration: WIDTH_DURATION,
    labelDuration: LABEL_DURATION,
  };

  const adminItems = [
    { icon: ICONS.student(),     label: "Student",           path: "/studentdata" },
    { icon: ICONS.batch(),       label: "Batch",             path: "/batchdata" },
    { icon: ICONS.course(),      label: "Course",            path: "/coursedata" },
    { icon: ICONS.admission(),   label: "Admission",         path: "/admissiondata" },
    { icon: ICONS.task(),        label: "Task",              path: "/task" },
    { icon: ICONS.attendance(),  label: "Update Attendance", path: "/attendance" },
  ];

  const studentItems = [
    { icon: ICONS.viewBatch(),   label: "View Batch",           path: "/batchdata" },
    { icon: ICONS.viewAtten(),   label: "View Attendance",      path: "/coursedata" },
    { icon: ICONS.submitTask(),  label: "Submit Task",          path: "/coursedata" },
    { icon: ICONS.raiseQuery(),  label: "Raise Query",          path: "/raise-query" },
    { icon: ICONS.certificate(), label: "Download Certificate", path: "/" },
    { icon: ICONS.invoice(),     label: "Invoice Download",     path: "/" },
  ];

  const academicItems = (role === "admin" || role === "staff") ? adminItems : studentItems;

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) closeMobile();
  };

  return (
    <div
      style={{
        ...S.sidebar,
        width: sidebarWidth,
        // Animate width on ALL screen sizes for smooth open/close
        transition: `width ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        // Never use position:fixed — stay in the flex flow so navbar narrows
        position: "relative",
        // Hide overflow so icons don't peek out while collapsing to 0
        minWidth: 0,
      }}
    >
      {/* ── Toggle row ──────────────────────────────────────────────────────── */}
      <div style={{ ...S.toggleRow, justifyContent: isCollapsed ? "center" : "flex-end" }}>
        {!isMobile && (
          // Desktop / tablet — left/right arrow
          <button
            style={S.toggleBtn}
            onClick={() => doToggle(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse" : "Expand"}
          >
            {isSidebarOpen
              ? <MdKeyboardDoubleArrowLeft  style={{ fontSize: 20 }} />
              : <MdKeyboardDoubleArrowRight style={{ fontSize: 20 }} />}
          </button>
        ) }
      </div>

      {/* ── Logo row ────────────────────────────────────────────────────────── */}
      <div style={{ ...S.logoRow, 
        justifyContent: isCollapsed ? "center" : "flex-start" ,
        padding: isCollapsed ? "8px 0 14px" : S.logoRow.padding, 
    gap: isCollapsed ? "0" : "10px",}}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {ICONS.logo()}
        </span>
        <span style={{
          ...S.logoText,
          opacity:    effectiveLabelVisible ? 1 : 0,
          transform:  effectiveLabelVisible ? "translateX(0)" : "translateX(-8px)",
          maxWidth:   isCollapsed ? "0" : "180px",
          transition: `opacity ${LABEL_DURATION}ms ease, transform ${LABEL_DURATION}ms ease`,
        }}>
          School Portal
        </span>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <div style={S.nav}>
      <NavItem
  {...navProps}
  icon={ICONS.dashboard()}
  label="Dashboard"
  onClick={() => handleNav("/dashboard")}
/>

{/* Only add this divider when sidebar is NOT collapsed.
    When collapsed, SectionLabel already renders one divider. */}
{!isCollapsed && <div style={S.divider} />}

<SectionLabel label="ACADEMIC" {...navProps} />

        {academicItems.map((item) => (
          <NavItem
            key={item.label}
            {...navProps}
            icon={item.icon}
            label={item.label}
            onClick={() => handleNav(item.path)}
          />
        ))}

        <div style={S.divider} />
        <SectionLabel label="SETTINGS" {...navProps} />

        <NavItem {...navProps} icon={ICONS.settings()} label="Account Settings" onClick={() => handleNav("/settings")} />
      </div>

      {/* ── Sign Out ────────────────────────────────────────────────────────── */}
      <div
        style={{
          ...S.signout,
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding:        isCollapsed ? "13px 0" : "12px 12px",
          transition:     `background 0.18s, padding ${WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        }}
        onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        title={isCollapsed ? "Sign Out" : ""}
      >
        <span style={S.iconWrap}>
          <FaPowerOff style={{ fontSize: "17px", color: "#f87171" }} />
        </span>
        <span style={{
          opacity:    effectiveLabelVisible ? 1 : 0,
          transform:  effectiveLabelVisible ? "translateX(0)" : "translateX(-6px)",
          transition: `opacity ${LABEL_DURATION}ms ease, transform ${LABEL_DURATION}ms ease`,
          maxWidth:   isCollapsed ? "0" : "180px",
          overflow:   "hidden",
          whiteSpace: "nowrap",
        }}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default SideBar;