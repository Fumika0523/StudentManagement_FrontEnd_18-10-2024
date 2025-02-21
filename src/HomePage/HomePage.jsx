import DashboardCard from '../Components/Dashboard/dashboardCard'
import NavBar from './NavBar'
import SideBar from './SideBar'


function HomePage(){
    return(
        <>
        <div className='container'>
        <SideBar />
        <NavBar/>
        <DashboardCard/>
        </div>
        </>
    )
}
export default HomePage