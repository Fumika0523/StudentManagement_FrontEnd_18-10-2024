import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import ChartDisplay from "./SecondRow/ChartDisplay"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FaDownload } from "react-icons/fa";
import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";
import axios from "axios"
import { url } from "../utils/constant"


function DashboardCard({isAuthenticated, setIsAuthenticated}){
  //  const [isAuthenticated,setIsAuthenticated]=useState(false)
      const [showModal, setShowModal] = useState(false);

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
    <div className="backgroundDesign d-flex flex-column " >
        {/* First Row */}
        <EarningCardDisplay   />    
        {/* Second Row */}
        <ChartDisplay/>                 
        </div>
             {/* Modal overlay */}
      {showModal  && <SelectCourseModal show={showModal} setShow={setShowModal} />}
      {/* </div> */}

    </>
)
}
export default DashboardCard