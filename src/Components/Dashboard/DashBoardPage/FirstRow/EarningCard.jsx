import React from "react";
import { TfiBag } from "react-icons/tfi";
import { FaDollarSign, FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

function EarningCard({ title, total, icon, color }) {
  const Icons = {
    TfiBag,
    FaDollarSign,
    FaClipboardList,
    IoIosChatbubbles,
  };

  const IconComponent = Icons[icon];

  const borderStyle = {
    backgroundColor: "white",
    width: "100%",              // ✅ not minWidth
    height: "100px",
    borderLeft: "6px solid",    // ✅ consistent thickness
    borderColor: color,
  };

  return (
    <div className="rounded d-flex align-items-center px-3 py-2 shadow-sm" style={borderStyle}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <div style={{ fontSize: 14, color, fontWeight: 600, letterSpacing: 0.3 }}>
            {title}
          </div>
          <div className="fw-bold fs-4 mb-0">{total}</div>
        </div>

        <div className="d-flex align-items-center">
          {IconComponent ? (
            <IconComponent style={{ fontSize: "2.2rem", color: "#dddfeb" }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EarningCard;
