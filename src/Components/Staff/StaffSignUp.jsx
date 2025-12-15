import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import Form from 'react-bootstrap/Form';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import { url } from '../utils/constant';
import axios from 'axios';
import { FcVoicePresentation } from "react-icons/fc";


function SignUp() {

    const formSchema = Yup.object().shape({
        password: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required(),
        // phoneNumber: Yup.number().required(),  
        role: Yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: "",
            phoneNumber: "",
            birthdate:"",
            gender:"",
            role:""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            postSignUpUser(values)
        }
    })

    const navigate = useNavigate()

    const postSignUpUser = async (newUser) => {
        try{
         console.log("newUser",newUser)
        const res = await axios.post(`${url}/signup`, newUser)
        if (res.status == 200) {
            console.log("successfully signedup!")
            navigate('/staff-signin')
        }
        }catch(error){
            console.log("Sign up Error:",error.response.data || error.message)
        }
    }

    return (
        <>
            <div className='signInStyle container-fluid d-flex justify-content-center min-vh-100 align-items-center' >
                <div className='row justify-content-center align-items-center d-flex flex-column gap-4 w-100' >
               {/* 1st Card */}
                <Form className='signupCard col-10 col-sm-10 col-md-6 col-lg-5 col-xl-5 col-xxl-4 px-4' onSubmit={formik.handleSubmit} >
                    <div className="row">
                    <h2 className="d-flex justify-content-center align-items-center pb-2 fs-2" ><FcVoicePresentation  style={{fontSize:"55px"}}/> Staff Sign Up</h2>
                    </div>
                    <div className="row" >             
                        {/* Username */}
                        <Form.Group className='col-lg-6 col-sm-6 col-md-6 mb-1 ' >
                            <Form.Label className='formLabel m-0'>Username</Form.Label>
                            <Form.Control type="username" name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         {/* Email */}
                         <Form.Group className='col-md-6 col-lg-6 col-sm-6 '>
                            <Form.Label className='formLabel m-0'>Email Address</Form.Label>
                            <Form.Control type="email" name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        {/* 2ND ROW */}
                        <div className="row align-items-center d-flex"  >  
                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex flex-column justify-content-start mb-1' >

                        {/* Gender */}
                        <div className='formLabel  mb-1'>Gender</div>
           
                         <div className="d-flex flex-row  ">
                <div className="form-check">
                 <input className="form-check-input" type="radio" name="gender" id="male" value="male" 
                onChange={formik.handleChange} 
                    />
                    <label className="form-check-label" />
                     Male
                     </div>

      <div className="form-check">
        <input className="form-check-input" type="radio" name="gender" id="female" value="female"
        onChange={formik.handleChange} 
        />
        <label className="form-check-label" />
        Female
       </div>
                            </div>
                        </div>
                        
                        {/* B-Date*/}
                        <Form.Group className='col-lg-6 col-sm-6 col-md-6 mb-1'  >
                            <Form.Label className='formLabel m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         </div> 

                        {/* 3rd ROW */}
                        <div className="row mb-2">  
                        {/* Phone No.*/}
                        {/* <Form.Group className='col-lg-6 col-sm-6 col-md-6 '>
                            <Form.Label className='formLabel m-0'>Phone No.</Form.Label>
                            <Form.Control type="phoneNumber" name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                        </Form.Group>  */}
                        
                        {/* Role */}
                        <Form.Group className='col-lg-6 col-sm-6 col-md-6'>
                        <Form.Label className='formLabel m-0'>Role</Form.Label>
                        <Form.Select
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="supportTeam">Support Team</option>
                            <option value="testingTeam">Testing Team</option>
                            <option value="guest">Guest</option>
                            <option value="student">Student</option>
                        </Form.Select>
                        </Form.Group>

                        {/* Password*/}
                        <Form.Group className='col-lg-6 col-sm-6 col-md-6'>
                            <Form.Label className='formLabel m-0'>Password</Form.Label>
                            <Form.Control type="password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        <div className="row p-1">  
                        <div className='text-center'>
                        <Button type="submit" variant="outline-*" className="sign-Btn  my-3 fw-bold text-white" style={{fontSize:"18px",width:"100%",outline:"none",border:"none"}}>SIGN UP</Button>
                        </div>
                        </div> 
                        <div className="row text-center mb-1">  
                        <div className='message' >Or Sign Up Using</div>
                        </div>
                            <div className="row ">  
                            <div className='gap-2 mt-2 d-flex' style={{ justifyContent: "center" }}>
                                {/* Facebook */}
                                <FacebookIcon className="socialIcons" sx={{ color: "navy" }} />
                                {/* LinkedIn */}
                                <LinkedInIcon className="socialIcons" sx={{ color: "#0077B5" }} />
                                {/* GitHub */}
                                <GitHubIcon className="socialIcons"  />
                                {/* Google */}
                                <GoogleIcon sx={{ color: "#ea4335"}} className='socialIcons'/>
                            </div>
                            </div> 
                           
                            <div className="row d-flex justify-content-center">  
                    </div>
                </Form>

                {/* Second Card */}
            <div className='signinCard2 col-11 col-sm-10 col-md-6 col-lg-5 col-xl-5 col-xxl-4 px-4 d-flex  justify-content flex-row'>
            <div className='text-center message'>Or already have an account? &nbsp;</div>
            <Link className='link-underline link-underline-opacity-0 text-center' 
            to='/staff-signin'
            >Sign in</Link>                   
             </div>
                </div>
            </div>
        </>
    )
}

export default SignUp

// Formik
//https://colorlib.com/wp/wp-content/uploads/sites/2/free-html5-and-css3-login-forms.jpg
//Submit the value in the console
//Facebook,Google,GitHub,LinkedIn, normal login <<<<<<<< https://react-icons.github.io/react-icons/
//https://www.pngarts.com/files/5/Lines-Transparent-Background-PNG.png