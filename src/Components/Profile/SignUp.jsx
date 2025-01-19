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
                <div className='container d-flex justify-content-center min-vh-100 align-items-center'>
               
                <Form className='signupCard' onSubmit={formik.handleSubmit} >
                    <div className="row">
                    <h2 className="text-center fw-bold py-1" >Sign Up</h2>
                    </div>
                    <div className="row mb-2" >             
                        {/* Username */}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6' >
                            <Form.Label className='formLabel m-0'>Username</Form.Label>
                            <Form.Control type="username" placeholder='Type your Username' name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         {/* Email */}
                         <Form.Group className='col-md-6 col-lg-6 col-sm-12'>
                            <Form.Label className='formLabel m-0'>Email Address</Form.Label>
                            <Form.Control type="email" placeholder='Type your Email Address' name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        {/* 2ND ROW */}
                        <div className="row d-flex align-items-center mb-2"  >  
                        <div className='col-lg-6 col-md-6 col-sm-12d-flex row-direction' style={{height:"25%"}} >
                        {/* Gender */}
                        <div className='formLabel ms-1'>Gender</div>
                        <div className='form-check mt-2'>                 
                        <Form.Check  type="radio" name="gender" label={`Male`}
                            value="male"
                            onChange={formik.handleChange} /></div>
                         <div className='form-check mt-2'>
                            <Form.Check type="radio" name="gender" label={`Female`}
                            value="female"
                            onChange={formik.handleChange} /></div>
                        </div>
                               {/* B-Date*/}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6'  >
                            <Form.Label className='formLabel m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>
                         </div> 

                        {/* 3rd ROW */}
                        <div className="row mb-2">  
                        {/* Phone No.*/}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6'>
                            <Form.Label className='formLabel m-0'>Phone No.</Form.Label>
                            <Form.Control type="phoneNumber" placeholder="Type your Phone No." name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                        </Form.Group> 
                        {/* Password*/}
                        <Form.Group className='col-lg-6 col-sm-12 col-md-6'>
                            <Form.Label className='formLabel m-0'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type your Password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        </div> 
                        <div className="row p-1">  
                        <div className='text-center'>
                        <Button type="submit" variant="outline-*" className="sign-Btn my-3 fw-bold text-white" style={{textAlign:"center",justifyContent:"center",alignItems:"center", borderRadius:"15px"}}>SIGN UP</Button></div>
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
                            <div className="row text-center ">  
                            <div className='message' style={{ marginTop: "4%"}}>Or Already Have Account?</div>
                            </div> 
                            <div className="row d-flex justify-content-center">  
                            <div className="signupinBtn my-3 fw-bold" style={{width:"26%",textAlign:"center",justifyContent:"center",width:"30%",alignItems:"center"}}  onClick={()=>{navigate('/')}}>SIGN IN</div>
                            </div>
                       
                        </Form>
              
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