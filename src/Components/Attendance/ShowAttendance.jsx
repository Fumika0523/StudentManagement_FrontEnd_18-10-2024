import React, { useEffect, useState } from 'react'
import AttendanceTable from './AttendanceTable'
import {url} from '../utils/constant'
import {
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper,
  Button, Grid, TextField, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, Checkbox, Collapse, Divider,
} from "@mui/material";
import axios from 'axios';

const ShowAttendance = () => {
    const [batchData,setBatchData]=useState([])
      const [studentData, setStudentData] = useState([]);

    const [selectedBatch, setSelectedBatch] = useState("")
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    // GET: Batch Data
    const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("batchData from show-attendance",res.data.batchData)
        setBatchData(res.data.batchData
    )}

  const getStudentData = async () => {
    let res = await axios.get(`${url}/all-student`, config);
    setStudentData(res.data.studentData);
  };
      useEffect(()=>{
    getBatchData()
    getStudentData()
},[])

  return (
    <>
     <div className="py-2 border-4 border-danger row mx-auto w-100">
    <div className='d-flex flex-row align-items-center justify-content-between'>
        <Box  sx={{ flex: '1 1 220px', minWidth: 180, maxWidth: 300 }}>
        <FormControl  fullWidth size="small">
            <InputLabel>Select Batch</InputLabel>
            <Select 
            // value={selectedBatch}
            // onChange={(e)=>setSelectedBatch(e.target.value)}
            label="Select Batch"
            >
            {batchData?.map((batch)=>(
                <MenuItem key={batch._id}
                value={batch.batchNumber}>
                    {batch.batchNumber}
                </MenuItem>
            ))}
                 {batchData.length === 0 && (
                  <MenuItem disabled>No active batches found</MenuItem>
                )}
            </Select>
        </FormControl>
        </Box>
        <div>
        <Button >Show Record</Button>
        </div>
        <div>
            <Button className=''>Last 7days</Button>
            <Button className=''>Last 30days</Button>
        </div>       
    </div>
        <AttendanceTable studentData={studentData} setStudentData={setStudentData} />
        </div>
    </>
  )}

export default ShowAttendance

//drop button batch number 
//show button - api 
// Last 7 days/ Last 30days
//average of attendance
// in table, all student list shows.
// top to bottom student name
//left to right attendance record
// absence and presence record
//API:
// from student 
// attendance
// modify logic , when you click Present for 2 , and the rest of students should be marked as Absent