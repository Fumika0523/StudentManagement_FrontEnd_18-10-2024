import React, { useState } from 'react';
import ModalAddCourse from "./ModalAddCourse"
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Select, Box, TextField, Autocomplete
} from '@mui/material';
import  { tableCellClasses } from "@mui/material/TableCell";
import { styled } from '@mui/material/styles';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import ModalEditCourse from './ModalEditCourse';
import ModalDeleteCourse from './ModalDeleteCourse';
import { FormControl } from '@mui/material';
import TableFilter from '../TableFilter';


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


export default function CourseTable({ courseData, setCourseData }) {
    const [showAdd, setShowAdd] = useState(false);
  
  const [openFilters, setOpenFilters] = useState(true);
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [show, setShow] = useState(false);
  const [viewWarning, setViewWarning] = useState(false);
  const [singleCourse, setSingleCourse] = useState(null);

  const uniqueCourses = [...new Set(courseData.map(c => c.courseName))];

  // Apply Filter
  const handleApplyFilter = () => {
    let filtered = [...courseData];
    if (selectedCourse) {
      filtered = filtered.filter(c =>
        c.courseName?.toLowerCase().includes(selectedCourse.toLowerCase())
      );
    }
    setFilteredData(filtered);
    setShowTable(true);
  };

  // Reset Filter
  const handleResetFilter = () => {
    setCourseInput('');
    setSelectedCourse(null);
    setFilteredData([]);
    setShowTable(false);
  };

  const handleEditClick = (course) => {
    setShow(true);
    setSingleCourse(course);
  };

  return (
    <>
    <Box sx={{ width: '100%', }}>
      <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'stretch',
            // py: 2,
            gap: 2,
          }}
        >
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
  {/* <FormControl size="small" sx={{ minWidth: 200 }}>
    <span style={{ fontSize: 14, fontWeight: 600 }}>
      Batch Status
    </span>
    <Select
      value={batchStatus}
      onChange={(e) => setBatchStatus(e.target.value)}
    >
      <MenuItem value="">--Select--</MenuItem>
      <MenuItem value="active">Active</MenuItem>
      <MenuItem value="inactive">Inactive</MenuItem>
    </Select>
  </FormControl> */}
</TableFilter>


          {/* Add Button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <button 
              className="commonButton"
              onClick={() => setShowAdd(true)}
            >
              Add Course
            </button>
          </Box>
      </Box>

      {/* Table */}
     {showTable && (
  filteredData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Action</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Fee</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Availability</StyledTableCell>
                <StyledTableCell>Total Hours</StyledTableCell>
                <StyledTableCell>Daily Session Hours</StyledTableCell>
                <StyledTableCell>No. of Days</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={9} align="center">
                    No courses found
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredData.map((course) => (
                  <StyledTableRow key={course._id}>
                    <StyledTableCell>
                      <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                        <FaEdit
                          className="text-success fs-6"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(course)}
                        />
                        <MdDelete
                          className="text-danger fs-6"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setViewWarning(true);
                            setSingleCourse(course);
                          }}
                        />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>{course._id}</StyledTableCell>
                    <StyledTableCell>{course.courseName}</StyledTableCell>
                    <StyledTableCell>{course.courseFee}</StyledTableCell>
                    <StyledTableCell>{course.courseType}</StyledTableCell>
                    <StyledTableCell>{course.courseAvailability}</StyledTableCell>
                    <StyledTableCell>{course.courseDuration}</StyledTableCell>
                    <StyledTableCell>{course.dailySessionHrs}</StyledTableCell>
                    <StyledTableCell>{course.noOfDays}</StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ): (
     <Alert severity="info" sx={{ mt: 2 }}>No courses found</Alert>
  )
   ) }

      {/* Edit Modal */}
      {show && (
        <ModalEditCourse
          show={show}
          setShow={setShow}
          singleCourse={singleCourse}
          setSingleCourse={setSingleCourse}
          setCourseData={setCourseData}
        />
      )}

      {/* Delete Modal */}
      {viewWarning && (
        <ModalDeleteCourse
          viewWarning={viewWarning}
          singleCourse={singleCourse}
          setCourseData={setCourseData}
          setSingleCourse={setSingleCourse}
          setViewWarning={setViewWarning}
        />
      )
      }

         {
        showAdd && <ModalAddCourse show={showAdd} setShow={setShowAdd} setCourseData = {setCourseData} />
    }

    </Box>
    </>
  );
}
