import React, { useState, useEffect } from "react";
import {
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper,
  Button, Grid, TextField, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, Checkbox, Collapse, Divider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../utils/constant";
import { FaUserClock } from "react-icons/fa";

export const UpdateAttendance = () => {
  const [batchData, setBatchData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceStatus, setAttendanceStatus] = useState("present");

  // Student list section 
  const [showStudentList, setShowStudentList] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const getBatchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/allbatch`, config);
      const inProgressBatches = res.data.batchData.filter(
        (batch) => batch.status === "In Progress"
      );
      setBatchData(inProgressBatches);
    } catch (error) {
      toast.error("Failed to load batch data");
    } finally {
      setLoading(false);
    }
  };

  const getAdmissionData = async () => {
    const res = await axios.get(`${url}/alladmission`, config);
    setAdmissionData(res.data.admissionData);
  };

  const getStudentData = async () => {
    const res = await axios.get(`${url}/allstudent`, config);
    setStudentData(res.data.studentData);
  };

  useEffect(() => {
    getBatchData();
    getAdmissionData();
    getStudentData();
  }, []);

  //  When batch/date/default-status changes, close the expanded list and reset selection
  useEffect(() => {
    setShowStudentList(false);
    setStudents([]);
    setSelectedStudentIds([]);
  }, [selectedBatch, attendanceDate, attendanceStatus]);

  //  Submit => expand and show list
  const handleSubmitClick = () => {
    if (!selectedBatch) return toast.warning("Please select a batch");

    setLoading(true);
    try {
      const studentsInBatchNames = admissionData
        .filter((admission) => admission.batchNumber === selectedBatch)
        .map((admission) => admission.studentName);

      const batchStudents = studentData.filter((student) =>
        studentsInBatchNames.includes(student.username)
      );

      if (batchStudents.length === 0) {
        toast.info("No students found in this batch.");
        setStudents([]);
        setShowStudentList(false);
        return;
      }

      setStudents(batchStudents);

      // default selection based on global status
      if (attendanceStatus === "present") {
        setSelectedStudentIds(batchStudents.map((s) => s._id));
      } else {
        setSelectedStudentIds([]);
      }

      setShowStudentList(true); //  expand section
    } catch (error) {
      console.error("Filter error:", error);
      toast.error("Error on fetching student data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedStudentIds(students.map((s) => s._id));
    else setSelectedStudentIds([]);
  };

  const handleCancel = () => {
    setShowStudentList(false);
    setStudents([]);
    setSelectedStudentIds([]);
    setSelectedBatch("");
    setAttendanceDate(new Date().toISOString().split("T")[0]);
    setAttendanceStatus("present");
  };

  const handleSaveAttendance = async () => {
    if (!students.length) return toast.warning("No students to save.");

    try {
      const attendanceRecords = students.map((student) => ({
        studentId: student._id,
        status: selectedStudentIds.includes(student._id) ? "Present" : "Absent",
      }));

      const payload = {
        batchId: selectedBatch, 
        date: attendanceDate,
        attendanceRecords,
      };

      await axios.post(`${url}/attendance`, payload, config);

      toast.success("Attendance recorded successfully!");
      setShowStudentList(false);
      setStudents([]);
      setSelectedStudentIds([]);
    } catch (error) {
      toast.error("Failed to save attendance");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "calc(100vh - 130px)",
        backgroundColor: "#f8f9fc",
      }}
    >
      <Paper
        elevation={3}
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          width: "100%", 
          maxWidth: "1000px",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, pb: 3, borderBottom: "2px solid #e0e0e0" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUserClock size={24} color="#fff" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#2c3e50" }}>
              Attendance Entry
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mark student attendance for the selected batch
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4} sx={{ justifyContent: "end",
    alignItems: "center",}} >
          {/* First Row - Three Fields */}
          <Grid item  size={{ sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Batch</InputLabel>
              <Select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                label="Select Batch"
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                }}
              >
                {batchData.map((batch) => (
                  <MenuItem key={batch._id} value={batch.batchNumber}>
                    {batch.batchNumber}
                  </MenuItem>
                ))}
                {batchData.length === 0 && (
                  <MenuItem disabled>No active batches found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item  size={{ sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
              }}
            />
          </Grid>

          <Grid item  size={{ sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Mark as</InputLabel>
              <Select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                label="Mark as"
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                }}
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Second Row - Submit Button aligned right */}
          <Grid item  size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSubmitClick}
                disabled={loading}
                size="medium"
                sx={{ 
                  py: 1.2,
                  px: 4,
                  borderRadius: 2,
                  backgroundColor: "#4e73df",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  boxShadow: "0 2px 6px rgba(78, 115, 223, 0.3)",
                  "&:hover": {
                    backgroundColor: "#224abe",
                    boxShadow: "0 4px 10px rgba(78, 115, 223, 0.4)",
                  },
                }}
              >
                {loading ? "Loading..." : "Submit & Show Student List"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/*  Expandable section */}
        <Collapse in={showStudentList} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #e0e0e0",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50" }}>
              Mark Attendance — Batch {selectedBatch} ({attendanceDate})
            </Typography>
            <Typography variant="body2" sx={{ color: "#4e73df", fontWeight: 600 }}>
              {selectedStudentIds.length} of {students.length} students marked present
            </Typography>
          </Box>

          <Box 
            sx={{ 
              overflowX: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fc" }}>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Student Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                    Present
                    <Checkbox
                      sx={{ 
                        ml: 1,
                        color: "#4e73df",
                        "&.Mui-checked": {
                          color: "#4e73df",
                        },
                      }}
                      checked={
                        students.length > 0 &&
                        selectedStudentIds.length === students.length
                      }
                      indeterminate={
                        selectedStudentIds.length > 0 &&
                        selectedStudentIds.length < students.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.map((student, index) => (
                  <TableRow 
                    key={student._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#fafbfc",
                      "&:hover": {
                        backgroundColor: "#f0f2f5",
                      },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>{student.username}</TableCell>
                    <TableCell align="right">
                      <Checkbox
                        checked={selectedStudentIds.includes(student._id)}
                        onChange={() => handleToggleStudent(student._id)}
                        sx={{
                          color: "#4e73df",
                          "&.Mui-checked": {
                            color: "#4e73df",
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: 2, 
              mt: 3,
              pt: 3,
              borderTop: "2px solid #e0e0e0",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#4e73df",
                color: "#4e73df",
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "#224abe",
                  backgroundColor: "rgba(78, 115, 223, 0.05)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAttendance}
              sx={{ 
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#4e73df",
                px: 4,
                py: 1.5,
                boxShadow: "0 2px 6px rgba(78, 115, 223, 0.3)",
                "&:hover": {
                  backgroundColor: "#224abe",
                  boxShadow: "0 4px 10px rgba(78, 115, 223, 0.4)",
                },
              }}
            >
              Save Attendance
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};