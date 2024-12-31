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
// import ModalEditCourse from './ModalEditCourse';
// import ModalDeleteCourse from './ModalDeleteCourse'

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



const CustomisedAdmissionTable = ({admissionData,setAdmissionData}) => {
  const [show,setShow]=useState(false)
  const [singleAdmission,setSingleAdmission] = useState(null)
  console.log(admissionData)
  
  const token = sessionStorage.getItem('token')
  const config = {
      headers:{
          Authorization: `Bearer ${token}`
  }}



  return (
    <>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Action</StyledTableCell>
            <StyledTableCell>Admission Source</StyledTableCell>
            <StyledTableCell>Admission Fee</StyledTableCell>
            <StyledTableCell>Admission Date</StyledTableCell>
            <StyledTableCell>Admission Month</StyledTableCell>
            <StyledTableCell>Admission Year</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admissionData?.map((admission)=>(
          <StyledTableRow key={admin._id}>
            <StyledTableCell>
            <div>
              <FaEdit/>
              <MdDelete/>
            </div>
            </StyledTableCell>
            <StyledTableCell>{admission.admissionSource}</StyledTableCell>
            <StyledTableCell>{admission.admissionFee}</StyledTableCell>
            <StyledTableCell>{admission.admissionDate}</StyledTableCell>
            <StyledTableCell>{admission.admissionMonth}</StyledTableCell>
            <StyledTableCell>{admission.admissionYear}</StyledTableCell>
          </StyledTableRow>
          ))
        }
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default CustomisedAdmissionTable