import React from 'react'
import { ChartCard } from './ChartCard'
import DonutCard from './DonutCard'
import { useEffect, useState } from "react"
import axios from "axios"
import {url} from '../../../utils/constant'


const ChartDisplay = ({earnings, setEarnings, year,setYear, month,setMonth,}) => {
    const [admissionData,setAdmmisionData] = useState([])
    const token = localStorage.getItem('token')
    console.log("earnings from CHartDisplay",earnings)
    console.log("month from ChartDisplay",month)
      let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

  const getAdmissionData = async() => {
    let res = await axios.get(`${url}/alladmission`,config)
      console.log("AdmissionData from ChartDisplay",res.data.admissionData)
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

  return (
    <>
<div className="row w-100  mx-auto justify-content-center">
  <div className="col-12 col-lg-7 border-4 mb-md-3">
    <ChartCard
    month={month}
    setMonth={setMonth}
    year={year}
    setYear={setYear}
      earnings={earnings}
      setEarnings={setEarnings}
      admissionData={admissionData}
      setAdmmisionData={setAdmmisionData}
    />
  </div>
  <div className="col-12 col-lg-5 border-2">
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