import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './Components/Profile/SignIn'
import SignUp from './Components/Profile/SignUp'
import { useEffect, useState } from 'react'
import ProfileForm from './Components/Profile/ProfileForm'
import { Box } from '@mui/material'
import SideBar from './HomePage/SideBar'
import NavBar from './HomePage/NavBar'
import axios from 'axios'
import UserNameForm from './Components/Profile/Edit/userNameForm'
import { url } from './Components/utils/constant'
import GenderForm from './Components/Profile/Edit/genderForm'
import BirthdateForm from './Components/Profile/Edit/birthdateForm'


function App() {
  const [userData,setUserData] = useState([])

//signin part
//initially you are not loggin,its set as false,
//when you get the token(signed in), your authentication as true
const [isAuthenticated,setIsAuthenticated]=useState(false)

//its going to render whenever there is change (signin)
useEffect(()=>{
  const token = sessionStorage.getItem('token') //if you have a token,
  console.log(token) 
  setIsAuthenticated(true) //signed in,>>authentication > true
  getUserData()
},[])

// Get Student Data
const getUserData = async()=>{
  console.log("App.jsx call")
  const token=sessionStorage.getItem('token')
  let config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
  console.log("User data is called......");
  let res = await axios.get(`${url}/users/profile`,config) //API call retrieving from users/profile
  console.log(res.data.userData)
  console.log("userData")
  setUserData(res.data.userData) //useState is updated
}

console.log(userData)

  return (
    <>
    <div className='d-flex'>
      <SideBar/>
    <Box sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
      {/* <div>Welcome to new App</div> */}
      {/* We always wannt present Homepagenav bar */}
      {/* <HomePage/>  */}
      <NavBar/>
      <Routes>
        <Route path="/profile" element={<ProfileForm />}/>
        {/* //<Route path="/homepage" element = {<HomePage/>} /> */}
        <Route path="/signin" element={<SignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/usernameform" element={<UserNameForm/>}/>
        <Route path="/genderform" element={<GenderForm />}/>
        <Route path="/birthdateform" element={<BirthdateForm/>}/>
      </Routes>
      </Box>
      </div>
    </>
  )
}

export default App
