import Button from 'react-bootstrap/Button';
import { useFormik} from 'formik';
import * as Yup from "yup";
import React from "react";
import Form from 'react-bootstrap/Form';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { url } from '../utils/constant';
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from 'react-toastify';

function StaffSignIn({isAuthenticated,setIsAuthenticated}){

    const formSchema = Yup.object().shape({
        password:Yup.string().required(),
        username:Yup.string().required()
    })

    const formik = useFormik({
        initialValues:{
            username:"",
            password:"",
        },
        validationSchema:formSchema,
        onSubmit:(values)=>{
            //console.log(values)
            postSignInUser(values)
        }
    })

    const navigate=useNavigate()
   
    const postSignInUser=async(loginUser)=>{
    try{
        const res = await axios.post(`${url}/signin`,loginUser)
        //console.log("postSignInUser",res.data) 
       localStorage.setItem('token',res.data.token)
        localStorage.setItem('username',res.data.user.username)
         localStorage.setItem('role',res.data.role)
        if(res.data.token){
            toast.success(res.data.message);
            setIsAuthenticated(true) // signed in >> true
        }
         const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");
        const batchId = searchParams.get("batchId");
          
    console.log('🔍 Full URL:', window.location.href);
    console.log('🔍 Search params:', window.location.search);
    console.log('🔍 Redirect param:', redirect);
    console.log('🔍 BatchId param:', batchId);
            // After we save token + role
           if (redirect && batchId) {
      window.location.href = `${redirect}?batchId=${batchId}`;
    } else {
      window.location.href = '/studentdata'; // default redirect
    }

    }catch(e){
        console.log(e)
        if(e.response?.data?.message){
             toast.error(e.response?.data?.message); 
        }else{
            toast.error("Something went wrong. Please try again.");
        }
    }}

    return(
        <>
        <div className='signInStyle  justify-content-center d-flex container-fluid min-vh-100 align-items-center'>
        <div className='row justify-content-center  flex-column align-items-center w-100 gap-4'>
            {/* TITLE */}
            <Form onSubmit={formik.handleSubmit} className='signinCard  col-12 col-sm-7 col-md-6 col-lg-4  px-4'>
            <div className="row  ">
            <h2 style={{fontSize:"30px"}} className=" d-flex justify-content-center align-items-center" ><FcVoicePresentation className='mb-1' style={{fontSize:"55px"}}/> Staff Sign In</h2>
            </div>  
               {/* Username */}
            <div className='row '>
                <Form.Group className=' text-start'> 
                    <Form.Label  className='formLabel m-0'>Username</Form.Label>
                    <Form.Control type="username"  name="username" 
                    value={formik.values.username}
                    onChange={formik.handleChange} />
               </Form.Group>
            </div>
                {/* Password*/}
            <div className='row   '>
                    <Form.Group className='col-12 text-start'>
                    <Form.Label  className='formLabel m-0'>Password</Form.Label>
                    <Form.Control type="password"  name="password" 
                    value={formik.values.password}
                    onChange={formik.handleChange} />
                </Form.Group>
            </div>
                {/* Sign In Button */}
              <div className="row d-flex justify-content-center">
              <Button  type="submit" className="sign-Btn fw-bold my-4" style={{fontSize:"18px",width:"94%",outline:"none",border:"none"}}>SIGN IN</Button >
              </div>
              {/* or sign up */}
              <div className='row  p-1'>
                <div className='text-center message'>Or Sign Up Using</div>
            </div>
            {/* Icons */}
            <div className="row  p-1">
                <div className='gap-2 fs-5 mt-3 d-flex' style={{justifyContent:"center"}}>
              
                    {/* Facebook */}
                    <FacebookIcon className="socialIcons" sx={{color:"navy"}} />
                    {/* LinkedIn */}
                    <LinkedInIcon className="socialIcons" sx={{color:"#0077B5"}}/>
                    {/* GitHub */}
                    <GitHubIcon className="socialIcons" />
                    {/* Google */}
                    <GoogleIcon sx={{color:"#ea4335"}} className="socialIcons" />
                    </div>
                     </div>
            </Form>
            
            <div className='signinCard2 col-12 col-sm-7 col-md-6 col-lg-4 d-flex  justify-content flex-row'>            
            <div className='text-center message' >Don't have account? &nbsp;</div>
            <div>
            <Link className='link-underline link-underline-opacity-0 text-center' 
            to='/staff-signup' >Create an account</Link>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default StaffSignIn

// Formik
//https://colorlib.com/wp/wp-content/uploads/sites/2/free-html5-and-css3-login-forms.jpg
//Submit the value in the console
//Facebook,Google,GitHub,LinkedIn, normal login <<<<<<<< https://react-icons.github.io/react-icons/ 
//https://www.pngarts.com/files/5/Lines-Transparent-Background-PNG.png

//check the color icon

