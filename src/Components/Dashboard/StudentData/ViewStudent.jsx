import { useEffect } from "react"
import { useState } from "react"
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./customisedTables"
import { Button } from "react-bootstrap"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"
import NavBar from "../../../HomePage/NavBar"
import ModalAddStudent from "../StudentData/ModalAddStudent"

function ViewStudent(){
    const [studentData,setStudentData] = useState([])
    const [isAuthenticated,setIsAuthenticated]=useState(false)

    const getStudentData = async()=>{
        const token = sessionStorage.getItem('token')
        let config = {
            headers:{
                AUthorization:`Bearer ${token}`
            }
        }
        console.log("Student data is called........")
        let res = await axios.get(`${url}/allstudent`,config)
        console.log(res.data.studentData)
        setStudentData(res.data.studentData)
    }
    useEffect(()=>{
        const token = sessionStorage.getItem('token')
        console.log(token)
        setIsAuthenticated(true)
        getStudentData()
    },[])

    console.log(studentData)
    const [show, setShow] = useState(false);

    return(
        <>
         <div className="d-flex">
    <SideBar/>
        <Box sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar/>
        {/* create a table */}
        <div className="mx-4 mt-3 d-flex gap-4">
        <div className="fs-3">View Student Data</div>
        <div className="btn  py-auto px-3" onClick={()=>setShow(true)} style={{backgroundColor:"#4e73df",color:"white"}}>Add Student</div>
           </div>
       
      

        {/* <p>
            {studentData.map((element)=>(
                <div>{element.username}</div>
            ))}
        </p> */}
        <div className="m-4" style={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
            <div className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>DataTables Example
            </div>
            {<CustomizedTables studentData = {studentData}/>}
        </div>
        </Box>
        
                {show && <ModalAddStudent show={show} setShow={setShow}/>}
           
        </div>
        </>
    )
}
export default ViewStudent