import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

//static data
export const url = "http://localhost:8001"  
export const earningCardList = [
    {
        title:"EARNINGS (MONTHLY)",
        totalRevenue:"$40,000",
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
        title:"Total Batches",
        totalRevenue:"50%",
        icon:FaClipboardList,
        color:"#36b9cc"
    },
    {
        title:"Total Enrollment",
        totalRevenue:"18",
        icon:IoIosChatbubbles,
        color:"#f6c23e"
    }
]