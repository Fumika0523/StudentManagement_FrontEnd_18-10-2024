import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { MdOutlineRateReview, MdDelete } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { PiCertificateFill } from "react-icons/pi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { url } from '../../utils/constant';
import ModalEditBatch from './ModalEditBatch';
import ModalDeleteWarning from './ModalDeleteWaning';
import {ModalShowStudentsList} from './ModalShowStudentsList';
import ModalCertificate from '../Certificate/ModalCertificate';
import { StyledTableCell, StyledTableRow, tableContainerStyles } from "../../utils/constant";
import { FaCircleCheck } from "react-icons/fa6";
import { FaUsers, FaEdit, FaLock } from "react-icons/fa";

// Blinking red dot CSS
const dotStyle = `
.live-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  background-color: red;
  border-radius: 50%;
  margin-right: 3px;
  box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 0, 0, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
}
`;

// Helper: compute status based on DB value + dates
const computeStatus = (batch, course) => {
  if (batch.status === "Batch Completed") return "Batch Completed";
  if (!batch.startDate || !course || !course.noOfDays) {
    return batch.status || "Not Started";
  }

  const startDate = new Date(batch.startDate);
  const endDate = new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000);
  const today = new Date();

  if (today < startDate) return "Not Started";
  if (today >= startDate && today < endDate) return "In Progress";
  return "Training Completed";
};

