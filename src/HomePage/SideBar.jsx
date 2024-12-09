import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiFillDashboard } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { Container } from "react-bootstrap";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { IoSettings } from "react-icons/io5";


function SideBar() {
    const [open, setOpen] = useState(false);

    const iconStyle={
        marginLeft:"3%",
        marginRight:"7%",
        fontSize:"20px",
        color: "#bfbfbf",
    }

    const sideBarStyle = {
        width: "23%",
        height: "150vh",
        backgroundColor: "#4e73df",
        // padding:"1% 0%",
        textAlign:"start"
    }

    const sideBarFont = {
        textAlign:"start",
        color: "rgba(255, 255, 255, .8",
        width:"100%",
        height:"50px,",
        padding:"10% 0",
        border:"0px solid",
        backgroundColor:"transparent",
        fontSize:"17px"
    }

    const sideBarFontBorder = {
        textAlign:"start",
        color: "rgba(255, 255, 255, .8",
        width:"100%",
        height:"50px,",
        padding:"10% 0",
        border:"0px solid",
        fontSize:"17px",
        backgroundColor:"transparent",
        borderBottom:"1px solid #bfbfbf",
    }

    // const titleStyle={
    //   fontSize: "100%",
    //    fontWeight: "bold",
    //     color: "#bfbfbf",
    //     paddingTop:"6%",
    // }
    // when you hover the options, the color changes to #fff

    const navigate = useNavigate()
    return (
        <>
            <div style={sideBarStyle} >
                <Container >
                <div className="text-white fw-bold py-3 ps-4" style={{borderBottom:"1px solid #bfbfbf",fontSize:"18px"}}><PiStudentBold className="me-1" style={{fontSize:"40px"
                }}/>STUDENT ADMIN</div>
                <div className="text-white fw-bold" onClick={() => { navigate('/') }} style={{borderBottom:"1px solid #bfbfbf", padding:"10% 0",fontSize:"17px",cursor: "pointer"}} ><AiFillDashboard className="ms-2 me-3" />Dashboard</div>

        {/* COMPONENT */}
        <div className="sideBarHover1">   
        <div onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>
        <IoSettings className="ms-2 me-3" />Component</div></div>
      <Collapse in={open}>
       <div id="example-collapse-text" style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"white",padding:"1% 0", marginBottom:"2%"}}>
        <div className="btn btn-no-outline border-white" id="example-collapse-text" style={{ fontSize: "90%", padding: "5% 10%" }} onClick={() => { navigate('/studentdata') }} >
        View All Student
        </div>
          <div id="example-collapse-text" style={{ fontSize: "90%", padding: "5% 10%" }} >
            Card
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