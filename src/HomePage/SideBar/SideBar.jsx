import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiFillDashboard } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { IoSettings } from "react-icons/io5";
import * as React from 'react';
import { FaPowerOff } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { FaUsersViewfinder } from "react-icons/fa6";
import { GiEntryDoor } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { MdGridView } from "react-icons/md";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "../SideBar/SideBar.css"


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
      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    const navigate = useNavigate()
    return (
        <>

          <div className="sideBarStyle border-4 border-danger border "        
             id="sideWidth"
             style={{
         width: isSidebarOpen ? "330px" : "150px",
         transition:"0.8s",
       }}>

                {/* Arrow Icon */}
                <div className="position-relative " style={{height:isSidebarOpen ?"45px":"15px"}}>
                <div className="hamburger-icon text-white d-flex"
                 style={{zIndex:1000,cursor:"pointer",
                justifyContent: isSidebarOpen ? "end" : "center",
               }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
              {!isSidebarOpen?
             
             <MdKeyboardDoubleArrowRight style={{fontSize:"45px"}} />
             :
             <MdKeyboardDoubleArrowLeft  style={{fontSize:"45px"}}/> }
   
            </div>
              </div>
               {/* Arrow icon ends here */}
               {!isSidebarOpen ?
              <>
            
              {/* Logo Icon */}
              <div className="portalIcon mx-2 py-1" >
              <FaSchoolFlag/>
              </div>

              {/* Dashboard */}
              <div className="mx-3 bgColor portalIcon"
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
            {/* Component ARROW */}
            <div className="arrowIcon"
            style={{ position: "relative",top: "-32px",left:"70%",height:"0px"}} >
              { !expanded?
         
              <IoIosArrowForward className="text-white fs-5"
              />
              :
              <IoIosArrowDown  className="text-white fs-5"/>
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

              <div className="mx-3 portalIcon bgColor signOut" 
              onClick={() => handleSignOut()}>
              <FaPowerOff />
              </div>
              </> 

              :
                
              <>
              <div className="d-flex portalIcon col-11 border-danger text-white align-items-end justify-content-center mx-1  mx-3 " id="sideTitleIcon"
              style={{ padding:"8px 4px 5px 4px"}}
                >
            
                <FaSchoolFlag className=" d-flex  border-danger text-end  col-3"
                  style={{fontSize:"45px"}} />

                <div className="col-9 p-0  border-danger text-start fw-bold " 
                style={{fontSize:"23px",textWrap:"noWrap"}}
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
            className="dashRow row"
            onClick={handleExpandClick} >
          
            <div
            id="expandIcon " 
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className="d-flex row align-items-center">
            
            <IoSettings className="col-3 fs-4"/>
           <div id="component" className="col-7 ">
            Component</div>
              
              {expanded?
             
              <IoIosArrowDown className="col-2 fs-4 text-white"
              />
              :
              <IoIosArrowForward  className="col-2 fs-4 text-white"/> }
            
                <Collapse in={open}>
                <div id="example-collapse-text" className="mx-auto"
              style={{borderRadius:"10px", backgroundColor:"white", marginTop:"5%",padding:"3% 8%",width:"80%",
               }}>

              <div className="sidebarItem d-flex align-items-center justify-content-start gap-2"   onClick={() => { navigate('/studentdata') }} >
              <PiStudent className="fs-3" style={{color:"#2050deff"}}/>
              View All Student
              </div>

              {/* Batch */}
              <div className="sidebarItem d-flex align-items-center justify-content-start gap-2"   onClick={()=>{navigate('/batchdata')}}>
              <FaUsersViewfinder className="fs-3" style={{color:"#2050deff"}} />
            View All Batch
              </div>

              {/* Course */}
              <div className="sidebarItem d-flex align-items-center justify-content-start gap-2"  onClick={()=>{navigate('/coursedata')}}>
                      <MdMenuBook className="fs-3" style={{color:"#2050deff"}}/>  
                  View All Course
              </div>

              {/* Admission */}
              <div className="sidebarItem d-flex align-items-center justify-content-start gap-2 text-nowrap"
               onClick={()=>{navigate('/admissiondata')}}>
                <GiEntryDoor className="fs-3" style={{color:"#2050deff"}} />
              View All Admission
              </div>
              </div>
            </Collapse>
          </div>
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
            <div className="row dashRow"
            style={{color: "rgb(127, 4, 4)" }}
            onClick={() => handleSignOut()}>
           
                <FaPowerOff  className="col-3 fs-3"/>
                <div className="col-9" id="tables">Sign Out</div>
            </div>


            </>
            }
          {/* </div> */}
          </div>
        {/* </div> */}
        </>
    )
}
export default SideBar