import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import { ChartDisplay } from "./SecondRow/ChartDisplay"
import DonutDisplay from "./SecondRow/DonutDisplay"
import SideBar from "../../HomePage/SideBar"
import NavBar from "../../HomePage/NavBar"
import { Box } from "@mui/material"

function DashboardCard(){

return(
    <>
    <div className="d-flex">
        <SideBar/>
        <Box  sx={{ display:"flex", flexDirection:"column" }} >
        <NavBar/>
        <div className="backgroundDesign" >
        <div className="d-flex mt-3 align-items-center px-5 justify-content-between ">
            <div className="fs-2 text-secondary">Dashboard</div>
            <div className="btn text-white rounded px-2" style={{backgroundColor:"#4e73df",fontSize:"90%"}}>Generate Report</div>
        </div>
   
        <EarningCardDisplay  />
   
     
            <div className=" d-flex  px-5 justify-content-between">
                <ChartDisplay/>
                <DonutDisplay/>
            </div>
         </div>
        </Box>
    </div>
    </>
)
}
export default DashboardCard