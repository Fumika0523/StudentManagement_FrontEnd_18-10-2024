import { useCallback, useEffect, useMemo, useState } from 'react'
import CustomisedAdmissionTable from './CustomisedAdmissionTable'
import axios from 'axios'
import { url } from '../utils/constant'
import Header from './Header/Header'
import {
  buildCourseOptions,
  equalsText,
  includesText,
  isWithinSelectedDateFilter,
  matchesSelectedCourse,
} from '../utils/filterUtils'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useFilteredTable } from '../utils/useFilteredTable'

const ViewAdmission = () => {
  const [datePreset, setDatePreset] = useState("");
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [studentData, setStudentData] = useState([])
    const [courseData, setCourseData] = useState([])
    const [admissionData, setAdmissionData] = useState([])
    const [batchData, setBatchData] = useState([])
    const [openFilters, setOpenFilters] = useState(true);

    // Filter states
    const [studentName, setStudentName] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [sessionType, setSessionType] = useState("");
    const [batchStatus, setBatchStatus] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseInput, setCourseInput] = useState("")
  
  const config = useAuthConfig()

  const getBatchData = useCallback(async () => {
    let res = await axios.get(`${url}/allbatch`, config)
    setBatchData(res.data.batchData)
  }, [config])

  const getStudentData = useCallback(async () => {
    let res = await axios.get(`${url}/all-student`, config)
    setStudentData(res.data.studentData)
  }, [config])

  const getCourseData = useCallback(async () => {
    let res = await axios.get(`${url}/allcourse`, config)
    setCourseData(res.data.courseData)
  }, [config])

  const getAdmissionData = useCallback(async () => {
    let res = await axios.get(`${url}/alladmission`, config)
    setAdmissionData(res.data.admissionData)
  }, [config])
  
  useEffect(() => {
    getStudentData()
    getCourseData()
    getAdmissionData()
    getBatchData()
  }, [getAdmissionData, getBatchData, getCourseData, getStudentData])

  const uniqueCourses = useMemo(() => {
    return buildCourseOptions(courseData);
  }, [courseData]);

  const computedRows = useMemo(() => {
    const coursesById = {};
    (courseData || []).forEach(c => { coursesById[c._id] = c; });

    const batchByNumber = {};
    (batchData || []).forEach(b => { if (b?.batchNumber) batchByNumber[b.batchNumber] = b; });

    const assignedBatchByStudent = {};
    (admissionData || [])
      .filter(a => a?.status === "Assigned")
      .forEach(a => {
        assignedBatchByStudent[a.studentName] = a.batchNumber;
      });

    return studentData.map(s => {
      const course = coursesById[s.courseId] || {};
      const assignedBatchNumber = assignedBatchByStudent[s.studentName];
      const batch = assignedBatchNumber ? batchByNumber[assignedBatchNumber] : null;

      return {
        ...s,
        computedBatchStatus: batch?.status || "",
        computedSessionType: course?.courseType || "",
        computedCreatedAt: s.createdAt || "",
      };
    });
  }, [studentData, courseData, admissionData, batchData]);

  const filterRows = useCallback((rows) => {
    return rows.filter((student) => {
      if (studentName?.trim() && !includesText(student.studentName, studentName)) {
        return false;
      }

      if (genderFilter && !equalsText(student.gender, genderFilter)) {
        return false;
      }

      if (!matchesSelectedCourse({ row: student, selectedCourse, courseInput })) {
        return false;
      }

      if (batchStatus && !equalsText(student.computedBatchStatus, batchStatus)) {
        return false;
      }

      if (sessionType && !equalsText(student.computedSessionType, sessionType)) {
        return false;
      }

      return isWithinSelectedDateFilter(
        student.computedCreatedAt,
        datePreset,
        dateRange
      );
    });
  }, [
    batchStatus,
    courseInput,
    datePreset,
    dateRange,
    genderFilter,
    selectedCourse,
    sessionType,
    studentName,
  ]);

  const resetFilters = useCallback(() => {
    setStudentName("");
    setGenderFilter("");
    setDatePreset("");
    setDateRange({ from: null, to: null });
    setSessionType("");
    setSelectedCourse(null);
    setCourseInput("");
    setBatchStatus("");
  }, []);

  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable({
    rows: computedRows,
    filterRows,
    resetFilters,
  });

  return (
     <>
      <div className="py-2 border-4 border-danger row mx-auto w-100">
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
            onApply={applyFilters}
            onReset={resetTable}
            uniqueCourses={uniqueCourses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            courseInput={courseInput}
            setCourseInput={setCourseInput}
            batchStatus={batchStatus}
            setBatchStatus={setBatchStatus}
            studentName={studentName}
            setStudentName={setStudentName}
            // emailSearch={emailSearch}
            // setEmailSearch={setEmailSearch}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            sessionType={sessionType}
            setSessionType={setSessionType}
            studentData={studentData}
            setAdmissionData={setAdmissionData}
            admissionData={admissionData}
            batchData={batchData}
            setBatchData={setBatchData}
          />
                  
        {/* Table - Always show if filters applied */}
        {showTable && (
          <CustomisedAdmissionTable 
            studentData={displayData}
            setStudentData={setStudentData} 
            courseData={courseData} 
            setCourseData={setCourseData} 
            setAdmissionData={setAdmissionData} 
            admissionData={admissionData} 
            batchData={batchData} 
            setBatchData={setBatchData}
          />
        )}
      </div>
    </>
  )
}

export default ViewAdmission
