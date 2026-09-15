import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

import {
  useNavigate,
} from "react-router-dom";

import {
  ANIM,
  COLORS,
  S,
} from "./SideBarStyles";

import {
  getAcademicItems,
  ICONS,
} from "./SideBarData";

import type {
  SidebarIconConfig,
  SidebarIconKey,
} from "./SideBarData";


// ========================================
// SIDEBAR PROPS
// ========================================

interface SideBarProps {
  /*
   * App controls whether the sidebar is visible
   * on smaller screens.
   */
  isSidebarVisible?: boolean;

  /*
   * App currently passes this prop as `onClose`,
   * so we use the same name here.
   */
  onClose?: () => void;
}


// ========================================
// NAV ITEM PROPS
// ========================================

interface NavItemProps {
  icon: ReactNode;

  label: string;

  onClick: () => void;

  isCollapsed: boolean;

  labelVisible: boolean;

  widthDuration: number;

  labelDuration: number;
}


// ========================================
// SECTION LABEL PROPS
// ========================================

interface SectionLabelProps {
  label: string;

  isCollapsed: boolean;

  labelVisible: boolean;

  labelDuration: number;
}


// ========================================
// ICON RENDERER
// ========================================

const renderIcon = (
  iconKey: SidebarIconKey
): ReactNode => {
  /*
   * Give the dynamic icon lookup the shared
   * SidebarIconConfig type.
   */
  const icon:
    SidebarIconConfig =
    ICONS[iconKey];


  const {
    name,
    height,
    width,
    size,
  } = icon;


  /*
   * Some existing icons use `size` instead of
   * separate height/width values.
   *
   * Fall back to size so those icons also receive
   * dimensions correctly.
   */
  const iconHeight =
    height ??
    size;

  const iconWidth =
    width ??
    size;


  return (
    <img
      height={
        iconHeight
      }
      width={
        iconWidth
      }
      src={`https://img.icons8.com/color/${name}.png`}
      alt={
        name
      }
    />
  );
};


// ========================================
// NAVIGATION ITEM
// ========================================

