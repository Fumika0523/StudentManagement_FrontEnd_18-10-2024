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
            <div className="sideBarStyle" >
                <Container >
                <div className="dashRow row text-white "
                >
               <PiStudentBold className="col-md-3 studentTitleIcon text-right" style={{textAlign:"right"}}/> <div className="col-md-9 dashTitle p-0 " >STUDENT ADMIN</div>
                </div>
                <div className="row dashRow row align-items-center text-white">
                <AiFillDashboard className="col-3 fs-5" /><div className="col-9 fw-bold" onClick={() => { navigate('/dashboard') }} style={{fontSize:"18px",cursor: "pointer"}} >Dashboard</div>
                </div>

        {/* COMPONENT */}
        <div
        className="row dashRow Component"
         onClick={() => setOpen(!open)}  aria-controls="example-collapse-text"  aria-expanded={open}>
      <IoSettings className="col-3 p-0"/>
      <div className="col-7 ps-2">
      Component</div>
      <ExpandMore  onClick={handleExpandClick} className="col-2 p-0" >    <ExpandMoreIcon className="text-white " aria-expanded={expanded} aria-label="show more" expand={expanded} style={{textAlign:"right"}}/>
    
    </ExpandMore>
       <Collapse in={open}>
       <div id="example-collapse-text" style={{borderRadius:"10px", backgroundColor:"white",padding:"3%", margin:"2% 10% 0% 10%",width:"220px"}}>
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
      </div>

      <div className="row dashRow ">
            {/* UTILITIES */}
         <FiTool className="col-3" />
         <div className="col-9">Utilities</div>
      </div>
      <div className="row dashRow ">
             {/* PAGES */}
               <FaFolder className="col-3"/>
               <div className="col-9">Page</div>
      </div>
      <div className="row dashRow">
            {/* CHART */}
                <FaChartArea className="col-3"  />
                <div  className="col-9">Charts</div>
      </div>
      
          <div className="row dashRow">
              {/* Tables */}
                <FaTable className="col-3"/>
                <div className="col-9">Tables</div>
          </div>
          </Container>
            </div>
              
            
        </>
    )
}
export default SideBar