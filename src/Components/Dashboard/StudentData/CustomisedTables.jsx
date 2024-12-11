import React, { useState } from 'react';
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
import { IoEyeSharp } from "react-icons/io5";
import axios from 'axios';
import EditStudentData from './EditStudentData';
import ModalShowPassword from './ModalShowPassword';
import { url } from '../../utils/constant';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f4f6',
    color: '#5a5c69',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '16px',
    padding: '10px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '14px',
    textAlign: 'center',
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

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Main component
const CustomizedTables = ({ studentData }) => {
  console.log(studentData)
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);

  const token = sessionStorage.getItem('token');
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
      await axios.delete(`${url}/deletestudent/${id}`, config);
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handlePasswordClick = (password) => {
    setViewPassword(true);
    setPassword(password);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Actions</StyledTableCell>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Birthdate</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData?.map((student) => (
              <StyledTableRow key={student._id}>
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
                    <IoEyeSharp
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
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
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {show && (
        <EditStudentData
          show={show}
          setShow={setShow}
          singleStudent={singleStudent}
          setSingleStudent={setSingleStudent}
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

