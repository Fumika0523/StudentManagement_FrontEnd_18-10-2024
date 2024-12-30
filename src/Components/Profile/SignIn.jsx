import Button from 'react-bootstrap/Button';
import { useFormik} from 'formik';
import * as Yup from "yup";
import React from "react";
import Form from 'react-bootstrap/Form';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { url } from '../utils/constant';

function SignIn({isAuthenticated,setIsAuthenticated}){

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
            console.log(values)
            postSignInUser(values)
        }
    })

    const navigate=useNavigate()

    const postSignInUser=async(loginUser)=>{
        console.log(loginUser)
        const res = await axios.post(`${url}/signin`,loginUser)
        console.log(res.data)
        sessionStorage.setItem('token',res.data.token)
        sessionStorage.setItem('username',res.data.user.name)
        if(res.data.token){
            setIsAuthenticated(true) // signed in >> true
        }
        navigate('/dashboard')
    }

    return(
        <>
        <div className='signInStyle'>
        <div className='signinCard'>

            {/* TITLE */}
            <h2 className="text-center fw-bold" >Sign in</h2>
            <Form onSubmit={formik.handleSubmit}>
                {/* Username */}
                <Form.Group className='mt-3 text-start'>
                    <Form.Label  className='formLabel m-0'>Username</Form.Label>
                    <Form.Control type="username" placeholder='Type your Username' name="username" 
                    value={formik.values.username}
                    onChange={formik.handleChange} />
                </Form.Group>
                    {/* Password*/}
                    <Form.Group className='mt-3 text-start'>
                    <Form.Label  className='formLabel m-0'>Password</Form.Label>
                    <Form.Control type="password" placeholder="Type your Password" name="password" 
                    value={formik.values.password}
                    onChange={formik.handleChange} />
                </Form.Group>
              <Button type="submit" variant="outline-*" className="signinBtn fw-bold" style={{borderRadius:"15px",color:"white"}}>SIGN IN</Button>
            </Form>
            <div className='text-center fs-6'>
                <div>Or Sign Up Using</div>
                <div className='gap-1 fs-3 mt-3 d-flex' style={{justifyContent:"center"}}>
                    {/* Facebook */}
                    <FacebookIcon sx={{color:"navy",fontSize:"35px"}} />
                    {/* LinkedIn */}
                    <LinkedInIcon sx={{color:"#0077B5",fontSize:"35px"}}/>
                    {/* GitHub */}
                    <GitHubIcon sx={{fontSize:"35px"}} />
                    {/* Google */}
                    <GoogleIcon sx={{color:"#ea4335",fontSize:"35px"}} />
                    </div>
                    <div style={{marginTop:"15%"}}>Or</div>
                    <div className="btn btn-link" style={{fontSize:"110%"}} onClick={()=>{navigate('/signup')}}>SIGN UP</div>
                    </div>
        </div>
        </div>
        </>
    )
}

export default SignIn

// Formik
//https://colorlib.com/wp/wp-content/uploads/sites/2/free-html5-and-css3-login-forms.jpg
//Submit the value in the console
//Facebook,Google,GitHub,LinkedIn, normal login <<<<<<<< https://react-icons.github.io/react-icons/ 
//https://www.pngarts.com/files/5/Lines-Transparent-Background-PNG.png

//check the color icon

