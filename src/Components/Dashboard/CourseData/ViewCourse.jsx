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

        <CustomisedCourseTables setCourseData={setCourseData} courseData={courseData} />
 
    </>
)
}
export default ViewCourse