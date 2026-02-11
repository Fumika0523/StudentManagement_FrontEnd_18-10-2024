
import React, { useState, useEffect } from 'react';
import { FaCircleCheck } from "react-icons/fa6";
import { TableRow, TableCell, TableContainer, TableHead, TableBody, Paper, Button, Collapse, Box, FormControl, Table, InputLabel, Select, MenuItem, TextField, Autocomplete, } from '@mui/material';
import { FaUsers } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { styled } from '@mui/material/styles';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaEdit, FaLock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalEditBatch from './ModalEditBatch';
import ModalDeleteWarning from './ModalDeleteWaning';
import ModalAddBatch from './ModalAddBatch';
import TablePagination from "@mui/material/TablePagination";
import { IoIosInformationCircle } from "react-icons/io";
import { url } from '../../utils/constant';
import axios from 'axios';
import { ModalShowStudentsList } from './ModalShowStudentsList';
import { PiCertificateFill } from "react-icons/pi";
import ModalCertificate from '../Certificate/ModalCertificate';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.components?.MuiTableCell?.head || 'MuiTableCell-head'}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '13.5px',
    padding: '7.5px 10px',
    textWrap: "noWrap",
  },
  [`&.${theme.components?.MuiTableCell?.body || 'MuiTableCell-body'}`]: {
    fontSize: '13px',
    textAlign: 'center',
    padding: '7.5px 10px',
    textWrap: "noWrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:hover': { backgroundColor: '#b3e5fc' },
}));

// Blinking red dot
const dotStyle = `
.live-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  background-color: red;
  border-radius: 50%;
  margin-right: 3px;
  box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 0, 0, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
}
`;

//  Helper: compute status based on DB value + dates
const computeStatus = (batch, course) => {
  // Final state always wins
  if (batch.status === "Batch Completed") return "Batch Completed";
  if (!batch.startDate || !course || !course.noOfDays) {
    // Fallback: use DB or default
    return batch.status || "Not Started";
  }

  const startDate = new Date(batch.startDate);
  const endDate = new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
  const today = new Date();

  if (today < startDate) return "Not Started";
  if (today >= startDate && today < endDate) return "In Progress";
  return "Training Completed";
};

