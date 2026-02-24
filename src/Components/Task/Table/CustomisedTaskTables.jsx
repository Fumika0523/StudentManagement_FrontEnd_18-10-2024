import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  Button,
  TablePagination,
} from "@mui/material";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
  url,
} from "../../utils/constant";

import ModalAssignTask from "./ModalAssignTask";
import axios from "axios";
import usePagination from "../../utils/usePagination";

export default function CustomisedTaskTables({ taskData = [] }) {
  const [batchData, setBatchData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const getBatchData = async () => {
      try {
        const res = await axios.get(`${url}/allbatch`, config);
        setBatchData(res.data.batchData || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    getBatchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build the rows you actually display
  const rows = useMemo(() => {
    return (taskData || []).flatMap((t) =>
      (t.taskDetail || []).map((d) => ({
        courseName: t.taskCourseName || "-",
        taskId: d._id || "-",
        taskQuestion: d.taskQuestion || "-",
        batchNumbers: Array.isArray(d.batchNumber) ? d.batchNumber : [],
        allocatedDay: d.allocatedDay ?? "-",
      }))
    );
  }, [taskData]);

  const handleAssignClick = (row) => {
    setSelectedTaskId(row.taskId);
    setShowAssign(true);
  };

  const selectedRow = rows.find((r) => r.taskId === selectedTaskId) || null;

  const closeAssignModal = () => {
    setShowAssign(false);
    setSelectedTaskId(null);
  };

  // Paginate the SAME array you render: rows
  const {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination(rows, { initialRowsPerPage: 10 });

  // Reset to page 0 when the dataset changes
  useEffect(() => {
    resetPage();
  }, [rows.length]); // length is enough to avoid unnecessary resets

  return (
    <Box sx={{ width: "100%" }}>
      {rows.length > 0 ? (
        <Paper sx={{ ...tableContainerStyles }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>#</StyledTableCell>
                  <StyledTableCell>Allocate Day</StyledTableCell>
                  <StyledTableCell>Course Name</StyledTableCell>
                  <StyledTableCell>Task ID</StyledTableCell>
                  <StyledTableCell>Task Question</StyledTableCell>
                  <StyledTableCell>Batch Number</StyledTableCell>
                  <StyledTableCell align="center">Assign</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row, idx) => {
                  const rowNumber = page * rowsPerPage + idx + 1;

                  return (
                    <StyledTableRow key={row.taskId || `${rowNumber}-${idx}`}>
                      <StyledTableCell>{rowNumber}</StyledTableCell>

                      <StyledTableCell>
                        {row.allocatedDay === "-" ? "-" : `Day ${row.allocatedDay}`}
                      </StyledTableCell>

                      <StyledTableCell>{row.courseName}</StyledTableCell>
                      <StyledTableCell>{row.taskId}</StyledTableCell>
                      <StyledTableCell>{row.taskQuestion}</StyledTableCell>

                      <StyledTableCell>
                        {row.batchNumbers?.length ? row.batchNumbers.join(", ") : "-"}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleAssignClick(row)}
                          sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
                        >
                          Assign
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
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
        <Alert severity="info" sx={{ mt: 2 }}>
          No tasks found
        </Alert>
      )}

      <ModalAssignTask
        show={showAssign}
        onClose={closeAssignModal}
        task={selectedRow}
        batchData={batchData}
      />
    </Box>
  );
}