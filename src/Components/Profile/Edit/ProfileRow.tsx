import type {
  MouseEventHandler,
  ReactNode,
} from "react";

import {
  Box,
  Typography,
} from "@mui/material";


// ========================================
// COMPONENT PROPS
// ========================================

interface ProfileRowProps {
  /*
   * Text or JSX displayed on the left side.
   */
  label: ReactNode;

  /*
   * Main value displayed on the right side.
   *
   * ReactNode lets us safely render strings,
   * numbers, icons, or formatted JSX.
   */
  value?: ReactNode;

  /*
   * Optional icon displayed beside the label.
   */
  icon?: ReactNode;

  /*
   * Optional click handler.
   *
   * The handler belongs to the outer MUI Box,
   * which renders as a div by default.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /*
   * Optional content displayed after the value,
   * such as an arrow or edit icon.
   */
  right?: ReactNode;

  /*
   * When true, show "Loading..." instead
   * of the current value.
   */
  loading?: boolean;
}


// ========================================
// COMPONENT
// ========================================

export default function ProfileRow({
  label,
  value,
  icon,
  onClick,
  right,
  loading = false,
}: ProfileRowProps) {
  return (
    <Box
      onClick={
        onClick
      }

      /*
       * Preserve the original accessibility
       * behaviour for clickable rows.
       */
      role={
        onClick
          ? "button"
          : undefined
      }

      tabIndex={
        onClick
          ? 0
          : undefined
      }

      sx={{
        display:
          "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        gap:
          1.5,

        px:
          2,

        py:
          1.5,

        cursor:
          onClick
            ? "pointer"
            : "default",

        "&:hover":
          onClick
            ? {
                backgroundColor:
                  "#f8fafc",
              }
            : undefined,
      }}
    >
      {/* ========================================
          LEFT SIDE
      ======================================== */}

      <Box
        sx={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            1,
        }}
      >
        {icon}

        <Typography
          sx={{
            fontSize:
              13,

            color:
              "#6b7280",
          }}
        >
          {label}
        </Typography>
      </Box>


      {/* ========================================
          RIGHT SIDE
      ======================================== */}

      <Box
        sx={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize:
              14,

            color:
              "#111827",
          }}
        >
          {loading
            ? "Loading..."
            : value}
        </Typography>

        {right}
      </Box>
    </Box>
  );
}