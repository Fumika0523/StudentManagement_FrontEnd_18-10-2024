import axios from "axios"
import { useEffect, useState } from "react"
import { url } from "../utils/constant"
import { useNavigate } from "react-router-dom"

function ProfileForm(){
const navigate = useNavigate()
//dateString is a parameter, its accpeting the birthdate
const formatDate = (dateString) => {
    const date = new Date(dateString); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // showing only year, month, day in number
    return date.toLocaleDateString('en-US', options); // show in US date style
    };

const [userData,setUserData] = useState([])

const token = sessionStorage.getItem('token')
console.log(token)

let config = {
    headers:{
        Authorization: `Bearer ${token}`
    }
}

const getUserData=async()=>{
    console.log("User Data is called...")
    let res = await axios.get(`${url}/users/profile`,config)
    console.log(res.data.userData)
    setUserData(res.data.userData)
}

useEffect(()=>{
    getUserData()
},[]) // API call has to be made inside useEffect() only
console.log(userData)

//destructuring of the object
const {username,email,password,phoneNumber,gender,birthdate}=userData

    return(
        <>   
            <div style={{width:"90%",marginLeft:"5%",marginRight:"5%"}} className="py-4 ">
              {/* Top Section */}
              <div className='fs-4 text-center'>Personal info</div>
              <div style={{fontSize:"100%"}} className="text-center" > Info about you and your preferences across Student Management Service</div>
              
              {/* 2nd Section */}
              <div className='p-2 d-flex'>
                <div>
              <div className='fs-4 mt-3' >Your profile info in Student Manag. Services</div>
              <div className='mt-2' style={{fontSize:"100%"}}>Personal info and options to manage it. You can make some of this info, like your contact details, visible to others so they can reach you easily. You can also see a summary of your profiles.</div></div>
              <img src="https://www.gstatic.com/identity/boq/accountsettingsmobile/profile_scene_visible_720x256_ee5ae234eb96dc206b79c851f41a6f69.png" alt="" style={{width:"45%", height:"120px"}} />
              </div>
      
              {/* Basic Info */}
              <div className='p-3 border border-secondary-subtle rounded my-3' >
                  <div className='pb-1 fs-5'>Basic Info</div>
                  <div className='pb-3 text-secondary' style={{fontSize:"80%"}}>Some info may be visible to other people using Student Management services.</div>
                  <div className='d-flex border-bottom border-secondary-subtle text-secondary' style={{fontSize:"80%"}}>
                  <div style={{width:"30%"}}>Profile picture</div>
                  <div style={{width:"60%"}} >Add a profile picture to personalize your account</div>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrwa1p11xv_cq1ewqCn-67LO9-s41ocGYbdTILrcGusD5B_f8xO5-hkW8&s" alt="" style={{width:"7%"}} className='rounded-circle pb-1'/>
                  </div>
                  {/* Username */}
                  <div className='border-bottom border-secondary-subtle d-flex text-secondary py-3' style={{fontSize:"80%"}}>
                  <div style={{width:"30%"}}>Username</div>
                  <div onClick={()=>{navigate('/usernameform')}} >{username}</div>
                  </div>

                     {/* Birthday */}
                     <div className='border-bottom border-secondary-subtle d-flex text-secondary py-3' style={{fontSize:"80%"}}>
                  <div style={{width:"30%"}}>Birthday</div>
                   {/*  calling formatDate() function */}
                  <div onClick={()=>{navigate('/birthdateform')}}>{formatDate(birthdate)}</div> 
                  </div>

                     {/* Gender*/}
                     <div className='d-flex text-secondary pt-3' style={{fontSize:"80%"}}>
                  <div style={{width:"30%"}}>Gender</div>
                  <div onClick={()=>{navigate('/genderform')}} >{gender}</div>
                  </div>
              </div>
      
              {/* Contact info */}
              <div className=' mt-4 border border-secondary-subtle rounded p-3' >
                  <div className='pb-2 fs-5'>Contact info</div>
                  <div className='py-3 d-flex text-secondary border-bottom border-secondary-subtle'style={{fontSize:"80%"}}>
                      <div style={{width:"30%"}}>Email</div>
                      <div style={{width:"70%"}} >{email}</div>
                  </div>
                  <div className='d-flex text-secondary border-bottom border-secondary-subtle py-3' style={{fontSize:"80%"}}>
                      <div style={{width:"30%"}}>Phone</div>
                      <div style={{width:"70%"}}>{phoneNumber}</div>
                  </div>
              </div>

              {/* Other info */}
              <div  className="py-4 px-2 d-flex">
            <div>
              <div style={{fontSize:"160%"}}> Other info and preferences</div>
                <div className="py-1"> Ways to verify it’s you and settings for the web</div></div>
                <img src="https://www.gstatic.com/identity/boq/accountsettingsmobile/profile_scene_preferences_720x256_b83e731b89910d1e55bbe298246b0a12.png" alt="" style={{width:"45%"}}/>
                </div>
                
                
                {/* Password */}
              <div className="border border-secondary-subtle rounded p-3">
                  <div className="fs-5">Password</div>
                  <div className="text-secondary" style={{fontSize:"80%"}}>A secure password helps protect your Student Management Account</div>
                  <div style={{fontSize:"70%"}}>Last changed Jul 19,2023</div>
              </div>
              </div>
        </>
    )
}

export default ProfileForm

//|Profile info , Profile image, basic info contact info, password