function CustomisedBatchTables({ 
  batchData, 
  setBatchData, 
  courseData, 
  admissionData, 
  studentData 
}) {
  // Modal states
  const [show, setShow] = useState(false);
  const [singleBatch, setSingleBatch] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedBatchStudents, setSelectedBatchStudents] = useState([]);
  const [openCertificate, setOpenCertificate] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  
  // Status map for computed statuses
  const [statusMap, setStatusMap] = useState({});

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit handler
  const handleEditClick = (batch) => {
    setShow(true);
    setSingleBatch(batch);
  };

  // Delete handler
  const handleDelete = (batch) => {
    if (role === "admin") {
      setSingleBatch(batch);
      setViewWarning(true);
    } else {
      toast.error("To delete this information, please contact Super-Admin", { autoClose: 2000 });
    }
  };

  // View students handler
  const handleViewStudents = (batch) => {
    const studentsInBatchNames = admissionData
      .filter(admission => admission.batchNumber === batch.batchNumber)
      .map(admission => admission.studentName);

    const studentsInBatch = studentData?.filter(student =>
      studentsInBatchNames.includes(student.studentName)
    );
    
    setSelectedBatchStudents(studentsInBatch);
    setShowStudentsModal(true);
  };

  // Certificate handler
  const handleOpenCertificate = (batch) => {
    setOpenCertificate(true);
  };

  const handleCloseCertificate = () => {
    setOpenCertificate(false);
  };

  // Admin review handler
  const handleAdminReviewClick = (batch) => {
    if (batch.approvalStatus === "pending" && batch.requestedBy) {
      window.location.href = `/approve?batchId=${batch._id}`;
    }
  };

  // Send approval request
  const handleSendApproval = async (batch) => {
    try {
      const response = await axios.post(
        `${url}/batch/send-approval-request`,
        {
          batchId: batch._id,
          username: localStorage.getItem("username"),
        },
        config
      );
      toast.success("Approval request sent to Admin");
      setBatchData((prev) =>
        prev.map((b) =>
          b._id === batch._id ? { ...b, approvalStatus: "pending" } : b
        )
      );
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      toast.error("Failed to send approval request");
    }
  };

  // Build statusMap whenever batchData / courseData changes
  useEffect(() => {
    if (!batchData || batchData.length === 0) return;
    setStatusMap((prev) => {
      const updated = { ...prev };
      batchData.forEach((batch) => {
        const course = courseData?.find((c) => c.courseName === batch.courseName);
        const newStatus = computeStatus(batch, course);
        updated[batch._id] = newStatus;
      });
      return updated;
    });
  }, [batchData, courseData]);

  // Sync statusMap to backend (only when different from DB)
  useEffect(() => {
    if (!batchData || batchData.length === 0 || !token) return;

    const syncStatuses = async () => {
      try {
        await Promise.all(
          batchData.map((batch) => {
            const localStatus = statusMap[batch._id];
            if (!localStatus || localStatus === batch.status) return null;
            
            return axios
              .put(`${url}/updatebatch/${batch._id}`, { status: localStatus }, config)
              .then(() => {
                setBatchData((prev) =>
                  prev.map((b) =>
                    b._id === batch._id ? { ...b, status: localStatus } : b
                  )
                );
              })
              .catch((err) => {
                console.error("Failed to sync status for batch", batch._id, err);
              });
          }).filter(Boolean)
        );
      } catch (e) {
        console.error("Error syncing batch statuses", e);
      }
    };

    syncStatuses();
  }, [statusMap]);

  // Format date/time
  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d
      .toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour12: true })
      .replace("at", "");
  };

  // Check if batch is older than 7 days
  const isOlderThan7Days = (dateString) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - startDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  // Render action icons
  const renderActionIcons = (batch, status) => {
    const approval = batch.approvalStatus ?? "none";
    const isAdmin = role === "admin";
    const isStaff = role === "staff";
    const isOld = isOlderThan7Days(batch.startDate);

    const ViewUsersIcon = (
      <FaUsers
        className="text-secondary"
        style={{ fontSize: "19px", cursor: "pointer" }}
        title="View batch users"
        onClick={() => handleViewStudents(batch)}
      />
    );

    const CertificateIcon = (
      <PiCertificateFill
        className="text-primary fs-5"
        title="Certificate"
        style={{ cursor: "pointer" }}
        onClick={() => handleOpenCertificate(batch)}
      />
    );

    const EditIcon = (
      <FaEdit
        className="text-success"
        style={{ cursor: "pointer", fontSize: "17px" }}
        title="Edit batch"
        onClick={() => handleEditClick(batch)}
      />
    );

    const LockIcon = (msg) => (
      <FaLock
        className="text-muted"
        style={{ cursor: "pointer", opacity: 0.7, fontSize: "16px" }}
        title={msg}
        onClick={() => toast.error(msg, { autoClose: 2000 })}
      />
    );

    const ReviewIcon = (
      <MdOutlineRateReview
        className="text-primary"
        style={{ fontSize: "20px", cursor: "pointer" }}
        title="Review approval request"
        onClick={() => handleAdminReviewClick(batch)}
      />
    );

    const SendApprovalIcon = (
      <IoIosInformationCircle
        className="text-primary fs-5"
        style={{ cursor: "pointer" }}
        title="Send approval request to Admin"
        onClick={() => handleSendApproval(batch)}
      />
    );

    const ApprovedDot = <span className="live-dot" title="Approved - can edit" />;

    // Batch Completed
    if (status === "Batch Completed") {
      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          <FaCircleCheck
            className="text-success"
            style={{ fontSize: "18px", cursor: "default" }}
            title="Batch fully completed"
          />
          {CertificateIcon}
        </div>
      );
    }

    // Not Started / In Progress
    if (status === "Not Started" || status === "In Progress") {
      if (isStaff && isOld) {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            {LockIcon("This batch is locked (over 7 days old). Contact Admin.")}
          </div>
        );
      }

      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          {EditIcon}
        </div>
      );
    }

    // Training Completed
    if (status === "Training Completed") {
      if (isStaff) {
        if (approval === "approved") {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              {ApprovedDot}
              {EditIcon}
            </div>
          );
        }

        if (approval === "pending") {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              <FaLock className="text-muted" style={{ opacity: 0.7, fontSize: "16px" }} title="Pending" />
              <IoIosInformationCircle
                className="text-secondary fs-5"
                style={{ opacity: 0.4, cursor: "pointer" }}
                title="Admin approval is pending"
                onClick={() => toast.info("Waiting for admin approval…", { autoClose: 2000 })}
              />
            </div>
          );
        }

        if (approval === "declined") {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              {LockIcon("Approval request was declined by Admin.")}
            </div>
          );
        }

        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            {LockIcon("Training completed. Request approval from Admin to edit.")}
            {SendApprovalIcon}
          </div>
        );
      }

      if (isAdmin) {
        if (approval === "pending") {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              {ReviewIcon}
            </div>
          );
        }

        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}
            <FaLock
              className="text-muted"
              style={{ opacity: 0.7, fontSize: "16px" }}
              title="Training completed. Editing is locked."
            />
          </div>
        );
      }

      return <div className="d-flex align-items-center gap-2">{ViewUsersIcon}</div>;
    }

    return <div className="d-flex align-items-center gap-2">{ViewUsersIcon}</div>;
  };

  // Calculate paginated data
  const paginatedData = batchData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <style>{dotStyle}</style>
      <Box sx={{ width: '100%' }}>
        {/* Table */}
        {batchData.length > 0 ? (
          <Paper sx={tableContainerStyles}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No.</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>Batch No.</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>End Date</StyledTableCell>
                    <StyledTableCell>Class Type</StyledTableCell>
                    <StyledTableCell>Course</StyledTableCell>
                    <StyledTableCell>Session Day</StyledTableCell>
                    <StyledTableCell>Class Size</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Session Time</StyledTableCell>
                    <StyledTableCell>Fees</StyledTableCell>
                    <StyledTableCell>Assigned</StyledTableCell>
                    <StyledTableCell>Created</StyledTableCell>
                    <StyledTableCell>Updated</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedData.map((batch, index) => {
                    const course = courseData?.find(c => c.courseName === batch.courseName);
                    const status = statusMap[batch._id] || computeStatus(batch, course);
                    const actualAssignedCount = admissionData?.filter(
                      (adm) => adm.batchNumber === batch.batchNumber
                    ).length || 0;
                    const startDate = new Date(batch.startDate);
                    const endDate = course && course.noOfDays
                      ? new Date(startDate.getTime() + course.noOfDays * 24 * 60 * 60 * 1000)
                      : null;

                    return (
                      <StyledTableRow key={batch._id}>
                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>

                        {/* Action icons */}
                        <StyledTableCell>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                            {renderActionIcons(batch, status)}
                            <MdDelete
                              className={role === "admin" ? "text-danger" : "text-muted"}
                              style={{ cursor: "pointer", fontSize: "18px", opacity: role === "admin" ? 1 : 0.5 }}
                              onClick={() => handleDelete(batch)}
                            />
                          </div>
                        </StyledTableCell>

                        <StyledTableCell>{batch.batchNumber}</StyledTableCell>

                        {/* Status badge */}
                        <StyledTableCell>
                          <span
                            style={{
                              backgroundColor:
                                status === "Not Started" ? "#fdecea"
                                : status === "In Progress" ? "#faf3cdff"
                                : status === "Training Completed" ? "#e6f4ea"
                                : "#a1c5feff",
                              color:
                                status === "Not Started" ? "#d32f2f"
                                : status === "In Progress" ? "#e18b08ff"
                                : status === "Training Completed" ? "#2e7d32"
                                : "#042378ff",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontWeight: 600,
                              fontSize: "11px",
                              display: "inline-block",
                              minWidth: "110px",
                              textAlign: "center",
                            }}
                          >
                            {status}
                          </span>
                        </StyledTableCell>

                        <StyledTableCell>{formatDateTime(startDate)}</StyledTableCell>
                        <StyledTableCell>{endDate ? formatDateTime(endDate) : "-"}</StyledTableCell>
                        <StyledTableCell>{batch.sessionType}</StyledTableCell>
                        <StyledTableCell>{batch.courseName}</StyledTableCell>
                        <StyledTableCell>{batch.sessionDay}</StyledTableCell>
                        <StyledTableCell>{batch.targetStudent}</StyledTableCell>
                        <StyledTableCell>{batch.location}</StyledTableCell>
                        <StyledTableCell>{batch.sessionTime}</StyledTableCell>
                        <StyledTableCell>{batch.fees}</StyledTableCell>
                        <StyledTableCell style={{ color: actualAssignedCount >= batch.targetStudent ? 'red' : 'inherit' }}>
                          {actualAssignedCount} / {batch.targetStudent}
                        </StyledTableCell>
                        <StyledTableCell>{formatDateTime(batch.createdAt)}</StyledTableCell>
                        <StyledTableCell>{formatDateTime(batch.updatedAt)}</StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[15, 30, 50, 100]}
              component="div"
              count={batchData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
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
            No batches found
          </Alert>
        )}

        {/* Edit Modal */}
        {show && singleBatch && (
          <ModalEditBatch
            key={singleBatch._id}
            show={show}
            setShow={setShow}
            singleBatch={singleBatch}
            setSingleBatch={setSingleBatch}
            setBatchData={setBatchData}
            courseData={courseData}
          />
        )}

        {/* Delete Modal */}
        {viewWarning && (
          <ModalDeleteWarning
            viewWarning={viewWarning}
            singleBatch={singleBatch}
            setBatchData={setBatchData}
            setViewWarning={setViewWarning}
          />
        )}

        {/* Students List Modal */}
        {showStudentsModal && (
          <ModalShowStudentsList
            show={showStudentsModal}
            setShow={setShowStudentsModal}
            selectedBatchStudents={selectedBatchStudents}
            setSelectedBatchStudents={setSelectedBatchStudents}
          />
        )}

        {/* Certificate Modal */}
        <ModalCertificate
          open={openCertificate}
          setOpen={setOpenCertificate}
        />
      </Box>
    </>
  );
}

export default CustomisedBatchTables;