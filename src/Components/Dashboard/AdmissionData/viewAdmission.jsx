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
    const [isSidebarOpen, setIsSidebarOpen] = useState (true)

    
    const token = localStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}

    const getStudentData = async()=>{
    let res = await axios.get(`${url}/allstudent`,config)
    console.log("StudentData",res.data.studentData)
   setStudentData(res.data.studentData)
    }

    // Main admission Data
    const getAdmissionData = async()=>{
        // console.log("Admission data is called....")
        let res = await axios.get(`${url}/alladmission`,config)
        console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }
    useEffect(()=>{
        getAdmissionData()
        getStudentData()
    },[])
    // console.log(admissionData)

  return (
    <>
    <div className='d-flex '>
    <SideBar/>
    <div className="backgroundDesign d-flex flex-column" 
    style={{minWidth:isSidebarOpen ?"75%":"88%"}}>
    <NavBar/>
    <div className=' d-flex justify-content-end pe-4 py-3'>
    <Button variant="outline-none" className='commonButton'
    onClick={()=>setShow(true)}
    >Add Admission</Button>
    </div>
     {/* Buttom Table */}
     <div className="d-flex justify-content-center">
    {/* Table */}
    <div style={{orderRadius:"7px", width:"95%"}}>
        {<CustomisedAdmissionTable setAdmissionData={setAdmissionData} admissionData={admissionData} />  }
    </div>
    </div>
    </div>
    {show && <ModalAddAdmission show={show} setShow={setShow}
    setAdmissionData={setAdmissionData}
    admissionData={admissionData}
    studentData={studentData}
    setStudentData={setStudentData}
     />}
    </div>
   </>
  )
}

export default viewAdmission