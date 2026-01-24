import React, { useState, useEffect } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem, Box, Typography,
    Paper, Button, Grid, TextField, Stack, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox
} from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../utils/constant';
import { FaUserClock } from "react-icons/fa";

export const UpdateAttendance = () => {
    const [batchData, setBatchData] = useState([]);
    const [admissionData, setAdmissionData] = useState([])
    const [studentData, setStudentData] = useState([])

    const [selectedBatch, setSelectedBatch] = useState('');
    const [loading, setLoading] = useState(false);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState('present');

    // Modal & Student States
    const [openModal, setOpenModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const getBatchData = async () => {
        try {
            setLoading(true);
            let res = await axios.get(`${url}/allbatch`, config);
            const inProgressBatches = res.data.batchData.filter(batch => batch.status === "In Progress");
            setBatchData(inProgressBatches);
        } catch (error) {
            toast.error("Failed to load batch data");
        } finally {
            setLoading(false);
        }
    };

    const getAdmissionData = async () => {
        // console.log("Admission data is called....")
        let res = await axios.get(`${url}/alladmission`, config)
        // console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }
    const getStudentData = async () => {
        let res = await axios.get(`${url}/allstudent`, config)
        console.log("StudentData", res.data.studentData)
        setStudentData(res.data.studentData)
    }

    useEffect(() => {
        getBatchData();
        getAdmissionData()
        getStudentData()
    }, []);

    //  Open Modal and Fetch Students
    const handleSubmitClick = () => {
        if (!selectedBatch) return toast.warning("Please select a batch");

        setLoading(true);

        try {
            // 1. Get the names of students in this batch from admissionData
            const studentsInBatchNames = admissionData
                .filter(admission => admission.batchNumber === selectedBatch)
                .map(admission => admission.studentName);

            // 2. Filter studentData to get the full student objects (Source of Truth)
            const batchStudents = studentData.filter(student =>
                studentsInBatchNames.includes(student.username)
            );
            console.log("batchStudents", batchStudents)
            if (batchStudents.length === 0) {
                toast.info("No students found in this batch.");
                setStudents([]);
                return;
            }

            // 3. Set your local state for the modal
            setStudents(batchStudents);

            // 4. Handle default selection based on global status
            if (attendanceStatus === 'present') {
                setSelectedStudentIds(batchStudents.map(s => s._id));
            } else {
                setSelectedStudentIds([]);
            }

            setOpenModal(true);
        } catch (error) {
            console.error("Filter error:", error);
            toast.error("Error on fetching student data");
        } finally {
            setLoading(false);
        }
    };
    // Toggle individual student checkbox
    const handleToggleStudent = (id) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Final Save to Backend
    const handleSaveAttendance = async () => {
        try {
            // Map students to the format the backend expects
            const attendanceRecords = students.map(student => ({
                studentId: student._id,
                status: selectedStudentIds.includes(student._id) ? 'Present' : 'Absent'
            }));

            const payload = {
                batchId: selectedBatch, // Use ID if your backend prefers ID over Number
                date: attendanceDate,
                attendanceRecords
            };
            await axios.post(`${url}/attendance`, payload, config);
            toast.success("Attendance recorded successfully!");
            setOpenModal(false);
        } catch (error) {
            toast.error("Failed to save attendance");
        }
    };

    return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center',  alignItems: "center", minHeight: "calc(100vh - 130px)",}} >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: '800px' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <FaUserClock size={28} color="#4e73df" />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4e73df' }}>
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
                                {/*  Filter added here to only show 'In Progress' batches */}
                                {batchData
                                    .filter(batch => batch.status === "In Progress")
                                    .map((batch) => (
                                        <MenuItem key={batch._id} value={batch.batchNumber}>
                                            {batch.batchNumber}
                                        </MenuItem>
                                    ))
                                }
                                {/* Feedback if no batches are currently active */}
                                {batchData.filter(batch => batch.status === "In Progress").length === 0 && (
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
                            sx={{ mt: 2, backgroundColor: '#4e73df' }}
                        >
                            Submit & Open Student List
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* --- ATTENDANCE MODAL --- */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Mark Attendance - Batch {selectedBatch} ({attendanceDate})
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell align="right">Present</TableCell>
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
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSaveAttendance} variant="contained" color="primary">
                        Save Attendance
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};