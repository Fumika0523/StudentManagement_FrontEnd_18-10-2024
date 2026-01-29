import React, { useState, useEffect } from "react";
import {
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper,
  Button, Grid, TextField, Stack, Table,  TableBody,  TableCell,  TableHead,
  TableRow, Checkbox,  Collapse,  Divider,} from "@mui/material";
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
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 2, width: "100%", maxWidth: "900px" }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <FaUserClock size={28} color="#4e73df" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#4e73df" }}>
            Attendance Entry
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Select Batch</InputLabel>
              <Select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                label="Select Batch"
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

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Mark as</InputLabel>
              <Select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                label="Default Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmitClick}
              disabled={loading}
              sx={{ mt: 2, backgroundColor: "#4e73df" }}
            >
              {loading ? "Loading..." : "Submit & Show Student List"}
            </Button>
          </Grid>
        </Grid>

        {/*  Expandable section */}
        <Collapse in={showStudentList} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Mark Attendance — Batch {selectedBatch} ({attendanceDate})
            </Typography>

          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Present
                    <Checkbox
                      sx={{ ml: 1 }}
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
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.username}</TableCell>
                    <TableCell align="right">
                      <Checkbox
                        checked={selectedStudentIds.includes(student._id)}
                        onChange={() => handleToggleStudent(student._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <Box sx={{ display: "flex", flexDirection:"row", justifyContent:"end", gap:"30px", marginTop:"3opx", paddingTop:"10px" }}>
              <Button
                variant="outlined"
                onClick={() => setShowStudentList(false)}
              >
                Collapse
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAttendance}
                sx={{ backgroundColor: "#4e73df" }}
              >
                Save Attendance
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};
