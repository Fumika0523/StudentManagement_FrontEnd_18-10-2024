import React from "react";
import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

function EarningCard({title,totalRevenue,icon,color}) { //{title,totalRevenue,icon,color} << response from server, destructuring
    const Icons = {
        TfiBag: TfiBag, //if I have this icon, then map to the react icon
        FaDollarSign: FaDollarSign,
      }; // key:value , key > response from the server , passed as a prop and used here. value: is your react icon.
    const IconComponent = Icons[icon]; //dynamically retrieving the icons and mapping to the UI
 
    const borderStyle={
         backgroundColor: "white",
         width:"350px",
         height:"100px",
         borderLeft:"solid",
         borderLeftWidth:"thick",
         borderColor:color,
    }
  console.log(Icons[icon]) //[icon] >> prop, passing the icon[TfiBag],icon[FaDollarSign]...
  console.log(Icons.icon) //undefined, icon is not passed to ".icon"

    return (
        <>
            <div >
                <div className=" rounded ms-4 p-3" style={borderStyle}>
                    <div className="d-flex justify-content-between py-1">
                        <div>
                            <div style={{ fontSize: "100%",color:color }}>{title}</div>
                            <div className="fw-bold fs-4"> $ {totalRevenue}</div>
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