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


function SideBar() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const iconStyle={
        marginLeft:"3%",
        marginRight:"7%",
        fontSize:"20px",
        color: "#bfbfbf",
    }

    const sideBarStyle = {
        width: "19% ",
        height: "100vh",
        backgroundColor: "#4e73df",
        // padding:"1% 0%",
        textAlign:"start",
        position:"sticky",
        top:"0",
        overFlow: "hidden",
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


    const navigate = useNavigate()
    return (
        <>
            <div style={sideBarStyle} >
                <Container >
                <div className="text-white fw-bold py-3 ps-4" style={{borderBottom:"1px solid #bfbfbf",fontSize:"18px"}}><PiStudentBold className="me-1" style={{fontSize:"40px"
                }}/>STUDENT ADMIN</div>
                <div className="text-white fw-bold" onClick={() => { navigate('/dashboard') }} style={{borderBottom:"1px solid #bfbfbf", padding:"10% 0",fontSize:"17px",cursor: "pointer"}} ><AiFillDashboard className="ms-2 me-3" />Dashboard</div>

        {/* COMPONENT */}

        <div className="sideBarHover1 mb-2 text-start  d-flex ">   
        <div onClick={() => setOpen(!open)}  aria-controls="example-collapse-text"  aria-expanded={open}>
      <IoSettings className="ms-2 me-3"/>
      Component
      <ExpandMore  onClick={handleExpandClick} className="ms-5" >
        <ExpandMoreIcon className="text-white " aria-expanded={expanded} aria-label="show more" expand={expanded} style={{textAlign:"right"}}/>
    
          </ExpandMore>
         </div></div>
   
      <Collapse in={open}>
       <div id="example-collapse-text" style={{borderRadius:"10px", backgroundColor:"white",padding:"0", marginBottom:"2%",width:"250px"}}>
        <div className="btn btn-no-outline "  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={() => { navigate('/studentdata') }} >
            View All Student
        </div>
        <div className="btn btn-no-outline "  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/batchdata')}}>
            View All Batch
        </div>
        <div className="btn btn-no-outline "  style={{ fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%" }} onClick={()=>{navigate('/coursedata')}}>
            View All Course
        </div>
        
        <div className="btn btn-no-outline"
        style={{fontSize: "90%",width:"100%",textAlign:"start",padding:"3% 10%"}}
        onClick={()=>{navigate('/admissiondata')}}>
          View All Admission
        </div>
        </div>
      </Collapse>
                {/* UTILITIES */}
                <div className="sideBarHover1">
                    <div  className="sideBarHover" ><FiTool className="ms-2 me-3" />Utilities</div>
                    </div>
                <div style={{ borderBottom:"1px solid #bfbfbf",paddingTop:"10%"}}></div>
                {/* <div style={titleStyle} >ADDONS</div> */}
                   
                {/* PAGES */}
                <div className="sideBarHover1">
                <div  className="sideBarHover"><FaFolder className="ms-2 me-3"  />Pages</div></div>

                {/* CHART */}
                <div className="sideBarHover1">
                <div  className="sideBarHover"><FaChartArea className="ms-2 me-3"  />Charts</div></div>

                {/* Tables */}
                <div className="sideBarHover1">
                <div  className="sideBarHover"><FaTable className="ms-2 me-3"  />Tables</div></div>
                <div style={{ borderBottom:"1px solid #bfbfbf",paddingTop:"10%"}}></div>
                </Container>
            </div>

        </>
    )
}
export default SideBar