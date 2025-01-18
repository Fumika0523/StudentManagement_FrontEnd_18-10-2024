import DashboardCard from '../Components/Dashboard/dashboardCard'
import NavBar from './NavBar'
import SideBar from './SideBar'


function HomePage(){
    return(
        <>
        <div className='d-flex'>
        <SideBar />
        <NavBar/>
        <DashboardCard/>
        </div>
        </>
    )
}
export default HomePage