import React from "react";
import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

function EarningCard({title,totalRevenue,icon,color}) {
    const borderStyle={
         backgroundColor: "white",
         width:"302px",
         height:"120px",
         borderLeft:"solid",
         borderLeftWidth:"thick",
         borderColor:color,
    }
   
    return (
        <>
            <div >
                <div className=" rounded ms-4 p-4" style={borderStyle}>

                    <div className="d-flex justify-content-between py-1">
                        <div>
                            <div style={{ fontSize: "112%",color:color }}>{title}</div>
                            <div className="fw-bold fs-4"> $ {totalRevenue}</div>
                        </div>
                        <div  style={{ fontSize: "250%" ,color:"#dddfeb"}}>
                                                       {/* {React.createElement(icon) } */}
                                                       {icon}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EarningCard