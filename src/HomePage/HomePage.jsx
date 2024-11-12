import NavBar from './NavBar'
import SideBar from './SideBar'
import DashboardCard from '../Components/Dashboard'

function HomePage(){
    return(
        <>
        <div className='d-flex'>
        <SideBar/>
        <NavBar/>
        <DashboardCard/>
        </div>
        </>
    )
}
export default HomePage