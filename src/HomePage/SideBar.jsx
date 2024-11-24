import { TbBackground } from "react-icons/tb"
import { IoSettings } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';


function SideBar() {
    const sideBarStyle = {
        width: "20%",
        height: "150vh",
        backgroundColor: "#4e73df",
    }

    const sideBarFont = {
        color: "#f8f9fc",
        margin: "2% 7%",
        // border:"1px solid red",
        textAlign: "start",
        padding: "4% 0"
    }
    // when you hover the options, the color changes to #fff

    const navigate = useNavigate()
    return (
        <>
            <div style={sideBarStyle} >
                <div className="text-white border-bottom mx-3 text-center fw-bold py-3"><PiStudentBold className="fs-2" /> SB ADMIN</div>
                <div className="text-white border-bottom mx-3 py-3" onClick={() => { navigate('/') }}><AiOutlineDashboard className="me-2 text-white" />Dashboard</div>
                <div style={{ fontSize: "70%", fontWeight: "bold", color: "#bfbfbf", padding: "4% 0", margin: "2% 7%" }}>INTERFACE</div>
                {/* <div style={sideBarFont} ><IoSettings className="me-2"/> Components</div> */}
                <Accordion style={{ margin: "8%" }} defaultActiveKey="0">
                    <Accordion.Item eventKey="0" tyle={{ backgroundColor: "transparent", padding: "0%" }} >
                        <Accordion.Header tyle={{ backgroundColor: "transparent", padding: "0%" }} ><IoSettings className="me-2" />Component</Accordion.Header>
                        <Accordion.Body style={{ fontSize: "90%", padding: "5% 10%" }} onClick={() => { navigate('/studentdata') }}>
                            View All Student
                        </Accordion.Body>
                        <Accordion.Body>
                            Card
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <div style={sideBarFont} className="border-bottom"><FiTool className="me-2" />Utilities</div>
                <div style={{ fontSize: "70%", fontWeight: "bold", color: "#bfbfbf", padding: "4% 0", margin: "2% 7%" }}>ADDONS</div>
                <div style={sideBarFont}><FaFolder className="me-2" />Pages</div>
                <div style={sideBarFont}><FaChartArea className="me-2" />Charts</div>
                <div style={sideBarFont} className="border-bottom"><FaTable className="me-2 " />Tables</div>
            </div>
        </>
    )
}
export default SideBar