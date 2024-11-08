import EarningCardDisplay from "./FirstRow/EarningCardDisplay"

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
    </div>
    </>
)
}
export default DashboardCard