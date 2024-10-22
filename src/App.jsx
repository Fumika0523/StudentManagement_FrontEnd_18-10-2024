import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './Components/Profile/SignIn'
import SignUp from './Components/Profile/SignUp'


function App() {

  return (
    <>
    <div>
      {/* <div>Welcome to new App</div> */}
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
      </div>
    </>
  )
}

export default App
