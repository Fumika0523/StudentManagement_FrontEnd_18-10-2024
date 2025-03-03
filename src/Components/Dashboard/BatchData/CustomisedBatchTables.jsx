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
import ModalEditBatch from './ModalEditBatch';
import ModalDeleteWarning from './ModalDeleteWaning';
import { WrapText } from '@mui/icons-material';


// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f4f6',
      color: '#5a5c69',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: '13px',
      padding: '10px 15px',
      textWrap:"noWrap"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: '13.5px',
      textAlign: 'center',
      padding:"1.5px 2px",
      margin:"0",
      WrapText:'noWrap'
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

function CustomisedBatchTables({batchData,setBatchData}){
    const [show,setShow] = useState(false)
    const [singleBatch,setSingleBatch] = useState(null) //?
    console.log(batchData)
    const [viewWarning,setViewWarning] =useState(false)
    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

  const handleEditClick = (batch)=>{
    setShow(true);
    setSingleBatch(batch)
  }

    return(
    <>
    {/* <h1>Batch data</h1> */}
    <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Batch No.</StyledTableCell>
              <StyledTableCell>Session Type</StyledTableCell>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell>Session Day</StyledTableCell>
              <StyledTableCell>Target Student</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Session Time</StyledTableCell>
              <StyledTableCell>Fees</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batchData?.map((batch) => (
              <StyledTableRow key={batch._id}>
                <StyledTableCell>
                  <div style={{ display: 'flex',fontSize:"18px", justifyContent:"space-evenly", textAlign:"center",}}>
                    <FaEdit
                      className="text-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(batch)}
                    />
                    <MdDelete
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={()=>{
                        setViewWarning(true)
                        console.log(batch)
                        setSingleBatch(batch)
                      }
                      }
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{batch.batchNumber}</StyledTableCell>
                <StyledTableCell>
                  {batch.sessionType}
                </StyledTableCell>
                <StyledTableCell>{batch.courseName}</StyledTableCell>
                <StyledTableCell>{batch.sessionDay}</StyledTableCell>
                <StyledTableCell>{batch.targetStudent}</StyledTableCell>
                <StyledTableCell>
                  {batch.location}
                </StyledTableCell>
                <StyledTableCell>{batch.sessionTime}</StyledTableCell>
                <StyledTableCell>{batch.fees}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Part */}
      {
        show && (
          <ModalEditBatch
          show={show}
          setShow={setShow}
          singleBatch={singleBatch}
          setSingleBatch={setSingleBatch}
          setBatchData={setBatchData} />
        )}

      {/* Delete */}
      {
        viewWarning && (
          <ModalDeleteWarning
          viewWarning = {viewWarning} 
          singleBatch={singleBatch}
          //passing from vieBatchData
          setBatchData={setBatchData}
          setViewWarning = {setViewWarning}
          />
        )
      }

    </>
    )
}
export default CustomisedBatchTables