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



function App() {
  const [userData,setUserData] = useState([])
  // Get Student Data
const getUserData = async()=>{
  console.log("App.jsx call")
 
  let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
  console.log("User data is called......");
  let res = await axios.get(`${url}/users/profile`,config) //API call retrieving from users/profile
  //console.log(res.data.userData)
  console.log("userData")
  setUserData(res.data.userData) //useState is updated
}

//signin part
//initially you are not loggin,its set as false,
//when you get the token(signed in), your authentication as true
const [isAuthenticated,setIsAuthenticated]=useState(false)

//its going to render whenever there is change (signin)
useEffect(()=>{
  const token = localStorage.getItem('token') //if you have a token,
  console.log(token) 
  if(token){
  setIsAuthenticated(true) //signed in,>>authentication > true
  getUserData(token)
   }
},[])

// // Get Student Data
// const getUserData = async()=>{
//   console.log("App.jsx call")
//   const token=localStorage.getItem('token')
//   let config = {
//     headers:{
//       Authorization:`Bearer ${token}`
//     }
//   }
//   console.log("User data is called......");
//   let res = await axios.get(`${url}/users/profile`,config) //API call retrieving from users/profile
//   //console.log(res.data.userData)
//   console.log("userData")
//   setUserData(res.data.userData) //useState is updated
// }
//console.log(userData)

  return (
    <>
    {/* <div className='d-flex border border-4 border-warning'> */}
      <Box  sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }}  >
      <Routes>
      <Route path="/" element={<StudentOrStaff/>}/>
    
      {/* Protected Routes: Redirect if Not Authenticated */}

      {isAuthenticated ? (
        <>
      <Route path="/dashboard" element={<DashboardCard />}/>
      <Route path="/student-signin" element={<StudentSignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
      <Route path="/student-signup" element={<StudentSignUp/>}/>   
      <Route path="/staff-signin" element={<StaffSignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
      <Route path="/staff-signup" element={<StaffSignUp/>}/>  
        <Route path="/profile" element={<ProfileForm />}/>
        {/* <Route path="/homepage" element = {<HomePage/>} /> */}
        <Route path="/usernameform" element={<UserNameForm/>}/>
        <Route path="/genderform" element={<GenderForm />}/>
        <Route path="/birthdateform" element={<BirthdateForm/>}/>
        <Route path="/phonenumberform" element={<PhoneNumberForm/>}/>
        <Route path="/passwordform" element={<PasswordForm/>}/>
        <Route path="/studentdata" element={<ViewStudent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/batchdata" element={<ViewBatch />}/>
        <Route path="/coursedata" element={<ViewCourse/>}/>
        <Route path="/admissiondata" element={<ViewAdmission/>}/>
              
        </>
      ) : (
        // Any Path >>> Redirect  >> Home Page
        <Route path="*" element={<Navigate to = "/" />} />
      )}
      </Routes>
      </Box>

      <ToastContainer
      transition={Zoom}
      autoClose={2000}
      theme="light"
      draggable
      />
      {/* </div> */}
    </>
  )
}

export default App
