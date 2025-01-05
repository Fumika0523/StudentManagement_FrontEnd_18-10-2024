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
import ModalDeleteAdmission from './ModalDeleteAdmission';
import ModalEditAdmission from './ModalEditAdmission';

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

const CustomisedAdmissionTable = ({admissionData,setAdmissionData,courseData,setCourseData}) => {
  const [show,setShow]=useState(false)
  const [singleAdmission,setSingleAdmission] = useState(null)
  console.log(admissionData)
  const [singleCourse,setSingleCourse] = useState(null)
  const [viewWarning, setViewWarning] = useState(false)

  const token = sessionStorage.getItem('token')
  const config = {
      headers:{
          Authorization: `Bearer ${token}`
  }}

  
  const handleEditClick = (admission)=>{
    setShow(true);
    setSingleAdmission(admission)
}

const formatDate = (dateString)=>{
  console.log(dateString)
  const date = new Date(dateString);
  console.log(date)
  return date.toLocaleDateString('en-US',{
    year:"numeric",
    month:'long',
    day:'numeric'
  })
}
console.log(new Date("03-01-2025"))

  return (
    <>
    <TableContainer component={Paper} >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Action</StyledTableCell>
            <StyledTableCell>Course Name</StyledTableCell>
            <StyledTableCell>Admission Source</StyledTableCell>
            <StyledTableCell>Admission Fee</StyledTableCell>
            <StyledTableCell>Admission Date</StyledTableCell>
            <StyledTableCell>Admission Month</StyledTableCell>
            <StyledTableCell>Admission Year</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admissionData?.map((admission)=>(
          <StyledTableRow key={admission._id}>
            <StyledTableCell>
            <div style={{ display: 'flex',fontSize:"18px", justifyContent:"space-evenly",textAlign:"center"}}>
              <FaEdit 
              className="text-success"
              style={{ cursor: 'pointer' }}
              onClick={() => handleEditClick(admission)}/>

              <MdDelete
              className="text-danger"
              style={{ cursor: 'pointer' }}
              onClick={()=>{
              setViewWarning(true)
              console.log(admission)
              setSingleAdmission(admission)}}/>
            </div>

            </StyledTableCell>
            <StyledTableCell>{admission.courseName}</StyledTableCell>
            <StyledTableCell>{admission.admissionSource}</StyledTableCell>
            <StyledTableCell>{admission.admissionFee}</StyledTableCell>
            <StyledTableCell>{formatDate(admission.admissionDate)}</StyledTableCell>
            <StyledTableCell>{formatDate(admission.admissionMonth)}</StyledTableCell>
            <StyledTableCell>{formatDate(admission.admissionYear)}</StyledTableCell>
          </StyledTableRow>
          ))
        }
        </TableBody>
      </Table>
    </TableContainer>

    {/* Edit */}
    {
        show && (
            <ModalEditAdmission
            show = {show}
            setShow = {setShow}
            singleAdmission={singleAdmission}
            setSingleAdmission={setSingleAdmission}
            setAdmissionData={setAdmissionData}
            />
    )}

      {/* Delete */}
    {
        viewWarning && (
            <ModalDeleteAdmission
            viewWarning={viewWarning}
            singleAdmission={singleAdmission}
            setAdmissionData={setAdmissionData}
            setViewWarning={setViewWarning}/>
        )
    }
    </>
  )
}

export default CustomisedAdmissionTable