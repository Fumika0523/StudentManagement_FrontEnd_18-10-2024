import React from 'react'
import { ChartCard } from './ChartCard'
import DonutCard from './DonutCard'
import { useEffect, useState } from "react"
import axios from "axios"
import {url} from '../../utils/constant'


const ChartDisplay = () => {
    const [admissionData,setAdmmisionData] = useState([])
    const token = localStorage.getItem('token')
    //I can pass it to the next component (EarningCard), where is the usage.
    const [earnings,setEarnings] = useState([])
      let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

  const getAdmissionData = async() => {
    let res = await axios.get(`${url}/alladmission`,config)
        // console.log("AdmissionData from ChartDisplay",res.data.admissionData)
    setAdmmisionData(res.data.admissionData)
  }


    const getEarningData = async () => {
  try {
    let res = await axios.get(`${url}/earnings`, config)
    // console.log("getEarningData ", res.data)
    setEarnings(res.data)
  } catch (error) {
    if (error.response) {
      // Backend responded with an error
      console.error("Response error:", error.response.status, error.response.data)
    } else if (error.request) {
      // No response received
      console.error("No response:", error.request)
    } else {
      // Axios setup error
      console.error("Error setting up request:", error.message)
    }
  }
}
      useEffect(()=>{
         getAdmissionData()
        getEarningData()
      },[])   

      // console.log("earnings",earnings)


  return (
    <>
<div className="row w-100 border mx-auto justify-content-center">
  <div className="col-11 col-lg-7 border-4">
    <ChartCard
      earnings={earnings}
      setEarnings={setEarnings}
      admissionData={admissionData}
      setAdmmisionData={setAdmmisionData}
    />
  </div>
  <div className="col-11 col-lg-5 border-2">
    <DonutCard
      earnings={earnings}
      setEarnings={setEarnings}
      admissionData={admissionData}
      setAdmmisionData={setAdmmisionData}
    />
  </div>
</div>

    </>
  )
}

export default ChartDisplay