import { useEffect, useRef, useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { COLORS, ANIM, S } from "./SideBarStyles";
import { ICONS, getAcademicItems } from "./SideBarData";

// Icons
const renderIcon = (iconKey) => {
  const icon = ICONS[iconKey];
  if (!icon) return null;

  const { name, height,width } = icon;
  return (
    <>
        <img
        height={height}
      width={width}
      src={`https://img.icons8.com/color/${name}.png`}
      alt={name}
  // style={{ height: "100%", width: "auto" }}
       />
    </>
  );
};

//Nav Item
function NavItem({
  icon,
  label,
  onClick,
  isCollapsed,
  labelVisible,
  widthDuration,
  labelDuration,
}) {
  const [hovered, setHovered] = useState(false);
  const showTooltip = hovered && isCollapsed;

  return (
    <div className="d-flex flex-row  gap-2 align-items-center"
      style={{
        ...S.item,
        color: hovered ? "#fff" : COLORS.TEXT,
        background: hovered ? "rgba(64, 155, 240, 0.36)" : "transparent",
        margin: !isCollapsed ? "10px 0px" : "15px 0px",
        padding: !isCollapsed ? "0px 5px" : "0px",
        justifyContent:!isCollapsed ? "start" : "center",
        transition: `background 0.38s, color 0.18s,
        padding ${widthDuration}ms cubic-bezier(0.4,0,0.2,1),
        margin ${widthDuration}ms cubic-bezier(0.4,0,0.2,1)`,
      //border:"2px solid yellow"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={S.iconWrap}>{icon}</span>

      <span
      className=""
        style={{
          ...S.itemLabel,
          opacity: labelVisible ? 1 : 0,
          transform: labelVisible ? "translateX(0)" : "translateX(-8px)",
          display: isCollapsed ? "none" : "block",
          pointerEvents: isCollapsed ? "none" : "auto",
          transition: `opacity ${labelDuration}ms ease, transform ${labelDuration}ms ease`,    

        }}
      >
        {label}
      </span>

      <span
        style={{
          ...S.tooltip,
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(6px)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ label, isCollapsed, labelVisible, labelDuration }) {
  if (isCollapsed) return
   <div style={S.divider}
    />;

  return (
    <div
      style={{
        ...S.sectionLabel,
        color: COLORS.MUTED,
        opacity: labelVisible ? 1 : 0,
        transition: `opacity ${labelDuration}ms ease`,
        // border:"2px solid green"
      }}
    >
      {label}
    </div>
  );
}

function SideBar({ isSidebarVisible = false, onCloseMobile }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    if (screenWidth >= 1024) {
      doToggle(true);
    } else if (screenWidth >= 768) {
      doToggle(false);
    }
  }, [screenWidth]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeMobile();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => clearTimeout(labelTimer.current);
  }, []);

  const doToggle = (open) => {
    clearTimeout(labelTimer.current);

    if (open) {
      setIsSidebarOpen(true);
      labelTimer.current = setTimeout(() => {
        setLabelVisible(true);
      }, ANIM.WIDTH_DURATION - 80);
    } else {
      setLabelVisible(false);
      labelTimer.current = setTimeout(() => {
        setIsSidebarOpen(false);
      }, ANIM.LABEL_DURATION + 40);
    }
  };

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) closeMobile();
  };

  const sidebarWidth = isMobile
    ? isSidebarVisible
      ? "70px"
      : "0px"
    : isSidebarOpen
    ? "248px"
    : "70px";

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
          <button
            style={S.toggleBtn}
            onClick={() => doToggle(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse" : "Expand"}
          >
            {isSidebarOpen ? (
              <MdKeyboardDoubleArrowLeft style={{ fontSize: 22 }} />
            ) : (
              <MdKeyboardDoubleArrowRight style={{ fontSize: 22 }} />
            )}
          </button>
        )}
      </div>

      {/* Nav area */}
      <div style={S.navOuter}>
        <div style={S.navScroll}>
        <NavItem
          style={{}}
            icon={renderIcon("logo")}
            label="School Portal"
            onClick={() => handleNav("/dashboard")}
            isCollapsed={isCollapsed}
            labelVisible={effectiveLabelVisible}
            widthDuration={ANIM.WIDTH_DURATION}
            labelDuration={ANIM.LABEL_DURATION}
          />

          <NavItem
          style={{}}
            icon={renderIcon("dashboard")}
            label="Dashboard"
            onClick={() => handleNav("/dashboard")}
            isCollapsed={isCollapsed}
            labelVisible={effectiveLabelVisible}
            widthDuration={ANIM.WIDTH_DURATION}
            labelDuration={ANIM.LABEL_DURATION}
          />

          {!isCollapsed && <div style={S.divider} />}

          <SectionLabel
            label="ACADEMIC"
            isCollapsed={isCollapsed}
            labelVisible={effectiveLabelVisible}
            labelDuration={ANIM.LABEL_DURATION}
          />

          {academicItems.map((item) => (
            <NavItem
              key={item.label}
              icon={renderIcon(item.iconKey)}
              label={item.label}
              onClick={() => handleNav(item.path)}
              isCollapsed={isCollapsed}
              labelVisible={effectiveLabelVisible}
              widthDuration={ANIM.WIDTH_DURATION}
              labelDuration={ANIM.LABEL_DURATION}
            />
          ))}

          {!isCollapsed && <div style={S.divider} />}

          <NavItem
            icon={renderIcon("settings")}
            label="Account Settings"
            onClick={() => handleNav("/settings")}
            isCollapsed={isCollapsed}
            labelVisible={effectiveLabelVisible}
            widthDuration={ANIM.WIDTH_DURATION}
            labelDuration={ANIM.LABEL_DURATION}
          />
        </div>

      {/* Sign out */}
      <div
      className="d-flex flex-row align-items-center border border-4 gap-2 border-warning"
        style={{
          ...S.signout,
        justifyContent: isCollapsed ? "center" : "flex-start",
        transition: `background 0.18s, padding ${ANIM.WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
        left: isCollapsed ? "unset" : 0, 
          right: !isCollapsed ? "unset" : 0, 
        }}
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(248,113,113,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        title={isCollapsed ? "Sign Out" : null}
      >
        <span style={S.iconWrap}>
          <FaPowerOff style={{ fontSize: "28px", color: "#f87171" }} />
        </span>
        <span
        className="d-none d-md-block"
          style={{
          ...S.itemLabel,
            opacity: effectiveLabelVisible ? 1 : 0,
            transform: effectiveLabelVisible ? "translateX(0)" : "translateX(-6px)",
            transition: `opacity ${ANIM.LABEL_DURATION}ms ease, transform ${ANIM.LABEL_DURATION}ms ease`,
            border:"2px solid pink",
            display: isCollapsed ? "none" : "block",
          }}
        >
          Sign Out
        </span>
      </div>
      </div>    
    </div>
  );
}

export default SideBar;