import React, { useState, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import { MdDelete } from "react-icons/md";
import ModalDeleteAdmission from "./ModalDeleteAdmission";
import ModalEditAdmission from "./ModalEditAdmission";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import ModalAddAdmission from './ModalAddAdmission'
import TablePagination from '@mui/material/TablePagination';
import { FormControl, Select, MenuItem, Button, Collapse, Box, Autocomplete, TextField } from "@mui/material";
import { toast } from 'react-toastify'; 


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

const CustomisedAdmissionTable = ({ 
  admissionData,setAdmissionData, batchData,studentData, setStudentData 
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [singleAdmission, setSingleAdmission] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  
  // Filter states
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dateField, setDateField] = useState('');
  const [batchStatus, setBatchStatus] = useState('');
  const [showTable, setShowTable] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  
  const role = localStorage.getItem('role');

  // Memoize unique courses
  const uniqueCourses = useMemo(() => {
    if (!Array.isArray(batchData)) return [];
    return [...new Set(batchData.map(b => b?.courseName).filter(Boolean))];
  }, [batchData]);

  // Filter admissionData, not batchData
  const handleApplyFilter = () => {
    if (!Array.isArray(admissionData)) {
      console.error('admissionData is not an array');
      return;
    }

    let filtered = [...admissionData];

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(admission =>
        admission?.courseName?.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    // Filter by batch status (if applicable to admission)
    if (batchStatus) {
      filtered = filtered.filter(admission =>
        admission?.status?.toLowerCase() === batchStatus.toLowerCase()
      );
    }

    // Filter by date field (if dateField is selected)
    // You can add date range filtering here if needed
    setPage(0); // Reset to first page
    setShowTable(true);
    
    // Store filtered data (you'll need to add this state)
    setFilteredData(filtered);
  };

  const [filteredData, setFilteredData] = useState([]);

const handleResetFilter = () => {
  setCourseInput('');
  setSelectedCourse(null);
  setBatchStatus('');
  setDateField('');
  setFilteredData([]);
  setShowTable(false); //  hides the table
  setPage(0);
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (admission) => {
    setShowEdit(true);
    setSingleAdmission(admission);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: true,
      })
      .replace("at", "");
  };

  // Data to display
  const displayData = showTable ? filteredData : admissionData;
  const paginatedData = Array.isArray(displayData) 
    ? displayData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

const handleActionClick = (actionType, admission) => {
    if (role === "staff") {
      toast.error("You don't have permission for this action, please contact to super admin", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // If not staff, proceed with normal logic
    if (actionType === 'edit') {
      handleEditClick(admission);
    } else if (actionType === 'delete') {
      setViewWarning(true);
      setSingleAdmission(admission);
    }
  };

  return (
    <Box className="border-4 border-danger row mx-auto w-100">
      {/* Filter Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: 'stretch',
          py: 2,
          gap: 2,
        }}
      >
        <Box >
          {/* Filter Toggle */}
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenFilters(!openFilters)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%' ,
              borderRadius: openFilters ? '4px 4px 0 0' : '4px',
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
                p: 1,
              }}
            >
              {/* Course Name */}
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 200, flex: 1 }}>
                <span style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                  Course Name
                </span>
                <Autocomplete
                  freeSolo
                  options={uniqueCourses}
                  inputValue={courseInput}
                  onInputChange={(e, newValue) => setCourseInput(newValue)}
                  value={selectedCourse}
                  onChange={(e, newValue) => setSelectedCourse(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select or type" size="small" />
                  )}
                />
              </Box>

              {/* Date By */}
              <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                <span style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                  Date By
                </span>
                <Select
                  value={dateField}
                  displayEmpty
                  onChange={(e) => setDateField(e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  <MenuItem value="startDate">Start Date</MenuItem>
                  <MenuItem value="endDate">End Date</MenuItem>
                  <MenuItem value="updatedAt">Updated Date</MenuItem>
                </Select>
              </FormControl>

              {/* Batch Status - Fixed label */}
              <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                <span style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                  Batch Status
                </span>
                <Select
                  value={batchStatus}
                  displayEmpty
                  onChange={(e) => setBatchStatus(e.target.value)}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1 }}>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleApplyFilter}
                  sx={{ minWidth: 100 }}
                >
                  Apply
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleResetFilter}
                  sx={{ minWidth: 100 }}
                >
                  Reset
                </Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>

        {/* Add Button */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: { xs: 0, md: 0 } }}>
          <button 
            className="commonButton"
            onClick={() => setShowAdd(true)}
          >
            Add Admission
          </button>
        </Box>
      </Box>

      {/* Table */}
      {showTable  && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <TableContainer 
            component={Paper}
            sx={{ 
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Action</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Batch No.</StyledTableCell>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell>Course Name</StyledTableCell>
                  <StyledTableCell>Student ID</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell>Source</StyledTableCell>
                  <StyledTableCell>Fee</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Month</StyledTableCell>
                  <StyledTableCell>Year</StyledTableCell>
                  <StyledTableCell>CreatedAt</StyledTableCell>
                  <StyledTableCell>UpdatedAt</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((admission) => (
                    <StyledTableRow key={admission._id}>
                      <StyledTableCell>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                          {/* Edit Icon */}
                          <FaEdit
                            className={role === "staff" ? "text-muted" : "text-success"}
                            style={{ 
                              cursor: "pointer", 
                              fontSize: "18px",
                              opacity: role === "staff" ? 0.5 : 1 
                            }}
                            onClick={() => handleActionClick('edit', admission)}
                          />
                          
                          {/* Delete Icon */}
                          <MdDelete
                            className={role === "staff" ? "text-muted" : "text-danger"}
                            style={{ 
                              cursor: "pointer", 
                              fontSize: "18px",
                              opacity: role === "staff" ? 0.5 : 1 
                            }}
                            onClick={() => handleActionClick('delete', admission)}
                          />
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        {admission.batchNumber ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell>{admission.batchNumber || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.courseId || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.courseName || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.studentId || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.studentName || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.admissionSource || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.admissionFee || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{formatDate(admission.admissionDate)}</StyledTableCell>
                      <StyledTableCell>{admission.admissionMonth || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{admission.admissionYear || 'N/A'}</StyledTableCell>
                      <StyledTableCell>{formatDateTime(admission.createdAt)}</StyledTableCell>
                      <StyledTableCell>{formatDateTime(admission.updatedAt)}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <StyledTableCell colSpan={14} align="center">
                      No data available
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Fixed Pagination - removed absolute positioning */}
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

      {/* Modals */}
      {showEdit && (
        <ModalEditAdmission
          show={showEdit}
          setShow={setShowEdit}
          singleAdmission={singleAdmission}
          setSingleAdmission={setSingleAdmission}
          setAdmissionData={setAdmissionData}
        />
      )}

      {viewWarning && (
        <ModalDeleteAdmission
          admissionData={admissionData}
          viewWarning={viewWarning}
          singleAdmission={singleAdmission}
          setAdmissionData={setAdmissionData}
          setViewWarning={setViewWarning}
        />
      )}

      {showAdd && (
        <ModalAddAdmission
          show={showAdd}
          setShow={setShowAdd}
          setAdmissionData={setAdmissionData}
          admissionData={admissionData}
          studentData={studentData}
          setStudentData={setStudentData}
        />
      )}
    </Box>
  );
};

export default CustomisedAdmissionTable;