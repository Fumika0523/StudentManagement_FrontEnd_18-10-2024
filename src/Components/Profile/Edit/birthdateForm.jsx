import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { Form, Formik, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { url } from "../../utils/constant";
import { IoArrowBackOutline } from "react-icons/io5";
import NavBar from "../../../HomePage/NavBar/NavBar"

function birthdateForm() {
    const [userData, setUserData] = useState([])
    const navigate = useNavigate()
    const formSchema = Yup.object().shape({
    birthdate :Yup.date().required()       
})
console.log(userData?.birthdate) // checking if the data is stored to userData or not
// console.log(userData)
const formik=useFormik({
    initialValues:{
        birthdate:userData.birthdate || ""
    },
    enableReinitialize: true, //if there is any update in my initial value, please make it update >> enable > true
    onSubmit:(values)=>{
        // console.log(values)
        updateProfile(values)
    }
})

const token = localStorage.getItem('token')
// console.log('token')

let config = {
    headers:{
        Authorization:`Bearer ${token}`
    }}

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
            //userData was empty so updated into SetUserData
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
    <NavBar />
        <div className="px-5 mt-5">
        <div className="d-flex flex-row align-items-center  border-4 gap-2">
        <IoArrowBackOutline className=" fs-2" style={{color:"gray",cursor:"pointer"}}
         onClick={()=>{
        navigate('/profile')
    }}/>
         <span className="fs-2">Update Birthday</span>
        </div>
        <div className="text-start my-4" style={{width:"75%"}}>Your birthday may be used for account security and personalization across Google services. If this Google Account is for a business or organization, use the birthday of the person who manages the account.</div>
        <div className=" p-3 border border-secondary-subtle  rounded" >
        <form onSubmit={formik.handleSubmit}>
         
            {/* Birthday */}
            <Box className="border-secondary-subtle d-flex flex-column text-secondary py-3">
                    <div className="mb-2 fs-5 text-black">Update birthday</div>
                    <div>
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
                    </div>
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
         </div>
    </>
)
}
export default birthdateForm
