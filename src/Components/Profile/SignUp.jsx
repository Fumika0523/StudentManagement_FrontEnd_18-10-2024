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
            <div className='signInStyle py-5' style={{ height: "100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <div className='container py-5' style={{ width: "35%", border: "1px solid black", borderRadius: "50px", backgroundColor: "white" }}>

                    {/* TITLE */}
                    <h1 className="text-center" style={{ fontWeight: "bold" }}>Sign Up</h1>
                    <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"100%"}}>
                        {/* Username */}
                        <Form.Group className='my-3'>
                            <Form.Label className='m-0'>Username</Form.Label>
                            <Form.Control type="username" placeholder='Type your Username' name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Gender */}
                        <div>Gender</div>
                        <div className='form-check form-check-inline'>                 
                        <Form.Check type="radio" name="gender" label={`Male`}
                            value="male"
                            onChange={formik.handleChange} /></div>
                         <div className='form-check form-check-inline'>
                            <Form.Check type="radio" name="gender" label={`Female`}
                            value="female"
                            onChange={formik.handleChange} /></div>

                        {/* Email */}
                        <Form.Group className='my-3'>
                            <Form.Label className='m-0'>Email Address</Form.Label>
                            <Form.Control type="email" placeholder='Type your Email Address' name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* B-Date*/}
                        <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Phone No.*/}
                        <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Phone No.</Form.Label>
                            <Form.Control type="phoneNumber" placeholder="Type your Phone No." name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* Password*/}
                        <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type your Password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        <div className='text-end my-1 mb-4' style={{ fontSize: "80%" }}></div>

                        <Button type="subumit" className="mb-4 signInStyle py-2" style={{ width: "100%", borderRadius: "20px" }}>SIGN UP</Button>
                        </Form>
                        <div className='text-center'>
                            <div style={{ fontSize: "120%" }}>Or Sign Up Using</div>
                            <div className='gap-1 mt-3 d-flex' style={{ justifyContent: "center" }}>
                                {/* Facebook */}
                                <FacebookIcon sx={{ color: "navy", fontSize: "35px" }} />
                                {/* LinkedIn */}
                                <LinkedInIcon sx={{ color: "#0077B5", fontSize: "35px" }} />
                                {/* GitHub */}
                                <GitHubIcon sx={{ fontSize: "35px" }} />
                                {/* Google */}
                                <GoogleIcon sx={{ color: "#ea4335", fontSize: "35px" }} />
                            </div>
                            <div style={{ marginTop: "3%", fontSize: "110%" }}>Or Already Have Account?</div>
                            <div className='btn btn-link' style={{ marginTop: "3%", fontSize: "110%",width:"10%" }} onClick={()=>{navigate('/')}}>SIGN IN</div>
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