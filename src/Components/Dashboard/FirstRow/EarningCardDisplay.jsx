import EarningCard from "./EarningCard"
import {url} from '../../utils/constant'
import { useEffect, useState } from "react"
import axios from "axios"
import React from 'react';


function EarningCardDisplay(){
    const token = localStorage.getItem('token')
    //I can pass it to the next component (EarningCard), where is the usage.
    const [earnings,setEarnings] = useState([])
      let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

    const getEarningData = async () => {
  try {
    let res = await axios.get(`${url}/earnings`, config)
    console.log("getEarningData", res.data)
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
        getEarningData()
      },[])     


    return(
        <>
  <div className="d-flex border-4 justify-content-center align-items-center mx-auto row px-2 w-100">
  <div className="fs-4">MTD</div>
  {earnings?.map((element, index) => (
    <React.Fragment key={index}>
      <EarningCard {...element}title={element.title.toUpperCase()} />
      {index === 3 && (
        <div className="fs-4">YTD</div>
      )}
    </React.Fragment>
  ))}
</div>

        </>
    )
}
export default EarningCardDisplay