import EarningCard from "./EarningCard"
import {earningCardList, url} from '../../utils/constant'
import { useEffect, useState } from "react"
import axios from "axios"


function EarningCardDisplay(){
    //I can pass it to the next component (EarningCard), where is the usage.
    const [earnings,setEarnings] = useState([])
    const getEarningData = async()=>{
        console.log("Earning data is called..........")
        let res = await axios.get(`${url}/earnings`)
        console.log(res.data)
        setEarnings(res.data)
      }
      useEffect(()=>{
        getEarningData()
      },[])

    return(
        <>
        <div className="d-flex"  >
            {
                // earningCardList.map((element,index)=> <EarningCard {...element} key={index}/>
                // )
                earnings.map((element,index)=><EarningCard {...element} key = {index}/>)
            }
       
    
        </div>
        </>
    )
}
export default EarningCardDisplay