import React, { useState, useEffect, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import { Box } from "@mui/material";
import { FaEdit, FaKey } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

import EditStudentData from "./Modals/EditStudent/EditStudentData";
import ModalShowPassword from "./Modals/ModalShowPassword";
import ModalDeleteStudent from "./Modals/ModalDeleteStudent";
import usePagination from "../utils/usePagination"; 
import {StyledTableCell,StyledTableRow, tableContainerStyles, url} from "../utils/constant"

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const CustomizedTables = ({
  studentData,
  setStudentData,
  admissionData,
  courseData,
  batchData,
}) => {
  const [studentBatchMap, setStudentBatchMap] = useState({});
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const handleEditClick = (student) => {
    setShowEdit(true);
    setSingleStudent(student);
  };

  const handleDeleteClick = (student) => {
    if (role === "admin") {
      setStudentToDelete(student);
      setShowDelete(true);
    } else {
      toast.error("To delete the information, please contact Super-Admin", { autoClose: 2000 });
    }
  };

  const handleConfirmDelete = async (id) => {
    const studentName = studentToDelete?.studentName || "Student";
    
    try {
      console.log("🗑️ Deleting student:", studentName);
      const res = await axios.delete(`${url}/deletestudent/${id}`, config);
      
      if (res) {
        const refreshed = await axios.get(`${url}/allstudent`, config);
        setStudentData(refreshed.data.studentData);
        
        toast.success(`🗑️ ${studentName} has been deleted successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        
        console.log(" Student deleted successfully");
      }
    } catch (error) {
      console.error(" Error deleting student:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete student. Please try again.";
      toast.error(`Delete Failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handlePasswordClick = (pwd) => {
    setViewPassword(true);
    setPassword(pwd);
  };

  useEffect(() => {
    if (studentData?.length && admissionData?.length && batchData?.length) {
      const map = {};
      admissionData
        .filter((a) => a.status === "Assigned")
        .forEach((admission) => {
          const batch = batchData.find((b) => b.batchNumber === admission.batchNumber);
          if (batch) {
            map[admission.studentName] = {
              batchNumber: admission.batchNumber,
              sessionTime: batch.sessionTime,
              source: admission.admissionSource,
              batchStatus: batch.status,
            };
          }
        });
      setStudentBatchMap(map);
    }
  }, [studentData, admissionData, batchData]);

  const courseMap = useMemo(() => {
    const map = {};
    (courseData || []).forEach((course) => (map[course._id] = course));
    return map;
  }, [courseData]);

  const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour12: true,
    }).replace("at", "");
  };

  const StatusBadge = ({ studentStatus, studentName }) => {
    const bStatus = studentBatchMap[studentName]?.batchStatus;
    const displayStatus = studentStatus === "Assigned" ? bStatus || "Assigned" : studentStatus;

    let bg = "#eeeeee";
    let color = "#333";

    switch (displayStatus) {
      case "Not Started":
        bg = "#fdecea"; color = "#d32f2f"; break;
      case "In Progress":
        bg = "#faf3cdff"; color = "#e18b08ff"; break;
      case "Training Completed":
        bg = "#e6f4ea"; color = "#2e7d32"; break;
      case "Batch Completed":
        bg = "#a1c5feff"; color = "#042378ff"; break;
      case "De-assigned":
        bg = "#cfd8dc"; color = "#455a64"; break;
      default:
        bg = "#eeeeee"; color = "#333";
    }

    return (
      <span
        style={{
          backgroundColor: bg,
          color,
          padding: "4px 8px",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "11px",
          display: "inline-block",
          minWidth: "110px",
          textAlign: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {displayStatus || "N/A"}
      </span>
    );
  };

  const {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination(studentData, { initialRowsPerPage: 10 });
  
  useEffect(() => {
    resetPage();
  }, [studentData]);

  return (
    <div className="">
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {/* Added proper horizontal scrolling */}
        <TableContainer 
          sx={{
            ...tableContainerStyles,
            maxWidth: "100%",
            overflowX: "auto",
            // Custom scrollbar styling
            "&::-webkit-scrollbar": {
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          <Table sx={{ minWidth: 2000 }}> {/*  Set minimum width to force scrolling */}
            <TableHead>
              <TableRow>
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
                <StyledTableCell>Batch No.</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Student ID</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone No.</StyledTableCell>
                <StyledTableCell>Gender</StyledTableCell>
                <StyledTableCell>Birthdate</StyledTableCell>
                <StyledTableCell>Preferred Courses</StyledTableCell>
                <StyledTableCell>Mapped Course</StyledTableCell>
                <StyledTableCell>Course ID</StyledTableCell>
                <StyledTableCell>Session Time</StyledTableCell>
                <StyledTableCell>Session Type</StyledTableCell>
                <StyledTableCell>Daily Session Hours</StyledTableCell>
                <StyledTableCell>No. of Days</StyledTableCell>
                <StyledTableCell>Admission Fee</StyledTableCell>
                <StyledTableCell>Admission Date</StyledTableCell>
                <StyledTableCell>Created Date</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((student, index) => {
                const course = courseMap[student.courseId] || {};
                const rowNumber = page * rowsPerPage + index + 1;

                return (
                  <StyledTableRow key={student._id}>
                    <StyledTableCell>{rowNumber}</StyledTableCell>

                    <StyledTableCell>
                      <div style={{ display: "flex", justifyContent: "space-evenly" , alignItems:"center"}}>
                        <FaEdit
                          className={role === "admin" ? "text-success fs-5" : "text-muted fs-5"}
                          style={{ cursor: "pointer", opacity: role === "admin" ? 1 : 0.5 }}
                          onClick={() => {
                            if (role === "admin") handleEditClick(student);
                            else toast.error("To edit the information, please contact Admin", { autoClose: 2000 });
                          }}
                          title="Edit Student"
                        />

                        <MdDelete
                          className={role === "admin" ? "text-danger fs-5" : "text-muted fs-5"}
                          style={{ cursor: "pointer", opacity: role === "admin" ? 1 : 0.5 }}
                          onClick={() => handleDeleteClick(student)}
                          title="Delete Student"
                        />

                        <FaKey
                          className="text-secondary fs-6"
                          style={{ cursor: "pointer", }}
                          onClick={() => handlePasswordClick(student.password)}
                          title="View Password"
                        />
                      </div>
                    </StyledTableCell>
                    
                    <StyledTableCell>{student.batchNumber || "-"}</StyledTableCell>
                    <StyledTableCell>
                      <StatusBadge studentStatus={student.status} studentName={student.studentName} />
                    </StyledTableCell>

                    <StyledTableCell>{student._id}</StyledTableCell>

                    <StyledTableCell>
                      {(student.studentName || "")
                        .split(" ")
                        .filter(Boolean)
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ") || "-"}
                    </StyledTableCell>

                    <StyledTableCell>{student.username || "-"}</StyledTableCell>
                    <StyledTableCell>{student.email || "-"}</StyledTableCell>
                    <StyledTableCell>{student.phoneNumber || "-"}</StyledTableCell>
                    <StyledTableCell>{student.gender || "-"}</StyledTableCell>
                    <StyledTableCell>{formatDate(student.birthdate)}</StyledTableCell>

                    <StyledTableCell>
                      {Array.isArray(student.preferredCourses) && student.preferredCourses.length
                        ? student.preferredCourses.join(", ")
                        : "Not selected yet"}
                    </StyledTableCell>

                    <StyledTableCell>{student.courseName || "-"}</StyledTableCell>
                    <StyledTableCell>{course._id || "-"}</StyledTableCell>

                    <StyledTableCell>{studentBatchMap[student.studentName]?.sessionTime || "-"}</StyledTableCell>
                    <StyledTableCell>{course.courseType || "-"}</StyledTableCell>
                    <StyledTableCell>{course.dailySessionHrs || "-"}</StyledTableCell>
                    <StyledTableCell>{course.noOfDays || "-"}</StyledTableCell>

                    <StyledTableCell>{student.admissionFee || "-"}</StyledTableCell>
                    <StyledTableCell>{formatDate(student.admissionDate)}</StyledTableCell>
                    <StyledTableCell>{formatDateTime(student.createdAt)}</StyledTableCell>
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
      </Box>

      {/* Edit Modal */}
      {showEdit && (
        <EditStudentData
          show={showEdit}
          setShow={setShowEdit}
          singleStudent={singleStudent}
          setSingleStudent={setSingleStudent}
          setStudentData={setStudentData}
        />
      )}

      {/* Password Modal */}
      {viewPassword && (
        <ModalShowPassword
          viewPassword={viewPassword}
          setViewPassword={setViewPassword}
          password={password}
          setPassword={setPassword}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <ModalDeleteStudent
          show={showDelete}
          setShow={setShowDelete}
          studentToDelete={studentToDelete}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default CustomizedTables;