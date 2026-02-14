import React, { useMemo } from "react";
import Grid from "@mui/material/Grid2";
import {
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  School,
  LocationOn,
  CalendarMonth,
  Wifi,
  WifiOff,
  Tag,
  CheckCircle,
  Person,
  Today,
} from "@mui/icons-material";

const BatchFilterFields = ({
  // Filter values
  batchNumber,
  setBatchNumber,
  courseName,
  setCourseName,
  location,
  setLocation,
  createdBy,
  setCreatedBy,
  status,
  setStatus,
  sessionType,
  setSessionType,
  sessionDay,
  setSessionDay,
  // Data for dropdowns
  batchData,
  courseData,
}) => {
  // Get unique values for autocomplete
  const uniqueCourseNames = useMemo(() => {
    if (!courseData) return [];
    return [...new Set(courseData.map((c) => c?.courseName).filter(Boolean))].sort();
  }, [courseData]);

  const uniqueLocations = useMemo(() => {
    if (!batchData) return [];
    return [...new Set(batchData.map((b) => b?.location).filter(Boolean))].sort();
  }, [batchData]);

  const uniqueBatchNumbers = useMemo(() => {
    if (!batchData) return [];
    return [...new Set(batchData.map((b) => b?.batchNumber).filter(Boolean))].sort();
  }, [batchData]);

  // Shared styles
  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.5,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  const selectSx = {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
      borderWidth: "2px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* Batch Number */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <Tag sx={{ fontSize: 16 }} />
            Batch Number
          </Typography>
          <Autocomplete
            freeSolo
            options={uniqueBatchNumbers}
            value={batchNumber}
            onChange={(e, newValue) => setBatchNumber(newValue || "")}
            onInputChange={(e, newInputValue) => setBatchNumber(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search batch number..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Course Name */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <School sx={{ fontSize: 16 }} />
            Course Name
          </Typography>
          <Autocomplete
            freeSolo
            options={uniqueCourseNames}
            value={courseName}
            onChange={(e, newValue) => setCourseName(newValue || "")}
            onInputChange={(e, newInputValue) => setCourseName(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select or type course..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Location */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <LocationOn sx={{ fontSize: 16 }} />
            Location
          </Typography>
          <Autocomplete
            freeSolo
            options={uniqueLocations}
            value={location}
            onChange={(e, newValue) => setLocation(newValue || "")}
            onInputChange={(e, newInputValue) => setLocation(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search location..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Created By */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <Person sx={{ fontSize: 16 }} />
            Created By
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="Enter creator name..."
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94a3b8", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <CheckCircle sx={{ fontSize: 16 }} />
            Status
          </Typography>
          <FormControl size="small" fullWidth>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={selectSx}>
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Status</em>
              </MenuItem>
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Training Completed">Training Completed</MenuItem>
              <MenuItem value="Batch Completed">Batch Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Session Type */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <Wifi sx={{ fontSize: 16 }} />
            Session Type
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              sx={selectSx}
            >
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Types</em>
              </MenuItem>
              <MenuItem value="Online">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Wifi sx={{ fontSize: 16, color: "#059669" }} />
                  Online
                </Box>
              </MenuItem>
              <MenuItem value="At School">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WifiOff sx={{ fontSize: 16, color: "#dc2626" }} />
                  At School
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Session Day */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={labelSx}>
            <Today sx={{ fontSize: 16 }} />
            Session Day
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={sessionDay}
              onChange={(e) => setSessionDay(e.target.value)}
              sx={selectSx}
            >
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Days</em>
              </MenuItem>
              <MenuItem value="Weekday">📅 Weekday</MenuItem>
              <MenuItem value="Weekend">🎉 Weekend</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BatchFilterFields;