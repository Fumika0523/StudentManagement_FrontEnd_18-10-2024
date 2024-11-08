import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import React from "react";

// const backgroundDesign= {
//     // backgroundColor:"#efeff5",
//     backgroundColor:"green",
//     height:"100vh"
// }

function EarningCard({title,totalRevenue,icon,color}) {

    const borderStyle={
         backgroundColor: "white",
         width:"297px",
         height:"130px",
         borderLeft:"solid",
         borderLeftWidth:"thick",
         borderColor:color,
    }

    return (
        <>
            <div >
                <div className=" rounded ms-3 p-4" style={borderStyle}>

                    <div className="d-flex justify-content-between py-3">
                        <div>
                            <div style={{ fontSize: "112%",color:color }}>{title}</div>
                            <div className="fw-bold fs-4"> {totalRevenue}</div>
                        </div>
                        <div  style={{ fontSize: "250%" ,color:"#dddfeb"}}>
                                                       {React.createElement(icon) }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EarningCard