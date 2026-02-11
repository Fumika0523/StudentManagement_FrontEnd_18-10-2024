import React, { useState, useEffect, useMemo, useRef } from "react";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import {  Box,  Button,  Menu,  MenuItem,  Divider,  ListItemIcon,ListItemText,  FormControl,  Select,  Autocomplete,  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FiDownload, FiUpload, FiFileText } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import EditStudentData from "./EditStudentData";
import ModalShowPassword from "./ModalShowPassword";
import ModalAddStudent from "./ModalAddStudent";
import TableFilter from "../TableFilter";
import { url } from "../../utils/constant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "14.5px",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    textAlign: "center",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:hover": { backgroundColor: "#b3e5fc" },
}));

// Safe date formatter
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CustomizedTables = ({
  studentData,
  setStudentData,
  setAdmissionData,
  admissionData,
  courseData,
  setCourseData,
  batchData,
  setBatchData,
}) => {
  const [studentBatchMap, setStudentBatchMap] = useState({});
  const [singleStudent, setSingleStudent] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const role = localStorage.getItem("role");

  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInput, setCourseInput] = useState("");
  const [batchStatus, setBatchStatus] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(16);

  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // Memoize unique courses
  const uniqueCourses = useMemo(() => {
    if (!Array.isArray(batchData)) return [];
    return [...new Set(batchData.map((b) => b?.courseName).filter(Boolean))];
  }, [batchData]);

  const handleEditClick = (student) => {
    setShowEdit(true);
    setSingleStudent(student);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await axios.delete(`${url}/deletestudent/${id}`, config);
      if (res) {
        const refreshed = await axios.get(`${url}/allstudent`, config);
        setStudentData(refreshed.data.studentData);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Delete failed");
    }
  };

  const handlePasswordClick = (pwd) => {
    setViewPassword(true);
    setPassword(pwd);
  };

  // Apply filter logic
  const handleApplyFilter = () => {
    let filtered = Array.isArray(studentData) ? [...studentData] : [];

    // 1) Gender
    if (genderFilter) {
      filtered = filtered.filter((stu) => stu.gender === genderFilter);
    }

    // 2) Course Name
    if (selectedCourse) {
      filtered = filtered.filter((stu) => stu.courseName === selectedCourse);
    }

    // 3) Batch Status (from map)
    if (batchStatus) {
      filtered = filtered.filter((stu) => {
        const status = studentBatchMap[stu.studentName]?.batchStatus;
        return status === batchStatus;
      });
    }

    // 4) Date filter (keep your existing logic here)
    if (dateFilter) {
      const today = new Date();
      filtered = filtered.filter((stu) => {
        const created = new Date(stu.createdAt);
        if (isNaN(created)) return false;

        if (dateFilter === "today") return created.toDateString() === today.toDateString();

        // TODO: add your "week/month" logic if you have it.
        return true;
      });
    }

    setFilteredData(filtered);
    setShowTable(true);
    setPage(0);
  };

  const handleResetFilter = () => {
    setGenderFilter("");
    setBatchFilter("");
    setDateFilter("");
    setSelectedCourse(null);
    setCourseInput("");
    setBatchStatus("");
    setFilteredData([]);
    setShowTable(false);
    setPage(0);
  };

  // Sync filtered results when studentData changes (e.g., after adding/uploading)
  useEffect(() => {
    if (showTable) handleApplyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData]);

  // Build studentBatchMap
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

  // Create a map for fast lookup: courseId => course object
  const courseMap = useMemo(() => {
    const map = {};
    (courseData || []).forEach((course) => {
      map[course._id] = course;
    });
    return map;
  }, [courseData]);

  const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d
      .toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: true,
      })
      .replace("at", "");
  };

  // Status Badge
  const StatusBadge = ({ studentStatus, studentName }) => {
    const bStatus = studentBatchMap[studentName]?.batchStatus;
    const displayStatus = studentStatus === "Assigned" ? bStatus || "Assigned" : studentStatus;

    let bg = "#eeeeee";
    let color = "#333";

    switch (displayStatus) {
      case "Not Started":
        bg = "#fdecea";
        color = "#d32f2f";
        break;
      case "In Progress":
        bg = "#faf3cdff";
        color = "#e18b08ff";
        break;
      case "Training Completed":
        bg = "#e6f4ea";
        color = "#2e7d32";
        break;
      case "Batch Completed":
        bg = "#a1c5feff";
        color = "#042378ff";
        break;
      case "De-assigned":
        bg = "#cfd8dc";
        color = "#455a64";
        break;
      default:
        bg = "#eeeeee";
        color = "#333";
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

  // Excel bulk upload 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadTemplate = async () => {
    try {
      window.open("http://localhost:8001/api/excel/student-template", "_blank");
    } catch (e) {
      toast.error("Downloading Excel Template failed");
      console.error(e);
    }
  };

  const uploadExcel = async () => {
    if (!file) {
      toast.error("Please choose an Excel file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:8001/api/excel/student-import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Uploaded successfully!");

      // Optional: refresh student list after upload
      try {
        const refreshed = await axios.get(`${url}/allstudent`, config);
        setStudentData(refreshed.data.studentData);
      } catch (refreshErr) {
        console.error("Refresh after upload failed:", refreshErr);
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      toast.error("Upload failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Dropdown state
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const actionsOpen = Boolean(actionsAnchorEl);
  const fileInputRef = useRef(null);

  const openActionsMenu = (e) => setActionsAnchorEl(e.currentTarget);
  const closeActionsMenu = () => setActionsAnchorEl(null);

  const triggerFilePicker = () => {
    closeActionsMenu();
    fileInputRef.current?.click();
  };

  const onFilePicked = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };


  // Table data + pagination
  const displayData = showTable ? filteredData : studentData;
  const safeDisplayData = Array.isArray(displayData) ? displayData : [];

  const paginatedData = safeDisplayData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="row mx-auto">
        {/* Actions Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            my: 1,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
          }}
        >
          {/* Primary */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAdd(true)}
            sx={{ borderRadius: 2, backgroundColor:" #2c51c1" }}
          >
            Add Student
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFilePicked}
            style={{ display: "none" }}
          />

          {/* Dropdown */}
          <Button
         variant="outlined"
          startIcon={<MoreVertIcon size={18} />}
          onClick={openActionsMenu}
          sx={{ borderRadius: 2 , color:" #2c51c1", borderColor:" #2c51c1"}}
          >
            Actions
          </Button>

          <Menu
            anchorEl={actionsAnchorEl}
            open={actionsOpen}
            onClose={closeActionsMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { borderRadius: 2, minWidth: 260 } }}
          >
            <MenuItem
              onClick={() => {
                closeActionsMenu();
                downloadTemplate();
              }}
            >
              <ListItemIcon>
                <FiDownload  size={18}  />
              </ListItemIcon>
              <ListItemText primary="Download Excel Template" />
            </MenuItem>

            <MenuItem onClick={triggerFilePicker}>
              <ListItemIcon>
                <FiFileText size={18}  />
              </ListItemIcon>
              <ListItemText
                primary="Choose file…"
                secondary={file?.name ? file.name : "No file selected"}
              />
            </MenuItem>

            <Divider />

            <MenuItem
              disabled={loading || !file}
              onClick={() => {
                closeActionsMenu();
                uploadExcel();
              }}
            >
              <ListItemIcon>
                <FiUpload  size={18}  />
              </ListItemIcon>
              <ListItemText primary={loading ? "Updating…" : "Upload Updated Excel"} />
            </MenuItem>
          </Menu>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "start",
            mt: 1,
          }}
        >
          <TableFilter
            open={openFilters}
            setOpen={setOpenFilters}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
          >
            {/* Course Name */}
            <Box sx={{ minWidth: 200 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Course Name</span>
              <Autocomplete
                freeSolo
                options={uniqueCourses}
                value={selectedCourse}
                inputValue={courseInput}
                onInputChange={(e, v) => setCourseInput(v)}
                onChange={(e, v) => setSelectedCourse(v)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Box>

            {/* Batch Status */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Batch Status</span>
              <Select value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)}>
                <MenuItem value="">--Select--</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Training Completed">Training Completed</MenuItem>
                <MenuItem value="Batch Completed">Batch Completed</MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
              </Select>
            </FormControl>
          </TableFilter>
        </Box>

        {/* Table */}
        {showTable && (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", mt: "10px" }}>
            <TableContainer component={Paper}>
              <Table>
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

                        {/* Actions */}
                        <StyledTableCell>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                              fontSize: "18px",
                            }}
                          >
                            {/* Edit */}
                            <FaEdit
                              className={role === "admin" ? "text-success" : "text-muted"}
                              style={{ cursor: "pointer", opacity: role === "admin" ? 1 : 0.5 }}
                              onClick={() => {
                                if (role === "admin") handleEditClick(student);
                                else toast.error("To edit the information, please contact Admin", { autoClose: 2000 });
                              }}
                            />

                            {/* Delete */}
                            <MdDelete
                              className={role === "admin" ? "text-danger" : "text-muted"}
                              style={{ cursor: "pointer", opacity: role === "admin" ? 1 : 0.5 }}
                              onClick={() => {
                                if (role === "admin") handleDeleteClick(student._id);
                                else toast.error("To delete the information, please contact Super-Admin", { autoClose: 2000 });
                              }}
                            />

                            {/* Password */}
                            <FaKey
                              className="text-secondary"
                              style={{ cursor: "pointer", fontSize: "16px" }}
                              onClick={() => handlePasswordClick(student.password)}
                            />
                          </div>
                        </StyledTableCell>

                        {/* BatchNumber */}
                        <StyledTableCell>{student.batchNumber || "-"}</StyledTableCell>

                        {/* Status */}
                        <StyledTableCell>
                          <StatusBadge studentStatus={student.status} studentName={student.studentName} />
                        </StyledTableCell>

                        {/* Student ID */}
                        <StyledTableCell>{student._id}</StyledTableCell>

                        {/* Student Name */}
                        <StyledTableCell>
                          {(student.studentName || "")
                            .split(" ")
                            .filter(Boolean)
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ") || "-"}
                        </StyledTableCell>

                        {/* Username */}
                        <StyledTableCell>{student.username || "-"}</StyledTableCell>

                        {/* Email */}
                        <StyledTableCell>{student.email || "-"}</StyledTableCell>

                        {/* Phone No. */}
                        <StyledTableCell>{student.phoneNumber || "-"}</StyledTableCell>

                        {/* Gender */}
                        <StyledTableCell>{student.gender || "-"}</StyledTableCell>

                        {/* Birthdate */}
                        <StyledTableCell>{formatDate(student.birthdate)}</StyledTableCell>

                        {/* Preferred Course */}
                        <StyledTableCell>
                          {Array.isArray(student.preferredCourses) && student.preferredCourses.length
                            ? student.preferredCourses.join(", ")
                            : "Not selected yet"}
                        </StyledTableCell>

                        {/* Mapped Course */}
                        <StyledTableCell>{student.courseName || "-"}</StyledTableCell>

                        {/* course id */}
                        <StyledTableCell>{course._id || "-"}</StyledTableCell>

                        {/* session time */}
                        <StyledTableCell>{studentBatchMap[student.studentName]?.sessionTime || "-"}</StyledTableCell>

                        {/* session type */}
                        <StyledTableCell>{course.courseType || "-"}</StyledTableCell>

                        {/* session hrs */}
                        <StyledTableCell>{course.dailySessionHrs || "-"}</StyledTableCell>

                        {/* No. of days */}
                        <StyledTableCell>{course.noOfDays || "-"}</StyledTableCell>

                        {/* Admission Fee */}
                        <StyledTableCell>{student.admissionFee || "-"}</StyledTableCell>

                        {/* Admission date */}
                        <StyledTableCell>{formatDate(student.admissionDate)}</StyledTableCell>

                        {/* Created Date */}
                        <StyledTableCell>{formatDateTime(student.createdAt)}</StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={safeDisplayData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                boxShadow: 2,
                p: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Box>
        )}

        {/* Modals */}
        {showEdit && (
          <EditStudentData
            show={showEdit}
            setShow={setShowEdit}
            singleStudent={singleStudent}
            setSingleStudent={setSingleStudent}
            setStudentData={setStudentData}
          />
        )}

        {viewPassword && (
          <ModalShowPassword
            viewPassword={viewPassword}
            setViewPassword={setViewPassword}
            password={password}
            setPassword={setPassword}
          />
        )}

        {showAdd && <ModalAddStudent show={showAdd} setShow={setShowAdd} setStudentData={setStudentData} />}
      </div>
    </>
  );
};

export default CustomizedTables;
