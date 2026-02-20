import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Box, Alert, Button,
} from "@mui/material";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
  url,
} from "../../utils/constant";

import ModalAssignTask from "./ModalAssignTask";
import axios from "axios";

export default function CustomisedTaskTables({ taskData = [] }) {
  const [batchData, setBatchData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assignTask, setAssignTask] = useState(null);
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
  }, []);

  // taskData is array 
  const rows = taskData.flatMap((t) =>
    (t.taskDetail || []).map((d) => ({
      courseName: t.taskCourseName || "-",
      taskId: d._id || "-",
      taskQuestion: d.taskQuestion || "-",
      batchNumbers: Array.isArray(d.batchNumber) ? d.batchNumber : [],
      allocatedDay: d.allocatedDay ?? "-",
    }))
  );

const handleAssignClick = (row) => {
  setSelectedTaskId(row.taskId);
  setShowAssign(true);
};

const selectedRow = rows.find((r) => r.taskId === selectedTaskId) || null;

  const closeAssignModal = () => {
    setShowAssign(false);
    setAssignTask(null);
  };

  const confirmAssign = async (payload) => {
    console.log("Confirm assign payload:", payload);

    // TODO: call your backend here
    // await axios.put(`${url}/assignTaskToBatch`, payload, config);

    closeAssignModal();

    // If you want updated batchNumbers to show immediately,
    // you must refetch tasks or update taskData in parent.
  };

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
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.taskId || idx}>
                    <StyledTableCell>{idx + 1}</StyledTableCell>
                    <StyledTableCell>{row.allocatedDay === "-" ? "-" : `Day ${row.allocatedDay}`}</StyledTableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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