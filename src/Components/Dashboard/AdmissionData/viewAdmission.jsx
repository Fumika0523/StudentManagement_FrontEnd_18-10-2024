import React, { useState } from 'react'
import SideBar from '../../../HomePage/SideBar'
import NavBar from '../../../HomePage/NavBar'
import CustomisedAdmissionTable from './CustomisedAdmissionTable'
import { useEffect } from 'react'
import axios from 'axios'
import { url } from '../../utils/constant'
import ModalAddAdmission from './ModalAddAdmission'
import { Button } from 'react-bootstrap'


const viewAdmission = () => {
    const [admissionData,setAdmissionData] = useState([])
    const [courseData,setCourseData]=useState([])
    const [show,setShow] = useState(false)
    
    const token = sessionStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}

    // Main admission Data
    const getAdmissionData = async()=>{
        console.log("Admission data is called....")
        let res = await axios.get(`${url}/alladmission`,config)
        console.log("AdmissionData",res.data.admissionData)
        setAdmissionData(res.data.admissionData)
    }
    useEffect(()=>{
        getAdmissionData()
    },[])
    console.log(admissionData)

  return (
    <>
    <div className='d-flex  border border-danger border-4'>
    <SideBar/>
    <div className="backgroundDesign d-flex flex-column" >
    <NavBar/>
    <div className='d-flex justify-content-end border-warning border-3 pe-4 py-3'>
    <Button className='my-2 commonButton'
    onClick={()=>setShow(true)}
    style={{backgroundColor:"#4e73df",color:"white"}}>Add Admission</Button>
    </div>
    {/* Second Row */}
    <div className='d-flex  border-black border-4  px-3 justify-content-center'>
    <div className="px-2" style={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
        <div iv className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>All Admission</div>
        {<CustomisedAdmissionTable setAdmissionData={setAdmissionData} admissionData={admissionData} />  }
    </div>
    </div>
    </div>
    {show && <ModalAddAdmission show={show} setShow={setShow}
    setAdmissionData={setAdmissionData}
     />}
    </div>
   </>
  )
}

export default viewAdmission