import React, { useState, useEffect, useMemo, useRef } from "react";import TableRow from "@mui/material/TableRow";
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
import ModalAddAdmission from './ModalAddAdmission'
import TablePagination from '@mui/material/TablePagination';
import {  Box,  Button,  Menu,  MenuItem,  Divider,  ListItemIcon,ListItemText,  FormControl,  Select,  Autocomplete,  TextField,
} from "@mui/material";

import { toast } from 'react-toastify';
import TableFilter from "../TableFilter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FiDownload, FiUpload, FiFileText } from "react-icons/fi";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";


const StyledTableCell = styled(TableCell)(() => ({
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
  admissionData, setAdmissionData, batchData, studentData, setStudentData, courseData, setCourseData
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
  //find the batch object that matched admission' batchNumber, then return its statu
  const batchStatusMap = useMemo(() => {
  const map = {};
  if (!Array.isArray(batchData)) return map;
  batchData.forEach((b) => {
    if (b?.batchNumber) {
      map[b.batchNumber] = b.status || "N/A";
    }
  });
  return map;
  }, [batchData]);

  const getBatchStatusByBatchNumber = (batchNumber) => {
  if (!batchNumber) return "N/A";
  return batchStatusMap[batchNumber] || "N/A";
  };

  //badge color
  const StatusBadge = ({ status }) => {
  const bg =
    status === "Not Started"
      ? "#fdecea" : status === "In Progress"
      ? "#faf3cdff" : status === "Training Completed"
      ? "#e6f4ea" : status === "Batch Completed"
      ? "#a1c5feff" : "#eeeeee"; 

  const color = status === "Not Started"
      ? "#d32f2f" : status === "In Progress"
      ? "#e18b08ff" : status === "Training Completed"
      ? "#2e7d32" : status === "Batch Completed"
      ? "#042378ff" : "#333"; 

  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        padding: "4px 8px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "11px",
        display: "inline-block",
        minWidth: "110px",
        textAlign: "center",
      }}
    >
      {status || "N/A"}
    </span>
  );
};
  
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

if (batchStatus) {
  filtered = filtered.filter((admission) => {
    const status = getBatchStatusByBatchNumber(admission.batchNumber);
    return status === batchStatus;
  });
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
      // Add this effect to sync filteredData whenever admissionData updates
  useEffect(() => {
    if (showTable) {
      handleApplyFilter();
    }
  }, [admissionData]); // Runs whenever admissionData changes (like after adding a admission)
  

  //Excel bulkload
   const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadTemplate = async () => {
    try {
      window.open("http://localhost:8001/api/excel/admission-template", "_blank");
    } catch (e) {
      toast.error("Downloading Excel Template failed");
      console.error(e);
    }
  };

  const uploadExcel = async () => {
    if (!file) {
      toast.error("Please choose an Excel file first");
      console.log("Something went wrong")
      return;
    }
    try {
     console.log("Upload excel is clicked")
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8001/api/excel/admission-import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res)
      toast.success("Uploaded successfully!");
     // try {
        // const refreshed = await axios.get(`${url}/alladmission`, config);
        // setAdmissionData(refreshed.data.admissionData);
      // } catch (refreshErr) {
      //   console.error("Refresh after upload failed:", refreshErr);
      // }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      toast.error("Upload failed");
     console.log("Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  // Dropdown state
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const actionsOpen = Boolean(actionsAnchorEl);
  const fileInputRef = useRef(null);

  const openActionsMenu = (e) => setActionsAnchorEl(e.currentTarget);
  const closeActionsMenu = () => setActionsAnchorEl(null);

  const triggerFilePicker = () => {
    closeActionsMenu();
    fileInputRef.current?.click();
  };

  const onFilePicked = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };


  return (
    <Box className="row mx-auto w-100">
        {/* Actions Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            my: 1,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
          }}
        >
          {/* Primary */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAdd(true)}
            sx={{ borderRadius: 2, backgroundColor:" #2c51c1" }}
          >
            Add Admission
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFilePicked}
            style={{ display: "none" }}
          />

          {/* Dropdown */}
          <Button
         variant="outlined"
          startIcon={<MoreVertIcon size={18} />}
          onClick={openActionsMenu}
          sx={{ borderRadius: 2 , color:" #2c51c1", borderColor:" #2c51c1"}}
          >
            Actions
          </Button>

          <Menu
            anchorEl={actionsAnchorEl}
            open={actionsOpen}
            onClose={closeActionsMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { borderRadius: 2, minWidth: 260 } }}
          >
            <MenuItem
              onClick={() => {
                closeActionsMenu();
                downloadTemplate();
              }}
            >
              <ListItemIcon>
                <FiDownload  size={18}  />
              </ListItemIcon>
              <ListItemText primary="Download Excel Template" />
            </MenuItem>

            <MenuItem onClick={triggerFilePicker}>
              <ListItemIcon>
                <FiFileText size={18}  />
              </ListItemIcon>
              <ListItemText
                primary="Choose file…"
                secondary={file?.name ? file.name : "No file selected"}
              />
            </MenuItem>

            <Divider />

            <MenuItem
              disabled={loading || !file}
              onClick={() => {
                closeActionsMenu();
                uploadExcel();
              }}
            >
              <ListItemIcon>
                <FiUpload  size={18}  />
              </ListItemIcon>
              <ListItemText primary={loading ? "Updating…" : "Upload Updated Excel"} />
            </MenuItem>
          </Menu>
        </Box>

            {/* Filter Section */}
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
              onChange={(e) => setBatchStatus(e.target.value)}>
              <MenuItem value="">--Select--</MenuItem>
              <MenuItem value="Batch Completed">Batch Completed</MenuItem>
              <MenuItem value="Training Completed">Training Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Not Started">Not Started</MenuItem>
            </Select>
          </FormControl>
        </TableFilter>
   

      {/* Table */}
      {showTable && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px"
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
                      <StatusBadge
                        status={
                          admission.status === "Assigned"
                            ? getBatchStatusByBatchNumber(admission.batchNumber)
                            : admission.status
                        }
                      />
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

          {/* Pagination */}
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
          setStudentData={setStudentData}
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