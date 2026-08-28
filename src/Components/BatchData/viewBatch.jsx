import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomisedBatchTables from "./CustomisedBatchTables";
import BatchHeader from "./Header/BatchHeader";
import { url } from "../utils/constant";
import axios from "axios";
import { includesText } from "../utils/filterUtils";
import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

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

  const config = useAuthConfig();

  // Fetch all data
  const getStudentData = useCallback(async () => {
    try {
      let res = await axios.get(`${url}/all-student`, config);
      setStudentData(res.data.studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [config]);

  const getBatchData = useCallback(async () => {
    try {
      let res = await axios.get(`${url}/allbatch`, config);
      setBatchData(res.data.batchData);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  }, [config]);

  const getAdmissionData = useCallback(async () => {
    try {
      let res = await axios.get(`${url}/alladmission`, config);
      setAdmissionData(res.data.admissionData);
    } catch (error) {
      console.error("Error fetching admissions:", error);
    }
  }, [config]);

  const getCourseData = useCallback(async () => {
    try {
      let res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [config]);

  useEffect(() => {
    getAdmissionData();
    getBatchData();
    getStudentData();
    getCourseData();
  }, [getAdmissionData, getBatchData, getCourseData, getStudentData]);

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

  const filterRows = useCallback(
    (rows) => {
      return rows.filter((batch) => {
        if (batchNumber?.trim() && !includesText(batch.batchNumber, batchNumber)) {
          return false;
        }

        if (courseName?.trim() && !includesText(batch.courseName, courseName)) {
          return false;
        }

        if (location?.trim() && !includesText(batch.location, location)) {
          return false;
        }

        if (createdBy?.trim() && !includesText(batch.createdBy, createdBy)) {
          return false;
        }

        if (status) {
          const course = courseData?.find((c) => c.courseName === batch.courseName);
          const computedStatus = computeStatus(batch, course);
          if (computedStatus !== status) return false;
        }

        if (sessionType && batch.sessionType !== sessionType) {
          return false;
        }

        if (sessionDay && batch.sessionDay !== sessionDay) {
          return false;
        }

        return true;
      });
    },
    [batchNumber, courseName, location, createdBy, status, sessionType, sessionDay, courseData]
  );

  const resetFilters = useCallback(() => {
    setBatchNumber("");
    setCourseName("");
    setLocation("");
    setCreatedBy("");
    setStatus("");
    setSessionType("");
    setSessionDay("");
  }, []);

  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable({
    rows: batchData,
    filterRows,
    resetFilters,
  });

  return (
    <Box className="py-2 row mx-auto w-100">
      {/* Header with Filters and Action Button */}
      <BatchHeader
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={applyFilters}
        onReset={resetTable}
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
          batchData={displayData}
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
            Please select filters and click Apply Filters to view batches
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ViewBatch;
