import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React, { useEffect } from "react";
import Form from 'react-bootstrap/Form';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { url } from '../utils/constant';
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from 'react-toastify';


function StaffSignIn() {

const searchParams = new URLSearchParams(window.location.search);
const redirect = searchParams.get("redirect");
const batchId = searchParams.get("batchId");

// If user is already logged in AND redirect params exist → redirect NOW
useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && (role === 'admin' || role === 'staff')) {
        if (redirect && batchId) {
            const targetUrl = `${redirect}?batchId=${batchId}`;
            console.log(" AUTO REDIRECT TO APPROVAL PAGE:", targetUrl);
            window.location.href = targetUrl;
        } else {
            window.location.href = '/studentdata';
        }
    }
}, []);


    const formSchema = Yup.object().shape({
        password: Yup.string().required(),
        username: Yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log('📝 Form submitted with values:', values);
            postSignInUser(values)
        }
    })

    const navigate = useNavigate()

    const postSignInUser = async (loginUser) => {
        console.log('Calling Signin API');
        
        try {
            console.log('Calling API:', `${url}/signin`);
            const res = await axios.post(`${url}/signin`, loginUser)
            console.log(' Login API success:', res.data);
            
            // Save to localStorage
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('username', res.data.user.username)
            localStorage.setItem('role', res.data.role)
            console.log(' Saved to localStorage');
            
            if (res.data.token) {
                toast.success(res.data.message);
                console.log(' Authentication state updated');
            }

            // Get redirect params
            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get("redirect");
            const batchId = searchParams.get("batchId");

            console.log(' === After Login - Checking Redirect ===');
            console.log(' Current URL:', window.location.href);
            console.log(' Search params:', window.location.search);
            console.log(' Redirect param:', redirect);
            console.log(' BatchId param:', batchId);

            // Redirect after successful login
            if (redirect && batchId) {
                const targetUrl = `${redirect}?batchId=${batchId}`;
                console.log(' Redirecting to:', targetUrl);
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            } else {
                console.log(' No redirect params, going to default');
                console.log(' Redirecting to: /studentdata');
                
                setTimeout(() => {
                    window.location.href = '/studentdata';
                }, 500);
            }

        } catch (e) {
            console.error('Login Error:', e);
            console.error('Error response:', e.response?.data);
            
            if (e.response?.data?.message) {
                toast.error(e.response?.data?.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
        
        console.log(' === End of Login Process ===');
    }

    console.log(' Rendering StaffSignIn component');

    const handleGoogleLogin = () => {
    console.log("Please login with Google")
    window.location.href="http://localhost:8001/auth/google/"
};


    return (
        <>
            <div className='signInStyle  justify-content-center d-flex container-fluid min-vh-100 align-items-center'>
                <div className='row justify-content-center  flex-column align-items-center w-100 gap-4'>
                    {/* TITLE */}
                    <Form onSubmit={formik.handleSubmit} className='signinCard  col-12 col-sm-7 col-md-6 col-lg-4  px-4'>
                        <div className="row  ">
                            <h2 style={{ fontSize: "30px" }} className=" d-flex justify-content-center align-items-center" >
                                <FcVoicePresentation className='mb-1' style={{ fontSize: "55px" }} /> Staff Sign In
                            </h2>
                        </div>
                        {/* Username */}
                        <div className='row '>
                            <Form.Group className=' text-start'>
                                <Form.Label className='formLabel m-0'>Username</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange} 
                                />
                            </Form.Group>
                        </div>
                        {/* Password*/}
                        <div className='row   '>
                            <Form.Group className='col-12 text-start'>
                                <Form.Label className='formLabel m-0'>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange} 
                                />
                            </Form.Group>
                        </div>
                        {/* Sign In Button */}
                        <div className="row d-flex justify-content-center">
                            <Button 
                                type="submit" 
                                className="sign-Btn fw-bold my-4" 
                                style={{ fontSize: "18px", width: "94%", outline: "none", border: "none" }}
                            >
                                SIGN IN
                            </Button>
                        </div>
                        {/* or sign up */}
                        <div className='row  p-1'>
                            <div className='text-center message'>Or Sign Up Using</div>
                        </div>
                        {/* Icons */}
                        <div className="row  p-1">
                            <div className='gap-2 fs-5 mt-3 d-flex' style={{ justifyContent: "center" }}>
                                {/* Facebook */}
                                <FacebookIcon className="socialIcons" sx={{ color: "navy" }} />
                                {/* LinkedIn */}
                                <LinkedInIcon className="socialIcons" sx={{ color: "#0077B5" }} />
                                {/* GitHub */}
                                <GitHubIcon className="socialIcons" />
                                {/* Google */}
                                <GoogleIcon sx={{ color: "#ea4335" }} className="socialIcons" />
                            </div>
                        </div>
                    </Form>
                

                    <div className='signinCard2 col-12 col-sm-7 col-md-6 col-lg-4 d-flex  justify-content flex-row'>
                        <div className='text-center message' >Don't have account? &nbsp;</div>
                        <div>
                            <Link 
                                className='link-underline link-underline-opacity-0 text-center'
                                to='/staff-signup' 
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffSignIn