import {
  FaFolder,
  FaChartArea,
  FaTable,
  FaPowerOff,
} from "react-icons/fa";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoCalendarNumberSharp } from "react-icons/io5";

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

  // 📱 Adjust default state based on screen size
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

  // 📏 Sidebar width rules
  let sidebarWidth = "0px";
  if (screenWidth < 768) {
    sidebarWidth = isSidebarVisible ? "150px" : "0px"; // mobile toggle via Navbar
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    sidebarWidth = isSidebarOpen ? "360px" : "150px"; // tablet toggle
  } else {
    sidebarWidth = isSidebarOpen ? "300px" : "150px"; // desktop toggle
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
            className="hamburger-icon text-white d-flex "
            style={{
              zIndex: "10",
              cursor: "pointer",
              // border:"2px solid red",
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

        {/* ================= Collapsed Sidebar (150px) ================= */}
        {!isSidebarOpen ? (
          <>
            <div className="portalIcon mx-3 py-1">
              <FaSchoolFlag />
            </div>

            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/dashboard")}
            >
              <AiFillDashboard />
            </div>

            {/* Component Section */}
            <div
              onClick={() => setOpen(!open)}
              aria-controls="collapse-mini"
              aria-expanded={open}
              id="expandIcon"
              style={{ cursor: "pointer", height: "25px" }}
            >
              <div className="bgColor mx-4 portalIcon smallSidebarIcon">
                <MdGridView />
              </div>
              <div
                className="arrowIcon"
                style={{
                  position: "relative",
                  top: "-32px",
                  left: "70%",
                  width: "30px",
                }}

              >
                {open ? (
                  <IoIosArrowDown className="text-white fs-5" />
                ) : (
                  <IoIosArrowForward className="text-white fs-5" />
                )}
              </div>
            </div>

            {/* Collapsed Component Items */}
            <Collapse in={open}>
              <div
                id="collapse-mini"
                className="bg-white mx-auto"
                style={{ width: "100px", borderRadius: "15px" }}
              >
                {role === "admin" || role === "staff" ? (
                  <>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/studentdata")}
                      >
                        <PiStudent />
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/batchdata")}
                      >
                        <FaUsersViewfinder />
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/coursedata")}
                      >
                        <MdMenuBook />
                      </div>
                    </div>
                    <div className="my-2">
                      <div
                        className="component-icon mx-4"
                        onClick={() => navigate("/admissiondata")}
                      >
                        <GiEntryDoor />
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

            {/* Other Menu Icons */}
            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/chartdata")}
            >
              <FaChartArea />
            </div>

            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/utilitiesdata")}
            >
              <FiTool />
            </div>

            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/pagedata")}
            >
              <FaFolder />
            </div>

            <div
              className="mx-4 bgColor portalIcon"
              onClick={() => navigate("/tabledata")}
            >
              <FaTable />
            </div>

            <div className="mx-auto mb-3 signOut" onClick={handleSignOut}>
              <FaPowerOff className="fs-2" />
            </div>
          </>
        ) : (
          /* ================= Expanded Sidebar (350px) ================= */
          <>
            <div className="d-flex portalIcon col-11 text-white align-items-end justify-content-center py-2 mx-auto">
              <FaSchoolFlag
                className="d-flex border-danger text-end col-3"
                style={{ fontSize: "40px" }}
              />
              <div
                className="col-9 p-0 text-start fw-bold"
                style={{ fontSize: "23px", whiteSpace: "nowrap" }}
              >
                Student Portal
              </div>
            </div>

            <div className="dashRow row text-white">
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
              style={{ cursor: "pointer", color: "#bfbfbf", fontSize: "18px" ,marginBottom:""}}
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
                        <PiStudent className="fs-3" style={{ color: "#2050deff" }} />
                        Student
                      </div>
                      {/* Batch */}
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/batchdata")}
                      >
                        <FaUsersViewfinder
                          className="fs-3"
                          style={{ color: "#2050deff" }}
                        />
                        Batch
                      </div>
                      {/* Course */}
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/coursedata")}
                      >
                        <MdMenuBook className="fs-3" style={{ color: "#2050deff" }} />
                        Course
                      </div>
                      <div
                        className="sidebarItem d-flex align-items-center gap-2"
                        onClick={() => navigate("/admissiondata")}
                      >
                        <GiEntryDoor className="fs-3" style={{ color: "#2050deff" }} />
                        Admission
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Student Login */}
                      <div
                        className="sidebarItem d-flex align-items-center  gap-2"
                        onClick={() => navigate("/batchdata")}
                      >
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

            {/* UTILITIES */}
            <div className="row dashRow">
              <FiTool className="col-3 fs-3" />
              <div className="col-9" id="utilities">Task</div>
            </div>

            {/* PAGES  Only for student */}
            <div className="row dashRow">
              <IoCalendarNumberSharp className="col-3 fs-3" />
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
