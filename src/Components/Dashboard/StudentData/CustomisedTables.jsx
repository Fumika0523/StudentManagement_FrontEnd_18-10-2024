import React, { useState, useEffect, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { FaEdit, FaLock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import axios from 'axios';
import EditStudentData from './EditStudentData';
import ModalShowPassword from './ModalShowPassword';
import { url } from '../../utils/constant';
import { toast } from 'react-toastify';
import ModalAddStudent from './ModalAddStudent';
import TablePagination from '@mui/material/TablePagination';
import TableFilter from '../TableFilter';
import { FormControl, Select, MenuItem, Button, Collapse, Box, Autocomplete, TextField } from "@mui/material";

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
const CustomizedTables = ({ studentData, setStudentData, setAdmissionData, admissionData, courseData, setCourseData, batchData, setBatchData }) => {
  const [studentBatchMap, setStudentBatchMap] = useState({});
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
  const role = localStorage.getItem('role')  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const uniqueBatches = [...new Set(admissionData.map(adm => adm.batchNumber))];
  const uniqueGenders = [...new Set(studentData.map(stu => stu.gender))];
const [page, setPage] = useState(0)
const [rowsPerPage, setRowsPerPage] = useState(16);
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
    const [courseInput, setCourseInput] = useState('');
    const [dateField, setDateField] = useState('');
    const [batchStatus, setBatchStatus] = useState('');
  
  const handleEditClick = (student) => {
    setShowEdit(true)
    setSingleStudent(student);
  };

    // Memoize unique courses
    const uniqueCourses = useMemo(() => {
      if (!Array.isArray(batchData)) return [];
      return [...new Set(batchData.map(b => b?.courseName).filter(Boolean))];
    }, [batchData]);

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

 // Apply filter logic
 const handleApplyFilter = () => {
  let filtered = [...studentData];

  // 1. Filter by Gender (Existing)
  if (genderFilter) {
    filtered = filtered.filter(stu => stu.gender === genderFilter);
  }

  // 2. Filter by Course Name (New)
  if (selectedCourse) {
    filtered = filtered.filter(stu => stu.courseName === selectedCourse);
  }

  // 3. Filter by Batch Status (New)
  if (batchStatus) {
    filtered = filtered.filter(stu => {
      // Look up status from the map we created in useEffect
      const status = studentBatchMap[stu.studentName]?.batchStatus;
      return status === batchStatus;
    });
  }

  // 4. Filter by Date (Existing)
  if (dateFilter) {
    const today = new Date();
    filtered = filtered.filter(stu => {
      const created = new Date(stu.createdAt);
      if (dateFilter === "today") return created.toDateString() === today.toDateString();
      // ... rest of your date logic
      return true;
    });
  }
  setFilteredData(filtered);
  setShowTable(true);
};

  //  Reset filter logic
  const handleResetFilter = () => {
    setGenderFilter('');
    setBatchFilter('');
    setDateFilter('');
    setFilteredData([]);
    setShowTable(false);
  };
// Add this effect to sync filteredData whenever studentData updates
useEffect(() => {
  if (showTable) {
    handleApplyFilter();
  }
}, [studentData]); // Runs whenever studentData changes (like after adding a student)

useEffect(() => {
  if (studentData.length && admissionData.length && batchData.length) {
    const studentBatchMap = {};
    admissionData.filter(a => a.status === "Assigned")
    .forEach(admission => {
      const batch = batchData.find(b => b.batchNumber === admission.batchNumber);
      if (batch) {
        studentBatchMap[admission.studentName] = {
          batchNumber: admission.batchNumber,
          sessionTime: batch.sessionTime,
          source:admission.admissionSource,
          batchStatus:batch.status
        };
      }
    });
    setStudentBatchMap(studentBatchMap);
  }
}, [studentData, admissionData, batchData]);
console.log("batchStatus",batchStatus)

   // Create a map for fast lookup: courseId => course object
  const courseMap = useMemo(() => {
    const map = {};
    courseData.forEach(course => {
      map[course._id] = course;
    });
    return map;
  }, [courseData]);

const formatDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) {
    console.log("Invalid date:", date);
    return "-";
  }
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour12: true }).replace("at", "");
};

  const displayData = showTable? filteredData : studentData;
  const paginatedData = Array.isArray(displayData)
  ? displayData.slice(page* rowsPerPage, page * rowsPerPage + rowsPerPage)
  :[]

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 // --- NEW STATUS BADGE COMPONENT ---
  const StatusBadge = ({ studentStatus, studentName }) => {
    // 1. Get the Batch Status from your existing map
    const batchStatus = studentBatchMap[studentName]?.batchStatus;

    // 2. Determine what text to show
    // If student is Assigned, show the Batch Status. Otherwise, show Student Status (e.g., De-assigned)
    const displayStatus = studentStatus === "Assigned" ? (batchStatus || "Assigned") : studentStatus;

    // 3. Define Colors based on the Display Status
    let bg = "#eeeeee"; // Default Grey
    let color = "#333";

    switch (displayStatus) {
      case "Not Started":
        bg = "#fdecea"; color = "#d32f2f"; // Red/Pink
        break;
      case "In Progress":
        bg = "#faf3cdff"; color = "#e18b08ff"; // Yellow/Orange
        break;
      case "Training Completed":
        bg = "#e6f4ea"; color = "#2e7d32"; // Green
        break;
      case "Batch Completed":
        bg = "#a1c5feff"; color = "#042378ff"; // Blue
        break;
      case "De-assigned":
        bg = "#cfd8dc"; color = "#455a64"; // Blue-Grey (Distinct "Inactive" look)
        break;
      default:
        bg = "#eeeeee"; color = "#333";
    }

    return (
      <span
        style={{
          backgroundColor: bg,
          color: color,
          padding: "4px 8px",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "11px",
          display: "inline-block",
          minWidth: "110px",
          textAlign: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)" // Added subtle shadow for depth
        }}
      >
        {displayStatus || "N/A"}
      </span>
    );
  };

  return (
    <>
      {/* Filters */}
    <div className='row  mx-auto '>
        <Box
          sx={{display:'flex', flexDirection:{xs:'column',md:'row'},
          justifyContent:'space-between',alignItems:'start',mt:1,}}>
          <TableFilter
            open={openFilters}
            setOpen={setOpenFilters}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
          >
            {/* Course Name */}
            <Box sx={{ minWidth: 200 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                Course Name
              </span>
              <Autocomplete
                freeSolo
                options={uniqueCourses}
                value={selectedCourse}
                inputValue={courseInput}
                onInputChange={(e, v) => setCourseInput(v)}
                onChange={(e, v) => setSelectedCourse(v)}
                renderInput={(params) => (
                  <TextField {...params} size="small" />
                )}
              />
            </Box>

  {/* Batch Status */}
  <FormControl size="small" sx={{ minWidth: 200 }}>
    <span style={{ fontSize: 14, fontWeight: 600 }}>
      Batch Status
    </span>
    <Select
      value={batchStatus}
      onChange={(e) => setBatchStatus(e.target.value)}
    >
      <MenuItem value="">--Select--</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Training Completed">Training Completed</MenuItem>
      <MenuItem value="Batch Completed">Batch Completed</MenuItem>
      <MenuItem value="Not Started">Not Started</MenuItem>
    </Select>
  </FormControl>
  </TableFilter>
<Box
  sx={{
    display: "flex", flexWrap: "wrap", gap: 1, mb: 2, mt: 1,justifyItemsustifyContent: { xs: "flex-start", md: "flex-end" },
  }}
>
  {/* ADD BUTTON */}
  <button
    type="button"
    className="commonButton"
    onClick={() => setShowAdd(true)}
  >
    Add Student
  </button>

  {/* BULK UPLOAD */}
  <label htmlFor="bulkUploadCsv" className="commonButton secondary fileButtonLabel">
    Bulk Upload (CSV)
    <input
      id="bulkUploadCsv"
      type="file"
      accept=".csv"
      hidden
      // onChange={handleBulkUpload}
/>
    </label>
      </Box>
        </Box>

        {/* Table */}
        {showTable && (
        <Box
             sx={{
                display: "flex", flexDirection: "column",   width: "100%", maxWidth: "100%",marginTop:"10px"
                }} >
        <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>No.</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                  <StyledTableCell>Batch No.</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Student ID</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell>Username</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone No.</StyledTableCell>
                  <StyledTableCell>Gender</StyledTableCell>
                  <StyledTableCell>Birthdate</StyledTableCell>
                  <StyledTableCell>Preferred Courses</StyledTableCell>
                  <StyledTableCell>Mapped Course</StyledTableCell>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell>Session Time</StyledTableCell>
                  <StyledTableCell>Session Type</StyledTableCell>
                  <StyledTableCell>Daily Session Hours</StyledTableCell>
                  <StyledTableCell>No. of Days</StyledTableCell>
                  <StyledTableCell>Admission Fee</StyledTableCell>
                  <StyledTableCell>Admission Date</StyledTableCell>
                  <StyledTableCell>Created Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((student, index) => {
                  const course = courseMap[student.courseId] || {};
                  return (
                    <StyledTableRow key={student._id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                    {/* Action */}
                    <StyledTableCell>
                      <div style={{ display: 'flex', justifyContent: "space-evenly", fontSize: "18px" }}>
                        {/* Edit */}
                        <FaEdit
                          className={role === "admin" ? "text-success" : "text-muted"}
                          style={{ cursor: 'pointer', opacity: role === "admin" ? 1 : 0.5 }}
                          onClick={() => {
                            if (role === "admin") {
                              handleEditClick(student);
                            } else {
                              toast.error("To edit the information, please contact Admin", { autoClose: 2000 });
                            }
                          }}
                        />
                        {/* Delete */}
                        <MdDelete
                          className={role === "admin" ? "text-danger" : "text-muted"}
                          style={{ cursor: 'pointer', opacity: role === "admin" ? 1 : 0.5 }}
                          onClick={() => {
                            if (role === "admin") {
                              handleDeleteClick(student._id);
                            } else {
                              toast.error("To delete the information, please contact Super-Admin", { autoClose: 2000 });
                            }
                          }}
                        />
                        {/* Lock */}
                        <FaKey
                          className="text-secondary"
                          style={{ cursor: 'pointer', fontSize: "16px" }}
                          onClick={() => handlePasswordClick(student.password)}
                        />
                      </div>
                    </StyledTableCell>
                     {/* BatchNumber */}
                      <StyledTableCell>  {student.batchNumber || "-"}</StyledTableCell>
                      {/* Status */}
                     {/* Status with Badge */}
                        <StyledTableCell>
                          <StatusBadge 
                            studentStatus={student.status} 
                            studentName={student.studentName} 
                          />
                        </StyledTableCell>
                     {/* Student ID */}
                      <StyledTableCell>{student._id}</StyledTableCell>           
                      {/* Student Name */}
                      <StyledTableCell>{student.studentName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</StyledTableCell>
                      {/* Username */}
                      <StyledTableCell>{student.username}</StyledTableCell>
                       {/* Email */}
                      <StyledTableCell>{student.email}</StyledTableCell>
                      {/* Phone No. */}
                      <StyledTableCell>{student.phoneNumber}</StyledTableCell>
                      {/* Gender */}
                      <StyledTableCell>{student.gender}</StyledTableCell>
                    {/* Birthdate */}
                      <StyledTableCell>{formatDate(student.birthdate)}</StyledTableCell>
                    {/* Preferred Course */}
                      <StyledTableCell>{student.preferredCourses.join(', ') || "Not selected yet"}</StyledTableCell>
                      {/* Mapped Course */}
                      <StyledTableCell>{student.courseName || "-"}</StyledTableCell>
                      {/* course id */}
                    <StyledTableCell>{course._id || "-"}</StyledTableCell>
                      {/* session time */}
                      <StyledTableCell>{studentBatchMap[student.studentName]?.sessionTime || "-"}</StyledTableCell>
                      {/* session type */}
                      <StyledTableCell>{course.courseType || "-"}</StyledTableCell>
                      {/* seeion hrs */}
                     <StyledTableCell>{course.dailySessionHrs || "-"}</StyledTableCell>
                     {/* No. of days */}
                      <StyledTableCell>{course.noOfDays || "-"}</StyledTableCell>
                     {/* Admission Fee */}
                      <StyledTableCell>{student.admissionFee || "-"}</StyledTableCell>
                      {/* Admission date */}
                        <StyledTableCell>{formatDate(student.admissionDate || "-")}</StyledTableCell>
                        {/* Created Date */}
                      <StyledTableCell>{formatDateTime(student.createdAt)}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={displayData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
            boxShadow: 2,
            p: 1,
            width: "100%",
            maxWidth: "100%",
            display: 'flex',
            justifyContent: 'center',
          }}
          />
          </Box>
          )}

        {showEdit && (
            <EditStudentData
              show={showEdit}
              setShow={setShowEdit}
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
          
          {showAdd && <ModalAddStudent show={showAdd} setShow={setShowAdd} setStudentData={setStudentData}/>}
    </div>

    </>
  );
};

export default CustomizedTables;