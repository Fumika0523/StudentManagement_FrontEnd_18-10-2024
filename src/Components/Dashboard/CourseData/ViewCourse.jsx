import { useEffect, useState } from "react"
import CustomisedCourseTables from "./CustomisedCourseTables"
import ModalAddCourse from "./ModalAddCourse"
import { url } from "../../utils/constant"
import axios from "axios"
import { Button } from "react-bootstrap"


function ViewCourse(){
    const [courseData,setCourseData] = useState([])
    const [show,setShow] = useState(false)
    
    const token = localStorage.getItem('token')
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

 <div className="d-flex justify-content-end  pe-4 " >
    {/* ADD Button */}
    <Button variant="outline-none" className=" commonButton" 
    onClick={()=>setShow(true)}> Add Course</Button>
    </div>

   {/* Buttom Table */}
    <div className="d-flex  border-black border-4  px-3 justify-content-center">       
    {/* Table */}    
    <div className="" style={{borderRadius:"7px", minWidth:"95%"}}>
        <CustomisedCourseTables setCourseData={setCourseData} courseData={courseData} />
    </div>
    </div>

    {
        show && <ModalAddCourse show={show} setShow={setShow} setCourseData = {setCourseData} />
    }

    </>
)
}
export default ViewCourse