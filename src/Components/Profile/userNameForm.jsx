import * as Yup from "yup";
import { useFormik } from 'formik'
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { url } from "../utils/constant";
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
        }
    })

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

        useEffect(()=>{
            getUserData()
        },[]) // API call has to be made inside useEffect() only
        console.log(userData)
    }

    

    return(
    <>
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

    {/* Save */}
    <button onClick={()=>{
        updateProfile()
    }}>Save</button>
    </Box>
    </>
    )
}
export default userNameForm