import React from "react";
import { Box, Button } from "@mui/material";
import { GroupAdd } from "@mui/icons-material";
import { primaryActionButtonStyles } from "../../utils/constant";
import { MdBadge } from "react-icons/md";


const BatchActionButtons = ({ setShowAdd }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 1,
        justifyContent:"flex-end",
        alignItems: "center",
      }}
    >
      {/* Add Batch Button */}
      <Button
        variant="contained"
        startIcon={<MdBadge />}
        onClick={() => setShowAdd(true)}
        sx={primaryActionButtonStyles}
      >
        Add Batch
      </Button>
    </Box>
  );
};

export default BatchActionButtons;