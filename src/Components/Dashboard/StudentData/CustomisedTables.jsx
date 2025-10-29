import React, { useState, useEffect, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { FaEdit, FaKey } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import EditStudentData from './EditStudentData';
import ModalShowPassword from './ModalShowPassword';
import TablePagination from '@mui/material/TablePagination';
import { url } from '../../utils/constant';
import { FormControl, Select, MenuItem, Box, Button } from "@mui/material";
import { toast } from 'react-toastify';
import Collapse from '@mui/material/Collapse';
import ModalAddStudent from './ModalAddStudent';

// Styled Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "14.5px",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    textAlign: "center",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#b3e5fc",
  },
}));

const CustomizedTables = ({
  studentData,  setStudentData,  setAdmissionData,  admissionData, courseData,
  setCourseData,  batchData,  setBatchData}) => {

  const [studentBatchMap, setStudentBatchMap] = useState({});
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

  // Filters
  const [openFilters, setOpenFilters] = useState(true);
  const [genderFilter, setGenderFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const uniqueBatches = [...new Set(admissionData.map(adm => adm.batchNumber))];
  const uniqueGenders = [...new Set(studentData.map(stu => stu.gender))];

//Pagination 
const [page, setPage] = useState(0)
const [rowsPerPage, setRowsPerPage] = useState(15);


  const handleEditClick = (student) => {
    setShow(true);
    setSingleStudent(student);
  };

  const handleDeleteClick = async (id) => {
    try {
      let res = await axios.delete(`${url}/deletestudent/${id}`, config);
      if (res) {
        let updated = await axios.get(`${url}/allstudent`, config);
        setStudentData(updated.data.studentData);
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

    if (genderFilter) {
      filtered = filtered.filter(stu => stu.gender === genderFilter);
    }

    if (batchFilter) {
      filtered = filtered.filter(stu =>
        studentBatchMap[stu.studentName]?.batchNumber === batchFilter
      );
    }

    if (dateFilter) {
      const today = new Date();
      filtered = filtered.filter(stu => {
        const created = new Date(stu.createdAt);
        if (dateFilter === "today") {
          return created.toDateString() === today.toDateString();
        } else if (dateFilter === "last7") {
          const last7 = new Date();
          last7.setDate(today.getDate() - 7);
          return created >= last7;
        } else if (dateFilter === "last30") {
          const last30 = new Date();
          last30.setDate(today.getDate() - 30);
          return created >= last30;
        } else if (dateFilter === "older") {
          const last30 = new Date();
          last30.setDate(today.getDate() - 30);
          return created < last30;
        }
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

  useEffect(() => {
    if (studentData.length && admissionData.length && batchData.length) {
      const map = {};
      admissionData.forEach(adm => {
        const batch = batchData.find(b => b.batchNumber === adm.batchNumber);
        if (batch) {
          map[adm.studentName] = {
            batchNumber: adm.batchNumber,
            sessionTime: batch.sessionTime,
            source: adm.admissionSource
          };
        }
      });
      setStudentBatchMap(map);
    }
  }, [studentData, admissionData, batchData]);



  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour12: true
    }).replace("at", "");
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


  return (
    <>
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Box
      sx={{display:'flex', flexDirection:{xs:'column',md:'row'},
      justifyContent:'space-between',alignItems:'stretch'}}>
        <Box>
            {/* Filter Toggle */}
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenFilters(!openFilters)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderRadius: openFilters ? '4px 4px 0 0' : '4px'
            }}
          >
            Filter {openFilters ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </Button>
          {/* Filter Panel */}
          <Collapse in={openFilters}>
           <Paper
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
                maxWidth: '100%',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                boxShadow: 3,
                p: 2,
              }}
            >
              <Box
              width={'100%'}
              sx={{
                  display:'flex',
                  justifyContent:'start',
                  flexWrap:'wrap',
                  flexDirection:'row',
                  alignItems:'center',
                  gap:3
              }        }>
              {/* Gender */}
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Gender</span>
                <Select
                  value={genderFilter}
                  displayEmpty
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  {uniqueGenders.map((g, i) => (
                    <MenuItem key={i} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Batch */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Batch.No</span>
                <Select
                  value={batchFilter}
                  displayEmpty
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  {uniqueBatches.map((b, i) => (
                    <MenuItem key={i} value={b}>{b}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Created By</span>
                <Select
                  value={dateFilter}
                  displayEmpty
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="last7">Last 7 Days</MenuItem>
                  <MenuItem value="last30">Last 30 Days</MenuItem>
                  <MenuItem value="older">Older</MenuItem>
                </Select>
              </FormControl>
              </Box>
            
              {/* Buttons */}
              <Box 
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={2}
                width="100%">
                <Button className='commonButton px-3'
                size="small" onClick={handleApplyFilter}>Apply</Button>
                <Button variant="outlined" className="px-3" size="small" onClick={handleResetFilter}>Reset</Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>
        <Box>
          {/* ADD BUTTON */}
            <button variant="outline-none" className="commonButton"
            onClick={()=>setShowAdd(true)} 
            >Add Student
            </button>
        </Box>
      </Box>


      {/* Table */}
      {showTable && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
             width: "100%",
                    maxWidth: "100%",
                  }}
                >
        <TableContainer component={Paper} className='my-3'>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Batch No.</StyledTableCell>
                <StyledTableCell>Admission Date</StyledTableCell>
                <StyledTableCell>Session Time</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Gender</StyledTableCell>
                <StyledTableCell>Created Date</StyledTableCell>
              </TableRow>
            </TableHead>
           <TableBody>
  {paginatedData.length > 0 ? (
    paginatedData.map((stu, i) => (
      <StyledTableRow key={stu._id}>
        <StyledTableCell>{page * rowsPerPage + i + 1}</StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {role !== "staff" && (
              <>
                <FaEdit
                  className="text-success"
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleEditClick(stu)}
                />
                <MdDelete
                  className="text-danger"
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleDeleteClick(stu._id)}
                />
                <FaKey
                  className="text-secondary"
                  style={{ cursor: "pointer", fontSize: "16px" }}
                  onClick={() => handlePasswordClick(stu.password)}
                />
              </>
            )}
          </Box>
        </StyledTableCell>

        {/* Assigned or Not */}
        <StyledTableCell>
          {studentBatchMap[stu.studentName]?.batchNumber ? "Assigned" : "Not Assigned"}
        </StyledTableCell>
              <StyledTableCell>
          {formatDateTime(stu.admissionDate)}
        </StyledTableCell>
        {/* Batch Info */}
        <StyledTableCell>{studentBatchMap[stu.studentName]?.batchNumber || "—"}</StyledTableCell>
        <StyledTableCell>{studentBatchMap[stu.studentName]?.sessionTime || "—"}</StyledTableCell>

        {/* Student Details */}
        <StyledTableCell>{stu.studentName || "N/A"}</StyledTableCell>
        <StyledTableCell>{stu.gender || "N/A"}</StyledTableCell>

        {/* Dates */}
        <StyledTableCell>{formatDateTime(stu.createdAt)}</StyledTableCell>
      </StyledTableRow>
    ))
  ) : (
    <TableRow>
      <StyledTableCell colSpan={8} align="center">
        No students found
      </StyledTableCell>
    </TableRow>
  )}
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

       {showAdd && <ModalAddStudent show={showAdd} setShow={setShowAdd}
                  setStudentData={setStudentData}
                  />}
      </Box>
    </>
  );
};

export default CustomizedTables;