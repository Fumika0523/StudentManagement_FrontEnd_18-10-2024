import { Box, Button, TextField } from "@mui/material";
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

    const getUserData=async()=>{
        console.log("User data is called")
        let res = await fetch(`${url}/users/profile`,config)
        let data = await res.json()
        console.log(data.userData)
        if (data.userData) {
            // Extract YYYY-MM-DD from the date string
            const formattedDate = data.userData.birthdate
            //if data.userData.birthdate exist, >> convert into ISOString
                ? new Date(data.userData.birthdate).toISOString().split('T')[0]  //split method,
                //otherwise make it empty
                : "";
            //spreading operator, we are updating only birthdate. the rest is remaing the same
            setUserData({ ...data.userData, birthdate: formattedDate });
        }
        // date is ISOSstring >> convert >> toISOString()
        console.log("2024-10-29T15:07:54.366Z".split('T'))
        //['2024-10-29', '15:07:54.366Z']
        console.log("2024-10-29T15:07:54.366Z".split('T')[0])
        //2024-10-29
        
    
        //we want a date and its a array,
        console.log(data.userData)
       // setUserData(data?.userData)
    }
    useEffect(()=>{
        getUserData()
    },[])

    return (
        <>
            <div className="m-5 p-3 border border-secondary-subtle rounded" style={{ width: "80%" }}>
            <form onSubmit={formik.handleSubmit}>
                {/* Material UI */}
                {/* Birthday */}
                <Box className="border-bottom border-secondary-subtle d-flex text-secondary py-3" style={{ fontSize: "80%" }}>
                    <Box style={{ width: "30%" }}>Birthday</Box>
                    <TextField
                        fullWidth
                        type="date"
                        name="birthdate"
                        value={formik.values.birthdate}
                        onChange={formik.handleChange}
                        //
                        error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                        helperText={formik.touched.birthdate && formik.errors.birthdate}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                {/* Action Buttons */}
                <Box className="mt-3 text-end">
                    {/* Cancel Button */}
                    <Button
                        variant="text"
                        color="primary"
                        style={{ fontSize: "90%" }}
                        onClick={() => navigate('/profile')}
                        type="button"
                    >
                    Cancel
                    </Button>

                    {/* Save Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ fontSize: "90%", borderRadius: "16px" }}
                        type="submit"
                    >
                    Save
                    </Button>
                </Box>
            </form>
         </div>
        </>
    )
}
export default birthdateForm
