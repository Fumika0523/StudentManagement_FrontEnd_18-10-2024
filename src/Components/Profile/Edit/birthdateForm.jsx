import { Box } from "@mui/material";
import axios from "axios";
import { Form, Formik, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { url } from "../../utils/constant";


function birthdateForm() {
    const [userData, setUserData] = useState([])

    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
    birthdate :Yup.date().required()       
})
console.log(userData?.birthdate) // checking if the data is stored to userData or not

const formik=useFormik({
    initialValues:{
        birthdate:userData.birthdate || ""
    },
    enableReinitialize: true, //if there is any update in my initial value, please make it update >> enable > true
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

    const updateProfile = async(updatedProfile)=>{
        console.log("birthdate posted to the DB")
        console.log("update birthdate:",updatedProfile)
    
    let res = await axios.put(`${url}/users/profile`,updatedProfile,config)
    console.log(res)
    if(res){
        navigate('/profile')
    }}


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // showing only year, month, day in number
        return date.toLocaleDateString('en-US', options); // show in US date style
    };


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

    return (
        <>
            <div className="m-5 p-3 border border-secondary-subtle rounded" style={{ width: "80%" }}>
                <Form
                    component="form"
                    noValidate autoComplete="off"
                    onSubmit={formik.handleSubmit}>

                    {/* Birthday */}
                    <div className='border-bottom border-secondary-subtle d-flex text-secondary py-3' style={{ fontSize: "80%" }}>
                        <div style={{ width: "30%" }}>Birthday</div>
                        {/*  calling formatDate() function */}
                        {/* <div 
                        onChange={formik.handleChange}
                        value={formik.values.birthdate}>
                               {formik.errors.birthdate && formik.touched.birthdate? (
                         <div>{formik.errors.birthdate}</div>
                          ) : null }
                            {formatDate(formik.values.birthdate)}
                        </div> */}
                            <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>
                    </div>



                    <div className="mt-3 text-end" >
                        {/* Cancel */}
                        <button className="btn text-primary" style={{ fontSize: "90%" }}
                            onClick={() => {
                                navigate('/profile')
                            }}>
                            Cancel
                        </button>

                        {/* Save */}
                        <button className="btn btn-secondary px-3"
                            style={{ fontSize: "90%", borderRadius: "16px" }}
                            onClick={() => {
                                updateProfile()
                            }}>Save</button>
                    </div>
                </Form>
            </div>
        </>
    )
}
export default birthdateForm
