import React, { useState, useEffect } from 'react';
import { 
    FormControl, InputLabel, Select, MenuItem, Box, Typography, 
    Paper, Button, Grid, TextField, Divider, Stack 
} from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../utils/constant';
import { FaUserClock } from "react-icons/fa";


export const UpdateAttendance = () => {
    const [batchData, setBatchData] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [loading, setLoading] = useState(true);
    const [attendanceDate, setAttendanceDate] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('');

    // Fetching token for authorization as seen in your other components
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

   const getBatchData = async () => {
    try {
        setLoading(true);
        let res = await axios.get(`${url}/allbatch`, config)
        const inProgressBatches = res.data.batchData.filter(
      (batch) => batch.status === "In Progress"
    );
    console.log("inProgressBatches",inProgressBatches)
  } catch (error) {
    console.error(error);
    toast.error("Failed to load batch data");
  } finally {
    setLoading(false); 
  }
};
     useEffect(() => {
         getBatchData()  
        }, [])

    const handleChange = (event) => {
        setSelectedBatch(event.target.value);
    };


    return (
   <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Paper elevation={3} sx={{
                p: { xs: 2, sm: 4 }, 
                borderRadius: 2,
                width: '100%',
                maxWidth: { xs: '100%', sm: '600px', md: '800px' }, // Responsive width
                mx: 'auto'
            }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <FaUserClock size={28} color="#4e73df" />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4e73df' }}>
                        Attendance Entry
                    </Typography>
                </Stack>
                    {/* Batch Dropdown */}
                    <Grid container spacing={2}>
                    {/* Batch Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                        <InputLabel id="batch-select-label">
                            Select Batch Number
                        </InputLabel>
                        <Select
                            labelId="batch-select-label"
                            id="batch-select"
                            value={selectedBatch}
                            label="Select Batch Number"
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            disabled={loading}
                        >
                            {batchData.length > 0 ? (
                            batchData.map((batch) => (
                                <MenuItem key={batch._id} value={batch.batchNumber}>
                                {batch.batchNumber} - {batch.courseName}
                                </MenuItem>
                            ))
                            ) : (
                            <MenuItem disabled>
                                {loading ? "Loading..." : "No in-progress batches"}
                            </MenuItem>
                            )}
                        </Select>
                        </FormControl>
                    </Grid>

                    {/* Date Picker */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                        fullWidth
                        label="Attendance Date"
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Attendance */}
                     <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                        <InputLabel id="attendance-status-label">
                            Mark Attendance
                        </InputLabel>
                        <Select
                            labelId="attendance-status-label"
                            value={attendanceStatus}
                            label="Mark Attendance"
                            onChange={(e) => setAttendanceStatus(e.target.value)}
                        >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
{/* Action Buttons */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                sx={{ borderRadius: '10px', px: 4 }}
                            >
                                Reset
                            </Button>
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    backgroundColor: '#4e73df', 
                                    borderRadius: '10px', 
                                    px: 5,
                                    '&:hover': { backgroundColor: '#2e59d9' } 
                                }}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Grid>
                    </Grid>
            </Paper>
        </Box>
    );
};