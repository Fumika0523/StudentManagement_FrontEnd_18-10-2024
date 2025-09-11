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


// Styled components
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

function CustomisedBatchTables({batchData,setBatchData}){
    const [show,setShow] = useState(false)
    const [singleBatch,setSingleBatch] = useState(null) //?
    const [viewWarning,setViewWarning] =useState(false)

  const handleEditClick = (batch)=>{
    setShow(true);
    setSingleBatch(batch)
  }

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
    return(
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
            <TableRow>
            <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Batch No.</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Session Type</StyledTableCell>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell>Session Day</StyledTableCell>
              <StyledTableCell>Target Student</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Session Time</StyledTableCell>
              <StyledTableCell>Fees</StyledTableCell>
               <StyledTableCell>Assigned Student</StyledTableCell>
            <StyledTableCell>CreatedAt</StyledTableCell>
            <StyledTableCell>UpdatedAt</StyledTableCell>
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
            <StyledTableCell>{batch.status}</StyledTableCell>
            <StyledTableCell>{batch.sessionType}
            </StyledTableCell>
            <StyledTableCell>{batch.courseName}</StyledTableCell>
            <StyledTableCell>{batch.sessionDay}</StyledTableCell>
            <StyledTableCell>{batch.targetStudent}</StyledTableCell>
            <StyledTableCell>{batch.location}
            </StyledTableCell>
            <StyledTableCell>{batch.sessionTime}</StyledTableCell>
            <StyledTableCell>{batch.fees}</StyledTableCell>
            <StyledTableCell>{batch.assignedStudentCount}</StyledTableCell>
            <StyledTableCell>{formatDateTime(batch.createdAt)}</StyledTableCell>
            <StyledTableCell>{formatDateTime(batch.updatedAt)}</StyledTableCell>
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