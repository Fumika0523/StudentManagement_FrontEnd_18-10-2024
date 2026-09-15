import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Box,
  Button,
} from "@mui/material";

import { MdBadge } from "react-icons/md";

import {
  primaryActionButtonStyles,
} from "../../utils/constant";


// ========================================
// COMPONENT PROPS
// ========================================

interface BatchActionButtonsProps {
  /*
   * TypeScript:
   * setShowAdd comes from useState<boolean>()
   * inside BatchHeader.
   *
   * Using Dispatch<SetStateAction<boolean>>
   * keeps it compatible with normal updates:
   *
   * setShowAdd(true)
   *
   * and functional updates:
   *
   * setShowAdd((previous) => !previous)
   */
  setShowAdd: Dispatch<
    SetStateAction<boolean>
  >;
}


const BatchActionButtons = ({
  setShowAdd,
}: BatchActionButtonsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {/* Add Batch Button */}
      <Button
        variant="contained"
        startIcon={<MdBadge />}
        onClick={() =>
          setShowAdd(true)
        }
        sx={
          primaryActionButtonStyles
        }
      >
        Add Batch
      </Button>
    </Box>
  );
};

export default BatchActionButtons;