import SideBar from "../../../HomePage/SideBar"
import { useState } from "react"
import NavBar from "../../../HomePage/NavBar"
import CustomisedCourseTables from "./CustomisedCourseTables"
import { Box } from "@mui/material"
import ModalAddCourse from "./ModalAddCourse"

function ViewCourse(){
    const [courseData,setCourseData] = useState([])
    const [show,setShow] = useState([])

return(
    <>
    <div className="d-flex">
    <SideBar/>
    <Box sx={{flexGrow:1,display:"flex",flexDirection:"column"}}>
    <NavBar/>

    <div className="btn" onClick={()=>setshow(truw)}>Add Course</div>

    <div className="m-4" tyle={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
    <div>All Course</div>
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