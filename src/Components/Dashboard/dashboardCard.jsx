import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import { ChartDisplay } from "./SecondRow/ChartDisplay"
import DonutDisplay from "./SecondRow/DonutDisplay"


function DashboardCard(){
    const backgroundDesign= {
        backgroundColor:"#efeff5",
        // backgroundColor:"green",
        height:"100vh"
    }
return(
    <>
    <div style={backgroundDesign}>
        <div className="d-flex justify-content-between py-2">
    <div className="p-3 fs-4 text-secondary">Dashboard</div>
    <div className="btn my-3 text-white rounded px-2" style={{backgroundColor:"#4e73df", marginRight:"2.1%",fontSize:"90%"}}>Generate Report</div>
    </div>
    <EarningCardDisplay/>
    <div className="d-flex">
    <ChartDisplay/>
    <DonutDisplay/>
    </div>
  
    </div>
    </>
)
}
export default DashboardCard