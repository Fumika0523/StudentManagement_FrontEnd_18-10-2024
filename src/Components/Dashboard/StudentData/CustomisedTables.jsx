import * as React from 'react';
// import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { Table } from 'react-bootstrap';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.grey,
      color: theme.palette.common.grey,
      
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: "15px",
      padding:"0.5% 1%",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const tableHeadStyle ={
    fontSize:"17px",
    padding:"0.5% 1%",
  }

  const thStyle={
    color:"#5a5c69",
    padding:"1%"
  }
export default function CustomizedTables({studentData}){
    return(
        <>
   <Table>
   <thead  style={{borderBottom:"4px solid #e3e6f0",}}>
        <tr >
          <th className='fw-bold' style={thStyle}>Student ID</th>
          <th className='fw-bold' style={thStyle}>Username</th>
          <th className='fw-bold' style={thStyle}>Email</th>
          <th className='fw-bold' style={thStyle}>Phone Number</th>
          <th className='fw-bold' style={thStyle}>Gender</th>
          <th className='fw-bold' style={thStyle}>Birthdate</th>
        </tr>
      </thead>
      <tbody>
      {studentData.map((element)=>(
                <tr >
                <td style={thStyle}>{element._id}</td>
                <td style={thStyle}>{element.username}</td>
                <td style={thStyle}>{element.email}</td>
                <td style={thStyle}>{element.phoneNumber}</td>
                <td style={thStyle}>{element.gender}</td>
                <td style={thStyle}>{element.birthdate}</td>
              </tr>   
        ))}
      </tbody>
    </Table>

        {/* <TableContainer component={Paper} style={{ width:"97%",margin:"2% 1.5%",border:"1px solid grey"}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead >
                <TableRow>
                    <StyledTableCell style={tableHeadStyle}>
                       Student ID
                    </StyledTableCell>
                    <StyledTableCell style={tableHeadStyle}>
                        Username
                    </StyledTableCell>
                    <StyledTableCell style={tableHeadStyle}>
                        Email
                    </StyledTableCell>
                    <StyledTableCell style={tableHeadStyle}>
                        Phone Number
                    </StyledTableCell>
                    <StyledTableCell style={tableHeadStyle}>
                        Gender
                    </StyledTableCell>
                    <StyledTableCell style={tableHeadStyle}>
                        Birthdate
                    </StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {studentData.map((element)=>(
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