function CustomisedBatchTables({ batchData, setBatchData, setCourseData, courseData, admissionData, studentData }) {
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [singleBatch, setSingleBatch] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15); // show up to 15 per page
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [selectedBatchStudents, setSelectedBatchStudents] = useState([])
  const [openCertificate, setOpenCertificate] = useState(false);
  const [certificateStudent, setCertificateStudent] = useState(null);
  // Local status map { batchId: statusString }
  const [statusMap, setStatusMap] = useState({});

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCertificate = (batch) => {
    setOpenCertificate(true);
  };

  const handleCloseCertificate = () => {
    setOpenCertificate(false);
    setCertificateStudent(null);
  };

  const handleViewStudents = (batch) => {
    console.log("batch", batch); // selected batch details
    // Get all students for this batch
    const studentsInBatchNames = admissionData
      //.filter() collects all admissions matching the batchNumber
      .filter(admission => admission.batchNumber === batch.batchNumber)
      //,map() extracts just the studentName
      .map(admission => admission.studentName);
    //the Resulting array studentsinBatch now contains all student names for that batch
    console.log("studentsInBatchNames :", studentsInBatchNames);

    // Find full student details from studentData
    const studentsInBatch = studentData?.filter(student =>
      studentsInBatchNames.includes(student.studentName)
    );
    console.log("All students in this batch:", studentsInBatch);
    setSelectedBatchStudents(studentsInBatch);
    setShowStudentsModal(true);
  };

  // Filter states
  const [filters, setFilters] = useState({
    batchNumber: '',
    courseName: '',
    status: '',
    sessionType: '',
    sessionDay: '',
    location: '',
    createdDateFrom: '',
    createdDateTo: '',
    startDateFrom: '',
    startDateTo: ''
  });

  const handleEditClick = (batch) => {
    setShow(true);
    setSingleBatch(batch);
  };

  const handleAdminReviewClick = (batch) => {
    if (batch.approvalStatus == "pending" && batch.requestedBy) {
      window.location.href = `/approve?batchId=${batch._id}`
    }
  }

  // Whenever batchData changes, automatically update filteredData if table is visible
  useEffect(() => {
    if (showTable && batchData.length > 0) {
      handleApplyFilter();
    }
  }, [batchData, showTable]);

  //  Build statusMap whenever batchData / courseData changes
  useEffect(() => {
    if (!batchData || batchData.length === 0) return;
    setStatusMap((prev) => {
      const updated = { ...prev };
      batchData.forEach((batch) => {
        const course = courseData?.find((c) => c.courseName === batch.courseName);
        const newStatus = computeStatus(batch, course);
        updated[batch._id] = newStatus;
      });
      return updated;
    });
  }, [batchData, courseData]);

  //  Sync statusMap → Backend (only when different from DB)
  useEffect(() => {
    if (!batchData || batchData.length === 0) return;
    if (!token) return;

    const syncStatuses = async () => {
      try {
        await Promise.all(
          batchData.map((batch) => {
            const localStatus = statusMap[batch._id];
            if (!localStatus) return null;
            if (localStatus === batch.status) return null; // already in sync
            return axios
              .put(`${url}/updatebatch/${batch._id}`, { status: localStatus }, config)
              .then(() => {
                // update frontend copy
                setBatchData((prev) =>
                  prev.map((b) =>
                    b._id === batch._id ? { ...b, status: localStatus } : b
                  )
                );
              })
              .catch((err) => {
                console.error("Failed to sync status for batch", batch._id, err);
              });
          }).filter(Boolean)
        );
      } catch (e) {
        console.error("Error syncing batch statuses", e);
      }
    };

    syncStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusMap]); // batchData & config are stable enough here for your use case

  const handleDelete = (batch) => {
    if (role === "admin") {
      setSingleBatch(batch);
      setViewWarning(true);
    } else {
      toast.error("To delete this information, please contact Super-Admin", { autoClose: 2000 });
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d
      .toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour12: true })
      .replace("at", "");
  };

  const handleApplyFilter = () => {
    let filtered = [...batchData];

    // Filter by batch number
    if (filters.batchNumber) {
      filtered = filtered.filter(batch =>
        batch.batchNumber?.toLowerCase().includes(filters.batchNumber.toLowerCase())
      );
    }

    // Filter by course name
    if (filters.courseName) {
      filtered = filtered.filter(batch =>
        batch.courseName?.toLowerCase().includes(filters.courseName.toLowerCase())
      );
    }

    // Filter by status (using same status logic as table)
    if (filters.status) {
      filtered = filtered.filter(batch => {
        const course = courseData?.find(c => c.courseName === batch.courseName);
        const computed = computeStatus(batch, course);
        return computed === filters.status;
      });
    }

    // Filter by session type
    if (filters.sessionType) {
      filtered = filtered.filter(batch => batch.sessionType === filters.sessionType);
    }

    // Filter by session day
    if (filters.sessionDay) {
      filtered = filtered.filter(batch => batch.sessionDay === filters.sessionDay);
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(batch =>
        batch.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by created date range
    if (filters.createdDateFrom || filters.createdDateTo) {
      filtered = filtered.filter(batch => {
        const createdDate = new Date(batch.createdAt);
        const fromDate = filters.createdDateFrom ? new Date(filters.createdDateFrom) : null;
        const toDate = filters.createdDateTo ? new Date(filters.createdDateTo) : null;

        if (fromDate && toDate) {
          return createdDate >= fromDate && createdDate <= toDate;
        } else if (fromDate) {
          return createdDate >= fromDate;
        } else if (toDate) {
          return createdDate <= toDate;
        }
        return true;
      });
    }

    // Filter by start date range
    if (filters.startDateFrom || filters.startDateTo) {
      filtered = filtered.filter(batch => {
        const startDate = new Date(batch.startDate);
        const fromDate = filters.startDateFrom ? new Date(filters.startDateFrom) : null;
        const toDate = filters.startDateTo ? new Date(filters.startDateTo) : null;

        if (fromDate && toDate) {
          return startDate >= fromDate && startDate <= toDate;
        } else if (fromDate) {
          return startDate >= fromDate;
        } else if (toDate) {
          return startDate <= toDate;
        }
        return true;
      });
    }
    setFilteredData(filtered);
    setShowTable(true);
  };

  const handleResetFilter = () => {
    setFilters({
      batchNumber: '',
      courseName: '',
      status: '',
      sessionType: '',
      sessionDay: '',
      location: '',
      createdDateFrom: '',
      createdDateTo: '',
      startDateFrom: '',
      startDateTo: ''
    });
    setFilteredData([]);
    setShowTable(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const isOlderThan7Days = (dateString) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - startDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  //  Admin approval request (staff)
  const handleSendApproval = async (batch) => {
    try {
      const response = await axios.post(
        `${url}/batch/send-approval-request`,
        {
          batchId: batch._id,
          username: localStorage.getItem("username"),
        },
        config
      );
      console.log("SUCCESS:", response.data.message);
      toast.success("Approval request sent to Admin");

      // update local state to show 'pending'
      setBatchData((prev) =>
        prev.map((b) =>
          b._id === batch._id ? { ...b, approvalStatus: "pending" } : b
        ));
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error("Failed to send approval request");
    }
  };

  return (
    <>
      <style>{dotStyle}</style>
      <Box className="border-4 border-danger row mx-auto w-100">
        {/* Filters and Add Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'stretch',
            py: 2,
            gap: 2,
          }}>
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenFilters(!openFilters)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderRadius: openFilters ? '4px 4px 0 0' : '4px',
              }}
            >
              Filter {openFilters ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </Button>
            <Collapse in={openFilters}>
              <Paper sx={{
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
              }}>
                {/* Filter Grid */}
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mb={2}>
                  {/* Batch Number */}
                  <TextField
                    size="small"
                    label="Batch Number"
                    value={filters.batchNumber}
                    onChange={(e) => handleFilterChange('batchNumber', e.target.value)}
                    placeholder="Search batch no..."
                  />

                  {/* Course Name - Autocomplete */}
                  <Autocomplete
                    size="small"
                    options={[...new Set(batchData?.map(b => b.courseName))]}
                    value={filters.courseName || null}
                    onChange={(event, newValue) => handleFilterChange('courseName', newValue || '')}
                    renderInput={(params) => (
                      <TextField {...params} label="Course Name" placeholder="Type to search..." />
                    )}
                    freeSolo
                    clearOnEscape
                  />

                  {/* Status */}
                  <FormControl size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Training Completed">Training Completed</MenuItem>
                      <MenuItem value="Batch Completed">Batch Completed</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Session Type */}
                  <FormControl size="small" fullWidth>
                    <InputLabel>Session Type</InputLabel>
                    <Select
                      value={filters.sessionType}
                      label="Session Type"
                      onChange={(e) => handleFilterChange('sessionType', e.target.value)}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="At School">At School</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Session Day */}
                  <FormControl size="small" fullWidth>
                    <InputLabel>Session Day</InputLabel>
                    <Select
                      value={filters.sessionDay}
                      label="Session Day"
                      onChange={(e) => handleFilterChange('sessionDay', e.target.value)}
                    >
                      <MenuItem value="">All Days</MenuItem>
                      <MenuItem value="Weekday">Weekday</MenuItem>
                      <MenuItem value="Weekend">Weekend</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Location */}
                  <TextField
                    size="small"
                    label="Location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Search location..."
                  />

                  {/* Created Date From */}
                  <TextField
                    size="small"
                    type="date"
                    label="Created From"
                    value={filters.createdDateFrom}
                    onChange={(e) => handleFilterChange('createdDateFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Created Date To */}
                  <TextField
                    size="small"
                    type="date"
                    label="Created To"
                    value={filters.createdDateTo}
                    onChange={(e) => handleFilterChange('createdDateTo', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Start Date From */}
                  <TextField
                    size="small"
                    type="date"
                    label="Start Date From"
                    value={filters.startDateFrom}
                    onChange={(e) => handleFilterChange('startDateFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Start Date To */}
                  <TextField
                    size="small"
                    type="date"
                    label="Start Date To"
                    value={filters.startDateTo}
                    onChange={(e) => handleFilterChange('startDateTo', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" size="small" onClick={handleApplyFilter}>
                    Apply
                  </Button>
                  <Button variant="outlined" size="small" onClick={handleResetFilter}>
                    Reset
                  </Button>
                </Box>
              </Paper>
            </Collapse>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <button className="commonButton" onClick={() => setShowAdd(true)}>Add Batch</button>
          </Box>
        </Box>

        {/* Table */}
        {showTable && (
          <Box sx={{ mt: 1 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No.</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>Batch No.</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>End Date</StyledTableCell>
                    <StyledTableCell>Class Type</StyledTableCell>
                    <StyledTableCell>Course</StyledTableCell>
                    <StyledTableCell>Session Day</StyledTableCell>
                    <StyledTableCell>Class Size</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Session Time</StyledTableCell>
                    <StyledTableCell>Fees</StyledTableCell>
                    <StyledTableCell>Assigned</StyledTableCell>
                    <StyledTableCell>Created</StyledTableCell>
                    <StyledTableCell>Updated</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={16} align="center">No batches found</StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((batch, index) => {
                        const course = courseData?.find(c => c.courseName === batch.courseName);
                        const computedStatus = statusMap[batch._id] || computeStatus(batch, course);
                        const status = computedStatus;
                        const actualAssignedCount = admissionData?.filter(
                          (adm) => adm.batchNumber === batch.batchNumber
                        ).length || 0;
                        const startDate = new Date(batch.startDate);
                        const endDate = course && course.noOfDays
                          ? new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000)
                          : null;
                        const isOld = isOlderThan7Days(batch.startDate);

// normalize approval status
const approval = batch.approvalStatus ?? "none"; // "none" | "pending" | "approved" | "declined"

const isAdmin = role === "admin";
const isStaff = role === "staff";

const canShowCertificate = status === "Batch Completed"; // ✅ only after Batch Completed

const renderActionIcons = () => {
  const ViewUsersIcon = (
    <FaUsers
      className="text-secondary"
      style={{ fontSize: "19px", cursor: "pointer" }}
      title="View batch users"
      onClick={() => handleViewStudents(batch)}
    />
  );

  const CertificateIcon = (
    <PiCertificateFill
      className="text-primary fs-5"
      title="Certificate"
      style={{ cursor: "pointer" }}
      onClick={() => handleOpenCertificate(batch)}
    />
  );

  const EditIcon = (
    <FaEdit
      className="text-success"
      style={{ cursor: "pointer", fontSize: "17px" }}
      title="Edit batch"
      onClick={() => handleEditClick(batch)}
    />
  );

  const LockIcon = (msg) => (
    <FaLock
      className="text-muted"
      style={{ cursor: "pointer", opacity: 0.7, fontSize: "16px" }}
      title={msg}
      onClick={() => toast.error(msg, { autoClose: 2000 })}
    />
  );

  const ReviewIcon = (
    <MdOutlineRateReview
      className="text-primary"
      style={{ fontSize: "20px", cursor: "pointer" }}
      title="Review approval request"
      onClick={() => handleAdminReviewClick(batch)}
    />
  );

  const SendApprovalIcon = (
    <IoIosInformationCircle
      className="text-primary fs-5"
      style={{ cursor: "pointer" }}
      title="Send approval request to Admin"
      onClick={() => handleSendApproval(batch)}
    />
  );

  const ApprovedDot = <span className="live-dot" title="Approved - can edit" />;

  // ✅ FINAL (Batch Completed): only users + check + certificate
  if (status === "Batch Completed") {
    return (
      <div className="d-flex align-items-center gap-2">
        {ViewUsersIcon}
        <FaCircleCheck
          className="text-success"
          style={{ fontSize: "18px", cursor: "default" }}
          title="Batch fully completed"
        />
        {canShowCertificate && CertificateIcon}
      </div>
    );
  }

  // ✅ Not Started / In Progress
  if (status === "Not Started" || status === "In Progress") {
    // staff lock only (admin can edit until Batch Completed)
    if (isStaff && isOld) {
      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          {LockIcon("This batch is locked (over 7 days old). Contact Admin.")}
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center gap-2">
        {ViewUsersIcon}
        {EditIcon}
      </div>
    );
  }

  // ✅ Training Completed
  if (status === "Training Completed") {
    // Staff flow
    if (isStaff) {
      if (approval === "approved") {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            {ApprovedDot}
            {EditIcon}
          </div>
        );
      }

      if (approval === "pending") {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            <FaLock
              className="text-muted"
              style={{ opacity: 0.7, fontSize: "16px" }}
              title="Pending"
            />
            <IoIosInformationCircle
              className="text-secondary fs-5"
              style={{ opacity: 0.4, cursor: "pointer" }}
              title="Admin approval is pending"
              onClick={() => toast.info("Waiting for admin approval…", { autoClose: 2000 })}
            />
          </div>
        );
      }

      if (approval === "declined") {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            {LockIcon("Approval request was declined by Admin.")}
          </div>
        );
      }

      // none
      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          {LockIcon("Training completed. Request approval from Admin to edit.")}
          {SendApprovalIcon}
        </div>
      );
    }

    // Admin flow (locked, only review if pending)
    if (isAdmin) {
      if (approval === "pending") {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            {ReviewIcon}
          </div>
        );
      }

      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          <FaLock
            className="text-muted"
            style={{ opacity: 0.7, fontSize: "16px" }}
            title="Training completed. Editing is locked."
          />
        </div>
      );
    }

    // other roles
    return <div className="d-flex align-items-center gap-2">{ViewUsersIcon}</div>;
  }

  return <div className="d-flex align-items-center gap-2">{ViewUsersIcon}</div>;
};

                       
                        return (
                          <StyledTableRow key={batch._id}>
                            <StyledTableCell>{index + 1}</StyledTableCell>

                            {/* Action icons */}
                            <StyledTableCell>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                {renderActionIcons()}

                                {/* Delete icon (admin only) */}
                                <MdDelete
                                  className={role === "admin" ? "text-danger" : "text-muted"}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    opacity: role === "admin" ? 1 : 0.5,
                                  }}
                                  onClick={() => handleDelete(batch)}
                                />
                              </div>
                            </StyledTableCell>

                            {/* Data cells */}
                            <StyledTableCell>{batch.batchNumber}</StyledTableCell>

                            {/* Status badge */}
                            <StyledTableCell>
                              <span
                                style={{
                                  backgroundColor:
                                    status === "Not Started"
                                      ? "#fdecea"
                                      : status === "In Progress"
                                        ? "#faf3cdff"
                                        : status === "Training Completed"
                                          ? "#e6f4ea"
                                          : "#a1c5feff", // Batch Completed
                                  color:
                                    status === "Not Started"
                                      ? "#d32f2f"
                                      : status === "In Progress"
                                        ? "#e18b08ff"
                                        : status === "Training Completed"
                                          ? "#2e7d32"
                                          : "#042378ff", // Batch Completed
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  display: "inline-block",
                                  minWidth: "110px",
                                  textAlign: "center",
                                }}>
                                {status}
                              </span>
                            </StyledTableCell>

                            <StyledTableCell>
                              {startDate && !isNaN(startDate) ? formatDateTime(startDate) : "-"}
                            </StyledTableCell>
                            <StyledTableCell>
                              {endDate && !isNaN(endDate) ? formatDateTime(endDate) : "-"}
                            </StyledTableCell>
                            <StyledTableCell>{batch.sessionType}</StyledTableCell>
                            <StyledTableCell>{batch.courseName}</StyledTableCell>
                            <StyledTableCell>{batch.sessionDay}</StyledTableCell>
                            <StyledTableCell>{batch.targetStudent}</StyledTableCell>
                            <StyledTableCell>{batch.location}</StyledTableCell>
                            <StyledTableCell>{batch.sessionTime}</StyledTableCell>
                            <StyledTableCell>{batch.fees}</StyledTableCell>
                            {/* <StyledTableCell>{batch.assignedStudentCount}</StyledTableCell> */}
                            <StyledTableCell
                              style={{
                                // fontWeight: 'bold', 
                                color: actualAssignedCount >= batch.targetStudent ? 'red' : 'inherit'
                              }}
                            >
                              {actualAssignedCount} / {batch.targetStudent}
                            </StyledTableCell>
                            <StyledTableCell>{formatDateTime(batch.createdAt)}</StyledTableCell>
                            <StyledTableCell>{formatDateTime(batch.updatedAt)}</StyledTableCell>
                          </StyledTableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderTop: "1px solid #ddd",
                paddingY: 0.5,
                marginTop: "-4px",
                minHeight: "52px",
              }}
            >
              <TablePagination
                rowsPerPageOptions={[15, 30, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page"
                sx={{
                  m: 0,
                  p: 0,
                  ".MuiTablePagination-toolbar": {
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "48px",
                  },
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Modals */}
        {show && (
          <ModalEditBatch
            show={show}
            setShow={setShow}
            singleBatch={singleBatch}
            setSingleBatch={setSingleBatch}
            setBatchData={setBatchData}
            courseData={courseData}
          />
        )}
        {viewWarning && (
          <ModalDeleteWarning
            viewWarning={viewWarning}
            singleBatch={singleBatch}
            setBatchData={setBatchData}
            setViewWarning={setViewWarning}
          />
        )}

        {showAdd && (
          <ModalAddBatch
            show={showAdd}
            setShow={setShowAdd}
            batchData={batchData}
            setBatchData={setBatchData}
            courseData={courseData}
            setCourseData={setCourseData}
          />
        )}

        {showStudentsModal && (
          <ModalShowStudentsList
            show={showStudentsModal}
            setShow={setShowStudentsModal}
            batchData={batchData}
            selectedBatchStudents={selectedBatchStudents}
            setSelectedBatchStudents={setSelectedBatchStudents}
          />
        )}

        <ModalCertificate
          open={openCertificate}
          setOpen={setOpenCertificate} />
      </Box>
    </>
  );
}

export default CustomisedBatchTables;
