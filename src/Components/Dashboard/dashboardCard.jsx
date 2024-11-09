import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import { ChartDisplay } from "./SecondRow/ChartDisplay"

function DashboardCard(){
    const backgroundDesign= {
        backgroundColor:"#efeff5",
        // backgroundColor:"green",
        height:"100vh"
    }
return(
    <>
    <div style={backgroundDesign}>
    <div className="p-3 fs-4 text-secondary">Dashboard</div>
    <EarningCardDisplay/>
    <ChartDisplay/>
    </div>
    </>
)
}
export default DashboardCard