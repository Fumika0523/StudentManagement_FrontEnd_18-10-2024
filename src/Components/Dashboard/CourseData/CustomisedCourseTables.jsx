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
import ModalEditCourse from './ModalEditCourse';
import ModalDeleteCourse from './ModalDeleteCourse'

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

function CustomisedCourseTables({courseData,setCourseData}){
    const [show,setShow] = useState(false)
    const [singleCourse,setSingleCourse] = useState(null) //?
    console.log(courseData)
    const [viewWarning, setViewWarning] = useState(false)

    const token = sessionStorage.getItem('token')
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
    }}

    const handleEditClick = (course)=>{
        setShow(true);
        setSingleCourse(course)
    }

  return(
  <>
   <TableContainer component={Paper} >
      <Table >
        <TableHead>
          <TableRow>
            <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell>Session Type</StyledTableCell>
              <StyledTableCell>Session Time</StyledTableCell>
              <StyledTableCell>Session Availability</StyledTableCell>
              <StyledTableCell>Session Duration</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
        {/* What is key ..??? */}
          { courseData?.map((course)=>(
            <StyledTableRow key={course._id}>
                <StyledTableCell>
                     <div style={{ display: 'flex',fontSize:"18px", justifyContent:"space-evenly", textAlign:"center"}}>
                     <FaEdit
                        className="text-success"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEditClick(course)}/>
                    
                    <MdDelete
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={()=>{
                        setViewWarning(true)
                        console.log(course)
                        setSingleCourse(course)}}/></div>
                        
                    </StyledTableCell>
                    <StyledTableCell>{course.courseName}</StyledTableCell>
                    <StyledTableCell>{course.sessionType}</StyledTableCell>
                    <StyledTableCell>{course.sessionTime}</StyledTableCell>
                    <StyledTableCell>{course.sessionAvailability}</StyledTableCell>
                    <StyledTableCell>{course.sessionDuration}</StyledTableCell>
                
                </StyledTableRow> 
             ))
           }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit */}
    {
        show && (
            <ModalEditCourse
            show = {show}
            setShow = {setShow}
            singleCourse = {singleCourse}
            setSingleCourse = {setSingleCourse}
            setCourseData = {setCourseData}/>
    )}

      {/* Delete */}
    {
        viewWarning && (
            <ModalDeleteCourse
            viewWarning = {viewWarning}
            singleCourse = {singleCourse}
            setCourseData = {setCourseData}
            setSingleCourse = {setSingleCourse}
            setViewWarning={setViewWarning}/>
        )
    }
   
    </>
)
}
export default CustomisedCourseTables