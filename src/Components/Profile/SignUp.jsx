import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import Form from 'react-bootstrap/Form';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import { url } from '../utils/constant';
import axios from 'axios';


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
            <div className='signInStyle'>
                <div  className='signupCard'>
                    {/* TITLE */}
                    <h2 className="text-center fw-bold" >Sign Up</h2>

                    <Form onSubmit={formik.handleSubmit} >
                        {/* Username */}
                        <Form.Group >
                            <Form.Label className='formLabel m-0'>Username</Form.Label>
                            <Form.Control type="username" placeholder='Type your Username' name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Gender */}
                        <div className='formLabel m-0'>Gender</div>
                        <div className='form-check form-check-inline'>                 
                        <Form.Check type="radio" name="gender" label={`Male`}
                            value="male"
                            onChange={formik.handleChange} /></div>
                         <div className='form-check form-check-inline'>
                            <Form.Check type="radio" name="gender" label={`Female`}
                            value="female"
                            onChange={formik.handleChange} /></div>

                        {/* Email */}
                        <Form.Group >
                            <Form.Label className='formLabel m-0'>Email Address</Form.Label>
                            <Form.Control type="email" placeholder='Type your Email Address' name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* B-Date*/}
                        <Form.Group>
                            <Form.Label className='formLabel m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Phone No.*/}
                        <Form.Group>
                            <Form.Label className='formLabel m-0'>Phone No.</Form.Label>
                            <Form.Control type="phoneNumber" placeholder="Type your Phone No." name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Password*/}
                        <Form.Group>
                            <Form.Label className='formLabel m-0'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type your Password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        <div className='text-center my-3' style={{ fontSize: "80%" }}>
                        <Button type="submit" variant="outline-*" className="signupBtn fw-bold" style={{borderRadius:"15px",color:"white"}}>SIGN UP</Button></div>
                        </Form>
                        <div className='text-center'>
                            <div style={{fontSize:"15px"}}>Or Sign Up Using</div>
                            <div className='gap-1 mt-2 d-flex' style={{ justifyContent: "center" }}>
                                {/* Facebook */}
                                <FacebookIcon sx={{ color: "navy", fontSize: "35px" }} />
                                {/* LinkedIn */}
                                <LinkedInIcon sx={{ color: "#0077B5", fontSize: "35px" }} />
                                {/* GitHub */}
                                <GitHubIcon sx={{ fontSize: "35px" }} />
                                {/* Google */}
                                <GoogleIcon sx={{ color: "#ea4335", fontSize: "35px" }} />
                            </div>
                            <div style={{ marginTop: "7%", fontSize:"15px"}}>Or Already Have Account?</div>
                            <div className='btn btn-link' style={{ fontSize: "110%"}} onClick={()=>{navigate('/')}}>SIGN IN</div>
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