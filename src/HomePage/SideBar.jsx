import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiFillDashboard } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { IoSettings } from "react-icons/io5";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { FaUsersViewfinder } from "react-icons/fa6";
import { GiEntryDoor } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { MdGridView } from "react-icons/md";
import { FaSchool } from "react-icons/fa6";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function SideBar() {
    const [open, setOpen] = useState(false); //Toggling our second icon to get sub icon
    const [expanded, setExpanded] = React.useState(false); //to open component, when its open the down-arrow should show
    const [isSidebarOpen, setIsSidebarOpen] = useState (true); // State to toggle the sidebar
   

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        // transform: !expand ? 'rotate(-90deg)':'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      }));

      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    const navigate = useNavigate()
    return (
        <>
          <div className="sideBarStyle"
            style={{
              width: isSidebarOpen ? "20%" : "6%",
              padding:isSidebarOpen ? "0.5% 1.5%":"0.5% 0%",
            }}
             id="sideWidth">
            <Container >
                <div className="row smallSideRow mb-4 ">
                <div className="hamburger-icon text-white d-flex"
                  style={{position:"absolute",zIndex:1000,cursor:"pointer",
                    textAlign: isSidebarOpen ? "left" : "center",
                    justifyContent: isSidebarOpen ? "end" : "center",
                    alignContent:"center",
                    right:isSidebarOpen ? "10px" : "0px",
                  }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                    <MdKeyboardDoubleArrowRight style={{fontSize:"45px"}}/>
            </div>
              </div>
               {!isSidebarOpen ?
              <>

              {/* Student Icon */}
              <div className="row smallSideRow"
              style={{paddingTop:isSidebarOpen ? "0%" : "35%"}}>
              <div className="portalIcon mt-1" >
              <FaSchoolFlag/>
              </div>
              </div>
          
              {/* Dashboard */}
              <div className="row smallSideRow mt-3 "
              >
              <div className="smallSidebarIcon"
              onClick={()=> navigate("/dashboard")} >
              <AiFillDashboard  />
              </div>      
              </div>
          <div className="row border border-black"
           
            id="expandIcon" 
            onClick={handleExpandClick}
              >
          <div
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className="d-flex align-items-center border justify-content-center border-warning 
          componentDiv" 
           >
            
            <MdGridView 
             
            className="MdGridViewIcon smallSidebarIcon border " style={{fontSize:"50px",color:"white"}} />
              
              { expanded?
             
              <IoIosArrowForward className="arrowIcon text-white"
              />
              :
              <IoIosArrowDown  className="text-white  border"/>
             
                  }
          </div>
      </div>
      <Collapse in={open}>
        <div id="example-collapse-text">
       
      {/* StudentData */}
      <div className="component-icon" onClick={() => { navigate('/studentdata')}}
        style={{cursor:"pointer"}}>
      <PiStudent />
      </div>
      {/* Batch Data*/}
      <div className="component-icon" onClick={()=>{navigate('/batchdata')}}>
      <FaUsersViewfinder  />
      </div>
      {/* Course Data */}
      <div className="component-icon" onClick={()=>{navigate('/coursedata')}}>
      <MdMenuBook/>         
      </div>
      {/* Admission Data */}
      <div className="component-icon" onClick={()=>{navigate('/admissiondata')}}
        style={{fontSize:"40px"}}
        >
      <GiEntryDoor />
      </div>
      </div>
    
      </Collapse>
              {/* Chart */}
              <div className="row smallSideRow"
              style={{marginTop:"20px"}}>
              <div className="smallSidebarIcon" onClick={()=>navigate("/chartdata")}
                style={{marginTop:"20pxgit"}}>
              <FaChartArea />
              </div>
              </div>

              {/* Utilities */}
              <div className="row smallSideRow">
              <div className="smallSidebarIcon"
              onClick={()=>navigate("/utilitiesdata")}>
              <FiTool/>
              </div>
              </div>

              {/* Page */}
              <div className="row smallSideRow">
              <div className="smallSidebarIcon"
                onClick={()=>navigate("/pagedata")}>
                <FaFolder/>
              </div>
              </div>

              {/* Table */}
              <div className="row smallSideRow">
              <div className="smallSidebarIcon" onClick={()=> navigate("/tabledata")}>
              <FaTable />
              </div>
              </div>
              </> 

              :
                
              <>
              <div className="dashRow row text-white" id="sideTitleIcon"
                >
                <FaSchoolFlag className="text-end col-lg-2 col-md-2 col-sm-4 studentTitleIcon  fs-1 p-0"/>
               <div className="col-lg-10 col-md-10 col-sm-8 tex-start dashTitle  fs-3">Student Portal</div>
                </div>
                <div className="row dashRow row text-white" >
                <AiFillDashboard className="col-3  fs-5" /><div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} id="dashboard" >Dashboard</div>
                </div>

            {/* COMPONENT */}
            <div 
            className="dashRow row"
            onClick={handleExpandClick}
             >
          
            <div
            id="expandIcon " 
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className="d-flex  align-items-center">
            
            <IoSettings className="col-2 "/>
           <div id="component" className="ps-4 col-8 ">
            Component</div>
              
              {expanded?
             
              <IoIosArrowForward className="col-2 fs-4 text-white"
              />
              :
              <IoIosArrowDown  className="col-2 fs-4 text-white"/> }
               </div>
                <Collapse in={open}>
                <div id="example-collapse-text" 
              style={{borderRadius:"10px", backgroundColor:"white",color:"black", marginTop:"5%",width:"230px",padding:"3% 0",
               }}>

              <div className="sidebarItem"   onClick={() => { navigate('/studentdata') }} >
            View All Student
             </div>
             {/* Batch */}
            <div className="sidebarItem"  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/batchdata')}}>
            View All Batch
             </div>
             {/* Course */}
              <div className="sidebarItem"  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/coursedata')}}>
                  View All Course
              </div>
              {/* Admission */}
              <div className="sidebarItem"
              style={{fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%"}}
              onClick={()=>{navigate('/admissiondata')}}>
                View All Admission
              </div>
                </div>
                </Collapse>
            </div>
      
       {/* UTILITIES */}
        <div className="row dashRow">
        <FiTool className="col-3" />
         <div className="col-9" id="utilities">Utilities</div>
            </div>
             {/* PAGES */}
            <div className="row dashRow ">               <FaFolder className="col-3"/>
               <div className="col-9" id="page">Page</div>
            </div>
            <div className="row dashRow">
            {/* CHART */}
                <FaChartArea className="col-3"  />
                <div  className="col-9" id="chart">Charts</div>
            </div>
      
            <div className="row dashRow">
              {/* Tables */}
                <FaTable className="col-3"/>
                <div className="col-9" id="tables">Tables</div>
            </div>
            </>
            }
          </Container>
              {/* </div> */}
            </div>
              
            
        </>
    )
}
export default SideBar