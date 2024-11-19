import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { useState } from "react";

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

export const url = "http://localhost:8000"  
export const earningCardList = [
    {
        title:"EARNINGS (MONTHLY)",
        totalRevenue:{monthlyEarnings},
        icon:TfiBag,
        color:"#4e73df"
    },
    {   
        title:"EARNINGS (ANNUAL)",
        totalRevenue:"$215,000",
        icon:FaDollarSign,
        color:"#1cc88a"
    },
    {
        title:"TASKS",
        totalRevenue:"50%",
        icon:FaClipboardList,
        color:"#36b9cc"
    },
    {
        title:"PENDING REQUESTS",
        totalRevenue:"18",
        icon:IoIosChatbubbles,
        color:"#f6c23e"
    }
]