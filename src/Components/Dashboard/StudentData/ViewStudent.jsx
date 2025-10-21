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

    <div className="  backgroundDesign d-flex flex-column  " >
        {/* ADD Button */}
        <div className=" d-flex justify-content-end  pe-4 py-3">
        <Button variant="outline-none" className="commonButton"
        onClick={()=>setShow(true)} 
        >Add Student</Button>
        </div>

        {/* Buttom Table */}
        <div className="d-flex  border-black border-4   justify-content-center">
        {/* Table */}
        <div  style={{borderRadius:"7px",width:"97%"}}>           
            {<CustomizedTables studentData = {studentData}
            setStudentData={setStudentData} courseData={courseData} setCourseData={setCourseData} setAdmissionData={setAdmissionData} admissionData={admissionData} batchData={batchData} setBatchData={setBatchData}
          
            />}

            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}      
        </div>
        </div>
        {/* </div> */}
        </div>
            {show && <ModalAddStudent show={show} setShow={setShow}
            setStudentData={setStudentData}
            />}
           
 
        </>
    )
}
export default ViewStudent