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

    const token = localStorage.getItem('token')
    // console.log("token", token)
    const role = localStorage.getItem('role')
    // console.log(role)


    const handleSignOut = () => {
      localStorage.removeItem('token')
      navigate('/')
    }
      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    const navigate = useNavigate()
    return (
        <>
          <div className="sideBarStyle border-warning border-4  "        
             id="sideWidth"
             style={{
         width: isSidebarOpen ? "350px" : "150px",
         transition:"0.8s",
       }}>

                {/* Arrow Icon */}
                <div className="position-relative  border-4 " style={{height:isSidebarOpen ?"15px":"15px"}}>
                <div className="hamburger-icon text-white d-flex"
                 style={{zIndex:100,cursor:"pointer",
                justifyContent: isSidebarOpen ? "end" : "center",
               }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
              {!isSidebarOpen?
             
             <MdKeyboardDoubleArrowRight style={{fontSize:"40px"}} />
             :
             <MdKeyboardDoubleArrowLeft  style={{fontSize:"45px"}}/> }
   
            </div>
              </div>
               {/* Arrow icon ends here */}
               {!isSidebarOpen ?
              <>
              {/* Logo Icon */}
              <div className="portalIcon mx-3 py-1" >
              <FaSchoolFlag/>
              </div>

              {/* Dashboard */}
              <div className="mx-4 bgColor portalIcon"
              onClick={()=> navigate("/dashboard")} >
              <AiFillDashboard/>
              </div>      

           {/* Component */}
        <div className=" "
          onClick={() => setOpen(!open)} // 
          aria-controls="example-collapse-text"
          aria-expanded={open}
          id="expandIcon"
          style={{ cursor: "pointer",height:"25px" }}
        >
          <div className="bgColor mx-4 portalIcon smallSidebarIcon ">
            <MdGridView className=""/>
          </div>

          {/* Arrow Icon */}
          <div
            className="arrowIcon "
            style={{ position: "relative", top: "-32px", left: "70%",width:"30px" }}
          >
            {open ? (
              <IoIosArrowDown className="text-white fs-5" />
            ) : (
              <IoIosArrowForward className="text-white fs-5" />
            )}
          </div>
        </div>

      {/* Smooth Collapse Content */}
      <Collapse in={open}>
        <div
          id="example-collapse-text"
          className="bg-white mx-auto"
          style={{ width: "100px", borderRadius: "15px" }}
        >
          {role === "admin" ? (
            <>
              {/* Student Data */}
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/studentdata")}
                  style={{ cursor: "pointer" }}
                >
                  <PiStudent />
                </div>
              </div>

              {/* Batch Data */}
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/batchdata")}
                  style={{ cursor: "pointer" }}
                >
                  <FaUsersViewfinder />
                </div>
              </div>

              {/* Course Data */}
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/coursedata")}
                  style={{ cursor: "pointer" }}
                >
                  <MdMenuBook />
                </div>
              </div>

              {/* Admission Data */}
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/admissiondata")}
                  style={{ fontSize: "40px", cursor: "pointer" }}
                >
                  <GiEntryDoor />
                </div>
              </div>
            </>
          ) : (
            <>
            {/* Student login */}
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("")}
                  style={{ cursor: "pointer" }}
                >
                  Attendance
                </div>
              </div>

            
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                >
                  Schedule
                </div>
              </div>

              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                >
                  Progress
                </div>
              </div>

             
              <div className="my-2">
                <div
                  className="component-icon mx-4"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                >
                  Result
                </div>
              </div>
            </>
          )}
        </div>
      </Collapse>


              {/* Chart */}
              <div className=" mx-4 bgColor portalIcon"
               onClick={()=>navigate("/chartdata")}
              >
              <FaChartArea />
              </div>

              {/* Utilities */}
              <div className="mx-4 bgColor portalIcon"
              onClick={()=>navigate("/utilitiesdata")}>
              <FiTool/>
              </div>
          
              {/* Page */}
              <div className="mx-4 bgColor portalIcon"
                onClick={()=>navigate("/pagedata")}>
                <FaFolder/>
              </div>

              {/* Table */}
              <div className="mx-4 bgColor portalIcon" 
              onClick={()=> navigate("/tabledata")}>
              <FaTable />
              </div>

              {/* Sign Out */}
              <div className="mx-auto mb-3 signOut" 
              onClick={() => handleSignOut()}>
              <FaPowerOff className="fs-2"/>
              </div>
              </> 

              :
                // side bar is opened
              <>
              {/* STudent Portal */}
              <div className="d-flex portalIcon col-11 text-white align-items-end justify-content-center py-2  mx-3 " id="sideTitleIcon"
                >            
                <FaSchoolFlag className=" d-flex  border-danger text-end  col-3"
                  style={{fontSize:"40px"}} />

                <div className="col-9 p-0  border-danger text-start fw-bold " 
                style={{fontSize:"23px",textWrap:"noWrap"}}
                >
                  Student Portal
                </div>
              </div>

                {/* Dashboard */}
                <div className="dashRow row text-white" >
                <AiFillDashboard className="col-3  fs-4" />
                <div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} id="dashboard" >Dashboard</div>
                 <span className="mx-auto pt-3 my-0" style={{borderBottom:"1px solid #bfbfbf", width:"85%"}}></span>
              </div>

            {/* COMPONENT */}
       <div className="row" style={{ cursor: "pointer" ,color:" #bfbfbf",  backgroundColor: "transparent",  fontSize:"18px"}}>
      {/* Header Row */}
      <div
        id="expandIcon"
        onClick={() => setOpen(!open)} // 👈 only one toggle
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="d-flex row align-items-center"
      >
        <IoSettings className="col-3 fs-4" />
        <div id="component" className="col-7">
          Component
        </div>

        {open ? (
          <IoIosArrowDown className="col-2 fs-4 text-white" />
        ) : (
          <IoIosArrowForward className="col-2 fs-4 text-white" />
        )}
      </div>

      {/* Collapse Content */}
     <Collapse in={open}>
  <div
    id="example-collapse-text"
    className="mx-auto"
    style={{
      borderRadius: "10px",
      backgroundColor: "white",
      padding: "3% 8%",
      width: "80%",
    }}
  >
    {role === "admin" ? (
      <>
        {/* View All Student */}
        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/studentdata")}
        >
          <PiStudent className="fs-3" style={{ color: "#2050deff" }} />
          View All Student
        </div>

        {/* View All Batch */}
        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/batchdata")}
        >
          <FaUsersViewfinder className="fs-3" style={{ color: "#2050deff" }} />
          View All Batch
        </div>

        {/* View All Course */}
        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/coursedata")}
        >
          <MdMenuBook className="fs-3" style={{ color: "#2050deff" }} />
          View All Course
        </div>

        {/* View All Admission */}
        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2 text-nowrap"
          onClick={() => navigate("/admissiondata")}
        >
          <GiEntryDoor className="fs-3" style={{ color: "#2050deff" }} />
          View All Admission
        </div>
      </>
    ) : (
      <>
      {/* STudent Login */}
        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/")}
        >
          <span className="fs-3" style={{ color: "#2050deff" }}></span>
          Attendance
        </div>

        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/")}
        >
          <span className="fs-3" style={{ color: "#2050deff" }}></span>
          Schedule
        </div>

        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/optionC")}
        >
          <span className="fs-3" style={{ color: "#2050deff" }}></span>
          Progress
        </div>

        <div
          className="sidebarItem d-flex align-items-center justify-content-start gap-2"
          onClick={() => navigate("/optionD")}
        >
          <span className="fs-3" style={{ color: "#2050deff" }}></span>
          Result        
          </div>
      </>
    )}
  </div>
</Collapse>

    </div>
      
       {/* UTILITIES */}
        <div className="row dashRow">
        <FiTool className="col-3 fs-3" />
         <div className="col-9" id="utilities">Utilities</div>
          </div>

             {/* PAGES */}
              <div className=" row" style={{ cursor: "pointer" ,color:" #bfbfbf", backgroundColor: "transparent",  fontSize:"18px"}}>          
               <FaFolder className="col-3 fs-3"/>
               <div className="col-9" id="page">Page</div>
            </div>

                {/* CHART */}
                  <div className=" row" style={{ cursor: "pointer" ,color:" #bfbfbf", backgroundColor: "transparent",  fontSize:"18px"}}>
                 <FaChartArea className="col-3 fs-3"  />
                 <div  className="col-9" id="chart">Charts</div>
            </div>
            
               {/* Tables */}
            <div className="row dashRow">
                <FaTable className="col-3 fs-3"/>
                <div className="col-9" id="tables">Tables</div>
                   <span className="mx-auto pt-3 my-0" style={{borderBottom:"1px solid #bfbfbf", width:"85%"}}></span>
            </div>
                 
              
                 {/* Sign Out */}
            <div className="row signOut dashRow  pb-4"
           
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