import * as Yup from "yup";
import { useFormik } from 'formik'
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/constant";
import axios from "axios";
import Form from 'react-bootstrap/Form';


function genderForm(){
    const [userData,setUserData] = useState([]) // useState variable

    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
        gender:Yup.string()
    })
     console.log(userData?.gender)

    const formik=useFormik({
        initialValues:{
            gender:userData.gender || ""
        },
        enableReinitialize:true,
        onSubmit:(values)=>{
            console.log(values)
            updateProfile(values)
        }})

        const token = sessionStorage.getItem('token')
        console.log('token')

        let config={
            headers:{
                Authorization:`Bearer ${token}`
            }}

        const updateProfile=async(updatedProfile)=>{
            console.log("Gender posted to the DB")
            // console.log("Update Gender:",updatedProfile)

        let res = await axios.put(`${url}/users/profile`,updatedProfile,config)
        console.log(res)
        if(res){
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

    return(
        <>
        {/* Material UI Form > <Box> with a component form */}
        {/* If you using <Form> % formik cannot be used together > */}
        {/* Boostrap also have <Form> 
        never use the different component together. */}
        <Form className="border border-secondary-subtle rounded m-5 p-3" onSubmit={formik.handleSubmit}>
        <div>Gender</div>

        {/* MALE */}
        <div className='form-check form-check-inline'>                 
        <Form.Check type="radio" name="gender" label="Male" value="male" 
         onChange={formik.handleChange}
         checked={formik.values.gender ==="male"}
         />
         {formik.errors.gender && formik.touched.gender?(
            <div>{formik.errors.gender}</div>
         ): null }
         </div>
         {/* FEMALE */}
        <div className='form-check form-check-inline'>
        <Form.Check type="radio" name="gender" label="Female" value="female"
         onChange={formik.handleChange}
        //  if formik.values.gender is equal to female , then check
         checked={formik.values.gender === "female"}
         />
           {formik.errors.gender && formik.touched.gender?(
            <div>{formik.errors.gender}</div>
         ): null }
         </div>

         
        <div className="mt-3 text-end" >

        {/* Cancel */}
        <button className="btn text-primary" style={{fontSize:"90%"}}
        onClick={()=>{
        navigate('/profile')
         }}>
        Cancel
        </button>

        {/* Save */}
        <button type="submit" className="btn btn-secondary px-3"
        style={{fontSize:"90%",borderRadius:"16px"}}>
            Save
        </button>
        </div>
        </Form>

        </>

    
    )}

export default genderForm