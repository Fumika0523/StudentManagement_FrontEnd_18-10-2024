import React, { useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import EditStudentData from './EditStudentData';
import ModalShowPassword from './ModalShowPassword';
import { url } from '../../utils/constant';
import { FaKey } from "react-icons/fa";


// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14.5px',
    padding: '10px 15px',
    textWrap:"noWrap"
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: '13px',
    textAlign: 'center',
    padding: '10px 15px',
    textWrap:"noWrap"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: '#daf1fc',
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
const CustomizedTables = ({ studentData,setStudentData,courseData,setCourseData }) => {

  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleEditClick = (student) => {
    setShow(true);
    setSingleStudent(student);
  };

  const handleDeleteClick = async (id) => {
    try {
      let res =await axios.delete(`${url}/deletestudent/${id}`, config);
      console.log(res)
      if(res){
        let res = await axios.get(`${url}/allstudent`,config)
        console.log("StudentData",res.data.studentData)
        // console.log("index",res.data.studentData)
        setStudentData(res.data.studentData)
      }
      // alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handlePasswordClick = (password) => {
    setViewPassword(true);
    setPassword(password);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
            <StyledTableCell >No.</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Birthdate</StyledTableCell>
              <StyledTableCell>Course ID</StyledTableCell>
              <StyledTableCell>Preferred Course Name</StyledTableCell>
              <StyledTableCell>Admission Fee</StyledTableCell>
              <StyledTableCell>Admission Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {studentData?.map((student,index) => (
              <StyledTableRow key={student._id}>
              <StyledTableCell className='p-0'>{index+1}</StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <FaEdit
                      className="text-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(student)}
                    />
                    <MdDelete
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteClick(student._id)}
                    />
                    <FaKey
                      className="text-secondary"
                      style={{ cursor:'pointer' }}
                      onClick={() => handlePasswordClick(student.password)}
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{student._id}</StyledTableCell>
                <StyledTableCell>
                  {student.studentName
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </StyledTableCell>
                <StyledTableCell>{student.username}</StyledTableCell>
                <StyledTableCell>{student.email}</StyledTableCell>
                <StyledTableCell>{student.phoneNumber}</StyledTableCell>
                <StyledTableCell>
                  {student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
                </StyledTableCell>
                <StyledTableCell>{formatDate(student.birthdate)}</StyledTableCell>
                <StyledTableCell>{student.courseId}</StyledTableCell>
                {/* <StyledTableCell>{student.courseName}</StyledTableCell> */}
                <StyledTableCell>{student.courseName}</StyledTableCell>
                <StyledTableCell>{student.admissionFee}</StyledTableCell>
                <StyledTableCell>{formatDate(student.admissionDate)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      </TableContainer>

      {show && (
        <EditStudentData
          show={show}
          setShow={setShow}
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
    </>
  );
};

export default CustomizedTables;

