import React, { useState } from "react";
import { Box, Button, Collapse, FormControl, MenuItem, Paper, Select, Autocomplete, TextField  } from "@mui/material";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";


const FilterPanel = ({ filters, setFilters, onApply, onReset, options }) => {
  const [open, setOpen] = useState(true);
  const [courseInput, setCourseInput] = useState('');
  const [batchData,setBatchData] = useState([])
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const uniqueCourses = [...new Set(batchData.map(b => b.courseName))];
  const [selectedCourse, setSelectedCourse] = useState(null);
  
    const handleApplyFilter = () => {
    let filtered = [...batchData];

    if (selectedCourse) {
      filtered = filtered.filter(batch =>
        batch.courseName?.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    if (batchStatus) {
      filtered = filtered.filter(batch =>
        batch.status?.toLowerCase() === batchStatus.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setShowTable(true); // show table after applying filter
  };

  return (
    <>
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
        }}
      >
        Filters {open ? <AiOutlineMinus /> : <AiOutlinePlus />}
      </Button>

      {/* Collapsible Filter Area */}
      <Collapse in={open}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 2,
            mb: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: 3,
          }}
        >
          {/* === Filter Fields === */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
              justifyContent: "start",
            }}
          >

               {/* Course Name */}
          <Box sx={{ display: 'flex', flexDirection: 'column', width: 200 }}>
              <span className='mb-0' style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                Course Name
              </span>
              <Autocomplete
                freeSolo
                options={uniqueCourses}
                inputValue={courseInput}
                onInputChange={(e, newValue) => setCourseInput(newValue)}
                value={selectedCourse}
                onChange={(e, newValue) => setSelectedCourse(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="" size="small" />
                )}
              />
          </Box>

            {/* Gender */}
            {options.gender && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Gender</span>
                <Select
                  value={filters.gender || ""}
                  displayEmpty
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  {options.gender.map((g, i) => (
                    <MenuItem key={i} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Batch */}
            {options.batch && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Batch</span>
                <Select
                  value={filters.batch || ""}
                  displayEmpty
                  onChange={(e) => handleChange("batch", e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  {options.batch.map((b, i) => (
                    <MenuItem key={i} value={b}>{b}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}



            {/* Date */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Created</span>
              <Select
                value={filters.date || ""}
                displayEmpty
                onChange={(e) => handleChange("date", e.target.value)}
              >
                <MenuItem value="">--Select--</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="last7">Last 7 Days</MenuItem>
                <MenuItem value="last30">Last 30 Days</MenuItem>
                <MenuItem value="older">Older</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleApplyFilter}
            >
              Apply
            </Button>
            <Button variant="outlined" size="small" onClick={onReset}>
              Reset
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default FilterPanel;
