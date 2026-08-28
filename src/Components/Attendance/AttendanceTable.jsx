import React, { useState } from 'react';
import {
  Table,TableBody, TableContainer, TableHead,
  TableRow, Paper,
  Box,
  Alert,
  TablePagination,
} from '@mui/material';
import { StyledTableCell, StyledTableRow, tableContainerStyles } from '../utils/constant';

const AttendanceTable = ({ studentData = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = studentData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //get date data
  const getDatesInCurrentMonth = ()=>{
    console.log("getDatesIncurrentMonth function is calling...")
    const now = new Date() //creating a Date object for today
    const year = now.getFullYear() // ex) 2026
    const month = now.getMonth() // 0 - index based >> January = 0, Feb = 1, ...

    const lastDay = new Date(year, month + 1, 0).getDate() // month + 1 >> next month, day = 0 > go back 1 day

    return Array.from({length: lastDay }, (_, i) => {
      const date = new Date(year, month, i + 1)
      const dayOfWeek = date.getDay()

      return {
        day: i + 1,
        label:date.toLocaleDateString('en-GB', {weekday:'short'}),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      }
    })
  }

  return (
    <Box  
    sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px"
      }}>
      {studentData.length > 0 ? (
        <Paper sx={tableContainerStyles}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                    <StyledTableCell>{item.studentName}</StyledTableCell>
                    <StyledTableCell>{item.date ?? '-'}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[15, 30, 50, 100]}
            component="div"
            count={studentData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page"
            sx={{
              borderTop: '1px solid rgba(0,0,0,0.08)',
              '& .MuiTablePagination-toolbar': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0,
                py: 0,
                px: 1,
                minHeight: 'unset',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                m: 0,
                whiteSpace: 'nowrap',
              },
              '& .MuiTablePagination-actions': {
                m: 0,
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputBase-root': { mt: 0 },
            }}
          />
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            mt: 2,
            borderRadius: '10px',
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
          }}
        >
          No student data found
        </Alert>
      )
      }
    </Box>
  );
};

export default AttendanceTable;