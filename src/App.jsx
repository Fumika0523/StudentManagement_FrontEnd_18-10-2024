import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import ProfileForm from './Components/Profile/ProfileForm'
import { Box } from '@mui/material'
import axios from 'axios'
import UserNameForm from './Components/Profile/Edit/userNameForm'
import { url } from './Components/utils/constant'
import GenderForm from './Components/Profile/Edit/genderForm'
import BirthdateForm from './Components/Profile/Edit/birthdateForm'
import PhoneNumberForm from './Components/Profile/Edit/phoneNumberForm'
import PasswordForm from './Components/Profile/Edit/passwordForm'
import DashboardCard from './Components/Dashboard/dashboardCard'
import ViewStudent from './Components/Dashboard/StudentData/ViewStudent'
import ViewBatch from './Components/Dashboard/BatchData/viewBatch'
import ViewCourse from './Components/Dashboard/CourseData/ViewCourse'
import { ToastContainer } from 'react-toastify'
import { Zoom } from 'react-toastify'
import ViewAdmission from './Components/Dashboard/AdmissionData/viewAdmission'
import StudentOrStaff from './HomePage/StudentOrStaff'
import StaffSignIn from './Components/Staff/StaffSignIn'
import StudentSignIn from './Components/Student/StudentSignIn'
import StudentSignUp from './Components/Student/StudentSignUp'
import StaffSignUp from './Components/Staff/StaffSignUp'
import SelectCourseModal from './Components/Dashboard/StudentData/SelectCourseModal'


function App() {
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
// console.log("role",role)
 //if you have a token,
  const [userData,setUserData] = useState([])
const getUserData = async()=>{
  let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
  let res = await axios.get(`${url}/users/profile`,config) //API call retrieving from users/profile
  //console.log(res.data.userData)
  // console.log("userData",res.data.userData.role)
  setUserData(res.data.userData) //useState is updated
}


//signin part
//initially you are not loggin,its set as false,
//when you get the token(signed in), your authentication as true
const [isAuthenticated,setIsAuthenticated]=useState(false)

//its going to render whenever there is change (signin)
useEffect(()=>{
  // console.log(token) 
  if(token){
  setIsAuthenticated(true) //signed in,>>authentication > true
  getUserData()
   }
},[])


  return (

    <>
      <Box  sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }}  >
      <Routes>
  {token ? (
    role === "admin" ? (
      // Admin routes
      <>
        <Route path="/studentdata" element={<ViewStudent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/batchdata" element={<ViewBatch />}/>
        <Route path="/coursedata" element={<ViewCourse/>}/>
        <Route path="/admissiondata" element={<ViewAdmission/>}/>
        <Route path="*" element={<Navigate to="/studentdata" />} />
        <Route path="/profile" element={<ProfileForm />}/>
                <Route path="/dashboard" element={<DashboardCard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}/>

      </>
    ) : (
      // Student 
      <>
        <Route path="/profile" element={<ProfileForm />}/>
        <Route path="/usernameform" element={<UserNameForm/>}/>
        <Route path="/genderform" element={<GenderForm />}/>
        <Route path="/birthdateform" element={<BirthdateForm/>}/>
        <Route path="/phonenumberform" element={<PhoneNumberForm/>}/>
        <Route path="/passwordform" element={<PasswordForm/>}/>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </>
    )
  ) : (
    // Not logged in
    <>
      <Route path="/" element={<StudentOrStaff/>}/>
      <Route path="/student-signin" element={<StudentSignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
      <Route path="/student-signup" element={<StudentSignUp/>}/>   
      <Route path="/staff-signin" element={<StaffSignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
      <Route path="/staff-signup" element={<StaffSignUp/>}/>  
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )}
    
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
</Routes>
      </Box>

      <ToastContainer
      transition={Zoom}
      autoClose={2000}
      theme="light"
      draggable
      />

    </>
  )
}

export default App