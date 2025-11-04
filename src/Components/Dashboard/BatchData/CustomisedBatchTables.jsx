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
  Table ,
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
    // border:"2px solid red"
  },
  [`&.${theme.components?.MuiTableCell?.body || 'MuiTableCell-body'}`]: {
    fontSize: '13px',
    textAlign: 'center',
    padding: '5px 10px',
    textWrap: "noWrap",
    // border:"2px solid red"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:hover': { backgroundColor: '#b3e5fc' },
}));

// ✅ Blinking red dot
const dotStyle = `
.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  margin-left: 6px;
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

  const role = localStorage.getItem('role');

  const handleEditClick = (batch) => {
    setShow(true);
    setSingleBatch(batch);
  };
//Whenever batchData changes (after adding a new batch), it automatically updates filteredData.This only happens when showTable is true (when the table is visible).Now when you add a batch, the table will refresh automatically without needing to click "Apply" again
  useEffect(() => {
    if (showTable && batchData.length > 0) {
      setFilteredData([...batchData]);
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
    setFilteredData([...batchData]);
    setShowTable(true);
  };

  const handleResetFilter = () => {
    setFilteredData([]);
    setShowTable(false);
  };

  const isOlderThan7Days = (dateString) => {
  const createdDate = new Date(dateString);
  const today = new Date();
  const diffInDays = (today - createdDate) / (1000 * 60 * 60 * 24);
  return diffInDays > 7;
};



  return (
    <>
      {/* Inject live-dot CSS */}
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

                          {/* Action icons based on status, After 7 days from created batch Date, the batch will be auto-lock. */}

                          <StyledTableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                // border:"2px solid blue"
                              }}
                            >
                              {/* Case 1: In Progress — Live dot + Lock (only once) */}
                              {status === "In Progress" && (
                                <>
                                <div className='d-flex flex-row align-items-center gap-1'>
                                  <span className="live-dot"></span>
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

                              {/* Case 2: Older than 7 days (locked, but not In Progress or Completed) */}
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

                              {/*  Case 3: Editable (Completed, Not Started, or fallback within 7 days) */}
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

                              {/*  Delete – always visible for admin */}
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
                          {/* Batch Status */}
                          {/* <StyledTableCell>
                            <Chip label={status} 
                            color={
                              status === "Not Started" ? "error"
                                : status === "In Progress" ? "warning"
                                : "success"
                            }
                             variant="outlined" />
                          </StyledTableCell> */}
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
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: "13px",
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

export default CustomisedBatchTables;
