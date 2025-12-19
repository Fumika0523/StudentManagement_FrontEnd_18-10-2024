import React, { useEffect, useState } from "react"
import CustomisedBatchTables from "./CustomisedBatchTables"
import { url } from "../../utils/constant"
import axios from "axios"

function viewBatch() {
    const [batchData, setBatchData] = useState([])
    const [courseData, setCourseData] = useState([])
    const [studentData, setStudentData] = useState([])
    const [admissionData,setAdmissionData] = useState([])

    const token = localStorage.getItem('token')
    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const getStudentData = async () => {
        let res = await axios.get(`${url}/allstudent`, config)
        // console.log("StudentData",res.data.studentData)
        setStudentData(res.data.studentData)
    }
    //original Main batch data
    const getBatchData = async () => {
        let res = await axios.get(`${url}/allbatch`, config)
        console.log("BatchData", res.data.batchData)
        setBatchData(res.data.batchData)
    }
      const getAdmissionData = async()=>{
        // console.log("Admission data is called....")
        let res = await axios.get(`${url}/alladmission`,config)
        // console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }
    useEffect(() => {
                getAdmissionData()

        getBatchData()
        getStudentData()
        getCourseData()

    }, [])

    //Original Main Course Data
    const getCourseData = async () => {
        //console.log("Course data is called...") // checking if useEffect is working or not
        let res = await axios.get(`${url}/allcourse`, config)
        console.log("CourseData", res.data.courseData)
        setCourseData(res.data.courseData)
    }

    console.log(courseData)

    return (
        <>

            {<CustomisedBatchTables
             setAdmissionData={setAdmissionData} admissionData={admissionData}  setBatchData={setBatchData} batchData={batchData} studentData={studentData} setStudentData={setStudentData}/>  
            }


        </>
    )
}
export default viewBatch