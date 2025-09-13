import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalDeleteAdmission from "./ModalDeleteAdmission";
import ModalEditAdmission from "./ModalEditAdmission";

// MUI filter controls
import { FormControl, Select, MenuItem } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "14.5px",
    padding: "10px 15px",
    textWrap: "noWrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    textAlign: "center",
    padding: "10px 15px",
    textWrap: "noWrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#b3e5fc",
  },
}));

const CustomisedAdmissionTable = ({ admissionData, setAdmissionData }) => {
  const [show, setShow] = useState(false);
  const [singleAdmission, setSingleAdmission] = useState(null);
  const [viewWarning, setViewWarning] = useState(false);

  // filters
  const [courseFilter, setCourseFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const handleEditClick = (admission) => {
    setShow(true);
    setSingleAdmission(admission);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: true,
      })
      .replace("at", "");
  };


  const Courses = [...new Set(admissionData.map((a) => a.courseName))];
  const Batches = [...new Set(admissionData.map((a) => a.batchNumber))];

  // date filtering 
  const filterByDate = (createdAt) => {
    if (!dateFilter) return true;

    const today = new Date();
    const createdDate = new Date(createdAt);
    const diffInDays = (today - createdDate) / (1000 * 60 * 60 * 24);

    if (dateFilter === "today") {
      return createdDate.toDateString() === today.toDateString();
    }
    if (dateFilter === "last7") {
      return diffInDays <= 7;
    }
    if (dateFilter === "last30") {
      return diffInDays <= 30;
    }
    if (dateFilter === "older") {
      return diffInDays > 30;
    }

    return true;
  };

  // filtering logic
  const getFilteredData = () => {
    return admissionData.filter((admission) => {
      const courseMatch =
        !courseFilter || admission.courseName === courseFilter;
      const batchMatch = !batchFilter || admission.batchNumber === batchFilter;
      const dateMatch = filterByDate(admission.createdAt);

      return courseMatch && batchMatch && dateMatch;
    });
  };

  const filteredData = getFilteredData();

  return (
    <>
      {/* Filter Controls */}
      <div
      className=" border-4 mb-3 "
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "flex-start",
        }}
      >
        {/* Course Name Filter */}
<FormControl size="small" sx={{ minWidth: 150 }}>
  <Select
    displayEmpty
    value={courseFilter}
    onChange={(e) => setCourseFilter(e.target.value)}
    sx={{ fontSize: "15px" }}
  >
    <MenuItem value="" sx={{ fontSize: "15px" }}>
      Course Name
    </MenuItem>
    {Courses.map((course, idx) => (
      <MenuItem key={idx} value={course} sx={{ fontSize: "15px" }}>
        {course}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{/* Batch Number  */}
<FormControl size="small" sx={{ minWidth: 150 }}>
  <Select
    displayEmpty
    value={batchFilter}
    onChange={(e) => setBatchFilter(e.target.value)}
    sx={{ fontSize: "15px" }}
  >
    <MenuItem value="" sx={{ fontSize: "15px" }}>
      Batch Number
    </MenuItem>
    {Batches.map((batch, idx) => (
      <MenuItem key={idx} value={batch} sx={{ fontSize: "15px" }}>
        {batch}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{/* Created Date Filter */}
<FormControl size="small" sx={{ minWidth: 150 }}>
  <Select
    displayEmpty
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    sx={{ fontSize: "15px" }}
  >
    <MenuItem value="" sx={{ fontSize: "15px" }}>
      Created Date
    </MenuItem>
    <MenuItem value="today" sx={{ fontSize: "15px" }}>Today</MenuItem>
    <MenuItem value="last7" sx={{ fontSize: "15px" }}>Last 7 Days</MenuItem>
    <MenuItem value="last30" sx={{ fontSize: "15px" }}>Last 30 Days</MenuItem>
    <MenuItem value="older" sx={{ fontSize: "15px" }}>Older</MenuItem>
  </Select>
</FormControl>

      </div>

      {/* Table */}
      <TableContainer component={Paper}  > 
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Batch No.</StyledTableCell>
              <StyledTableCell>Course ID</StyledTableCell>
              <StyledTableCell>Course Name</StyledTableCell>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Source</StyledTableCell>
              <StyledTableCell>Fee</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Month</StyledTableCell>
              <StyledTableCell>Year</StyledTableCell>
              <StyledTableCell>CreatedAt</StyledTableCell>
              <StyledTableCell>UpdatedAt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((admission) => (
              <StyledTableRow key={admission._id}>
                <StyledTableCell>
                  <div
                    style={{
                      display: "flex",
                      fontSize: "18px",
                      justifyContent: "space-evenly",
                      textAlign: "center",
                    }}
                  >
                    <FaEdit
                      className="text-success"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(admission)}
                    />

                    <MdDelete
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setViewWarning(true);
                        setSingleAdmission(admission);
                      }}
                    />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{admission.batchNumber}</StyledTableCell>
                <StyledTableCell>{admission.courseId}</StyledTableCell>
                <StyledTableCell>{admission.courseName}</StyledTableCell>
                <StyledTableCell>{admission.studentId}</StyledTableCell>
                <StyledTableCell>{admission.studentName}</StyledTableCell>
                <StyledTableCell>{admission.admissionSource}</StyledTableCell>
                <StyledTableCell>{admission.admissionFee}</StyledTableCell>
                <StyledTableCell>
                  {formatDate(admission.admissionDate)}
                </StyledTableCell>
                <StyledTableCell>{admission.admissionMonth}</StyledTableCell>
                <StyledTableCell>{admission.admissionYear}</StyledTableCell>
                <StyledTableCell>
                  {formatDateTime(admission.createdAt)}
                </StyledTableCell>
                <StyledTableCell>
                  {formatDateTime(admission.updatedAt)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit */}
      {show && (
        <ModalEditAdmission
          show={show}
          setShow={setShow}
          singleAdmission={singleAdmission}
          setSingleAdmission={setSingleAdmission}
          setAdmissionData={setAdmissionData}
        />
      )}

      {/* Delete */}
      {viewWarning && (
        <ModalDeleteAdmission
          admissionData={admissionData}
          viewWarning={viewWarning}
          singleAdmission={singleAdmission}
          setAdmissionData={setAdmissionData}
          setViewWarning={setViewWarning}
        />
      )}
    </>
  );
};

export default CustomisedAdmissionTable;
