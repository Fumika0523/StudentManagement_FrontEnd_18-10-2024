import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import ChartDisplay from "./SecondRow/ChartDisplay"
import SideBar from "../../HomePage/SideBar/SideBar"
import NavBar from "../../HomePage/NavBar/NavBar"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FaDownload } from "react-icons/fa";
import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";


function DashboardCard({isAuthenticated, setIsAuthenticated}){

  //  const [isAuthenticated,setIsAuthenticated]=useState(false)
      const [showModal, setShowModal] = useState(false);
         const token = localStorage.getItem('token') 
    console.log(token)
  useEffect(() => {
    if (token) {
      setShowModal(true); // show the modal
    }
  }, []);


return(
    <>

    <div className="d-flex flex-row" >
        <SideBar />
    <div className="backgroundDesign d-flex flex-column " >
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
            <div className="d-flex align-items-center my-3 px-5 justify-content-between ">
                <div className="fs-2 text-secondary">Dashboard</div>
                <Button className="text-white d-flex align-items-center" style={{backgroundColor:"#4e73df",fontSize:"14px"}}>
                <FaDownload className="text-white-50 me-1" />
                Generate Report
                </Button>
            </div>
         
                {/* First Row */}
            <EarningCardDisplay  />    

            {/* Second Row */}
            <ChartDisplay/>                 
        </div>
             {/* Modal overlay */}
      {showModal  && <SelectCourseModal show={showModal} setShow={setShowModal} />}
      </div>

    </>
)
}
export default DashboardCard