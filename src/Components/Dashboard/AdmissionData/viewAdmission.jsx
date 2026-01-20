import React, { useState } from 'react'
import SideBar from '../../../HomePage/SideBar/SideBar'
import NavBar from '../../../HomePage/NavBar/NavBar'
import CustomisedAdmissionTable from './CustomisedAdmissionTable'
import { useEffect } from 'react'
import axios from 'axios'
import { url } from '../../utils/constant'
import ModalAddAdmission from './ModalAddAdmission'
import { Button } from 'react-bootstrap'


const viewAdmission = () => {
    const [admissionData,setAdmissionData] = useState([])
    const [studentData,setStudentData] = useState([])
    const [show,setShow] = useState(false)
    const [batchData,setBatchData] = useState([])
    const [courseData,setCourseData] = useState([])

    
    const token = localStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}

        const getCourseData = async()=>{
        //console.log("Course data is called...") // checking if useEffect is working or not
        let res = await axios.get(`${url}/allcourse`,config)
        //console.log("CourseData",res.data.courseData)
        setCourseData(res.data.courseData)
    }

    const getStudentData = async()=>{
    let res = await axios.get(`${url}/allstudent`,config)
    // console.log("StudentData",res.data.studentData)
   setStudentData(res.data.studentData)
    }
     const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
       // console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }

    // Main admission Data
    const getAdmissionData = async()=>{
        // console.log("Admission data is called....")
        let res = await axios.get(`${url}/alladmission`,config)
        // console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }
    useEffect(()=>{
        getAdmissionData()
        getStudentData()
        getCourseData()
        getBatchData()
    },[])
    // console.log(admissionData)

  return (
    <>
        {<CustomisedAdmissionTable setAdmissionData={setAdmissionData} admissionData={admissionData} batchData = {batchData} courseData={courseData} setCourseData={setCourseData} studentData={studentData} setStudentData={setStudentData}/>  }
   </>
  )
}

export default viewAdmission