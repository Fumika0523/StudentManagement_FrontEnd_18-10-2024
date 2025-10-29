import { useEffect } from "react"
import { useState } from "react"
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./CustomisedTables"
import SideBar from "../../../HomePage/SideBar/SideBar"
import NavBar from "../../../HomePage/NavBar/NavBar"
import ModalAddStudent from "../StudentData/ModalAddStudent"
import { Button } from "react-bootstrap"

function ViewStudent(){
    const [studentData,setStudentData] = useState([])
    const [courseData,setCourseData] = useState([])
    const [admissionData,setAdmissionData] = useState([])
    const [batchData,setBatchData] = useState([])
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [show, setShow] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState (true)

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

    return(
        <>
        <div className="">
        {/* Table */}
            {<CustomizedTables studentData = {studentData}
            setStudentData={setStudentData} courseData={courseData} setCourseData={setCourseData} setAdmissionData={setAdmissionData} admissionData={admissionData} batchData={batchData} setBatchData={setBatchData}
            />}
        </div>

            {show && <ModalAddStudent show={show} setShow={setShow}
            setStudentData={setStudentData}
            />}
           
 
        </>
    )
}
export default ViewStudent