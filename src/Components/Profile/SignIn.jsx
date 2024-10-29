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
        navigate('/homepage')
    }

    return(
        <>
        <div className='signInStyle py-5' style={{height:"100vh"}}>
        <div className='container py-5' style={{width:"30%",border:"1px solid black", borderRadius:"10px",backgroundColor:"white"}}>
            <h2  className="text-center" style={{fontWeight:"bold"}}>Sign in</h2>
            <Form onSubmit={formik.handleSubmit} className='px-5'>
                {/* Username */}
                <Form.Group className='my-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder='Type your Username' name="username" 
                    value={formik.values.username}
                    onChange={formik.handleChange} />
                </Form.Group>
                    {/* Password*/}
                    <Form.Group className='mt-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Type your Password" name="password" 
                    value={formik.values.password}
                    onChange={formik.handleChange} />
                </Form.Group>
                <div className='text-end my-1 mb-4' style={{fontSize:"80%"}}></div>
                <Button type="submit" className="mb-5 signInStyle" style={{width:"100%",borderRadius:"20px"}}>SIGN IN</Button>
                <div className='text-center'>
                <div style={{fontSize:"90%"}}>Or Sign Up Using</div>
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
                    <div style={{marginTop:"22%",fontSize:"90%"}}>Or Sign Up Using</div>
                    <div style={{marginTop:"5%",fontSize:"90%"}} onClick={()=>{navigate('/homepage')}}>SIGN UP</div>
                    </div>
            </Form>
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

