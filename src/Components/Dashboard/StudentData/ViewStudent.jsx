import React, { useState, useEffect, useMemo } from "react";
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./CustomisedTables"
import Header from "./Header/Header"

function ViewStudent() {
  const [datePreset, setDatePreset] = useState(""); // "today" | "7d" | "30d" | "month" | "year" | ""
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [studentData, setStudentData] = useState([])
  const [courseData, setCourseData] = useState([])
  const [admissionData, setAdmissionData] = useState([])
  const [batchData, setBatchData] = useState([])
  const [show, setShow] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [showTable, setShowTable] = useState(false);
  //Filter status
  const [studentName, setStudentName] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [sessionType, setSessionType] = useState("");
  const [batchStatus, setBatchStatus] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInput, setCourseInput] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  console.log("courseData in viewStudent:", courseData);

  const getBatchData = async () => {
    let res = await axios.get(`${url}/allbatch`, config)
    // console.log("BatchData", res.data.batchData)
    setBatchData(res.data.batchData)
  }

  const getStudentData = async () => {
    let res = await axios.get(`${url}/allstudent`, config)
    // console.log("StudentData", res.data.studentData)
    setStudentData(res.data.studentData)
  }
  useEffect(() => {
    getStudentData()
    getCourseData()
    getAdmissionData()
    getBatchData()
  }, [])

  const getCourseData = async () => {
    let res = await axios.get(`${url}/allcourse`, config)
    console.log("CourseData", res.data.courseData)
    setCourseData(res.data.courseData)
  }

  const getAdmissionData = async () => {
    let res = await axios.get(`${url}/alladmission`, config)
    console.log("AdmissionData", res.data.admissionData)
    setAdmissionData(res.data.admissionData)
  }

  const norm = (v) => String(v ?? "").trim().toLowerCase();
  const getPresetRange = (presetKey) => {
    if (!presetKey) return { from: null, to: null };

    const now = new Date();
    const to = new Date(now);
    to.setHours(23, 59, 59, 999);

    if (presetKey === "today") {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    if (presetKey === "7d") {
      const from = new Date(now);
      from.setDate(now.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    if (presetKey === "30d") {
      const from = new Date(now);
      from.setDate(now.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    if (presetKey === "month") {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    if (presetKey === "year") {
      const from = new Date(now.getFullYear(), 0, 1);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }

    return { from: null, to: null };
  };

  const isWithinRange = (createdAt, from, to) => {
    if (!from && !to) return true;

    const d = new Date(createdAt);
    if (isNaN(d)) return false;

    const start = from ? new Date(from) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = to ? new Date(to) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  const uniqueCourses = useMemo(() => {
    return (courseData || [])
      .filter((c) => c?._id && c?.courseName)
      .map((c) => ({ label: c.courseName, id: c._id }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [courseData]);

  const computedRows = useMemo(() => {
    const coursesById = {};
    (courseData || []).forEach(c => { coursesById[c._id] = c; });

    const batchByNumber = {};
    (batchData || []).forEach(b => { if (b?.batchNumber) batchByNumber[b.batchNumber] = b; });

    // studentName -> assigned batchNumber (from admissions)
    const assignedBatchByStudent = {};
    (admissionData || [])
      .filter(a => a?.status === "Assigned")
      .forEach(a => {
        assignedBatchByStudent[a.studentName] = a.batchNumber;
      });

    return (studentData || []).map(s => {
      const course = coursesById[s.courseId] || {};
      const assignedBatchNumber = assignedBatchByStudent[s.studentName];
      const batch = assignedBatchNumber ? batchByNumber[assignedBatchNumber] : null;

      return {
        ...s,
        // values you want to filter by
        computedBatchStatus: batch?.status || "",        // In Progress / Not Started etc
        computedSessionType: course?.courseType || "",   // Online/Offline? (based on your data)
        computedCreatedAt: s.createdAt || "",
      };
    });
  }, [studentData, courseData, admissionData, batchData]);

  const handleApplyFilter = () => {
    let filtered = [...computedRows];

    // student name filter
    if (studentName?.trim()) {
      const q = norm(studentName);
      filtered = filtered.filter((s) => norm(s.studentName).includes(q));
    }

    // gender filter
    if (genderFilter) {
      filtered = filtered.filter((s) => norm(s.gender) === norm(genderFilter));
    }

    // course filter
    if (selectedCourse?.id) {
      filtered = filtered.filter((s) => s.courseId === selectedCourse.id);
    } else if ((courseInput || "").trim()) {
      filtered = filtered.filter((s) => norm(s.courseName) === norm(courseInput));
    }

    // batch status filter
    if (batchStatus) {
      filtered = filtered.filter(
        (s) => norm(s.computedBatchStatus) === norm(batchStatus)
      );
    }

    // session type filter
    if (sessionType) {
      filtered = filtered.filter(
        (s) => norm(s.computedSessionType) === norm(sessionType)
      );
    }

    //  created date filter (preset OR custom)
    const isCustom = datePreset === "custom";
    const presetRange = !isCustom ? getPresetRange(datePreset) : { from: null, to: null };

    const from = isCustom ? dateRange?.from : presetRange.from;
    const to = isCustom ? dateRange?.to : presetRange.to;

    if (from || to) {
      filtered = filtered.filter((s) =>
        isWithinRange(s.computedCreatedAt, from, to)
      );
    }

    setFilteredData(filtered);
    setShowTable(true);
  };

  const handleResetFilter = () => {
    setStudentName("");
    setGenderFilter("");
    setDatePreset("");
    setDateRange({ from: null, to: null });
    setSessionType("");
    setSelectedCourse(null);
    setCourseInput("");
    setBatchStatus("");
    setFilteredData([]);
    setShowTable(false);
  };

  const displayData = showTable ? filteredData : computedRows;

  return (
    <>
      <div className=" py-2 border-4 border-danger row mx-auto w-100">
        <Header
          config={config}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          dateRange={dateRange}
          setDateRange={setDateRange}
          courseData={courseData}
          setCourseData={setCourseData}
          setStudentData={setStudentData}
          urlBase={url}
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
          uniqueCourses={uniqueCourses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          courseInput={courseInput}
          setCourseInput={setCourseInput}
          batchStatus={batchStatus}
          setBatchStatus={setBatchStatus}
          studentName={studentName}
          setStudentName={setStudentName}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          sessionType={sessionType}
          setSessionType={setSessionType}
        />
        {/* Table */}
        {showTable && (
          <CustomizedTables studentData={displayData}
            setStudentData={setStudentData} courseData={courseData} setCourseData={setCourseData} setAdmissionData={setAdmissionData} admissionData={admissionData} batchData={batchData} setBatchData={setBatchData}
          />
        )}
      </div>
    </>
  )
}
export default ViewStudent