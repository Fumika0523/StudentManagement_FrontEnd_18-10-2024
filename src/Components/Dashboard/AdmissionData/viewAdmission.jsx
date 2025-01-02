import React, { useState } from 'react'
import SideBar from '../../../HomePage/SideBar'
import { Box } from '@mui/material'
import NavBar from '../../../HomePage/NavBar'
import CustomisedAdmissionTable from './CustomisedAdmissionTable'
import { useEffect } from 'react'
import axios from 'axios'
import { url } from '../../utils/constant'
import ModalAddAdmission from './ModalAddAdmission'


const viewAdmission = () => {
    const [admissionData,setAdmissionData] = useState([])
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
    <div className='d-flex'>
    <SideBar/>
    <Box sx={{flexGrow:1, display:"flex", flexDirection:"column"}}>
    <NavBar/>

    <div className='btn py-auto px-auto mt-3'
    onClick={()=>setShow(true)}
    style={{backgroundColor:"#4e73df",color:"white",width:"13%",marginLeft:"84%"}}>Add Admission</div>

    <div div className="m-4" style={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
        <div iv className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>All Admission</div>
        {<CustomisedAdmissionTable setAdmissionData={setAdmissionData} admissionData={admissionData} />  }
    </div>
    </Box>
    {show && <ModalAddAdmission show={show} setShow={setShow}
    setAdmissionData={setAdmissionData} />}
    </div>
   </>
  )
}

export default viewAdmission