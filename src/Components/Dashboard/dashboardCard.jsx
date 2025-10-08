import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import ChartDisplay from "./SecondRow/ChartDisplay"
import SideBar from "../../HomePage/SideBar/SideBar"
import NavBar from "../../HomePage/NavBar/NavBar"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FaDownload } from "react-icons/fa";
import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";
import axios from "axios"
import { url } from "../utils/constant"


function DashboardCard({isAuthenticated, setIsAuthenticated}){
  //  const [isAuthenticated,setIsAuthenticated]=useState(false)
      const [showModal, setShowModal] = useState(false);
      const [admissionData,setAdmissionData] = useState([])
      const [studentData,setStudentData] = useState([])
      const [batchData,setBatchData] = useState([])
      const token = localStorage.getItem('token') 
    //console.log(token)
          let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
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
            <div className="d-flex align-items-center mt-3 px-3 justify-content-end ">
                <Button className="text-white d-flex gap-1 align-items-center" style={{backgroundColor:"#4e73df",fontSize:"14px"}}>
                <FaDownload className="text-white-50" />
                <span className="d-sm-none d-md-block">Generate Report</span>
                </Button>
            </div>
         
             {/* First Row */}
        <EarningCardDisplay  studentData={studentData} setStudentData={setStudentData} admissionData={admissionData} setAdmissionData={setAdmissionData} batchData={batchData} setBatchData={setBatchData} />    

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