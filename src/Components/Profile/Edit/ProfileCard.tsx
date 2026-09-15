import type {
  ReactNode,
} from "react";

import {
  Box,
  Divider,
  Paper,
  Typography,
} from "@mui/material";


// ========================================
// COMPONENT PROPS
// ========================================

interface ProfileCardProps {
  /*
   * Main heading shown at the top of the card.
   */
  title: ReactNode;

  /*
   * Small helper text under the title.
   *
   * ReactNode keeps this flexible in case we
   * later pass formatted text instead of only
   * a plain string.
   */
  hint?: ReactNode;

  /*
   * Any form or profile content can be rendered
   * inside the reusable card.
   */
  children: ReactNode;
}


// ========================================
// COMPONENT
// ========================================

export default function ProfileCard({
  title,
  hint,
  children,
}: ProfileCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border:
          "1px solid #e9eaf0",

        borderRadius:
          2,

        overflow:
          "hidden",

        boxShadow:
          "0 10px 22px rgba(17, 24, 39, 0.06)",
      }}
    >
      {/* ========================================
          CARD HEADER
      ======================================== */}

      <Box
        sx={{
          px:
            2,

          py:
            2,
        }}
      >
        <Typography
          sx={{
            fontSize:
              18,

            fontWeight:
              700,
          }}
        >
          {title}
        </Typography>


        {hint && (
          <Typography
            sx={{
              fontSize:
                13,

              color:
                "#6b7280",
            }}
          >
            {hint}
          </Typography>
        )}
      </Box>


      <Divider />


      {/* ========================================
          CARD CONTENT
      ======================================== */}

      {children}
    </Paper>
  );
}