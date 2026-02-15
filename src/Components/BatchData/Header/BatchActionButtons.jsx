import React from "react";
import { Box, Button } from "@mui/material";
import { GroupAdd } from "@mui/icons-material";
import { primaryActionButtonStyles } from "../../utils/constant";

const BatchActionButtons = ({ setShowAdd }) => {
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
      {/* Add Batch Button */}
      <Button
        variant="contained"
        startIcon={<GroupAdd />}
        onClick={() => setShowAdd(true)}
        sx={primaryActionButtonStyles}
      >
        Add Batch
      </Button>
    </Box>
  );
};

export default BatchActionButtons;