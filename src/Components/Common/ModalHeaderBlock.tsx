import type {
  ReactNode,
} from "react";

import Modal from "react-bootstrap/Modal";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalHeaderBlockProps {
  /*
   * Text displayed in the modal header.
   */
  title: string;


  /*
   * TypeScript:
   * ReactNode allows us to pass any valid React
   * content here, including MUI icons and
   * react-icons components.
   *
   * Example:
   *
   * <MdAssignmentTurnedIn />
   * <RiEdit2Fill />
   */
  icon: ReactNode;


  /*
   * Optional custom background gradient.
   *
   * If the parent does not provide one,
   * we keep the existing navy/blue gradient.
   */
  gradient?: string;
}


// ========================================
// COMPONENT
// ========================================

const ModalHeaderBlock = ({
  title,
  icon,
  gradient =
    "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
}: ModalHeaderBlockProps) => {
  return (
    <Modal.Header
      closeButton
      style={{
        background:
          gradient,

        color:
          "white",

        borderBottom:
          "none",

        borderRadius:
          "16px 16px 0 0",

        padding:
          "16px 22px",
      }}
    >
      <Modal.Title
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            12,

          fontSize:
            18,

          fontWeight:
            900,
        }}
      >
        {/* ========================================
            ICON
        ======================================== */}

        <div
          style={{
            width:
              38,

            height:
              38,

            borderRadius:
              12,

            fontSize:
              "24px",

            background:
              "rgba(255,255,255,0.14)",

            border:
              "1px solid rgba(255,255,255,0.22)",

            display:
              "grid",

            placeItems:
              "center",

            color:
              "white",
          }}
        >
          {icon}
        </div>


        {/* ========================================
            TITLE
        ======================================== */}

        <div
          style={{
            lineHeight:
              1.1,
          }}
        >
          <div
            style={{
              fontSize:
                18,
            }}
          >
            {title}
          </div>
        </div>
      </Modal.Title>
    </Modal.Header>
  );
};

export default ModalHeaderBlock;