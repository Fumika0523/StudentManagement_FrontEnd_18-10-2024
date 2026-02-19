import {
  FaFolder,
  FaChartArea,
  FaTable,
  FaPowerOff,
} from "react-icons/fa";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { FiTool } from "react-icons/fi";
import { AiFillDashboard } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { IoSettings } from "react-icons/io5";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { FaUsersViewfinder } from "react-icons/fa6";
import { GiEntryDoor } from "react-icons/gi";
import { MdMenuBook, MdGridView } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import "../SideBar/SideBar.css";

function SideBar({ isSidebarVisible = true }) {
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Resize listener for responsive behavior
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Adjust default state based on screen size
  useEffect(() => {
    if (screenWidth < 768) {
      setIsSidebarOpen(false); // mobile hidden by default
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      setIsSidebarOpen(false); // tablet collapsed
    } else {
      setIsSidebarOpen(true); // desktop expanded
    }
  }, [screenWidth]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //  Sidebar width rules
  let sidebarWidth = "0px";
  if (screenWidth < 768) {
    sidebarWidth = isSidebarVisible ? "100px" : "0px"; // mobile toggle via Navbar
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    sidebarWidth = isSidebarOpen ? "300px" : "100px"; // tablet toggle
  } else {
    sidebarWidth = isSidebarOpen ? "270px" : "100px"; // desktop toggle
  }

  return (
    <>
      <div
        className="sideBarStyle"
        style={{
          width: sidebarWidth,
          transition: "all 0.9s ",
          left: screenWidth < 768 && !isSidebarVisible ? "-150px" : "0",
        }}
      >
        {/* Toggle Button (← / →) */}
        <div className="position-relative ">
          <div
            className="hamburger-icon"
            style={{
              zIndex: "10",
              cursor: "pointer",
              position: "absolute",
              right: "0px",
              top: "0px",
              justifyContent: isSidebarOpen ? "end" : "center",
            }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <MdKeyboardDoubleArrowLeft style={{ fontSize: "40px" }} />
            ) : (
              <MdKeyboardDoubleArrowRight style={{ fontSize: "40px" }}
                className="d-none d-md-flex" />
            )}
          </div>
        </div>

        {!isSidebarOpen ? (
          <>
            <div className="portalIcon bgColor mx-4 ">
              <FaSchoolFlag />
            </div>
            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/dashboard")}
            >
              <AiFillDashboard />
            </div>

            {/* Component Section - sidebar closed*/}
           <div
            onClick={() => setOpen(!open)}
            aria-controls="collapse-mini"
            aria-expanded={open}
            id="expandIcon"
            className="sb-miniComponent mx-4 bgColor"
          >
            <MdGridView />
            <span className={`sb-miniArrow ${open ? "show" : ""}`}>
              {open ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </span>
          </div>

            {/* Collapsed Component Items */}
            <Collapse in={open}>
              <div
                id="collapse-mini"
                className="bg-white mx-auto"
                style={{ width: "60px", borderRadius: "15px" }}
              >
                {role === "admin" || role === "staff" ? (
                  <>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/studentdata")}
                      >
                        <PiStudent title="Student data"/>
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/batchdata")}
                      >
                        <FaUsersViewfinder title="Batch data"/>
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/coursedata")}
                      >
                        <MdMenuBook title="Course data"/>
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/admissiondata")}
                      >
                        <GiEntryDoor title="Admission data"/>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="my-2">
                    <div className="component-icon mx-4">
                      <IoCalendarNumberSharp className="fs-3 text-black" />
                      Attendance</div>
                  </div>
                )}
              </div>
            </Collapse>

                {/* Task */}
                <div  className="mx-4 bgColor portalIcon">
                  <FiTool className="" title="Task" />
                </div>
                     {/* Update Attendance */}
                <div className="mx-4 bgColor portalIcon"
                   onClick={() => navigate("/task")}>
                  <MdDateRange className=""  title="Update Attendance"/>
                </div>


            <div className="mx-auto mb-3 signOut" onClick={handleSignOut}>
              <FaPowerOff className="fs-2" />
            </div>
          </>
        ) : (
          /* ================= Expanded Sidebar (350px) ================= */
          <>
            <div className="d-flex portalIcon  align-items-end justify-content-center py-2 mx-auto w-100 gap-2">
              <FaSchoolFlag
                className="d-flex border-danger text-end "
                style={{ fontSize: "40px" }}
              />
              <div
                className="p-0 text-start fw-bold"
                style={{ fontSize: "23px", whiteSpace: "nowrap" }}
              >
                Student Portal
              </div>
            </div>

            <div className="dashRow row ">
              <AiFillDashboard className="col-3 fs-4" />
              <div
                className="col-9 fw-bold"
                onClick={() => navigate("/dashboard")}
                style={{ fontSize: "18px", cursor: "pointer" }}
              >
                Dashboard
              </div>
              <span
                className="mx-auto pt-3 my-0"
                style={{
                  borderBottom: "1px solid #bfbfbf",
                  width: "85%",
                }}
              ></span>
            </div>

            {/* Component (Expanded) */}
            <div
              id="expandIcon"
              onClick={() => setOpen(!open)}
              aria-controls="collapse-full"
              aria-expanded={open}
              className="d-flex align-items-center "
              style={{ cursor: "pointer", color: "#bfbfbf", fontSize: "18px", marginBottom: "" }}
            >
              <IoSettings className="col-3 fs-4" />
              <div id="component" className="col-6">
                Component
              </div>
              {open ? (
                <IoIosArrowDown className="col-3 text-white text-end p-0" />
              ) : (
                <IoIosArrowForward className="col-3 text-white" />
              )}
            </div>

            <Collapse in={open}>
              <div
                id="collapse-full"
                className="mx-auto"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  padding: "5% 8%",
                  width: "80%",
                }}
              >
                {role === "admin" || role === "staff" ?
                  (
                    <>
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/studentdata")}
                      >
                        <PiStudent className="fs-3"  />
                        Student
                      </div>
                      {/* Batch */}
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/batchdata")}
                      >
                        <FaUsersViewfinder
                          className="fs-3"
                       
                        />
                        Batch
                      </div>
                      {/* Course */}
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/coursedata")}
                      >
                        <MdMenuBook className="fs-3" />
                        Course
                      </div>
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/admissiondata")}
                      >
                        <GiEntryDoor className="fs-3" />
                        Admission
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Student Login */}
                      <div
                        className="sidebarItem d-flex align-items-center  gap-2"
                        onClick={() => navigate("/batchdata")}   >
                        <FaUsersViewfinder
                          className="fs-3"
                          style={{ color: "#2050deff" }}
                        />
                        View Batch
                      </div>
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/coursedata")}
                      >
                        <MdMenuBook className="fs-3" style={{ color: "#2050deff" }} />
                        View Attendance
                      </div>
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/coursedata")} >
                        <MdMenuBook className="fs-3" style={{ color: "#2050deff" }} />
                        Submit Task
                      </div>
                    </>
                  )}
              </div>
            </Collapse>
            {role === "admin" || role === "staff" ? (
              <>
                {/* Task */}
                <div className="row dashRow"
                 onClick={() => navigate("/task")}>
                  <FiTool className="col-3 fs-3" />
                  <div className="col-9" id="utilities">Task</div>
                </div>
                     {/* Update Attendance */}
                <div className="row dashRow"
                   onClick={() => navigate("/attendance")}>
                  <MdDateRange className="col-3 fs-3" />
                  <div className="col-9" id="utilities">Update Attendance</div>
                </div>
                
                </>)
              : (
                <>
                  {/* PAGES  Only for student */}
                  <div className="row dashRow"
                  onClick={() => navigate("/raise-query")} >
                    <IoCalendarNumberSharp className="col-3 fs-3"
                    />
                    <div className="col-9" id="page">
                      Raise Query</div>
                  </div>

                  {/* Only for student */}
                  <div className="row dashRow">
                    <FaChartArea className="col-3 fs-3" />
                    <div className="col-9" id="chart">Download Certificate</div>
                  </div>

                  {/* Only for student */}
                  <div className="row dashRow">
                    <FaTable className="col-3 fs-3" />
                    <div className="col-9" id="tables">Invoice Download</div>
                    <span className="mx-auto pt-3 my-0" style={{ borderBottom: "1px solid #bfbfbf", width: "85%" }}></span>
                  </div>
                </>
              )}

            {/* Sign out */}
            <div
              className="row signOut dashRow pb-4"
              onClick={handleSignOut}
              style={{ cursor: "pointer" }}
            >
              <FaPowerOff className="col-3 fs-3" />
              <div className="col-9">Sign Out</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SideBar;
