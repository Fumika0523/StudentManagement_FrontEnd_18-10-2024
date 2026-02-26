import { useEffect, useRef, useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { COLORS, ANIM, S } from "./SideBarStyles";
import { ICONS, getAcademicItems } from "./SideBar";

function NavItem({ icon, label, onClick, isCollapsed, labelVisible, widthDuration, labelDuration }) {
  const [hovered, setHovered] = useState(false);
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
        color: hovered ? "#fff" : COLORS.TEXT,
        background: hovered ? "rgba(255,255,255,0.1)" : "transparent",
        padding: isCollapsed ? "8px 0" : "8px 12px",
        margin: isCollapsed ? "2px 6px" : "2px 8px",
        justifyContent: isCollapsed ? "center" : "flex-start",
        transition: `background 0.18s, color 0.18s,
          padding ${widthDuration}ms cubic-bezier(0.4,0,0.2,1),
          margin  ${widthDuration}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <span style={S.iconWrap}>{icon}</span>

      <span
        style={{
          ...S.itemLabel,
          opacity: labelVisible ? 1 : 0,
          transform: labelVisible ? "translateX(0)" : "translateX(-8px)",
          maxWidth: isCollapsed ? "0" : "190px",
          pointerEvents: isCollapsed ? "none" : "auto",
          transition: `opacity ${labelDuration}ms ease, transform ${labelDuration}ms ease`,
        }}
      >
        {label}
      </span>

      <span style={{ ...S.tooltip, opacity: tooltipVisible && isCollapsed ? 1 : 0 }}>
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ label, isCollapsed, labelVisible, labelDuration }) {
  // ✅ collapsed shows only a divider (no “ACADEMIC” text)
  if (isCollapsed) return <div style={S.divider} />;
  return (
    <div
      style={{
        ...S.sectionLabel,
        color: COLORS.MUTED,
        opacity: labelVisible ? 1 : 0,
        transition: `opacity ${labelDuration}ms ease`,
      }}
    >
      {label}
    </div>
  );
}

// Props controlled by App/NavBar on mobile
function SideBar({ isSidebarVisible = false, onCloseMobile }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop/tablet
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [labelVisible, setLabelVisible] = useState(true);
  const labelTimer = useRef(null);

  const isMobile = screenWidth < 768;
  const isCollapsed = isMobile ? true : !isSidebarOpen;

  const effectiveLabelVisible = isMobile ? false : labelVisible;
  const academicItems = getAcademicItems(role);

  const closeMobile = () => onCloseMobile?.();

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Desktop expand, tablet collapse
    if (screenWidth >= 1024) doToggle(true);
    else if (screenWidth >= 768) doToggle(false);
  }, [screenWidth]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const doToggle = (open) => {
    clearTimeout(labelTimer.current);
    if (open) {
      setIsSidebarOpen(true);
      labelTimer.current = setTimeout(() => setLabelVisible(true), ANIM.WIDTH_DURATION - 80);
    } else {
      setLabelVisible(false);
      labelTimer.current = setTimeout(() => setIsSidebarOpen(false), ANIM.LABEL_DURATION + 40);
    }
  };

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) closeMobile();
  };

  // Mobile: width 64 when visible, 0 when hidden
  const sidebarWidth = isMobile ? (isSidebarVisible ? "64px" : "0px") : isSidebarOpen ? "248px" : "64px";

  return (
    <div
      style={{
        ...S.sidebar,
        background: `linear-gradient(180deg, ${COLORS.DARK} 0%, ${COLORS.DARKER} 100%)`,
        width: sidebarWidth,
        minWidth: 0,
        transition: `width ${ANIM.WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
    >
      {/* Toggle row */}
      <div style={{ ...S.toggleRow, justifyContent: isCollapsed ? "center" : "flex-end" }}>
        {!isMobile && (
          <button style={S.toggleBtn} onClick={() => doToggle(!isSidebarOpen)} title={isSidebarOpen ? "Collapse" : "Expand"}>
            {isSidebarOpen ? <MdKeyboardDoubleArrowLeft style={{ fontSize: 20 }} /> : <MdKeyboardDoubleArrowRight style={{ fontSize: 20 }} />}
          </button>
        )}
      </div>

      {/* Logo row (aligned in collapsed) */}
      <div
        style={{
          ...S.logoRow,
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding: isCollapsed ? "8px 0 14px" : S.logoRow.padding,
          gap: isCollapsed ? 0 : "10px",
        }}
      >
        <span style={S.iconWrap}>{ICONS.logo()}</span>

        <span
          style={{
            ...S.logoText,
            opacity: effectiveLabelVisible ? 1 : 0,
            transform: effectiveLabelVisible ? "translateX(0)" : "translateX(-8px)",
            maxWidth: isCollapsed ? "0" : "180px",
            transition: `opacity ${ANIM.LABEL_DURATION}ms ease, transform ${ANIM.LABEL_DURATION}ms ease`,
          }}
        >
          School Portal
        </span>
      </div>

      <div style={S.nav}>
        <NavItem
          icon={ICONS.dashboard()}
          label="Dashboard"
          onClick={() => handleNav("/dashboard")}
          isCollapsed={isCollapsed}
          labelVisible={effectiveLabelVisible}
          widthDuration={ANIM.WIDTH_DURATION}
          labelDuration={ANIM.LABEL_DURATION}
        />

        {/* ✅ Prevent double divider when collapsed */}
        {!isCollapsed && <div style={S.divider} />}
        <SectionLabel label="ACADEMIC" isCollapsed={isCollapsed} labelVisible={effectiveLabelVisible} labelDuration={ANIM.LABEL_DURATION} />

        {academicItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            onClick={() => handleNav(item.path)}
            isCollapsed={isCollapsed}
            labelVisible={effectiveLabelVisible}
            widthDuration={ANIM.WIDTH_DURATION}
            labelDuration={ANIM.LABEL_DURATION}
          />
        ))}

        {!isCollapsed && <div style={S.divider} />}
        <SectionLabel label="SETTINGS" isCollapsed={isCollapsed} labelVisible={effectiveLabelVisible} labelDuration={ANIM.LABEL_DURATION} />

        <NavItem
          icon={ICONS.settings()}
          label="Account Settings"
          onClick={() => handleNav("/settings")}
          isCollapsed={isCollapsed}
          labelVisible={effectiveLabelVisible}
          widthDuration={ANIM.WIDTH_DURATION}
          labelDuration={ANIM.LABEL_DURATION}
        />
      </div>

      <div
        style={{
          ...S.signout,
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding: isCollapsed ? "13px 0" : "12px 12px",
          transition: `background 0.18s, padding ${ANIM.WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        }}
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        title={isCollapsed ? "Sign Out" : ""}
      >
        <span style={S.iconWrap}>
          <FaPowerOff style={{ fontSize: "17px", color: "#f87171" }} />
        </span>

        <span
          style={{
            opacity: effectiveLabelVisible ? 1 : 0,
            transform: effectiveLabelVisible ? "translateX(0)" : "translateX(-6px)",
            transition: `opacity ${ANIM.LABEL_DURATION}ms ease, transform ${ANIM.LABEL_DURATION}ms ease`,
            maxWidth: isCollapsed ? "0" : "180px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default SideBar;