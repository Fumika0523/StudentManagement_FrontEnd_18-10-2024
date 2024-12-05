import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
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
        marginRight:"7%",
        color: "#bfbfbf",
    }

    const sideBarStyle = {
        width: "20%",
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
    }

    const titleStyle={
      fontSize: "70%",
       fontWeight: "bold",
        color: "#bfbfbf",
        paddingTop:"6%",
    }
    // when you hover the options, the color changes to #fff

    const navigate = useNavigate()
    return (
        <>
            <div style={sideBarStyle} >
                <Container >
                <div className="text-white fw-bold py-3 text-center" style={{borderBottom:"1px solid #bfbfbf"}}><PiStudentBold className="fs-1" /> SB ADMIN</div>
                <div className="text-white fw-bold" onClick={() => { navigate('/') }} style={{borderBottom:"1px solid #bfbfbf",  
        padding:"10% 0"}}><AiOutlineDashboard style={iconStyle} />Dashboard</div>
                <div style={titleStyle}>INTERFACE</div>
                {/* Component */}
                {/* <Dropdown defaultActiveKey="0" >
                        <Dropdown.Toggle style={sideBarFont}><IoSettings style={iconStyle} />Component</Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item style={{ fontSize: "90%", padding: "5% 10%" }} onClick={() => { navigate('/studentdata') }}>
                            View All Student
                        </Dropdown.Item>
                        <Dropdown.Item style={{ fontSize: "90%", padding: "5% 10%" }} >
                            Card
                        </Dropdown.Item>
                        </Dropdown.Menu>                    
              
                </Dropdown> */}
                      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        style={sideBarFont}
      >
        <IoSettings style={iconStyle} />Component
      </Button>
      <Collapse in={open}>
       <div id="example-collapse-text" style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"white",padding:"1% 0", marginBottom:"2%"}}>
       <div id="example-collapse-text" style={{ fontSize: "85%", padding: "5% 10%",fontWeight:"bold",        color: "#bfbfbf", }} >
       Custom Components: </div>
        <div className="btn btn-no-outline border-white" id="example-collapse-text" style={{ fontSize: "90%", padding: "5% 10%" }} onClick={() => { navigate('/studentdata') }} >
        View All Student
        </div>
          <div id="example-collapse-text" style={{ fontSize: "90%", padding: "5% 10%" }} >
            Card
        </div>
            </div>
      </Collapse>

                <div style={sideBarFont} ><FiTool style={iconStyle} />Utilities</div>
                <div style={titleStyle} >ADDONS</div>
                <div style={sideBarFont}><FaFolder style={iconStyle}  />Pages</div>
                <div style={sideBarFont}><FaChartArea style={iconStyle}  />Charts</div>
                <div style={sideBarFont} className="border-bottom"><FaTable style={iconStyle}  />Tables</div>
                </Container>
            </div>

        </>
    )
}
export default SideBar