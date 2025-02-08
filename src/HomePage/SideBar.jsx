import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiFillDashboard } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { IoSettings } from "react-icons/io5";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaPowerOff } from "react-icons/fa";
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

    const token = sessionStorage.getItem('token')
    console.log("token", token)
    
    const handleSignOut = () => {
      sessionStorage.removeItem('token')
      navigate('/')
    }
  
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
              width: isSidebarOpen ? "28%" : "8%",
              padding:isSidebarOpen ? "0.5% 0%":"0.5% 0%",
              transition:"0.8s"
            }}
             id="sideWidth">
     
                {/* Arrow Icon */}
                <div className="position-relative" style={{height:"50px"}}>
                <div className="hamburger-icon text-white d-flex"
                 style={{zIndex:1000,cursor:"pointer",
                  justifyContent: isSidebarOpen ? "end" : "center",
               }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                    <MdKeyboardDoubleArrowRight style={{fontSize:"45px"}}/>
            </div>
              </div>
               {/* Arrow icon ends here */}
               {!isSidebarOpen ?
              <>

              {/* Logo Icon */}
              <div className="portalIcon mx-2 pb-1" >
              <FaSchoolFlag/>
              </div>
         
              {/* Logo Icon ends*/}

              {/* Dashboard */}
              <div className=" mx-3 bgColor portalIcon boarder"
              onClick={()=> navigate("/dashboard")} >
              <AiFillDashboard/>
              </div>      
        

           {/* Component */}
          <div   
            onClick={handleExpandClick}>
          <div
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            id="expandIcon" 
           >
            <div className="bgColor portalIcon smallSidebarIcon"
            style={{margin:"0px 17.5px 0px 17.5px"}}
            >
            <MdGridView  />
        
            </div>
    
            <div className="arrowIcon"
            style={{  position: "relative",top: "-35px",left:"80%",height:"0px"}} >
              { !expanded?
         
              <IoIosArrowForward className="text-white fs-6"
              />
              :
              <IoIosArrowDown  className="text-white fs-6"/>
              }
             </div>
             </div>
          </div>
          <Collapse in={open}>
          <div id="example-collapse-text">
       
      {/* StudentData */}
      <div className="my-2">
      <div className="component-icon mx-3" onClick={() => { navigate('/studentdata')}}
      style={{cursor:"pointer"}}>
      <PiStudent />
      </div>
      </div>

      {/* Batch Data*/}
      <div className=" my-2">
      <div className="component-icon mx-3" onClick={()=>{navigate('/batchdata')}}>
      <FaUsersViewfinder  />
      </div>
      </div>

      {/* Course Data */}
      <div className="my-2">
      <div className="component-icon mx-3" onClick={()=>{navigate('/coursedata')}}>
      <MdMenuBook/>         
      </div>
      </div>

      {/* Admission Data */}
      <div className="my-2">
      <div className="component-icon mx-3" onClick={()=>{navigate('/admissiondata')}}
        style={{fontSize:"40px"}}
        >
      <GiEntryDoor />
      </div>
      </div>
      </div>
          </Collapse>

              {/* Chart */}
              <div className=" mx-3 bgColor portalIcon"
               onClick={()=>navigate("/chartdata")}
              >
              <FaChartArea />
              </div>

              {/* Utilities */}
              <div className="mx-3 bgColor portalIcon"
              onClick={()=>navigate("/utilitiesdata")}>
              <FiTool/>
              </div>
          
              {/* Page */}
              <div className="mx-3 bgColor portalIcon"
                onClick={()=>navigate("/pagedata")}>
                <FaFolder/>
              </div>

              {/* Table */}
              <div className="mx-3 bgColor portalIcon" 
              onClick={()=> navigate("/tabledata")}>
              <FaTable />
              </div>

              {/* Sign Out */}

              <div className="mx-3 portalIcon bgColor signout" 
              onClick={() => handleSignOut()}>
              <FaPowerOff />
              </div>
              </> 

              :
                
              <>
              <div className="d-flex portalIcon text-white align-items-end   mx-3 " id="sideTitleIcon"
              style={{ padding:"11px 0px"}}
                >
                  {/* School LOgo */}
                {/* <div className="border border-danger col-3"
                style={{fontSize:"45px"}}
                 > */}
                  <FaSchoolFlag className="  d-flex  col-3"
                  style={{fontSize:"45px"}} />
                {/* </div> */}

                <div className="col-9 fw-bold" 
                style={{fontSize:"25px"}}
                >
                  Student Portal
                </div>
              </div>

                {/* Dashboard */}
                <div className="row dashRow row text-white" >
                <AiFillDashboard className="col-3  fs-4" /><div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} id="dashboard" >Dashboard</div>
              </div>

            {/* COMPONENT */}
            <div 
            className="dashRow"
            onClick={handleExpandClick}
             >
          
            <div
            id="expandIcon " 
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className="d-flex row align-items-center">
            
            <IoSettings className="col-3 fs-4"/>
           <div id="component" className="col-7 ">
            Component</div>
              
              {!expanded?
             
              <IoIosArrowForward className="col-2 fs-4 text-white"
              />
              :
              <IoIosArrowDown  className="col-2 fs-4 text-white"/> }
               </div>
                <Collapse in={open}>
                <div id="example-collapse-text" 
              style={{borderRadius:"10px", backgroundColor:"white",color:"black", margin:"5% 5% 0% 5%",width:"230px",padding:"3% 0",
               }}>

              <div className="sidebarItem"   onClick={() => { navigate('/studentdata') }} >
              View All Student
              </div>

              {/* Batch */}
              <div className="sidebarItem"   onClick={()=>{navigate('/batchdata')}}>
            View All Batch
              </div>

              {/* Course */}
              <div className="sidebarItem"  onClick={()=>{navigate('/coursedata')}}>
                  View All Course
              </div>

              {/* Admission */}
              <div className="sidebarItem"
               onClick={()=>{navigate('/admissiondata')}}>
              View All Admission
              </div>
              </div>
            </Collapse>
          </div>
      
       {/* UTILITIES */}
        <div className="row dashRow">
        <FiTool className="col-3 fs-3" />
         <div className="col-9" id="utilities">Utilities</div>
          </div>

             {/* PAGES */}
            <div className="row dashRow ">               <FaFolder className="col-3 fs-3"/>
               <div className="col-9" id="page">Page</div>
            </div>

                {/* CHART */}
            <div className="row dashRow">
                 <FaChartArea className="col-3 fs-3"  />
                 <div  className="col-9" id="chart">Charts</div>
            </div>
            
               {/* Tables */}
            <div className="row dashRow">
                <FaTable className="col-3 fs-3"/>
                <div className="col-9" id="tables">Tables</div>
            </div>
              
                 {/* Sign Out */}
            <div className="row dashRow signout"
            onClick={() => handleSignOut()}>
           
                <FaPowerOff  className="col-3 fs-3"/>
                <div className="col-9" id="tables">Sign Out</div>
            </div>


            </>
            }
          </div>
        </>
    )
}
export default SideBar