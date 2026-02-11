import React from "react";
import {
  Box,
  Button,
  Collapse,
  Paper,
} from "@mui/material";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const TableFilter = ({
  open,
  setOpen,
  children,
  onApply,
  onReset,
}) => {
  return (
    <Box sx={{  minWidth: 320,  maxWidth: 520,}}>
      {/* Toggle Button */}
      <Button
        variant="contained"
        size="small"
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderRadius: open ? "4px 4px 0 0" : "4px",
          backgroundColor:"  #2c51c1",
        }}
      >
        Filter {open ? <AiOutlineMinus /> : <AiOutlinePlus />}
      </Button>

      {/* Filter Content */}
      <Collapse in={open}>
        <Paper
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: 3,
          }}
        >
          {children}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 1,  }}>
            <Button
              variant="contained"
              size="small"
              onClick={onApply}
              sx={{ backgroundColor:" #2c51c1"}}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onReset}
              sx={{ borderColor:" #2c51c1", color:" #2c51c1"}}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TableFilter;
