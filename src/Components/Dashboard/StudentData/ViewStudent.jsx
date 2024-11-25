import { useEffect } from "react"
import { useState } from "react"
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./customisedTables"
import { Button } from "react-bootstrap"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"
import NavBar from "../../../HomePage/NavBar"


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

    return(
        <>
         <div className="d-flex">
    <SideBar/>
        <Box sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar/>
        {/* create a table */}
        <Button >View Student Data</Button>
        <div className="mx-4 mt-3">
        <div className="fs-3">Tables</div>
        <div>DataTables is a third party plugin that is used to generate the demo table below. For more information about DataTables, please visit the official DataTables documentation.</div>
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
        </div>
        </>
    )
}
export default ViewStudent