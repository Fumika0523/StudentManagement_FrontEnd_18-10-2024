import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import ProfileForm from './Components/Profile/ProfileForm';
import { Box } from '@mui/material';
import axios from 'axios';
import UserNameForm from './Components/Profile/Edit/userNameForm';
import { url } from './Components/utils/constant';
import GenderForm from './Components/Profile/Edit/genderForm';
import BirthdateForm from './Components/Profile/Edit/birthdateForm';
import PhoneNumberForm from './Components/Profile/Edit/phoneNumberForm';
import PasswordForm from './Components/Profile/Edit/passwordForm';
import DashboardCard from './Components/Dashboard/dashboardCard';
import ViewStudent from './Components/Dashboard/StudentData/ViewStudent';
import ViewBatch from './Components/Dashboard/BatchData/viewBatch';
import ViewCourse from './Components/Dashboard/CourseData/ViewCourse';
import { ToastContainer, Zoom } from 'react-toastify';
import ViewAdmission from './Components/Dashboard/AdmissionData/viewAdmission';
import StudentOrStaff from './HomePage/StudentOrStaff';
import StaffSignIn from './Components/Staff/StaffSignIn';
import StudentSignIn from './Components/Student/StudentSignIn';
import StudentSignUp from './Components/Student/StudentSignUp';
import StaffSignUp from './Components/Staff/StaffSignUp';
import SelectCourseModal from './Components/Dashboard/StudentData/SelectCourseModal';
import ChartDisplay from './Components/Dashboard/SampleChart/ChartDisplay';

// ✅ Import new Navbar & Sidebar
import NavBar from './HomePage/NavBar/NavBar';
import SideBar from './HomePage/SideBar/SideBar';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [userData, setUserData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  State for sidebar visibility (mobile toggle)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const getUserData = async () => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let res = await axios.get(`${url}/users/profile`, config);
      setUserData(res.data.userData);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      getUserData();
    }
  }, []);


return (
  <>
    {/** Navbar & Sidebar appear only when logged in */}
    {token && (
      <>
        <div 
          className="d-flex flex-row" 
          style={{ 
            // border: "3px solid yellow",
            width: "100vw",           //  Add viewport width
            maxWidth: "100vw",        //  Prevent expansion
            overflow: "hidden",       // Hide overflow
            height: "100vh"           // Full viewport height
          }} 
        > 
          <SideBar isSidebarVisible={isSidebarVisible} />
          
          <div 
            className="backgroundDesign d-flex flex-column" 
            style={{
              flex: 1,                //  Take remaining space
              maxWidth: "100%",       //  Don't exceed parent
              overflow: "hidden"      //  Prevent expansion
            }}
          >
            <NavBar toggleSidebar={() => setIsSidebarVisible(prev => !prev)} />
            
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',          //  Full width of parent
                maxWidth: '100%',       //  Don't exceed parent
                overflowX: 'hidden',    //  Hide horizontal overflow
                overflowY: 'auto',      //  Allow vertical scroll
                padding: 2,             //  Add some padding
              }}
            >
              <Routes>
                {/* Your routes remain the same */}
                <Route path="/chartdisplay" element={<ChartDisplay />} />
                {role === 'admin' || role === 'staff' ? (
                  <>
                    <Route
                      path="/studentdata"
                      element={
                        <ViewStudent
                          isAuthenticated={isAuthenticated}
                          setIsAuthenticated={setIsAuthenticated}
                        />
                      }
                    />
                    <Route path="/batchdata" element={<ViewBatch />} />
                    <Route path="/coursedata" element={<ViewCourse />} />
                    <Route path="/admissiondata" element={<ViewAdmission />} />
                    <Route
                      path="/dashboard"
                      element={
                        <DashboardCard
                          isAuthenticated={isAuthenticated}
                          setIsAuthenticated={setIsAuthenticated}
                        />
                      }
                    />
                    <Route path="/profile" element={<ProfileForm />} />
                    <Route path="*" element={<Navigate to="/studentdata" />} />
                  </>
                ) : (
                  <>
                    <Route path="/profile" element={<ProfileForm />} />
                    <Route path="/usernameform" element={<UserNameForm />} />
                    <Route path="/genderform" element={<GenderForm />} />
                    <Route path="/birthdateform" element={<BirthdateForm />} />
                    <Route path="/phonenumberform" element={<PhoneNumberForm />} />
                    <Route path="/passwordform" element={<PasswordForm />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </>
                )}
              </Routes>
            </Box>
          </div>
        </div>
      </>
    )}

    {/* Public routes remain the same */}
    {!token && (
      <>
        <Routes>
          <Route path="/" element={<StudentOrStaff />} />
          <Route
            path="/student-signin"
            element={
              <StudentSignIn
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route path="/student-signup" element={<StudentSignUp />} />
          <Route
            path="/staff-signin"
            element={
              <StaffSignIn
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route path="/staff-signup" element={<StaffSignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    )}

    <ToastContainer transition={Zoom} autoClose={2000} theme="light" draggable />
  </>
);

}

export default App;
