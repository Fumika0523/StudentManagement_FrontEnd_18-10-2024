import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import ChartDisplay from "./SecondRow/ChartDisplay"
import SideBar from "../../HomePage/SideBar"
import NavBar from "../../HomePage/NavBar"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FaDownload } from "react-icons/fa";


function DashboardCard(){

      const [userData,setUserData] = useState([])
    
    //signin part
    //initially you are not loggin,its set as false,
    //when you get the token(signed in), your authentication as true
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    
    //its going to render whenever there is change (signin)
    useEffect(()=>{
      const token = sessionStorage.getItem('token') //if you have a token,
      console.log(token) 
      setIsAuthenticated(true) //signed in,>>authentication > true
    //   getUserData()
    },[])
    
return(
    <>
    <Container fluid className="  border-warning border-4 d-flex flex-row  ">
    {/* <div > */}
        <SideBar />
    <div className="backgroundDesign row justify-content-center  border-danger border-4 d-flex flex-column" >
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
            <div className="d-flex align-items-center col-11 mx-auto border-4  justify-content-between ">
                <div className="fs-1 text-secondary  border-primary border-3 col-8">
                Dashboard
                </div>
                <div className="col-4 d-flex justify-content-end">
                <Button className="text-white d-flex  align-items-center" style={{backgroundColor:"#4e73df"}}>
                <FaDownload className="text-white-50" />             
                <div className="text-nowrap ps-1" style={{fontSize:"14px"}} >
                Generate Report
                </div>
                </Button>
                </div>
            </div>
            {/* First Row */}
            <div>
            <EarningCardDisplay  />    
            </div>
            {/* Second Row */}
            {/* <div className="row"> */}
            <div>
            <ChartDisplay/>
            </div>
            {/* </div> */}
                
        </div>
    {/* </div> */}
    </Container>
    </>
)
}
export default DashboardCard