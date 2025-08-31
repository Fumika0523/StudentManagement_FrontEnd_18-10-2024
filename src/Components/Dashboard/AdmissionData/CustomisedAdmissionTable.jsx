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
import { useEffect } from 'react';
import { WrapText } from '@mui/icons-material';
import axios from 'axios';
import { url } from '../../utils/constant';


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
    backgroundColor: '#b3e5fc',
  },
}));

const CustomisedAdmissionTable = ({admissionData,setAdmissionData,courseData,setCourseData}) => {
  const [show,setShow]=useState(false)
  const [singleAdmission,setSingleAdmission] = useState(null)
  console.log(admissionData)
  const [singleCourse,setSingleCourse] = useState(null)
  const [viewWarning, setViewWarning] = useState(false)

  const token = localStorage.getItem('token')
  const config = {
      headers:{
          Authorization: `Bearer ${token}`
  }}

      const [studentData,setStudentData] = useState([])
      const getStudentData = async()=>{
        console.log("Student data is called.")
        let res = await axios.get(`${url}/allstudent`,config)
        console.log("Student Data",res.data.studentData)
        setStudentData(res.data.studentData)
        }
          useEffect(() => {
                getStudentData()
            }, [])
            console.log(studentData)
  
  const handleEditClick = (admission)=>{
    setShow(true);
    setSingleAdmission(admission)
}

const formatDate = (dateString)=>{
  // console.log(dateString)
  const date = new Date(dateString);
  // console.log(date)
  return date.toLocaleDateString('en-US',{
    year:"numeric",
    month:'short',
    day:'numeric',
    
  })
}
console.log(new Date("03-01-2025"))

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      hour12: true
  }).replace("at","");
};
//WHen you add a new admission data, automatically coursename should be added against the student name on student table.
  return (
    <>
    <TableContainer  component={Paper} >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Action</StyledTableCell>
            <StyledTableCell>Course ID</StyledTableCell>
            <StyledTableCell>Course Name</StyledTableCell>
            <StyledTableCell>Student ID</StyledTableCell>
            <StyledTableCell>Student Name</StyledTableCell>
            <StyledTableCell>Source</StyledTableCell>
            <StyledTableCell>Fee</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Month</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>CreatedAt</StyledTableCell>
            <StyledTableCell>UpdatedAt</StyledTableCell>
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
            <StyledTableCell>{admission.courseId}</StyledTableCell>
            <StyledTableCell>{admission.courseName}</StyledTableCell>
            <StyledTableCell>{admission.studentId}</StyledTableCell>
            <StyledTableCell>{admission.studentName}</StyledTableCell>
            <StyledTableCell>{admission.admissionSource}</StyledTableCell>
            <StyledTableCell>{admission.admissionFee}</StyledTableCell>
            <StyledTableCell>{formatDate(admission.admissionDate)}</StyledTableCell>
            <StyledTableCell>{admission.admissionMonth}</StyledTableCell>
            <StyledTableCell>{admission.admissionYear}</StyledTableCell>
            <StyledTableCell>{formatDateTime(admission.createdAt)}</StyledTableCell>
            <StyledTableCell>{formatDateTime(admission.updatedAt)}</StyledTableCell>
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