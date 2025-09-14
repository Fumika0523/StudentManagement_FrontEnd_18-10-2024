import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  TextField,
  Autocomplete,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// --- Table Styles (same as your original) ---
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "15px",
    padding: "10px 15px",
    textWrap: "noWrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "15px",
    textAlign: "center",
    padding: "10px 15px",
    textWrap: "noWrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#b3e5fc",
  },
}));

const Batch = ({ batchData }) => {
  const [open, setOpen] = useState(false);
  const [courseInput, setCourseInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batchStatus, setBatchStatus] = useState("");
  const [filteredData, setFilteredData] = useState(batchData);

  // Get unique course names
  const uniqueCourses = [...new Set(batchData.map((b) => b.courseName))];

  const handleSubmit = () => {
    let filtered = batchData;

    if (selectedCourse) {
      filtered = filtered.filter(
        (b) =>
          b.courseName &&
          b.courseName.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    if (batchStatus) {
      filtered = filtered.filter(
        (b) => b.status && b.status.toLowerCase() === batchStatus.toLowerCase()
      );
    }

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setCourseInput("");
    setSelectedCourse(null);
    setBatchStatus("");
    setFilteredData(batchData);
  };

  // Format Date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box p={2}>
      {/* Filter Toggle Button */}
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(!open)}
        sx={{ mb: 2 }}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        {open ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filter Panel */}
      <Collapse in={open}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Course Name Filter */}
          <Autocomplete
            freeSolo
            options={uniqueCourses}
            inputValue={courseInput}
            onInputChange={(event, newValue) => setCourseInput(newValue)}
            value={selectedCourse}
            onChange={(event, newValue) => setSelectedCourse(newValue)}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="Course Name" size="small" />
            )}
          />

          {/* Batch Status Filter */}
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Batch Status</InputLabel>
            <Select
              value={batchStatus}
              label="Batch Status"
              onChange={(e) => setBatchStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="deactive">Deactive</MenuItem>
            </Select>
          </FormControl>

          {/* Apply & Reset Buttons */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Paper>
      </Collapse>

      {/* Table (original structure) */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>No.</StyledTableCell>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell>Batch Number</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Updated At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((batch, index) => (
              <StyledTableRow key={batch._id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{batch.courseName}</StyledTableCell>
                <StyledTableCell>{batch.batchNumber}</StyledTableCell>
                <StyledTableCell>{batch.status}</StyledTableCell>
                <StyledTableCell>{formatDate(batch.startDate)}</StyledTableCell>
                <StyledTableCell>{formatDate(batch.endDate)}</StyledTableCell>
                <StyledTableCell>{formatDate(batch.createdAt)}</StyledTableCell>
                <StyledTableCell>{formatDate(batch.updatedAt)}</StyledTableCell>
              </StyledTableRow>
            ))}
            {filteredData.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  No records found
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Batch;
