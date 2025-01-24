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
import { GiHamburgerMenu } from "react-icons/gi";


function SideBar() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const iconStyle={
        marginLeft:"3%",
        marginRight:"7%",
        fontSize:"20px",
        color: "#bfbfbf",
    }

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(-90deg)':'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      }));

      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

      const sideBarFun = ()=>{
        document.getElementById("sideWidth").style.maxWidth = "15%";
        document.getElementById("sideTitle").style.display="none";
        document.getElementById("sideTitleIcon").style.fontSize="200px";
        document.getElementById("dashboard").style.display="none";
        document.getElementById("component").style.display="none";
        document.getElementById("expandIcon").style.display="none";
        document.getElementById("utilities").style.display="none"
        document.getElementById("page").style.display="none";
        document.getElementById("chart").style.display="none";
        document.getElementById("tables").style.display="none";
        console.log("Function is called")
      }

    const navigate = useNavigate()
    return (
        <>
            <div className="sideBarStyle" id="sideWidth">
              <div className="row">
              <GiHamburgerMenu className="text-end fs-1 my-2" onClick={()=>sideBarFun()}/>
              </div>
              <div className="row ">
          <Container >
               
                <div className="dashRow row text-white" id="sideTitleIcon"
                >
               <PiStudentBold className="text-end col-md-3 studentTitleIcon" /> 
               <div className="col-md-9 tex-start dashTitle p-0" id="sideTitle" >STUDENT ADMIN</div>
                </div>
                <div className="row dashRow row align-items-center text-white" >
                <AiFillDashboard className="col-3 fs-5" /><div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} id="dashboard" >Dashboard</div>
                </div>

        {/* COMPONENT */}
        <div
        className="row dashRow Component"
         onClick={() => setOpen(!open)}  aria-controls="example-collapse-text"  aria-expanded={open}>
      <IoSettings className="col-3 p-0"/>
      <div id="component" className="col-7 ps-2">
      Component</div>
      <ExpandMore id="expandIcon" onClick={handleExpandClick} className="col-2 p-0" >    <ExpandMoreIcon className="text-white " aria-expanded={expanded} aria-label="show more" expand={expanded} style={{textAlign:"right"}}/>
    
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
          </Container>
          </div>
            </div>
              
            
        </>
    )
}
export default SideBar