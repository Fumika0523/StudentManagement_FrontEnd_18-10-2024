import * as React from 'react';
// import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Table } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState } from "react"
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { url } from '../../utils/constant';
import EditStudentData from './EditStudentData';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableBody } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.grey,
      // color: theme.palette.common.grey,
      fontSize:"18px",
      color:"#5a5c69",
      margin:"0%",
      fontWeight:"bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize:"16.5px",
      padding:"1%"
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child StyledTableCell, &:last-child th': {
      border: 0,
    },
  }));

  

  const formaStyledTableCellate = (dateString) => {
    const date = new Date(dateString); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // showing only year, month, day in number
    return date.toLocaleDateString('en-US', options); // show in US date style
    };

export default function CustomizedTables({studentData}){
  const [show, setShow] = useState(false);
  const [singleStudent, setSingleStudent]=useState()
  const {id}=useParams()

  const token = sessionStorage.getItem('token')
  console.log(token)

  let config = {
  headers:{
    Authorization:`Bearer ${token}`
    }
  }

  const getStudentData=async()=>{
    console.log("Student data is called.......")
    let res = await fetch(`${url}/student/${id}`,config)//API Call
    let data = await res.json() //responding in string so we can not use string, converting to json format
    console.log(`studentData:`,data[0])
    setSingleStudent(data[0])
  }
  console.log(studentData)
  useEffect(()=>{
    getStudentData()
  },[])

    return(
        <>
  <TableContainer component={Paper}>
   <Table >
   <TableHead  style={{borderBottom:"4px solid #e3e6f0"}}>
        <TableRow >
          <StyledTableCell style={{width:"3%"}}></StyledTableCell>
          <StyledTableCell style={{width:"3%"}}></StyledTableCell>
          <StyledTableCell  >Student ID</StyledTableCell>
          <StyledTableCell >Username</StyledTableCell>
          <StyledTableCell >Email</StyledTableCell>
          <StyledTableCell >Phone Number</StyledTableCell>
          <StyledTableCell >Gender</StyledTableCell>
          <StyledTableCell >Birthdate</StyledTableCell>
        </TableRow>
      </TableHead>
     <TableBody>
      {studentData?.map((element)=>(
                <StyledTableRow >
                <StyledTableCell>
                {/* EDIT */}
                 <FaEdit onClick={()=>setShow(true)}   className='text-danger fs-3'/></StyledTableCell>

                  {/* DELETE */}
                <StyledTableCell><MdDelete  className='text-secondary fs-3 p-0 m-0 border border-white'/></StyledTableCell>
            
                <StyledTableCell > {element._id}</StyledTableCell>
                <StyledTableCell  >{element.username}</StyledTableCell>
                <StyledTableCell  >{element.email}</StyledTableCell>
                <StyledTableCell >{element.phoneNumber}</StyledTableCell>
                <StyledTableCell >{element.gender}</StyledTableCell>
                <StyledTableCell  >{formaStyledTableCellate(element.birthdate)}</StyledTableCell>
              </StyledTableRow>   
        ))}
     </TableBody>
    </Table>
    </TableContainer>
    
    {
        show && 
    <EditStudentData 
    show={show} setShow={setShow} singleStudent={singleStudent} id={id} />
  
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