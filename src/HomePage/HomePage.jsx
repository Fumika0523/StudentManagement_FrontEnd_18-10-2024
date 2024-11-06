import NavBar from './NavBar'
import SideBar from './SideBar'
import dashboardCard from './dashboardCard'

function HomePage(){
    return(
        <>
        <div className='d-flex'>
        <SideBar/>
        <NavBar/>
        <dashboardCard/>
        </div>
        </>
    )
}
export default HomePage