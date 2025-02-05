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

function ViewStudent(){
    const [studentData,setStudentData] = useState([])
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
        },[])
    console.log(studentData)

    return(
        <>
<div className="d-flex">
    <SideBar/>
        <Box style={{width:"80%"}} sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar/>
        {/* create a table */}
        {/* <div className="fs-3">View Student Data</div> */}
        <div className="btn  py-auto px-auto mt-3"  onClick={()=>setShow(true)} style={{backgroundColor:"#4e73df",color:"white",width:"10%",marginLeft:"88%"}}>Add Student</div>
        
        {/* <p>
            {studentData.map((element)=>(
            <div>{element.username}</div>
            ))}
        </p> */}
        <div className="m-4" style={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
            <div className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>All Student
            </div>
            {<CustomizedTables studentData = {studentData}
            setStudentData={setStudentData} 
            />}
            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}

            {/* {< HoverCustomisedTable />} */}
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