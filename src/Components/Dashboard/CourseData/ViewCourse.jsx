import SideBar from "../../../HomePage/SideBar"
import { useEffect, useState } from "react"
import NavBar from "../../../HomePage/NavBar"
import CustomisedCourseTables from "./CustomisedCourseTables"
import ModalAddCourse from "./ModalAddCourse"
import { url } from "../../utils/constant"
import axios from "axios"
import { Button } from "react-bootstrap"


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
    <div className="backgroundDesign d-flex flex-column" >
    <NavBar/>
    {/* Button */}
    <div className=" d-flex justify-content-end border-warning border-3 pe-4 py-3">
    <Button className="fs-5 commonButton" 
    onClick={()=>setShow(true)}> Add Course</Button>
    </div>
   {/* Buttom Table */}
   <div className="d-flex  border-black border-4 justify-content-center">
        {/* Table */}
        <div  style={{border:"2px solid #e3e6f0",borderRadius:"7px", minWidth:"95%"}}>
    <div className="tableTitle" >All Course</div>
    <CustomisedCourseTables setCourseData={setCourseData} courseData={courseData} />
    </div>
    </div>
    </div>
    {
        show && <ModalAddCourse show={show} setShow={setShow} setCourseData = {setCourseData} />
    }
    </div>

    </>
)
}
export default ViewCourse