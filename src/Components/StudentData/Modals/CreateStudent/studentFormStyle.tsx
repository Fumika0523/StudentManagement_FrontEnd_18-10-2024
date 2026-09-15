import {
  cloneElement,
} from "react";

import type {
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";


// ========================================
// SHARED ICON TYPE
// ========================================

/*
 * TypeScript:
 * FieldGroup and Section receive icons as JSX.
 *
 * The existing component uses React.cloneElement()
 * to add an `sx` prop to the icon.
 *
 * Most of the icons currently passed here are
 * MUI icons, which support the sx prop.
 */
interface IconProps {
  sx?: unknown;
}


// ========================================
// FIELD GROUP PROPS
// ========================================

interface FieldGroupProps {
  icon?:
    ReactElement<IconProps>;

  label: ReactNode;

  required?: boolean;

  /*
   * Formik expressions such as:
   *
   * formik.touched.email &&
   * formik.errors.email
   *
   * may return:
   *
   * string
   * false
   * undefined
   *
   * ReactNode safely supports all of those.
   */
  error?: ReactNode;

  children: ReactNode;
}


// ========================================
// FIELD GROUP
// ========================================

export const FieldGroup = ({
  icon,
  label,
  required = false,
  error,
  children,
}: FieldGroupProps) => {
  return (
    <div
      style={{
        marginBottom:
          14,
      }}
    >
      <label
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            6,

          fontSize:
            11,

          fontWeight:
            800,

          letterSpacing:
            "0.08em",

          textTransform:
            "uppercase",

          color:
            "#64748b",

          marginBottom:
            6,
        }}
      >
        {/* ========================================
            FIELD ICON
        ======================================== */}

        {icon &&
          cloneElement(
            icon,
            {
              sx: {
                fontSize:
                  15,

                color:
                  "#94a3b8",
              },
            }
          )}


        {/* ========================================
            FIELD LABEL
        ======================================== */}

        <span>
          {label}
        </span>


        {/* Red asterisk is only shown
            when the field is required. */}

        {required && (
          <span
            style={{
              color:
                "#ef4444",
            }}
          >
            *
          </span>
        )}
      </label>


      {/* ========================================
          INPUT / SELECT
      ======================================== */}

      {children}


      {/* ========================================
          VALIDATION ERROR
      ======================================== */}

      {error && (
        <div
          style={{
            marginTop:
              6,

            padding:
              "7px 10px",

            borderRadius:
              10,

            background:
              "#fff1f2",

            border:
              "1px solid #fecdd3",

            color:
              "#b91c1c",

            fontSize:
              12,

            fontWeight:
              700,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};


// ========================================
// SECTION PROPS
// ========================================

interface SectionProps {
  /*
   * title is optional because the existing
   * component allows Sections without headers.
   */
  title?: ReactNode;

  icon?:
    ReactElement<IconProps>;

  children: ReactNode;
}


// ========================================
// SECTION
// ========================================

/*
 * Shared card-style container used by
 * Student forms and signup forms.
 */
export const Section = ({
  title,
  icon,
  children,
}: SectionProps) => {
  return (
    <div
      style={{
        backgroundColor:
          "#fff",

        borderRadius:
          12,

        border:
          "1px solid #e9eef4",

        padding:
          "16px 18px",

        marginBottom:
          14,

        boxShadow:
          "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* ========================================
          OPTIONAL SECTION HEADER
      ======================================== */}

      {title && (
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              7,

            fontSize:
              12,

            fontWeight:
              700,

            color:
              "#1f3fbf",

            letterSpacing:
              "0.05em",

            textTransform:
              "uppercase",

            marginBottom:
              14,

            paddingBottom:
              10,

            borderBottom:
              "1px dashed #e2e8f0",
          }}
        >
          {/*
           * React.cloneElement lets us add styling
           * to an icon supplied by the parent
           * without changing every caller.
           */}
          {icon &&
            cloneElement(
              icon,
              {
                sx: {
                  fontSize:
                    16,
                },
              }
            )}


          {title}
        </div>
      )}


      {/* Actual form controls supplied by the parent. */}

      {children}
    </div>
  );
};


// ========================================
// SHARED INPUT STYLE
// ========================================

/*
 * TypeScript:
 * CSSProperties verifies that these values are
 * valid React inline CSS properties.
 *
 * This object is spread into Form.Control,
 * Form.Select, etc.
 */
export const inputStyle:
  CSSProperties = {
  fontSize:
    13,

  borderRadius:
    10,

  border:
    "1px solid #e2e8f0",

  padding:
    "9px 12px",

  backgroundColor:
    "#fff",

  color:
    "#1e293b",

  boxShadow:
    "0 1px 0 rgba(15, 23, 42, 0.02)",
};


// ========================================
// SHARED PANEL STYLE
// ========================================

export const panelStyle:
  CSSProperties = {
  backgroundColor:
    "#fff",

  borderRadius:
    14,

  border:
    "1px solid #e9eef4",

  padding:
    "16px 18px",

  boxShadow:
    "0 6px 18px rgba(2, 6, 23, 0.05)",
};