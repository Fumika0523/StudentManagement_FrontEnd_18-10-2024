import React, { useMemo } from "react";
import Grid from "@mui/material/Grid";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { 
  Search,  School,  Groups, Person,  CalendarMonth, Wifi, WifiOff 
} from "@mui/icons-material";


const FilterFields = ({
  courseName,
  setCourseName,
  courseData,  
  sessionType,
  setSessionType,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}) => {
  const safeDateRange = dateRange || { from: null, to: null };
  const isCustom = datePreset === "custom";

  const handleDatePresetChange = (value) => {
    setDatePreset(value);
    if (value !== "custom") {
      setDateRange({ from: null, to: null });
    }
  };

  // Get unique course names for autocomplete
  const uniqueCourseNames = useMemo(() => {
    if (!courseData) return [];
    const names = courseData
      .map(c => c?.courseName)
      .filter(Boolean)
      .filter((name, index, self) => self.indexOf(name) === index);
    return names.sort((a, b) => a.localeCompare(b));
  }, [courseData]);

  // Compact styles
  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.5,
    color: "#475569",
    letterSpacing: "0.025em",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f8fafc",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3b82f6",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3b82f6",
          borderWidth: "2px",
        },
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
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  };

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* Course Name with Autocomplete */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                placeholder="Select or type course name..."
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
            sx={{
              "& .MuiAutocomplete-popupIndicator": {
                color: "#94a3b8",
              },
              "& .MuiAutocomplete-clearIndicator": {
                color: "#94a3b8",
              },
            }}
          />
        </Grid>

           {/* Session Type */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                  <Typography sx={labelSx}>
                    <Wifi sx={{ fontSize: 16 }} />
                    Session Type
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select value={sessionType} onChange={(e) => setSessionType(e.target.value)} sx={selectSx}>
                      <MenuItem value="">
                        <em style={{ color: "#94a3b8", fontSize: "14px" }}>All Types</em>
                      </MenuItem>
                      <MenuItem value="Online">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Wifi sx={{ fontSize: 16, color: "#059669" }} />
                          Online
                        </Box>
                      </MenuItem>
                      <MenuItem value="Offline">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WifiOff sx={{ fontSize: 16, color: "#dc2626" }} />
                          Offline
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

        {/* Created Date - Preset Dropdown */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={labelSx}>
            <CalendarMonth sx={{ fontSize: 16 }} />
            Created Date
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={datePreset || ""}
              onChange={(e) => handleDatePresetChange(e.target.value)}
              sx={selectSx}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ color: "#94a3b8", fontSize: "14px" }}>
                  All Dates
                </em>
              </MenuItem>
              <MenuItem value="today">📅 Today</MenuItem>
              <MenuItem value="7d">📊 Last 7 days</MenuItem>
              <MenuItem value="30d">📈 Last 30 days</MenuItem>
              <MenuItem value="month">🗓️ This month</MenuItem>
              <MenuItem value="year">📆 This year</MenuItem>
              <MenuItem value="custom">🎯 Custom range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Date Range - From Date */}
        {isCustom && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={labelSx}>
              <CalendarMonth sx={{ fontSize: 16 }} />
              From Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={
                  safeDateRange.from ? dayjs(safeDateRange.from) : null
                }
                onChange={(v) =>
                  setDateRange((prev) => ({
                    ...(prev || { from: null, to: null }),
                    from: v ? v.toDate() : null,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
                    placeholder: "Start date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}

        {/* Custom Date Range - To Date */}
        {isCustom && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={labelSx}>
              <CalendarMonth sx={{ fontSize: 16 }} />
              To Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={safeDateRange.to ? dayjs(safeDateRange.to) : null}
                onChange={(v) =>
                  setDateRange((prev) => ({
                    ...(prev || { from: null, to: null }),
                    to: v ? v.toDate() : null,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
                    placeholder: "End date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FilterFields;