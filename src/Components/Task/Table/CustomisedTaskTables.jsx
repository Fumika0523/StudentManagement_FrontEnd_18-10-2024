import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  TablePagination,
  Button,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
} from "../../utils/constant"; // adjust path

export default function CustomisedTaskTables({ taskData = [], setTaskData }) {
  const [show, setShow] = useState(false);
  const [viewWarning, setViewWarning] = useState(false);
  const [singleTask, setSingleTask] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEditClick = (task) => {
    setShow(true);
    setSingleTask(task);
  };

  const handleDeleteClick = (task) => {
    setViewWarning(true);
    setSingleTask(task);
  };

  const handleAssignClick = (task) => {
    console.log("Assign clicked:", task);
    // TODO: open assign modal / call API etc
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    return taskData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [taskData, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      {taskData.length > 0 ? (
        <Paper sx={{ tableContainerStyles }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Action</StyledTableCell>
                  <StyledTableCell>Task ID</StyledTableCell>
                  <StyledTableCell>Course Name</StyledTableCell>
                  <StyledTableCell>Task Details</StyledTableCell>
                  <StyledTableCell>Created Date</StyledTableCell>
                  <StyledTableCell>Updated Date</StyledTableCell>
                  <StyledTableCell align="center">Assign</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((task) => (
                  <StyledTableRow key={task._id || task.id}>
                    {/* Action */}
                    <StyledTableCell>
                      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <FaEdit
                          className="text-success fs-5"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditClick(task)}
                        />
                        <MdDelete
                          className="text-danger fs-5"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteClick(task)}
                        />
                      </div>
                    </StyledTableCell>

                    {/* Columns */}
                    <StyledTableCell>{task.taskId || task._id || task.id}</StyledTableCell>
                    <StyledTableCell>{task.courseName}</StyledTableCell>
                    <StyledTableCell>{task.taskDetails}</StyledTableCell>
                    <StyledTableCell>{task.createdAt}</StyledTableCell>
                    <StyledTableCell>{task.updatedAt}</StyledTableCell>

                    {/* Assign button */}
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAssignClick(task)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 2,
                        }}
                      >
                        Assign
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={taskData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.08)",
              "& .MuiTablePagination-toolbar": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0,
                py: 0,
                px: 1,
                minHeight: "unset",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                m: 0,
                whiteSpace: "nowrap",
              },
              "& .MuiTablePagination-actions": {
                m: 0,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputBase-root": {
                mt: 0,
              },
            }}
          />
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            mt: 2,
            borderRadius: "10px",
            border: "1px solid #bfdbfe",
            backgroundColor: "#eff6ff",
          }}
        >
          No tasks found
        </Alert>
      )}

      {/* TODO: plug in your modals like you did for courses
          {show && <ModalEditTask ... />}
          {viewWarning && <ModalDeleteTask ... />}
          {assignModal && <ModalAssignTask ... />}
      */}
    </Box>
  );
}
