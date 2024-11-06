import * as Yup from "yup";
import { useFormik } from 'formik'
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { url } from "../../utils/constant";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';


function passwordForm(){
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [passwordShow,setPasswordShow]=useState(false)

    const handleExpandClick=()=>{
        setPasswordShow(!passwordShow)
    }
    console.log(passwordShow)

    const [userData,setUserData]=useState([]) //useState valiable

    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
        password:Yup.string().required()
    })
    console.log(userData?.password) //checking if the data is stored or not

    //useFormik,
    const formik=useFormik({
        initialValues:{
            //  || << or operator, if you dont have password, pass empty string
            password:userData.password || ""
        },
        enableReinitialize: true, //if there is any update in my initial value, please make it update >> enable > true
        onSubmit:(values)=>{
            console.log(values)
            updateProfile(values)
     }})
      
    const token = sessionStorage.getItem('token')
    console.log('token')

    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }

    const updateProfile=async(updatedProfile)=>{
        console.log("Password posted to the DB")
        console.log("Update Password:",updatedProfile)
    
    let res = await axios.put(`${url}/users/profile`,updatedProfile,config)
    console.log(res)
    if(res){
        // When there is a response, it should b navigated to progile page
       navigate('/profile')
    }}

    const getUserData=async()=>{
        console.log("User data is called")
        let res = await fetch(`${url}/users/profile`,config)
        let data = await res.json()
        console.log(data.userData)
        setUserData(data?.userData)
    }
    useEffect(()=>{
        getUserData()
    },[])
    //console.log(userData.userData)
   

    return(
    <>
    <div className="m-5 p-3 border border-secondary-subtle rounded" style={{width:"80%"}}>
    <div style={{fontSize:"90%"}}>Changes to your name will be reflected across your Google Account. Your previous name may still be searchable or appear on old messages.</div>
    <Box
    component="form"
    noValidate autoComplete="off"
    className="p-4"
     onSubmit={formik.handleSubmit}
    >
    {/* MOVIE POSTER */}
    <TextField 
    //type is attribute, storing into type
    type={passwordShow === true ? 'text' : 'password'} 
    // type="password"
    required
    label="Password"
    name="password"
    id="password"
    onChange={formik.handleChange}
    // not defaultValue >> value
    value={formik.values.password}/> 
    {formik.errors.password && formik.touched.password? (
    <div>{formik.errors.password}</div>
    ) : null }
    
    <div className="mt-2" style={{fontSize:"80%"}}> <Checkbox {...label} className="p-0" onClick={()=>handleExpandClick()}/>show Password</div>

    <div className="mt-3 text-end" >
    {/* Cancel */}
    <button className="btn text-primary" style={{fontSize:"90%"}}
    onClick={()=>{
        navigate('/profile')
    }}>
        Cancel
    </button>

    {/* Save */}
    <button className="btn btn-secondary px-3"
    style={{fontSize:"90%",borderRadius:"16px"}}
    >Save</button>
    </div>
    </Box>
    </div>
    </>
    )
}
export default passwordForm