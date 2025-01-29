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
              padding:isSidebarOpen ? "0% 1.5%":"0",
            }}
             id="sideWidth">
            <Container >
                <div className="row smallSideRow mb-4 ">
                <div className="hamburger-icon text-white"
                  style={{position:"absolute",zIndex:1000,cursor:"pointer",
                    textAlign: isSidebarOpen ? "left" : "center",
                    display: isSidebarOpen ? "flex" : "flex",
                    justifyContent: isSidebarOpen ? "end" : "center",
                    alignContent:"center",
                    right:isSidebarOpen ? "10px" : "0px",
                    // bottom:isSidebarOpen ? "0px" : "5%",
                  }}
                    onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                    <MdKeyboardDoubleArrowRight style={{fontSize:"40px"}}/>
            </div>
              </div>
               {!isSidebarOpen ?
              <>

              {/* Student Icon */}
              <div className="row smallSideRow"
              style={{paddingTop:isSidebarOpen ? "0px" : "15px"}}>
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
      <div className="row"  
      id="expandIcon" 
      onClick={handleExpandClick}
      >
          <div
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className="d-flex align-items-center justify-content-end gap-0 p-0"
            style={{flexDirection:"row"}}
          >
            
            <MdGridView 
             
            className=" smallSidebarIcon" style={{fontSize:"50px",color:"white",paddingLeft:"5px",}} />

              { expanded?
                  
                  <IoIosArrowDown  className="text-white fs-4"/>
                    :
                  <IoIosArrowForward className="text-white fs-4"/>
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
              <div className="row smallSideRow">
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
                <div className="row dashRow row align-items-center text-white" >
                <AiFillDashboard className="col-3  fs-5" /><div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} id="dashboard" >Dashboard</div>
                </div>

        {/* COMPONENT */}
        <div
        className="row dashRow Component"
         onClick={() => setOpen(!open)}  aria-controls="example-collapse-text"  
         aria-expanded={open}>
      <IoSettings className="col-3 p-0"/>
      <div id="component" className="col-7 ps-2">
      Component</div>
      <ExpandMore id="expandIcon" className="col-2 p-0"onClick={handleExpandClick} 
       >    
      <ExpandMoreIcon className="text-white " aria-expanded={expanded} aria-label="show more" expand={expanded} style={{textAlign:"right"}}/>
    </ExpandMore>
       <Collapse in={open}>
       <div id="example-collapse-text" 
       style={{borderRadius:"10px", backgroundColor:"white",color:"black",padding:"3%", margin:"2% 10% 0% 10%",width:"220px"
       }
       }       >
        <div className="sidebarItem"   onClick={() => { navigate('/studentdata') }} >
            View All Student
        </div>
        <div className="sidebarItem"  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/batchdata')}}>
            View All Batch
        </div>
        <div className="sidebarItem"  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/coursedata')}}>
            View All Course
        </div>
        
        <div className="sidebarItem"
        style={{fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%"}}
        onClick={()=>{navigate('/admissiondata')}}>
          View All Admission
        </div>
        </div>
      </Collapse>
      </div>

      <div className="row dashRow ">
            {/* UTILITIES */}
         <FiTool className="col-3" />
         <div className="col-9" id="utilities">Utilities</div>
      </div>
      <div className="row dashRow ">
             {/* PAGES */}
               <FaFolder className="col-3"/>
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