import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import CustomisedBatchTables from "./CustomisedBatchTables";
import BatchHeader from "./Header/BatchHeader";
import { url } from "../../utils/constant";
import axios from "axios";

function ViewBatch() {
  // Data states
  const [batchData, setBatchData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);

  // Filter states
  const [batchNumber, setBatchNumber] = useState("");
  const [courseName, setCourseName] = useState("");
  const [location, setLocation] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [status, setStatus] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDay, setSessionDay] = useState("");

  // UI states
  const [openFilters, setOpenFilters] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all data
  const getStudentData = async () => {
    try {
      let res = await axios.get(`${url}/allstudent`, config);
      setStudentData(res.data.studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const getBatchData = async () => {
    try {
      let res = await axios.get(`${url}/allbatch`, config);
      console.log("BatchData", res.data.batchData);
      setBatchData(res.data.batchData);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const getAdmissionData = async () => {
    try {
      let res = await axios.get(`${url}/alladmission`, config);
      setAdmissionData(res.data.admissionData);
    } catch (error) {
      console.error("Error fetching admissions:", error);
    }
  };

  const getCourseData = async () => {
    try {
      let res = await axios.get(`${url}/allcourse`, config);
      console.log("CourseData", res.data.courseData);
      setCourseData(res.data.courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    getAdmissionData();
    getBatchData();
    getStudentData();
    getCourseData();
  }, []);

  // Helper function to normalize strings
  const norm = (v) => String(v ?? "").trim().toLowerCase();

  // Compute status helper (same as in table)
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

  // Apply filters function (memoized)
  const applyCurrentFilters = useCallback(
    (data) => {
      let filtered = [...data];

      // Batch Number
      if (batchNumber?.trim()) {
        const q = norm(batchNumber);
        filtered = filtered.filter((b) => norm(b.batchNumber).includes(q));
      }

      // Course Name
      if (courseName?.trim()) {
        const q = norm(courseName);
        filtered = filtered.filter((b) => norm(b.courseName).includes(q));
      }

      // Location
      if (location?.trim()) {
        const q = norm(location);
        filtered = filtered.filter((b) => norm(b.location).includes(q));
      }

      // Created By
      if (createdBy?.trim()) {
        const q = norm(createdBy);
        filtered = filtered.filter((b) => norm(b.createdBy || "").includes(q));
      }

      // Status (using computed status from table)
      if (status) {
        filtered = filtered.filter((batch) => {
          const course = courseData?.find((c) => c.courseName === batch.courseName);
          const computedStatus = computeStatus(batch, course);
          return computedStatus === status;
        });
      }

      // Session Type
      if (sessionType) {
        filtered = filtered.filter((b) => b.sessionType === sessionType);
      }

      // Session Day
      if (sessionDay) {
        filtered = filtered.filter((b) => b.sessionDay === sessionDay);
      }

      return filtered;
    },
    [batchNumber, courseName, location, createdBy, status, sessionType, sessionDay, courseData]
  );

  // Apply filters
  const handleApplyFilter = () => {
    const filtered = applyCurrentFilters(batchData);
    setFilteredData(filtered);
    setShowTable(true);
  };

  // Auto-refresh when batchData changes (only if table is visible)
  useEffect(() => {
    if (showTable && batchData.length > 0) {
      console.log("Auto-refresh triggered! batchData length:", batchData.length);
      const filtered = applyCurrentFilters(batchData);
      setFilteredData(filtered);
    }
  }, [batchData, showTable, applyCurrentFilters]);

  // Reset filters
  const handleResetFilter = () => {
    setBatchNumber("");
    setCourseName("");
    setLocation("");
    setCreatedBy("");
    setStatus("");
    setSessionType("");
    setSessionDay("");
    setFilteredData([]);
    setShowTable(false);
  };

  return (
    <Box className="py-2 row mx-auto w-100">
      {/* Header with Filters and Action Button */}
      <BatchHeader
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        batchNumber={batchNumber}
        setBatchNumber={setBatchNumber}
        courseName={courseName}
        setCourseName={setCourseName}
        location={location}
        setLocation={setLocation}
        createdBy={createdBy}
        setCreatedBy={setCreatedBy}
        status={status}
        setStatus={setStatus}
        sessionType={sessionType}
        setSessionType={setSessionType}
        sessionDay={sessionDay}
        setSessionDay={setSessionDay}
        batchData={batchData}
        courseData={courseData}
        setBatchData={setBatchData}
      />

      {/* Table - Only show when showTable is true */}
      {showTable ? (
        <CustomisedBatchTables
          setAdmissionData={setAdmissionData}
          admissionData={admissionData}
          setBatchData={setBatchData}
          batchData={filteredData}
          studentData={studentData}
          setStudentData={setStudentData}
          courseData={courseData}
          setCourseData={setCourseData}
        />
      ) : (
        <Box 
          sx={{ 
            mt: 3, 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #cbd5e1'
          }}
        >
          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
            No filters applied
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Please select filters and click "Apply Filters" to view batches
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ViewBatch;