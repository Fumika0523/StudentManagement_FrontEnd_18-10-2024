import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  Box,
} from "@mui/material";

import {
  ToastContainer,
  Zoom,
} from "react-toastify";

import "./App.css";


// ========================================
// PROFILE
// ========================================

import ViewProfile from "./Components/Profile/ViewProfile";

import UserNameForm from "./Components/Profile/Edit/userNameForm";
import GenderForm from "./Components/Profile/Edit/genderForm";
import BirthdateForm from "./Components/Profile/Edit/birthdateForm";
import PhoneNumberForm from "./Components/Profile/Edit/phoneNumberForm";
import PasswordForm from "./Components/Profile/Edit/passwordForm";


// ========================================
// DASHBOARD
// ========================================

import DashboardCard from "./Components/Dashboard/DashBoardPage/dashboardCard";


// ========================================
// STUDENT / COURSE / BATCH / ADMISSION
// ========================================

import ViewStudent from "./Components/StudentData/ViewStudent";

import ViewBatch from "./Components/BatchData/viewBatch";

import ViewCourse from "./Components/CourseData/ViewCourse";

import ViewAdmission from "./Components/AdmissionData/viewAdmission";


// ========================================
// AUTHENTICATION
// ========================================

import StudentOrStaff from "./Signin-Singup/StudentOrStaff";

import StaffSignIn from "./Signin-Singup/Staff/StaffSignIn";

import StudentSignIn from "./Signin-Singup/Student/StudentSignIn";

import StudentSignUp from "./Signin-Singup/Student/StudentSignUp";

import StaffSignUp from "./Signin-Singup/Staff/StaffSignUp";


// ========================================
// LAYOUT
// ========================================

import NavBar from "./HomePage/NavBar/NavBar";

import SideBar from "./HomePage/SideBar/SideBar";


// ========================================
// OTHER FEATURES
// ========================================

import ApprovePage from "./Components/BatchData/AdminApproval/ApprovePage";

import {
  UpdateAttendance,
} from "./Components/Attendance/UpdateAttendance";

import ShowAttendance from "./Components/Attendance/ShowAttendance";

import BulkLoadButtons from "./Components/Bulkload/TestBulkLoadButtons";

import ViewTask from "./Components/Task/ViewTask";


/*
 * IMPORTANT:
 *
 * StudentPage was a duplicate folder and we deleted it.
 *
 * RaiseQuery now correctly comes from StudentOnlyPage.
 */
import RaiseQuery from "./Components/StudentOnlyPage/RaiseQuery";


// ========================================
// APP
// ========================================

