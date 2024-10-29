import * as Yup from "yup";
import { useFormik } from 'formik'
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { url } from "../../utils/constant";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function userNameForm({userData}){
    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
        username:Yup.string().required()
    })
    
    const formik=useFormik({
        initialValues:{
            username:userData?.username
        },
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
        console.log("Username posted to the DB")
        console.log("Update Username:",updatedProfile)
    
    let res = await axios.put(`${url}/users/profile`,updatedProfile,config)
    console.log(res)
    if(res){
       navigate('/profile')
    }}

    const getUserData=async()=>{
        console.log("User data is called")
        let res = await fetch(`${url}/users/profile`,config)
        let data = await res.json()
        console.log(data)
        getUserData(data)
    }


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
    required
    label="Username"
    name="username"
    id="username"
    onChange={formik.handleChange}
    defaultValue={formik.values.username}/>
    {formik.errors.username && formik.touched.username? (
    <div>{formik.errors.username}</div>
    ) : null }

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
     onClick={()=>{
        updateProfile()
    }}>Save</button>
    </div>
    </Box>
    </div>
    </>
    )
}
export default userNameForm