function NavItem({
  icon,
  label,
  onClick,
  isCollapsed,
  labelVisible,
  widthDuration,
  labelDuration,
}: NavItemProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState<boolean>(
      false
    );


  return (
    <div
      className="d-flex flex-row gap-2 align-items-center"
      style={{
        ...S.item,

        color:
          hovered
            ? "#fff"
            : COLORS.TEXT,

        background:
          hovered
            ? "rgba(64, 155, 240, 0.36)"
            : "transparent",

        margin:
          !isCollapsed
            ? "10px 0px"
            : "15px 0px",

        padding:
          isCollapsed
            ? "0px 10px"
            : "0px 6px",

        justifyContent:
          "flex-start",

        transition:
          `background 0.38s, color 0.18s,
          padding ${widthDuration}ms cubic-bezier(0.4,0,0.2,1),
          margin ${widthDuration}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
      onMouseEnter={() => {
        setHovered(
          true
        );
      }}
      onMouseLeave={() => {
        setHovered(
          false
        );
      }}
      onClick={
        onClick
      }
    >
      {/* ========================================
          ICON
      ======================================== */}

      <span
        style={
          S.iconWrap
        }
      >
        {icon}
      </span>


      {/* ========================================
          LABEL
      ======================================== */}

      <span
        style={{
          ...S.itemLabel,

          opacity:
            labelVisible
              ? 1
              : 0,

          transform:
            labelVisible
              ? "translateX(0)"
              : "translateX(-8px)",

          display:
            isCollapsed
              ? "none"
              : "block",

          pointerEvents:
            isCollapsed
              ? "none"
              : "auto",

          transition:
            `opacity ${labelDuration}ms ease,
            transform ${labelDuration}ms ease`,
        }}
      >
        {label}
      </span>
    </div>
  );
}


// ========================================
// SECTION LABEL
// ========================================

function SectionLabel({
  label,
  isCollapsed,
  labelVisible,
  labelDuration,
}: SectionLabelProps) {
  /*
   * When collapsed, replace the text section
   * heading with a divider.
   */
  if (
    isCollapsed
  ) {
    return (
      <div
        style={
          S.divider
        }
      />
    );
  }


  return (
    <div
      style={{
        ...S.sectionLabel,

        color:
          COLORS.MUTED,

        opacity:
          labelVisible
            ? 1
            : 0,

        transition:
          `opacity ${labelDuration}ms ease`,
      }}
    >
      {label}
    </div>
  );
}


// ========================================
// SIDEBAR COMPONENT
// ========================================

function SideBar({
  isSidebarVisible = false,
  onClose,
}: SideBarProps) {
  const navigate =
    useNavigate();


  const role =
    localStorage.getItem(
      "role"
    ) ?? "admin";


  // ========================================
  // SIDEBAR STATE
  // ========================================

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] =
    useState<boolean>(
      true
    );


  const [
    screenWidth,
    setScreenWidth,
  ] =
    useState<number>(
      window.innerWidth
    );


  const [
    labelVisible,
    setLabelVisible,
  ] =
    useState<boolean>(
      true
    );


  /*
   * The ref stores the active setTimeout ID.
   *
   * null means no timer currently exists.
   */
  const labelTimer =
    useRef<
      ReturnType<
        typeof window.setTimeout
      > | null
    >(
      null
    );


  // ========================================
  // RESPONSIVE STATE
  // ========================================

  const isMobile =
    screenWidth <
    768;


  const isCollapsed =
    isMobile
      ? true
      : !isSidebarOpen;


  const effectiveLabelVisible =
    isMobile
      ? false
      : labelVisible;


  const academicItems =
    getAcademicItems(
      role
    );


  // ========================================
  // CLEAR LABEL TIMER
  // ========================================

  const clearLabelTimer =
    (): void => {
      if (
        labelTimer.current !==
        null
      ) {
        window.clearTimeout(
          labelTimer.current
        );

        labelTimer.current =
          null;
      }
    };


  // ========================================
  // TOGGLE SIDEBAR
  // ========================================

  const doToggle = (
    open: boolean
  ): void => {
    clearLabelTimer();


    if (
      open
    ) {
      setIsSidebarOpen(
        true
      );


      labelTimer.current =
        window.setTimeout(
          () => {
            setLabelVisible(
              true
            );
          },
          ANIM.WIDTH_DURATION -
            80
        );


      return;
    }


    setLabelVisible(
      false
    );


    labelTimer.current =
      window.setTimeout(
        () => {
          setIsSidebarOpen(
            false
          );
        },
        ANIM.LABEL_DURATION +
          40
      );
  };


  // ========================================
  // CLOSE MOBILE SIDEBAR
  // ========================================

  const closeMobile =
    (): void => {
      onClose?.();
    };


  // ========================================
  // SCREEN RESIZE LISTENER
  // ========================================

  useEffect(() => {
    const onResize =
      (): void => {
        setScreenWidth(
          window.innerWidth
        );
      };


    window.addEventListener(
      "resize",
      onResize
    );


    return () => {
      window.removeEventListener(
        "resize",
        onResize
      );
    };
  }, []);


  // ========================================
  // AUTO COLLAPSE BY SCREEN SIZE
  // ========================================

  useEffect(() => {
    if (
      screenWidth >=
      1024
    ) {
      doToggle(
        true
      );

      return;
    }


    if (
      screenWidth >=
      768
    ) {
      doToggle(
        false
      );
    }
  }, [
    screenWidth,
  ]);


  // ========================================
  // ESCAPE KEY
  // ========================================

  useEffect(() => {
    const onKey = (
      event:
        KeyboardEvent
    ): void => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose?.();
      }
    };


    window.addEventListener(
      "keydown",
      onKey
    );


    return () => {
      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [
    onClose,
  ]);


  // ========================================
  // TIMER CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      clearLabelTimer();
    };
  }, []);


  // ========================================
  // NAVIGATION
  // ========================================

  const handleNav = (
    path: string
  ): void => {
    navigate(
      path
    );


    if (
      isMobile
    ) {
      closeMobile();
    }
  };


  // ========================================
  // SIDEBAR WIDTH
  // ========================================

  const sidebarWidth:
    string =
    isMobile
      ? isSidebarVisible
        ? "70px"
        : "0px"
      : isSidebarOpen
        ? "248px"
        : "70px";


  // ========================================
  // UI
  // ========================================

  return (
    <div
      style={{
        ...S.sidebar,

        background:
          `linear-gradient(
            180deg,
            ${COLORS.DARK} 0%,
            ${COLORS.DARKER} 100%
          )`,

        width:
          sidebarWidth,

        minWidth:
          0,

        transition:
          `width ${ANIM.WIDTH_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,

        fontFamily:
          "monospace",
      }}
    >
      {/* ========================================
          TOGGLE BUTTON
      ======================================== */}

      <div
        style={{
          ...S.toggleRow,

          justifyContent:
            isCollapsed
              ? "center"
              : "flex-end",
        }}
      >
        {!isMobile && (
          <button
            type="button"
            style={
              S.toggleBtn
            }
            onClick={() => {
              doToggle(
                !isSidebarOpen
              );
            }}
            title={
              isSidebarOpen
                ? "Collapse"
                : "Expand"
            }
          >
            {isSidebarOpen ? (
              <MdKeyboardDoubleArrowLeft
                style={{
                  fontSize:
                    30,
                }}
              />
            ) : (
              <MdKeyboardDoubleArrowRight
                style={{
                  fontSize:
                    30,
                }}
              />
            )}
          </button>
        )}
      </div>


      {/* ========================================
          NAVIGATION AREA
      ======================================== */}

      <div
        style={
          S.navOuter
        }
      >
        <div
          style={
            S.navScroll
          }
        >
          {/* ========================================
              LOGO
          ======================================== */}

          <NavItem
            icon={
              renderIcon(
                "logo"
              )
            }
            label="School Portal"
            onClick={() => {
              handleNav(
                "/dashboard"
              );
            }}
            isCollapsed={
              isCollapsed
            }
            labelVisible={
              effectiveLabelVisible
            }
            widthDuration={
              ANIM.WIDTH_DURATION
            }
            labelDuration={
              ANIM.LABEL_DURATION
            }
          />


          {/* ========================================
              DASHBOARD
          ======================================== */}

          <NavItem
            icon={
              renderIcon(
                "dashboard"
              )
            }
            label="Dashboard"
            onClick={() => {
              handleNav(
                "/dashboard"
              );
            }}
            isCollapsed={
              isCollapsed
            }
            labelVisible={
              effectiveLabelVisible
            }
            widthDuration={
              ANIM.WIDTH_DURATION
            }
            labelDuration={
              ANIM.LABEL_DURATION
            }
          />


          {!isCollapsed && (
            <div
              style={
                S.divider
              }
            />
          )}


          {/* ========================================
              ACADEMIC SECTION
          ======================================== */}

          <SectionLabel
            label="ACADEMIC"
            isCollapsed={
              isCollapsed
            }
            labelVisible={
              effectiveLabelVisible
            }
            labelDuration={
              ANIM.LABEL_DURATION
            }
          />


          {academicItems.map(
            (
              item
            ) => (
              <NavItem
                key={
                  item.label
                }
                icon={
                  renderIcon(
                    item.iconKey
                  )
                }
                label={
                  item.label
                }
                onClick={() => {
                  handleNav(
                    item.path
                  );
                }}
                isCollapsed={
                  isCollapsed
                }
                labelVisible={
                  effectiveLabelVisible
                }
                widthDuration={
                  ANIM.WIDTH_DURATION
                }
                labelDuration={
                  ANIM.LABEL_DURATION
                }
              />
            )
          )}


          {!isCollapsed && (
            <div
              style={
                S.divider
              }
            />
          )}


          {/* ========================================
              SETTINGS
          ======================================== */}

          <NavItem
            icon={
              renderIcon(
                "settings"
              )
            }
            label="Account Settings"
            onClick={() => {
              handleNav(
                "/settings"
              );
            }}
            isCollapsed={
              isCollapsed
            }
            labelVisible={
              effectiveLabelVisible
            }
            widthDuration={
              ANIM.WIDTH_DURATION
            }
            labelDuration={
              ANIM.LABEL_DURATION
            }
          />
        </div>
      </div>
    </div>
  );
}

export default SideBar;