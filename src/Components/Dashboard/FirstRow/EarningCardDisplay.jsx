import EarningCard from "./EarningCard"
import {earningCardList,url} from '../../utils/constant'
import { useEffect, useState } from "react"
import axios from "axios"

function EarningCardDisplay(){
    const token = localStorage.getItem('token')
    //I can pass it to the next component (EarningCard), where is the usage.
    const [earnings,setEarnings] = useState([])
      let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

    const getEarningData = async()=>{
        console.log("Earning data is called..........")
        let res = await axios.get(`${url}/earnings`,config)
        console.log("getEarningData",res.data)
        setEarnings(res.data)
      }
      useEffect(()=>{
        getEarningData()
      },[])

      const currentYear = new Date().getFullYear()
      console.log("current Year",currentYear)

      const currentMonth = new Date().getMonth()+1
      console.log("currentMonth",currentMonth)

      

    return(
        <>
        <div className=" d-flex justify-content-center align-items-center mx-auto  row px-2  w-100">
            {
                //earningCardList.map((element,index)=> <EarningCard {...element} key={index}/>
                //)
                 earnings?.map((element,index)=><EarningCard {...element} key = {index}/>)
            }
       
    
        </div>
        </>
    )
}
export default EarningCardDisplay