import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

const backgroundDesign= {
    backgroundColor:"#efeff5",
    height:"100vh"
}

function dashboardCard(){
    return(
        <>
        <div style={backgroundDesign}>
        <div className="p-3 fs-4 text-secondary">Dashboard</div>
        {/* Blue */}
        {/* <div className="border-4 border-start border-primary rounded mt-1 ms-3 p-4" style={{width:"30%",backgroundColor:"white"}}> */}

        {/* Green */}
        {/* <div className="border-4 border-start border-success rounded mt-1 ms-3 p-4" style={{width:"30%",backgroundColor:"white"}}> */}

        {/* Info */}
        {/* <div className="border-4 border-start border-info rounded mt-1 ms-3 p-4" style={{width:"30%",backgroundColor:"white"}}> */}

        {/* Yellow */}
        <div className="border-4 border-start border-warning rounded mt-1 ms-3 p-4" style={{width:"28%", height:"13%", backgroundColor:"white"}}>

        <div className="d-flex justify-content-between">
        <div>
        <div style={{fontSize:"60%"}}>EARNINGS (MONTHLY)</div>
        <div className="fw-bold fs-5">$40,000</div>
        </div>

        {/* BAG ICON */}
        {/* <TfiBag /> */}

        {/* Dollar */}
        {/* <FaDollarSign /> */}

        {/* List */}
        {/* <FaClipboardList /> */}

        {/* Message */}
        <IoIosChatbubbles className="text-secondary" style={{fontSize:"250%"}} />
        </div>
        </div>
        </div>
        </>
    )
}
export default dashboardCard