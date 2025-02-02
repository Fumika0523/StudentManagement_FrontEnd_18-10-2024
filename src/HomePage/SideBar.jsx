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
              padding:isSidebarOpen ? "0.5% 0%":"0.5% 0%",
            }}
             id="sideWidth">
            <div  className="">

                <div className="row border border-warning position-relative" style={{height:"50px",width:"125px"}}>
                <div className="hamburger-icon text-white d-flex"
                 tyle={{position:"absolute",zIndex:1000,cursor:"pointer",
                  textAlign: isSidebarOpen ? "left" : "center",
                  justifyContent: isSidebarOpen ? "end" : "center",
                  alignContent:"center",
                  right:isSidebarOpen ? "10px" : "0px",
                }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                    <MdKeyboardDoubleArrowRight style={{fontSize:"45px"}}/>
            </div>
              </div>
               {/* Arrow icon ends here */}
               {!isSidebarOpen ?
              <>

              {/* Logo Icon */}
              <div className="border border-black my-1"
              >
              <div className="border border-black portalIcon mx-2" >
              <FaSchoolFlag/>
              </div>
              </div>
              {/* Logo Icon ends*/}

              {/* Dashboard */}
              <div className="border border-danger my-1 "
              >
              <div className=" mx-3 bgColor portalIcon"
              onClick={()=> navigate("/dashboard")} >
              <AiFillDashboard/>
              </div>      
              </div>
          
           {/* Componrnt */}
          <div className="border border-danger"
            id="expandIcon" 
            onClick={handleExpandClick}>
          <div
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
           className="mx-3 d-flex align-items-center justify-content-center"
           >
            <div className="border bgColor portalIcon border-black  ">
            <MdGridView />
            </div>
          

            <div className="border border-danger arrow" >
              { !expanded?
         
              <IoIosArrowForward className="text-white"
              />
              :
              <IoIosArrowDown  className="text-white aborder"/>
              }
             </div>
             </div>
          
      </div>
      <Collapse in={open}>
        <div id="example-collapse-text">
       
      {/* StudentData */}
      <div className="border border-danger my-1">
      <div className="component-icon mx-3" onClick={() => { navigate('/studentdata')}}
      style={{cursor:"pointer"}}>
      <PiStudent />
      </div>
      </div>

      {/* Batch Data*/}
      <div className="border border-danger my-1">
      <div className="component-icon mx-3" onClick={()=>{navigate('/batchdata')}}>
      <FaUsersViewfinder  />
      </div>
      </div>

      {/* Course Data */}
      <div className="border border-danger my-1">
      <div className="component-icon mx-3" onClick={()=>{navigate('/coursedata')}}>
      <MdMenuBook/>         
      </div>
      </div>

      {/* Admission Data */}
      <div className="border border-danger my-1">
      <div className="component-icon mx-3" onClick={()=>{navigate('/admissiondata')}}
        style={{fontSize:"40px"}}
        >
      <GiEntryDoor />
      </div>
      </div>
      </div>
      </Collapse>

              {/* Chart */}
              <div className="border border-danger my-1 ">
              <div className=" mx-3 bgColor portalIcon"
               onClick={()=>navigate("/chartdata")}
              >
              <FaChartArea />
              </div>
              </div>

              {/* Utilities */}
              <div className="border border-danger my-1 ">
              <div className="mx-3 bgColor portalIcon"
              onClick={()=>navigate("/utilitiesdata")}>
              <FiTool/>
              </div>
              </div>

              {/* Page */}
              <div className="border border-danger my-1 ">
              <div className="mx-3 bgColor portalIcon"
                onClick={()=>navigate("/pagedata")}>
                <FaFolder/>
              </div>
              </div>

              {/* Table */}
              <div className="border border-danger my-1 ">
              <div className="mx-3 bgColor portalIcon" 
              onClick={()=> navigate("/tabledata")}>
              <FaTable />
              </div>
              </div>
              </> 

              :
                
              <>
              <div className="dashRow d-flex flex-row justify-content-center align-items-end text-white gap-1 pb-2 pt-0" id="sideTitleIcon"
                >
                  <div style={{fontSize:"45px"}}><FaSchoolFlag /></div>
               <div className="fw-bold"
               style={{fontSize:"30px"}}>Student Portal</div>
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
            <div className="row dashRow">
            {/* CHART */}
                <FaChartArea className="col-3 fs-3"  />
                <div  className="col-9" id="chart">Charts</div>
            </div>
      
            <div className="row dashRow">
              {/* Tables */}
                <FaTable className="col-3 fs-3"/>
                <div className="col-9" id="tables">Tables</div>
            </div>
            </>
            }
          {/* </Container> */}
              </div>
            </div>
              
            
        </>
    )
}
export default SideBar