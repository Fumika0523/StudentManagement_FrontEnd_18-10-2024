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
import { FcReading } from "react-icons/fc";


function SignUp() {

    const formSchema = Yup.object().shape({
        password: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required(),
        phoneNumber: Yup.number().required(),      
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: "",
            phoneNumber: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            postSignUpUser(values)
        }
    })

    const navigate = useNavigate()

    const postSignUpUser = async (newUser) => {
        console.log(newUser)
        const res = await axios.post(`${url}/signup`, newUser)
        console.log(res)
        if (res.status == 200) {
            //navigate to signin page
            navigate('/')
        }
    }

    return (
        <>
            <div className='signInStyle container-fluid' >
                <div className='row justify-content-center align-items-center d-flex flex-column gap-4' style={{margin:"6% 0%"}}>
               {/* 1st Card */}
                <Form className='signupCard col-10 col-sm-7 col-md-6 col-lg-5 col-xl-5 col-xxl-4 px-4' onSubmit={formik.handleSubmit} >
                    <div className="row">
                    <h2 className="text-center pb-2 fs-2" ><FcReading style={{fontSize:"55px"}} /> Sign Up</h2>
                    </div>
                    <div className="row" >             
                        {/* Username */}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6 mb-1 ' >
                            <Form.Label className='formLabel m-0'>Username</Form.Label>
                            <Form.Control type="username" name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         {/* Email */}
                         <Form.Group className='col-md-6 col-lg-6 col-sm-12 '>
                            <Form.Label className='formLabel m-0'>Email Address</Form.Label>
                            <Form.Control type="email" name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        {/* 2ND ROW */}
                        <div className="row d-flex align-items-center "  >  
                        <div className='col-lg-6 col-md-6 col-sm-12d-flex row-direction mb-1' >

                        {/* Gender */}
                        <div className='formLabel mb-1'>Gender</div>
                        {/* <div className='d-flex flex-row align-items-center justify-content-start border border-primary p-0'>
                        <div className='mt-2 col-sm-7 d-flex flex-row border border-warning'>                 
                        <Form.Check className='border border-danger form-check-input' type="radio" name="gender"   label={`Male`}
                        value="male"
                        onChange={formik.handleChange} /></div>
                        <div className='form-check mt-2'>
                        <Form.Check 
                        type="radio" name="gender" label={`Female`}
                        value="female" 
                        onChange={formik.handleChange} /></div> */}
                            {/* </div> */}
    <div className="col-sm-7 d-flex gap-3 flex-row  ">
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
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6 mb-1'  >
                            <Form.Label className='formLabel m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         </div> 

                        {/* 3rd ROW */}
                        <div className="row mb-2">  
                        {/* Phone No.*/}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6 '>
                            <Form.Label className='formLabel m-0'>Phone No.</Form.Label>
                            <Form.Control type="phoneNumber" name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                        </Form.Group> 
                        {/* Password*/}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6'>
                            <Form.Label className='formLabel m-0'>Password</Form.Label>
                            <Form.Control type="password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        <div className="row p-1">  
                        <div className='text-center'>
                        <div type="submit" variant="outline-*" className="sign-Btn my-3 fw-bold text-white" style={{fontSize:"18px"}}>SIGN UP</div></div>
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
                <div className='signinCard2   d-flex flex-row col-10 col-sm-7 col-md-6  justify-content col-lg-5 col-xxl-4 col-lg-4 gap-3 fs-5 text-center message'>
                    <div className="row">
                    <div>Or already have an account?</div>
                    </div>
                    <div className='row d-flex justify-content-center'>
                    <Link className='link-underline link-underline-opacity-0 text-center' 
                    to='/'
                    // onClick={()=>{navigate('/')}}
                    >Sign in</Link>
            </div>
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