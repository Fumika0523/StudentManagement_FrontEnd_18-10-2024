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

function CustomisedCourseTables({courseData,setCourseData}){
    const [show,setShow] = useState(false)
    const [singleCourse,setSingleCourse] = useState(null) //?
    console.log(courseData)
    const [viewWarning, setViewWarning] = useState(false)
   
    const token = localStorage.getItem('token')
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
            <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Fee</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Availability</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
        {/* What is key ..??? */}
          { courseData?.map((course)=>(
            <StyledTableRow key={course._id}>
                <StyledTableCell>
            <div style={{ display: 'flex',fontSize:"18px", justifyContent:"space-evenly",textAlign:"center"}}>
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
                    <StyledTableCell>{course._id}</StyledTableCell>
                    <StyledTableCell>{course.courseName}</StyledTableCell>
                    <StyledTableCell>{course.courseFee}</StyledTableCell>
                    <StyledTableCell>{course.courseType}</StyledTableCell>
                    <StyledTableCell>{course.courseTime}</StyledTableCell>
                    <StyledTableCell>{course.courseAvailability}</StyledTableCell>
                    <StyledTableCell>{course.courseDuration}</StyledTableCell>
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