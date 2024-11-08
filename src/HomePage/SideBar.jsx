import { TbBackground } from "react-icons/tb"
import { IoSettings } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";
import { FaTable } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";


function SideBar(){
    const sideBarStyle={
        width:"20%",
        height:"150vh",
        backgroundColor:"#4e73df",
    }

    const sideBarFont={
        color:"#f8f9fc",
        margin:"2% 7%",
        // border:"1px solid red",
        textAlign:"start",
        padding:"4% 0"
    }
    // when you hover the options, the color changes to #fff

    const navigate = useNavigate()
    return(
        <>
        <div style={sideBarStyle} >  
        <div className="text-white border-bottom mx-3 text-center fw-bold py-3"><PiStudentBold className="fs-2" /> SB ADMIN</div>
        <div className="text-white border-bottom mx-3 py-3" onClick={()=>{navigate('/')}}><AiOutlineDashboard className="me-2 text-white" />Dashboard</div>
        <div style={{fontSize:"70%", fontWeight:"bold",color:"#bfbfbf",padding:"4% 0", margin:"2% 7%"}}>INTERFACE</div>
        <div style={sideBarFont} ><IoSettings className="me-2"/> Components</div>
        <div style={sideBarFont} className="border-bottom"><FiTool className="me-2"/>Utilities</div>
        <div style={{fontSize:"70%", fontWeight:"bold",color:"#bfbfbf",padding:"4% 0", margin:"2% 7%"}}>ADDONS</div>
        <div style={sideBarFont}><FaFolder className="me-2"/>Pages</div>
        <div style={sideBarFont}><FaChartArea className="me-2"/>Charts</div>
        <div style={sideBarFont} className="border-bottom"><FaTable className="me-2 " />Tables</div>
        </div>
        </>
    )
}
export default SideBar