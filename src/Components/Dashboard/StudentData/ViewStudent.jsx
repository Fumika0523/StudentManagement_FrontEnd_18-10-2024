import React, { useState, useEffect, useMemo } from "react";
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./CustomisedTables"
import Header from "./Header/Header"

function ViewStudent(){
    const [studentData,setStudentData] = useState([])
    const [courseData,setCourseData] = useState([])
    const [admissionData,setAdmissionData] = useState([])
    const [batchData,setBatchData] = useState([])
    const [show, setShow] = useState(false);
    const [genderFilter, setGenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInput, setCourseInput] = useState("");
  const [batchStatus, setBatchStatus] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [filteredData, setFilteredData] = useState([]);


    const token = localStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}
    
        const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }

    const getStudentData = async()=>{
        let res = await axios.get(`${url}/allstudent`,config)
        console.log("StudentData",res.data.studentData)
        setStudentData(res.data.studentData)
        }
        useEffect(()=>{
         getStudentData()
         getCourseData()
         getAdmissionData()
         getBatchData()
        },[])

    const getCourseData = async()=>{
        //console.log("CourseData is called...")
        let res = await axios.get(`${url}/allcourse`,config)
        console.log("CourseData",res.data.courseData)
        setCourseData(res.data.courseData)
    }

       const getAdmissionData = async()=>{
        let res = await axios.get(`${url}/alladmission`,config)
        console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }

     const uniqueCourses = useMemo(() => {
    if (!Array.isArray(batchData)) return [];
    return [...new Set(batchData.map((b) => b?.courseName).filter(Boolean))];
  }, [batchData]);

  const handleApplyFilter = () => {
    let filtered = [...(studentData || [])];

    if (genderFilter) filtered = filtered.filter((s) => s.gender === genderFilter);
    if (selectedCourse) filtered = filtered.filter((s) => s.courseName === selectedCourse);

    // batchStatus + dateFilter logic can stay here too
    setFilteredData(filtered);
    setShowTable(true);
  };

  const handleResetFilter = () => {
    setGenderFilter("");
    setDateFilter("");
    setSelectedCourse(null);
    setCourseInput("");
    setBatchStatus("");
    setFilteredData([]);
    setShowTable(false);
  };

   const displayData = showTable ? filteredData : studentData;

    return(
        <>
        <div className=" py-2 border-4 border-danger row mx-auto w-100">
         <Header
        config={config}
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
      />
        {/* Table */}
        {showTable && (
            <CustomizedTables studentData = {displayData }
            setStudentData={setStudentData} courseData={courseData} setCourseData={setCourseData} setAdmissionData={setAdmissionData} admissionData={admissionData} batchData={batchData} setBatchData={setBatchData}
            />
        )}
        </div>

            {show && <ModalAddStudent show={show} setShow={setShow}
            setStudentData={setStudentData}
            />}
           
 
        </>
    )
}
export default ViewStudent