import SideBar from "../../../HomePage/SideBar"
import { useEffect, useState } from "react"
import NavBar from "../../../HomePage/NavBar"
import CustomisedCourseTables from "./CustomisedCourseTables"
import { Box } from "@mui/material"
import ModalAddCourse from "./ModalAddCourse"
import { url } from "../../utils/constant"
import axios from "axios"


function ViewCourse(){
    const [courseData,setCourseData] = useState([])
    const [show,setShow] = useState(false)

    const token = sessionStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
    }}

    //Original Main Course Data
    const getCourseData = async()=>{
        console.log("Course data is called...") // checking if useEffect is working or not
        let res = await axios.get(`${url}/allcourse`,config)
        console.log("CourseData",res.data.courseData)
        setCourseData(res.data.courseData)
    }
    useEffect(()=>{
        getCourseData()
    },[])
    console.log(courseData)

return(
    <>
    <div className="d-flex">
    <SideBar/>
    <Box sx={{flexGrow:1,display:"flex",flexDirection:"column"}}>
    <NavBar/>

    <div className="btn py-auto px-auto mt-3" onClick={()=>setShow(true)}
    style={{backgroundColor:"#4e73df",color:"white",width:"10%",marginLeft:"88%"}}>Add Course</div>

    <div className="m-4" tyle={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
    <div className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>
        All Course</div>
    <CustomisedCourseTables setCourseData={setCourseData} courseData={courseData} />
    </div>
    </Box>
    {
        show && <ModalAddCourse show={show} setShow={setShow} setCourseData = {setCourseData} />
    }
    </div>

    </>
)
}
export default ViewCourse