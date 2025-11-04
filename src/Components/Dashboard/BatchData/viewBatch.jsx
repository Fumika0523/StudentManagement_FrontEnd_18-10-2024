import { useEffect, useState } from "react"
import SideBar from "../../../HomePage/SideBar/SideBar"
import NavBar from "../../../HomePage/NavBar/NavBar"
import CustomisedBatchTables from "./CustomisedBatchTables"
import { url } from "../../utils/constant"
import axios from "axios"
import ModalAddBatch from "./ModalAddBatch"
import { Button } from "react-bootstrap"

function viewBatch(){
    const [batchData,setBatchData] = useState([])
    const [courseData,setCourseData] = useState([])

    const token = localStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}
    //original Main batch data
    const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }
    useEffect(()=>{
        getBatchData()
    },[])

        //Original Main Course Data
    const getCourseData = async()=>{
        //console.log("Course data is called...") // checking if useEffect is working or not
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

            {<CustomisedBatchTables setBatchData={setBatchData} batchData = {batchData}
            setCourseData={setCourseData} courseData={courseData}
            />}
     

        </>
    )
}
export default viewBatch