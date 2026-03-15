export const COLORS = {
  DARKER: "#05113f",
  DARK: "#1b3dc7",
  TEXT: "rgba(255,255,255,0.78)",
  MUTED: "rgba(255,255,255,0.38)",
};

export const ANIM = {
  WIDTH_DURATION: 900,
  LABEL_DURATION: 100,
};

export const S = {
  sidebar: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    overflowX: "visible",
    boxShadow: "4px 0 28px rgba(0,0,0,0.5)",
    flexShrink: 0,
    position: "relative",
  },

  toggleRow: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    padding: "10px 10px 6px",
  },

  toggleBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1.3px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    flexShrink: 0,
    padding: 0,
  },

  navOuter: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  navScroll: {
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none",
  },

  sectionLabel: {
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1.6px",
    textTransform: "uppercase",
    padding: "2px 18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  divider: {
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    margin: "8px 0",
    width: "100%",
  },

  item: {
    display: "flex",
    flex:"row",
    alignItems: "center",
    height:"55px",
    cursor: "pointer",
    position: "relative",
    overflow: "visible",
  },

  iconWrap: {
 // border:"2px solid white",
    height: "50px",
    width:"50px",
    display: "flex", 
    alignItems: "center" ,
    justifyContent:"center",
    padding:"0px"
  },

  itemLabel: {
    flex: 1,
    transformOrigin: "left center",
    whiteSpace: "nowrap",
    fontSize: "18px",
    fontWeight: 500,
    overflow: "hidden",
    fontFamily:""
    // border:"2px solid green"
  },

 signout: {
  cursor: "pointer",
  color: "#f96f6f",
  height: "50px",
  width: "100%",
  position: "absolute",
  bottom: 0,
  //left: 0,
  boxSizing: "border-box",
},

  tooltip: {
    position: "absolute",
    left: "60px",
    top: "50%",
    transform: "translateY(-50%) translateX(6px)",
    background: "#0f39b6",
    color: "#f1f5f9",
    padding: "5px 11px",
    borderRadius: "7px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: 9999,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
    transition: "opacity 0.15s ease, transform 0.15s ease",
  },
};