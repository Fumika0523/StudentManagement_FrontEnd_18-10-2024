import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './Components/Profile/SignIn'
import SignUp from './Components/Profile/SignUp'
import { useEffect, useState } from 'react'

function App() {
//signin part
//initially you are not loggin,its set as false,
//when you get the token(signed in), your authentication as true
const [isAuthenticated,setIsAuthenticated]=useState(false)

//its going to render whenever there is change (signin)
useEffect(()=>{
  const token = sessionStorage.getItem('token') //if you have a token,
  console.log(token) 
  setIsAuthenticated(true) //signed in,>>authentication > true
},[])

  return (
    <>
    <div>
      {/* <div>Welcome to new App</div> */}
      <Routes>
        {/*  */}
        <Route path="/signin" element={<SignIn isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
      </div>
    </>
  )
}

export default App
