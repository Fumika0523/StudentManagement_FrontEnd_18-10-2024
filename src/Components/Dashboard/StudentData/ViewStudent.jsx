import { useEffect } from "react"
import { useState } from "react"
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./CustomisedTables"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"
import NavBar from "../../../HomePage/NavBar"
import ModalAddStudent from "../StudentData/ModalAddStudent"
import HoverCustomisedTable from "./HoverCustomisesdTable"
import { Button } from "react-bootstrap"

function ViewStudent(){
    const [studentData,setStudentData] = useState([])
    const [courseData,setCourseData] = useState([])
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [show, setShow] = useState(false);

    const token = sessionStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}

    const getStudentData = async()=>{
        console.log("Student data is called........")
        let res = await axios.get(`${url}/allstudent`,config)
        console.log("StudentData",res.data.studentData)
        console.log("StudentData",res)
        setStudentData(res.data.studentData)
        }
        useEffect(()=>{
         getStudentData()
         getCourseData()
         getAdmissionData()
        },[])
    console.log(studentData)

    const getCourseData = async()=>{
        console.log("CourseData is called...")
        let res = await axios.get(`${url}/allcourse`,config)
        console.log("CourseData",res.data.courseData)
        setCourseData(res.data.courseData)
    }

    const getAdmissionData=async()=>{
        console.log("Admission Data is called....")
        let res = await axios.get(`${url}/addadmission`,config)
        console.log("AdmissionData",res.data.getAdmissionData)

    }

    return(
        <>
<div className="d-flex">
    <SideBar/>
        <Box className="border-danger border-4"
        // style={{width:"80%"}}
         sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar/>
        {/* create a table */}
        {/* <div className="fs-3">View Student Data</div> */}
        <div className="d-flex border-primary border-4 flex-column ">
        {/* ADD Button */}
        <div className=" d-flex justify-content-end border-warning border-3 pe-4 py-3">
        <Button className="fs-5 commonButton"
        onClick={()=>setShow(true)} 
        >Add Student</Button>
        </div>

        {/* Buttom Table */}
        <div className="d-flex  border-black border-4 justify-content-center">
        {/* Table */}
        <div  style={{border:"2px solid #e3e6f0",borderRadius:"7px", maxWidth:"95%"}}>
            {/* <div 
           className="tableTitle"
            //  style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}
            >All Student</div> */}
           
            {<CustomizedTables studentData = {studentData}
            setStudentData={setStudentData} courseData={courseData} setCourseData={setCourseData}
            />}
             {/* </div> */}
            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}

            {/* {< HoverCustomisedTable />} */}
      
        </div>
        </div>
        </div>
        </Box>
            {show && <ModalAddStudent show={show} setShow={setShow}
            setStudentData={setStudentData}
            />}
           
        </div>
        </>
    )
}
export default ViewStudent