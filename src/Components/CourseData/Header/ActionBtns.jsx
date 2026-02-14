import React from "react";
import { Box, Button } from "@mui/material";
import { School } from "@mui/icons-material";

const ActionBtns = ({ setShowAdd }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2,
        justifyContent: { xs: "flex-start", md: "flex-end" },
        alignItems: "center",
      }}
    >
      {/* Add Course Button */}
      <Button
        variant="contained"
        startIcon={<School />}
        onClick={() => setShowAdd(true)}
        sx={{
          backgroundColor: "#3b82f6",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          px: 2.5,
          py: 1,
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#2563eb",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-1px)",
          },
        }}
      >
        Add Course
      </Button>
    </Box>
  );
};

export default ActionBtns;