function App() {
  /*
   * localStorage.getItem() returns:
   *
   * string | null
   *
   * TypeScript understands this automatically.
   */
  const token =
    localStorage.getItem(
      "token"
    );


  const role =
    localStorage.getItem(
      "role"
    );


  const location =
    useLocation();


  const navigate =
    useNavigate();


  // ========================================
  // MOBILE SIDEBAR STATE
  // ========================================

  const [
    isSidebarVisible,
    setIsSidebarVisible,
  ] =
    useState<boolean>(
      false
    );


  // ========================================
  // GOOGLE OAUTH SUCCESS HANDLER
  // ========================================

  /*
   * Expected student OAuth callback:
   *
   * /oauth-success?token=JWT&role=student
   */
  useEffect(() => {
    if (
      location.pathname !==
      "/oauth-success"
    ) {
      return;
    }


    const params =
      new URLSearchParams(
        location.search
      );


    const oauthToken =
      params.get(
        "token"
      );


    const oauthRole =
      params.get(
        "role"
      );


    // ========================================
    // INVALID OAUTH RESPONSE
    // ========================================

    if (
      !oauthToken ||
      oauthRole !== "student"
    ) {
      localStorage.clear();


      navigate(
        "/signin",
        {
          replace:
            true,
        }
      );


      return;
    }


    // ========================================
    // VALID STUDENT LOGIN
    // ========================================

    localStorage.setItem(
      "token",
      oauthToken
    );


    localStorage.setItem(
      "role",
      oauthRole
    );


    navigate(
      "/dashboard",
      {
        replace:
          true,
      }
    );
  }, [
    location.pathname,
    location.search,
    navigate,
  ]);


  // ========================================
  // UI
  // ========================================

  return (
    <>
      {/* ========================================
          AUTHENTICATED LAYOUT
      ======================================== */}

      {token && (
        <div
          className="d-flex flex-row"
          style={{
            width:
              "100vw",

            maxWidth:
              "100vw",

            overflow:
              "hidden",

            height:
              "100vh",
          }}
        >
          {/* ========================================
              SIDEBAR
          ======================================== */}

          <SideBar
            isSidebarVisible={
              isSidebarVisible
            }
            onClose={() => {
              setIsSidebarVisible(
                false
              );
            }}
          />


          {/* ========================================
              MAIN CONTENT
          ======================================== */}

          <div
            className="backgroundDesign d-flex flex-column"
            style={{
              flex:
                1,

              maxWidth:
                "100%",

              overflow:
                "hidden",
            }}
          >
            {/* ========================================
                NAVBAR
            ======================================== */}

            <NavBar
              toggleSidebar={() => {
                setIsSidebarVisible(
                  (
                    previous
                  ) =>
                    !previous
                );
              }}
            />


            {/* ========================================
                PAGE CONTENT
            ======================================== */}

            <Box
              sx={{
                flexGrow:
                  1,

                display:
                  "flex",

                flexDirection:
                  "column",

                width:
                  "100%",

                maxWidth:
                  "100%",

                overflowX:
                  "hidden",

                overflowY:
                  "auto",
              }}
            >
              <Routes>
                {/* ========================================
                    COMMON AUTHENTICATED ROUTES
                ======================================== */}

                <Route
                  path="/buttons"
                  element={
                    <BulkLoadButtons />
                  }
                />




                {/* ========================================
                    ADMIN / STAFF ROUTES
                ======================================== */}

                {role === "admin" ||
                role === "staff" ? (
                  <>
                    <Route
                      path="/approve"
                      element={
                        <ApprovePage />
                      }
                    />


                    <Route
                      path="/studentdata"
                      element={
                        <ViewStudent />
                      }
                    />


                    <Route
                      path="/batchdata"
                      element={
                        <ViewBatch />
                      }
                    />


                    <Route
                      path="/coursedata"
                      element={
                        <ViewCourse />
                      }
                    />


                    <Route
                      path="/admissiondata"
                      element={
                        <ViewAdmission />
                      }
                    />


                    <Route
                      path="/dashboard"
                      element={
                        <DashboardCard />
                      }
                    />


                    <Route
                      path="/attendance"
                      element={
                        <UpdateAttendance />
                      }
                    />


                    <Route
                      path="/view-attendance"
                      element={
                        <ShowAttendance />
                      }
                    />


                    <Route
                      path="/profile"
                      element={
                        <ViewProfile />
                      }
                    />


                    <Route
                      path="/task"
                      element={
                        <ViewTask />
                      }
                    />


                    <Route
                      path="/"
                      element={
                        <Navigate
                          to="/dashboard"
                        />
                      }
                    />
                  </>
                ) : (
                  <>
                    {/* ========================================
                        STUDENT ROUTES
                    ======================================== */}

                    <Route
                      path="/raise-query"
                      element={
                        <RaiseQuery />
                      }
                    />


                    <Route
                      path="/profile"
                      element={
                        <ViewProfile />
                      }
                    />


                    <Route
                      path="/usernameform"
                      element={
                        <UserNameForm />
                      }
                    />


                    <Route
                      path="/genderform"
                      element={
                        <GenderForm />
                      }
                    />


                    <Route
                      path="/birthdateform"
                      element={
                        <BirthdateForm />
                      }
                    />


                    <Route
                      path="/phonenumberform"
                      element={
                        <PhoneNumberForm />
                      }
                    />


                    <Route
                      path="/passwordform"
                      element={
                        <PasswordForm />
                      }
                    />
                  </>
                )}
              </Routes>
            </Box>
          </div>
        </div>
      )}


      {/* ========================================
          PUBLIC ROUTES
      ======================================== */}

      <Routes>
        {/*
         * OAuth callback must always be available,
         * including before a token has been stored.
         */}
        <Route
          path="/oauth-success"
          element={
            null
          }
        />


        <Route
          path="/"
          element={
            <StudentOrStaff />
          }
        />


        <Route
          path="/student-signin"
          element={
            <StudentSignIn />
          }
        />


        <Route
          path="/student-signup"
          element={
            <StudentSignUp />
          }
        />


        <Route
          path="/staff-signin"
          element={
            <StaffSignIn />
          }
        />


        <Route
          path="/staff-signup"
          element={
            <StaffSignUp />
          }
        />
      </Routes>


      {/* ========================================
          TOAST NOTIFICATIONS
      ======================================== */}

      <ToastContainer
        transition={
          Zoom
        }
        autoClose={
          2000
        }
        theme="light"
        draggable
      />
    </>
  );
}

export default App;