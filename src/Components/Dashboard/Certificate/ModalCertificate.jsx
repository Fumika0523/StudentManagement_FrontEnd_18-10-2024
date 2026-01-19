import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogContent, DialogActions, Box
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: 700,
    textAlign: "center",
    fontSize: "14px",
    padding: "10px 12px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    textAlign: "center",
    padding: "10px 12px",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:hover": { backgroundColor: "#b3e5fc" },
}));

const ModalCertificate = ({ open, setOpen, batch }) => {
  const handleClose = () => setOpen(false);

  // later you can replace this with real data from batch
  const rows = [
    {
      studentName: "student01",
      completionDate: "12/01/2026",
      score: "80%",
      attendance: "90%",
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ pt: 2 }}>
        <TableContainer component={Paper} sx={{ maxHeight: 360, boxShadow: 0 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Completion Date</StyledTableCell>
                <StyledTableCell>Score</StyledTableCell>
                <StyledTableCell>Attendance</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, idx) => (
                <StyledTableRow key={idx}>
                  <StyledTableCell>{row.studentName}</StyledTableCell>
                  <StyledTableCell>{row.completionDate}</StyledTableCell>
                  <StyledTableCell>{row.score}</StyledTableCell>
                  <StyledTableCell>{row.attendance}</StyledTableCell>
                  <StyledTableCell>
                    <Button size="small" variant="outlined">
                      Generate
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        {/* <Button variant="contained" onClick={() => window.print()}>
          Print / Download
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ModalCertificate;
