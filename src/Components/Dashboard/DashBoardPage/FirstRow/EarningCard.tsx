import type {
  CSSProperties,
} from "react";

import type {
  IconType,
} from "react-icons";

import {
  TfiBag,
} from "react-icons/tfi";

import {
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";

import {
  IoIosChatbubbles,
} from "react-icons/io";


// ========================================
// ICON NAME TYPE
// ========================================

/*
 * TypeScript:
 * Only these icon names are supported by
 * this card because they exist in the icon map.
 *
 * Exporting the type will also be useful when
 * we migrate EarningCardDisplay.tsx next.
 */
export type EarningIconName =
  | "TfiBag"
  | "FaDollarSign"
  | "FaClipboardList"
  | "IoIosChatbubbles";


// ========================================
// COMPONENT PROPS
// ========================================

export interface EarningCardProps {
  title: string;

  /*
   * Earnings may be returned as either a number
   * or a pre-formatted string from the backend.
   */
  total: number | string;

  icon: EarningIconName;

  /*
   * Used for both the card's left border
   * and the title colour.
   */
  color: string;
}


// ========================================
// AVAILABLE ICONS
// ========================================

/*
 * Record guarantees that every valid
 * EarningIconName points to a React icon component.
 */
const Icons:
  Record<
    EarningIconName,
    IconType
  > = {
  TfiBag,

  FaDollarSign,

  FaClipboardList,

  IoIosChatbubbles,
};


// ========================================
// COMPONENT
// ========================================

function EarningCard({
  title,
  total,
  icon,
  color,
}: EarningCardProps) {
  /*
   * TypeScript already guarantees `icon` is one
   * of the keys in Icons, so this lookup is safe.
   */
  const IconComponent =
    Icons[icon];


  // ========================================
  // CARD STYLE
  // ========================================

  /*
   * CSSProperties gives the inline style object
   * proper React CSS typing.
   */
  const borderStyle:
    CSSProperties = {
    backgroundColor:
      "white",

    width:
      "100%",

    height:
      "100px",

    borderLeft:
      "6px solid",

    borderColor:
      color,
  };


  return (
    <div
      className="rounded d-flex align-items-center px-3 py-2 shadow mb-2"
      style={
        borderStyle
      }
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* ========================================
            CARD VALUE
        ======================================== */}

        <div>
          <div
            style={{
              fontSize:
                14,

              color,

              fontWeight:
                600,

              letterSpacing:
                0.3,
            }}
          >
            {title}
          </div>


          <div className="fw-bold fs-4 mb-0">
            {total}
          </div>
        </div>


        {/* ========================================
            CARD ICON
        ======================================== */}

        <div className="d-flex align-items-center">
          <IconComponent
            style={{
              fontSize:
                "2.2rem",

              color:
                "#dddfeb",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EarningCard;