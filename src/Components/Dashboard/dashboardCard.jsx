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
    {/* <Container fluid className="border  border-warning border-4 d-flex flex-row " style={{width:"100%"}}> */}
    <div className=" border-warning d-flex flex-row " >
        <SideBar />
    <div className="backgroundDesign d-flex flex-column  border-4" >
        <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
            <div className="d-flex align-items-center my-3 px-5 justify-content-between">
                <div className="fs-2 text-secondary">Dashboard</div>
                <Button className="text-white d-flex align-items-center" style={{backgroundColor:"#4e73df",fontSize:"14px"}}>
                <FaDownload className="text-white-50 me-1" />
                Generate Report
                </Button>
            </div>
            {/* First Row */}
            <EarningCardDisplay  />    

            {/* Second Row */}
            {/* <div className="row"> */}
            <ChartDisplay/>
            {/* </div> */}             
        </div>
      </div>
    {/* </Container> */}
    </>
)
}
export default DashboardCard