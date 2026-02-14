import React, { useState, useMemo } from 'react';
import { Modal, Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Paper, TableContainer, Typography, Box } from '@mui/material';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import { FaUsers } from 'react-icons/fa6';

export const ModalShowStudentsList = ({ show, setShow, selectedBatchStudents }) => {
  const [search, setSearch] = useState('');

  // Debounced search
  const filteredStudents = useMemo(() => {
    return _.filter(selectedBatchStudents, student =>
      student.studentName.toLowerCase().includes(search.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(search.toLowerCase())) ||
      (student.phoneNumber && student.phoneNumber.toString().includes(search))
    );
  }, [search, selectedBatchStudents]);

  const handleDownload = () => {
    const csvHeader = ['Student Name', 'Email', 'Phone Number', 'Gender'];
    const csvRows = filteredStudents.map(s => [
      s.studentName,
      s.email,
      s.phoneNumber,
      s.gender,
    ]);
    const csvContent = [csvHeader, ...csvRows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'students.csv');
  };

  return (
    <Modal open={show} onClose={() => setShow(false)}>
      <Box sx={{
        background: 'white',
        padding: 3,
        maxWidth: 700,
        width: '90%',
        maxHeight: '80vh',
        margin: '5% auto',
        borderRadius: 2,
        boxShadow: 6,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header + Download + Search */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaUsers size={24} color="#1976d2" />
            Assigned Students
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download CSV
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ maxHeight: '50vh', overflowY: 'auto', mb: 2 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <TableRow key={student._id} hover>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.email || '-'}</TableCell>
                    <TableCell>{student.phoneNumber || '-'}</TableCell>
                    <TableCell>{student.gender || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No students found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ textAlign: 'right' }}>
          <Button variant="outlined" onClick={() => setShow(false)}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};
