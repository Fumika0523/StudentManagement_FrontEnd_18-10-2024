import React from "react";
import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

function EarningCard({title,total,icon,color}) { //{title,totalRevenue,icon,color} << response from server, destructuring
    const Icons = {
        TfiBag: TfiBag, //if I have this icon, then map to the react icon
        FaDollarSign: FaDollarSign,
        FaClipboardList:FaClipboardList,
        IoIosChatbubbles:IoIosChatbubbles
      }; // key:value , key > response from the server , passed as a prop and used here. value: is your react icon.
    const IconComponent = Icons[icon]; //dynamically retrieving the icons and mapping to the UI
 
    const borderStyle={
        position:"relative",
        backgroundColor: "white",
        minWidth:"100%",
        height:"100px",
        borderLeft:"solid",
        borderLeftWidth:"thick",
        borderColor:color,
    }
  //console.log(Icons[icon]) //[icon] >> prop, passing the icon[TfiBag],icon[FaDollarSign]...
  //console.log(Icons.icon) //undefined, icon is not passed to ".icon"

    return (
        <>
         <div className="  mb-4 col-lg-3 col-md-6 col-sm-10 d-flex align-items-center justify-content-start flex-nowrap" >
                <div className="rounded align-items-center justify-content-center py-2 px-2 d-flex" style={borderStyle}>
                    <div className="d-flex  justify-content-between  align-items-center w-100" >
                        <div>
                            <div style={{ fontSize: "16px",color:color }}>{title}</div>
                            <div className="fw-bold fs-4">{total}</div>
                        </div>
                        <div className="my-2">
                            {/* {React.createElement(icon) } */}
                            <IconComponent style={{ fontSize: "230%" ,color:"#dddfeb",marginTop:"25% 0"}}  />       
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EarningCard