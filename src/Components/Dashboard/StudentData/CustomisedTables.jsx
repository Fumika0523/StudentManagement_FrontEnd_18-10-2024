import * as React from 'react';
// import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Table } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState } from "react"
import EditStudentData from './EditStudentData';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableBody } from '@mui/material';
import axios from 'axios';
import { url } from '../../utils/constant';
import { IoEyeSharp } from "react-icons/io5";
import ModalShowPassword from './ModalShowPassword';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.grey,
      // color: theme.palette.common.grey,
      fontSize:"16px",
      color:"#5a5c69",
      margin:"0%",
      fontWeight:"bold",
      textAlign:"Center",
      padding:"1% 0%",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize:"16px",
      padding:"0.5% 0%",
      textAlign:"center",
        },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: '#e0f7fa',
      cursor: 'pointer',
    },
  }));

  const formaStyledTableCellate = (dateString) => {
    const date = new Date(dateString); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // showing only year, month, day in number
    console.log(date.toLocaleDateString('en-US', options))
    return date.toLocaleDateString('en-US', options); // show in US date style
    };
  
export default function CustomizedTables({studentData}){
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent]=useState(null)
  const [viewPassword, setViewPassword] = useState(false)
  const [password,setPassword]=useState(null)

 const token = sessionStorage.getItem('token')
 console.log('token')
 
  let config = {
      headers:{
          Authorization:`Bearer ${token}`
      }}

const handleEditClick = (student)=>{
  setShow(true)
  console.log(student)
  setSingleStudent(student)
}

const handleDeleteClick = (id)=>{
  deleteStudent(id)
}

const deleteStudent = async(id)=>{
  console.log("Student deleted from the DB...")
  let res = await axios.delete(`${url}/deletestudent/${id}`,config)
  console.log(res)
 }

 const handlePasswordClick=(password)=>{
 console.log(password)
 setViewPassword(true)
 setPassword(password)
 }

    return(
    <>
  <TableContainer component={Paper}>
   <Table >
    {/* textAlignment center */}
   <TableHead  style={{borderBottom:"4px solid #e3e6f0"}}>
        <TableRow >
          <StyledTableCell></StyledTableCell>
          <StyledTableCell  >Student ID</StyledTableCell>
          <StyledTableCell >Student Name</StyledTableCell>
          <StyledTableCell >Username</StyledTableCell>
          <StyledTableCell >Email</StyledTableCell>
          <StyledTableCell >Phone Number</StyledTableCell>
          <StyledTableCell >Gender</StyledTableCell>
          <StyledTableCell >Birthdate</StyledTableCell>
        </TableRow>
      </TableHead>
     <TableBody >
      {studentData?.map((element)=>(  
                <StyledTableRow  >
                {/* Remove the underline */}                 
                {/* EDIT */}
                <StyledTableCell className='text-decoration-none ps-2 m-0 '>
                <div className='d-flex p-0 m-0 fs-6'><FaEdit  onClick={()=>handleEditClick(element)}  className='text-success p-0 m-0 fs-6 text-decoration-none'/>

                  {/* DELETE */}
                <MdDelete  className='text-danger fs-6 p-0 m-0 border border-white' onClick={()=>handleDeleteClick(element._id)}/></div>                
               
                {/* Eye */}
                <div><IoEyeSharp className='text-primary fs-6 m-0 p-0' onClick={()=>handlePasswordClick(element.password)}/></div></StyledTableCell>
                
                <StyledTableCell > {element._id}</StyledTableCell>
                {/* Student name, initial letter should be capital */}
                {/* .toUpperCase().slice(1) */}
                <StyledTableCell  >{element.studentName.split(" ").map((element)=>element.charAt(0).toUpperCase()+element.slice(1)).join(" ")}</StyledTableCell>
                <StyledTableCell  >{element.username}</StyledTableCell>
                <StyledTableCell  >{element.email}</StyledTableCell>
                <StyledTableCell >{element.phoneNumber}</StyledTableCell>
                <StyledTableCell >{element.gender.charAt().toUpperCase()+element.gender.slice(1)}</StyledTableCell>
                <StyledTableCell  >{formaStyledTableCellate(element.birthdate)}</StyledTableCell>
              </StyledTableRow> 
                
        ))}
     </TableBody>
    </Table>
    </TableContainer>
    {
        show && 
    <EditStudentData 
    show={show} setShow={setShow} singleStudent={singleStudent} setSingleStudent={setSingleStudent} />
  }
  {
       viewPassword &&
       <ModalShowPassword viewPassword={viewPassword} setViewPassword={setViewPassword} password={password} setPassword={setPassword} />
  }


        {/* <TableContainer component={Paper} style={{ width:"97%",margin:"2% 1.5%",border:"1px solid grey"}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead >
                <TableRow>
                    <StyledTableCell style={TableHead}>
                       Student ID
                    </StyledTableCell>
                    <StyledTableCell style={TableHead}>
                        Username
                    </StyledTableCell>
                    <StyledTableCell style={TableHead}>
                        Email
                    </StyledTableCell>
                    <StyledTableCell style={TableHead}>
                        Phone Number
                    </StyledTableCell>
                    <StyledTableCell style={TableHead}>
                        Gender
                    </StyledTableCell>
                    <StyledTableCell style={TableHead}>
                        Birthdate
                    </StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {studenStyledTableCellata.map((element)=>(
                        <StyledTableRow>
                            <StyledTableCell>
                                {element._id}
                            </StyledTableCell>
                            <StyledTableCell>
                                {element.username}
                            </StyledTableCell>
                            <StyledTableCell>
                                {element.email}
                            </StyledTableCell>
                            <StyledTableCell>
                                {element.phoneNumber}
                            </StyledTableCell>
                            <StyledTableCell>
                                {element.gender}
                            </StyledTableCell>
                            <StyledTableCell>
                                {element.birthdate}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> */}
        </>
    )
  }

