import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  TablePagination,
} from '@mui/material';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalEditCourse from './Modals/ModalEditCourse';
import ModalDeleteCourse  from './Modals/ModalDeleteCourse';
import {StyledTableCell, StyledTableRow, tableContainerStyles} from '../utils/constant'

export default function CustomisedCourseTables({ courseData, setCourseData }) {
  const [show, setShow] = useState(false);
  const [viewWarning, setViewWarning] = useState(false);
  const [singleCourse, setSingleCourse] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEditClick = (course) => {
    setShow(true);
    setSingleCourse(course);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedData = courseData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Table */}
      {courseData.length > 0 ? (
        <Paper
          sx={{
            tableContainerStyles
          }}
        >
          <TableContainer>
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
                {paginatedData.map((course) => (
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={courseData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
    borderTop: "1px solid rgba(0,0,0,0.08)",
    "& .MuiTablePagination-toolbar": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 0,
      py: 0,
      px: 1,
      minHeight: "unset",
    },
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
      m: 0,
      whiteSpace: "nowrap",
    },
    "& .MuiTablePagination-actions": {
      m: 0,
      display: "flex",
      alignItems: "center",
    },
    "& .MuiInputBase-root": {
      mt: 0,
    },
  }}
          />
        </Paper>
      ) : (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 2,
            borderRadius: "10px",
            border: "1px solid #bfdbfe",
            backgroundColor: "#eff6ff",
          }}
        >
          No courses found
        </Alert>
      )}

      {/* Edit Modal */}
      {show && (
        <ModalEditCourse
          show={show}
          key={singleCourse._id} 
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
      )}
    </Box>
  );
}