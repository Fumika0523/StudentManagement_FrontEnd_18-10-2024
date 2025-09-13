import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import axios from 'axios';
import EditStudentData from './EditStudentData';
import ModalShowPassword from './ModalShowPassword';
import { url } from '../../utils/constant';
import { FormControl, Select, MenuItem, Box } from "@mui/material";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14.5px',
    padding: '10px 15px',
    textWrap: "noWrap"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '13px',
    textAlign: 'center',
    padding: '10px 15px',
    textWrap: "noWrap"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: '#b3e5fc',
  },
}));

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Main component
const CustomizedTables = ({ studentData, setStudentData, setAdmissionData, admissionData }) => {
  const [studentBatchMap, setStudentBatchMap] = useState({});
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);

  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const uniqueBatches = [...new Set(admissionData.map(adm => adm.batchNumber))];
  const uniqueGenders = [...new Set(studentData.map(stu => stu.gender))];

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleEditClick = (student) => {
    setShow(true);
    setSingleStudent(student);
  };

  const handleDeleteClick = async (id) => {
    try {
      let res = await axios.delete(`${url}/deletestudent/${id}`, config);
      if (res) {
        let res = await axios.get(`${url}/allstudent`, config);
        setStudentData(res.data.studentData);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handlePasswordClick = (password) => {
    setViewPassword(true);
    setPassword(password);
  };

  useEffect(() => {
    if (studentData.length && admissionData.length) {
      const assignedStudent = Object.fromEntries(
        admissionData.map(admission => [admission.studentName, admission.batchNumber])
      );
      setStudentBatchMap(assignedStudent);
    }
  }, [studentData, admissionData]);

  // Apply filters
  const filteredData = studentData.filter(student => {
    const matchesGender = genderFilter ? student.gender === genderFilter : true;
    const matchesBatch = batchFilter ? studentBatchMap[student.studentName] === batchFilter : true;

    let matchesDate = true;
    if (dateFilter) {
      const admissionDate = new Date(student.admissionDate);
      const today = new Date();

      if (dateFilter === "today") {
        matchesDate = admissionDate.toDateString() === today.toDateString();
      } else if (dateFilter === "last7") {
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        matchesDate = admissionDate >= last7;
      } else if (dateFilter === "last30") {
        const last30 = new Date();
        last30.setDate(today.getDate() - 30);
        matchesDate = admissionDate >= last30;
      } else if (dateFilter === "older") {
        const last30 = new Date();
        last30.setDate(today.getDate() - 30);
        matchesDate = admissionDate < last30;
      }
    }

    return matchesGender && matchesBatch && matchesDate;
  });

  return (
    <>
      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        {/* Gender Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            displayEmpty
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            sx={{ fontSize: "15px" }}
          >
            <MenuItem value="" sx={{ fontSize: "15px" }}>Gender</MenuItem>
            {uniqueGenders.map((gender, idx) => (
              <MenuItem key={idx} value={gender} sx={{ fontSize: "15px" }}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Batch Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            displayEmpty
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            sx={{ fontSize: "15px" }}
          >
            <MenuItem value="" sx={{ fontSize: "15px" }}>Batch Number</MenuItem>
            {uniqueBatches.map((batch, idx) => (
              <MenuItem key={idx} value={batch} sx={{ fontSize: "15px" }}>
                {batch}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            displayEmpty
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ fontSize: "15px" }}
          >
            <MenuItem value="" sx={{ fontSize: "15px" }}>Created Date</MenuItem>
            <MenuItem value="today" sx={{ fontSize: "15px" }}>Today</MenuItem>
            <MenuItem value="last7" sx={{ fontSize: "15px" }}>Last 7 Days</MenuItem>
            <MenuItem value="last30" sx={{ fontSize: "15px" }}>Last 30 Days</MenuItem>
            <MenuItem value="older" sx={{ fontSize: "15px" }}>Older</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>No.</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
              <StyledTableCell>Batch No.</StyledTableCell>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Birthdate</StyledTableCell>
              <StyledTableCell>Course ID</StyledTableCell>
              <StyledTableCell>Preferred Courses</StyledTableCell>
              <StyledTableCell>Admission Fee</StyledTableCell>
              <StyledTableCell>Admission Date</StyledTableCell>
              <StyledTableCell>Mapped Course</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((student, index) => (
              <StyledTableRow key={student._id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', fontSize: "18px", justifyContent: "space-evenly" }}>
                    <FaEdit
                      className="text-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(student)}
                    />
                    <MdDelete
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteClick(student._id)}
                    />
                    <FaKey
                      className="text-secondary"
                      style={{ cursor: 'pointer', fontSize: "16px" }}
                      onClick={() => handlePasswordClick(student.password)}
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{studentBatchMap[student.studentName] || "Not assigned"}</StyledTableCell>
                <StyledTableCell>{student._id}</StyledTableCell>
                <StyledTableCell>
                  {student.studentName
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </StyledTableCell>
                <StyledTableCell>{student.username}</StyledTableCell>
                <StyledTableCell>{student.email}</StyledTableCell>
                <StyledTableCell>{student.phoneNumber}</StyledTableCell>
                <StyledTableCell>{student.gender}</StyledTableCell>
                <StyledTableCell>{formatDate(student.birthdate)}</StyledTableCell>
                <StyledTableCell>{student.courseId}</StyledTableCell>
                <StyledTableCell>{student.preferredCourses.join(', ')}</StyledTableCell>
                <StyledTableCell>{student.admissionFee}</StyledTableCell>
                <StyledTableCell>{formatDate(student.admissionDate)}</StyledTableCell>
                <StyledTableCell>{student.courseName}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {show && (
        <EditStudentData
          show={show}
          setShow={setShow}
          singleStudent={singleStudent}
          setSingleStudent={setSingleStudent}
          setStudentData={setStudentData}
        />
      )}

      {viewPassword && (
        <ModalShowPassword
          viewPassword={viewPassword}
          setViewPassword={setViewPassword}
          password={password}
          setPassword={setPassword}
        />
      )}
    </>
  );
};

export default CustomizedTables;
