import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

const labelSx = { fontSize: 12, fontWeight: 700, mb: 0, color: "#24155" };
const controlSx = {
  "& .MuiInputBase-root": { borderRadius: 2 },
};

const FilterFields = ({
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,

  batchStatus,
  setBatchStatus,

  studentName,
  setStudentName,
  emailSearch,
  setEmailSearch,
  genderFilter,
  setGenderFilter,
  dateFilter,
  setDateFilter,
  sessionType,
  setSessionType,
}) => {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {/* Student Name */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Student Name</Typography>
        <TextField
          size="small"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Search name"
          fullWidth
          sx={controlSx}
        />
      </Grid>

      {/* Email */}
      {/* <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Email</Typography>
        <TextField
          size="small"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          placeholder="Search email"
          fullWidth
          sx={controlSx}
        />
      </Grid> */}

      {/* Course Name */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Course Name</Typography>
        <Autocomplete
          freeSolo
          options={uniqueCourses || []}
          value={selectedCourse}
          inputValue={courseInput}
          onInputChange={(e, v) => setCourseInput(v)}
          onChange={(e, v) => setSelectedCourse(v)}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth sx={controlSx} />
          )}
        />
      </Grid>

      {/* Batch Status */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Batch Status</Typography>
        <FormControl size="small" fullWidth sx={controlSx}>
          <Select value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)}>
            <MenuItem value="">--Select--</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Training Completed">Training Completed</MenuItem>
            <MenuItem value="Batch Completed">Batch Completed</MenuItem>
            <MenuItem value="Not Started">Not Started</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Gender */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Gender</Typography>
        <FormControl size="small" fullWidth sx={controlSx}>
          <Select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <MenuItem value="">--Select--</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Created Date */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Created Date</Typography>
        <FormControl size="small" fullWidth sx={controlSx}>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <MenuItem value="">--Select--</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Session Type */}
      <Grid item xs={6} sm={4} md={2}>
        <Typography sx={labelSx}>Session Type</Typography>
        <FormControl size="small" fullWidth sx={controlSx}>
          <Select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
            <MenuItem value="">--Select--</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Offline">Offline</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FilterFields;
