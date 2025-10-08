import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { FaEdit, FaLock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalEditBatch from './ModalEditBatch';
import ModalDeleteWarning from './ModalDeleteWaning';
import { Button, Collapse, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, TableBody } from '@mui/material';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // import icons
import Box from '@mui/material/Box'; 
import { FaKey } from "react-icons/fa";


// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14px',
    padding: '10px',
    textWrap: "noWrap"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '13.5px',
    textAlign: 'center',
    padding: '10px',
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

function CustomisedBatchTables({ batchData, setBatchData, setCourseData,courseData  }) {
  const [show, setShow] = useState(false);
  const [singleBatch, setSingleBatch] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);

  // --- Filter states ---
  const [openFilters, setOpenFilters] = useState(true); // open by default
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batchStatus, setBatchStatus] = useState('');
  const [dateField, setDateField] = useState(''); // 'startDate', 'endDate', 'updatedAt'
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false); // table hidden initially

  const uniqueCourses = [...new Set(batchData.map(b => b.courseName))];
  const role = localStorage.getItem('role')
  const handleApplyFilter = () => {
    let filtered = [...batchData];

    if (selectedCourse) {
      filtered = filtered.filter(batch =>
        batch.courseName?.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }

    if (batchStatus) {
      filtered = filtered.filter(batch =>
        batch.status?.toLowerCase() === batchStatus.toLowerCase()
      );
    }

    setFilteredData(filtered);
    setShowTable(true); // show table after applying filter
  };

  const handleResetFilter = () => {
    setCourseInput('');
    setSelectedCourse(null);
    setBatchStatus('');
    setDateField('');
    setFilteredData([]);
    setShowTable(false); // hide table
  };

  const handleEditClick = (batch) => {
    setShow(true);
    setSingleBatch(batch);
  };

  const handleLockedClick = () => {
    toast.info("Please contact the super admin for any changes.", {
      autoClose: 1300,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // const formatDateTime = (isoString) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: '2-digit',
  //     hour12: true
  //   }).replace("at","");
  // };
const formatDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) {
    console.log("Invalid date:", date);
    return "-";
  }
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour12: true }).replace("at", "");
};


  const isOlderThan7Days = (dateString) => {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  console.log("batchData:", batchData);
  console.log("courseData:", courseData);

  return (
    <>
    {/* Filter Toggle */}
       <Button
        variant="outlined"
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

      {/* Filter Panel */}
  <Collapse in={openFilters}>
    <Paper
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 4,  // same as button
        borderBottomRightRadius: 4, // same as button
        boxShadow: 3,               // Material UI shadow
        p: 1,
      }}
    >
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 250 }}>
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
      <TextField {...params} placeholder="" size="small" />
    )}
  />
    </Box>

      <FormControl size="small" sx={{ width: 200 }}>
      <span style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
          Date Filter By
      </span>
        <Select
            value={dateField}
            displayEmpty
            onChange={(e) => setDateField(e.target.value)}
          >
        <MenuItem value="">
          --Select--
        </MenuItem>
        <MenuItem value="startDate">Start By</MenuItem>
        <MenuItem value="endDate">End By</MenuItem>
        <MenuItem value="updatedAt">Updated By</MenuItem>
      </Select>
      </FormControl>


      <FormControl size="small" sx={{ width: 200 }}>
       <span style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
        Course Name
      </span>
      <Select
        value={batchStatus}
        displayEmpty
        onChange={(e) => setBatchStatus(e.target.value)}
      >
        <MenuItem value="">
          --Select--
        </MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="deactive">Deactive</MenuItem>
      </Select>
    </FormControl>
    <Box className=" w-100 align-items-center gap-3 d-flex flex-row">
    {/* Apply */}
      <Button variant="contained" size="small" onClick={handleApplyFilter}>Apply</Button>

    {/* Reset */}
      <Button variant="outlined" size="small" onClick={handleResetFilter}>Reset</Button>
      </Box>
    </Paper>
  </Collapse>

      {/* Table */}
      {showTable && (
          <Box sx={{ mt: 5 }}> {/* gap between filter panel and table */}
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
                  <StyledTableCell colSpan={14} align="center">
                    No batches found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredData.map((batch,index) => (
                  <StyledTableRow key={batch._id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                    {/* Action */}
                    <StyledTableCell>
                      <div style={{ display: 'flex', justifyContent: "space-evenly", fontSize: "18px" }}>
                        {role === "admin" && (
                          <>
                         <FaEdit
                            className="text-success"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditClick(course)}/>
                            {/* Delete */}
                            {studentBatchMap[student.studentName]?.batchNumber ? null : (
                              <MdDelete
                                className="text-danger"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDeleteClick(student._id)}
                              />
                            )}
                          </>
                        )}
                        {/* Lock */}
                        <FaKey
                              className="text-success"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditClick(student)}
                            />
                                           {/* Password  */}
                          <FaKey
                          className="text-secondary"
                          style={{ cursor: 'pointer', fontSize: "16px" }}
                          onClick={() => handlePasswordClick(student.password)}
                        />
                      </div>
                    </StyledTableCell>


                    <StyledTableCell>{batch.batchNumber}</StyledTableCell>
                    <StyledTableCell>
                    {batch.startDate
                      ? (() => {
                          const course = courseData?.find(c => c.courseName === batch.courseName);
                          if (!course || !course.noOfDays) return '-';
                          const endDate = new Date(new Date(batch.startDate).getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
                          return new Date() > endDate ? "Closed" : "Open";
                        })()
                      : '-'}
                  </StyledTableCell>
                    <StyledTableCell>{formatDateTime(batch.startDate)}</StyledTableCell>
                    <StyledTableCell>
                    {batch.startDate
                      ? (() => {
                          const course = courseData?.find(c => c.courseName === batch.courseName); // or c.courseName
                          // console.log("batch.courseName:", batch.courseName, "matched course:", course);

                          if (!course || !course.noOfDays) return '-';
                          const endDate = new Date(new Date(batch.startDate).getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
                          // console.log("EndDate:", endDate);
                          return formatDateTime(endDate);
                        })()
                      : '-'}
                  </StyledTableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
          </Box>
      )}

      {/* Edit Modal */}
      {show && (
        <ModalEditBatch
          show={show}
          setShow={setShow}
          singleBatch={singleBatch}
          setSingleBatch={setSingleBatch}
          setBatchData={setBatchData}
        />
      )}

      {/* Delete Modal */}
      {viewWarning && (
        <ModalDeleteWarning
          viewWarning={viewWarning}
          singleBatch={singleBatch}
          setBatchData={setBatchData}
          setViewWarning={setViewWarning}
        />
      )}
    </>
  );
}

export default CustomisedBatchTables;
