import React, { useState, useEffect } from 'react';
import {
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Button,
  Collapse,
  Box,
  Chip,
  FormControl,
  Table,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaEdit, FaLock, FaKey } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalEditBatch from './ModalEditBatch';
import ModalDeleteWarning from './ModalDeleteWaning';
import ModalAddBatch from './ModalAddBatch';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.components?.MuiTableCell?.head || 'MuiTableCell-head'}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '13.5px',
    padding: '5px 10px',
    textWrap: "noWrap",
  },
  [`&.${theme.components?.MuiTableCell?.body || 'MuiTableCell-body'}`]: {
    fontSize: '13px',
    textAlign: 'center',
    padding: '5px 10px',
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

function CustomisedBatchTables({ batchData, setBatchData, setCourseData, courseData }) {
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [singleBatch, setSingleBatch] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);

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

  const role = localStorage.getItem('role');

  const handleEditClick = (batch) => {
    setShow(true);
    setSingleBatch(batch);
  };

  // Whenever batchData changes, automatically update filteredData if table is visible
  useEffect(() => {
    if (showTable && batchData.length > 0) {
      handleApplyFilter();
    }
  }, [batchData, showTable]);

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

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(batch => {
        const course = courseData?.find(c => c.courseName === batch.courseName);
        if (!course || !course.noOfDays) return false;

        const startDate = new Date(batch.startDate);
        const endDate = new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
        const today = new Date();

        let status = "";
        if (today < startDate) status = "Not Started";
        else if (today >= startDate && today < endDate) status = "In Progress";
        else status = "Completed";

        return status === filters.status;
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
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  return (
    <>
      <style>{dotStyle}</style>

      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        {/* Filters and Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: 2 }}>
          <Box sx={{ width: '80%' }}>
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
              <Paper sx={{ p: 2, mb: 2 }}>
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
                    options={[...new Set(batchData.map(b => b.courseName))]}
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
                      <MenuItem value="Completed">Completed</MenuItem>
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
          <Box sx={{ mt: 3 }}>
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
                    filteredData.map((batch, index) => {
                      // Single logic calculation per batch
                      const course = courseData?.find(c => c.courseName === batch.courseName);
                      if (!course || !course.noOfDays) return null;

                      const startDate = new Date(batch.startDate);
                      const endDate = new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
                      const today = new Date();

                      let status = "";
                      if (today < startDate) status = "Not Started";
                      else if (today >= startDate && today < endDate) status = "In Progress";
                      else status = "Completed";

                      return (
                        <StyledTableRow key={batch._id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>

                          {/* Action icons based on status */}
                          <StyledTableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {/* Case 1: In Progress — Live dot + Lock */}
                              {status === "In Progress" && (
                                <>
                                  <div className='d-flex flex-row align-items-center gap-1'>
                                    <span className="live-dot dotStyle"></span>
                                    <FaLock
                                      className="text-secondary"
                                      style={{ cursor: "pointer", opacity: 0.9, fontSize: "15.5px" }}
                                      onClick={() =>
                                        toast.info("This batch is unable to edit. Please contact to super admin.", {
                                          autoClose: 2000,
                                        })
                                      }
                                    />
                                  </div>
                                </>
                              )}

                              {/* Case 2: Older than 7 days (locked) */}
                              {isOlderThan7Days(batch.createdAt) &&
                                status !== "In Progress" &&
                                status !== "Completed" && (
                                  <FaLock
                                    className="text-muted"
                                    style={{ cursor: "pointer", opacity: 0.7, fontSize: "16px" }}
                                    onClick={() =>
                                      toast.error(
                                        "This batch is locked (over 7 days old). Please contact Super-Admin.",
                                        { autoClose: 2000 }
                                      )
                                    }
                                  />
                                )}

                              {/* Case 3: Editable */}
                              {(
                                (!isOlderThan7Days(batch.createdAt) && status !== "In Progress") ||
                                status === "Completed" ||
                                status === "Not Started"
                              ) && (
                                <FaEdit
                                  className="text-success"
                                  style={{ cursor: "pointer", fontSize: "17px" }}
                                  onClick={() => handleEditClick(batch)}
                                />
                              )}

                              {/* Delete – always visible for admin */}
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
                          <StyledTableCell>
                            <span
                              style={{
                                backgroundColor:
                                  status === "Not Started"
                                    ? "#fdecea"
                                    : status === "In Progress"
                                    ? "#faf3cdff"
                                    : "#e6f4ea",
                                color:
                                  status === "Not Started"
                                    ? "#d32f2f"
                                    : status === "In Progress"
                                    ? "#e18b08ff"
                                    : "#2e7d32",
                                padding: "4px 6px",
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: "12px",
                                display: "inline-block",
                                minWidth: "90px",
                                textAlign: "center",
                              }}
                            >
                              {status}
                            </span>
                          </StyledTableCell>

                          <StyledTableCell>{formatDateTime(startDate)}</StyledTableCell>
                          <StyledTableCell>{formatDateTime(endDate)}</StyledTableCell>
                          <StyledTableCell>{batch.sessionType}</StyledTableCell>
                          <StyledTableCell>{batch.courseName}</StyledTableCell>
                          <StyledTableCell>{batch.sessionDay}</StyledTableCell>
                          <StyledTableCell>{batch.targetStudent}</StyledTableCell>
                          <StyledTableCell>{batch.location}</StyledTableCell>
                          <StyledTableCell>{batch.sessionTime}</StyledTableCell>
                          <StyledTableCell>{batch.fees}</StyledTableCell>
                          <StyledTableCell>{batch.assignedStudentCount}</StyledTableCell>
                          <StyledTableCell>{formatDateTime(batch.createdAt)}</StyledTableCell>
                          <StyledTableCell>{formatDateTime(batch.updatedAt)}</StyledTableCell>
                        </StyledTableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Modals */}
        {show && (
          <ModalEditBatch show={show} setShow={setShow} singleBatch={singleBatch} setSingleBatch={setSingleBatch} setBatchData={setBatchData} />
        )}
        {viewWarning && (
          <ModalDeleteWarning viewWarning={viewWarning} singleBatch={singleBatch} setBatchData={setBatchData} setViewWarning={setViewWarning} />
        )}
        {showAdd && (
          <ModalAddBatch show={showAdd} setShow={setShowAdd} batchData={batchData} setBatchData={setBatchData} courseData={courseData} setCourseData={setCourseData} />
        )}
      </Box>
    </>
  );
}

export default CustomisedBatchTables