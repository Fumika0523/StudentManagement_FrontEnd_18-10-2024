import { useEffect } from "react"
import { useState } from "react"
import { url } from "../../utils/constant"
import axios from "axios"
import CustomizedTables from "./customisedTables"
import { Button } from "react-bootstrap"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"


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
        <Button>View Student Data</Button>
        {/* <p>
            {studentData.map((element)=>(
                <div>{element.username}</div>
                
            ))}
        </p> */}
        {<CustomizedTables studentData = {studentData}/>}
        </Box>
        </div>
        </>
    )
}
export default ViewStudent