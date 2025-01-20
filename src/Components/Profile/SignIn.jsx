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
        <div className='signInStyle '>
        <div className='container d-flex justify-content-center min-vh-100 align-items-center'>
            {/* <div > */}
            {/* TITLE */}
            <Form onSubmit={formik.handleSubmit} className='signinCard'>
            <div className="row ">
            <h2 className="text-center fw-bold" >Sign In</h2>
            </div>  
               {/* Username */}
            <div className='row  p-1'>
                <Form.Group className='col-12 p-1 text-start'>
                    <Form.Label  className='formLabel m-0'>Username</Form.Label>
                    <Form.Control type="username" placeholder='Type your Username' name="username" 
                    value={formik.values.username}
                    onChange={formik.handleChange} />
               </Form.Group>
            </div>
                {/* Password*/}
            <div className='row   '>
               
                    <Form.Group className='col-12 text-start'>
                    <Form.Label  className='formLabel m-0'>Password</Form.Label>
                    <Form.Control type="password" placeholder="Type your Password" name="password" 
                    value={formik.values.password}
                    onChange={formik.handleChange} />
                </Form.Group>
            </div>
                {/* Sign In Button */}
              <div className="row  p-1">
              <Button type="submit" variant="outline-*" className="sign-Btn my-3 fw-bold text-white" style={{width:"30%",textAlign:"center",justifyContent:"center",alignItems:"center",margin:"0 35%", borderRadius:"15px"}}>SIGN IN</Button>
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
                    <div className="row  p-1">
                    <div className='text-center my-2 message'>Don't have an account?</div>
                    </div>
                    <div className='row d-flex justify-content-center'>
                    <div  variant="outline-*" className="signupinBtn fw-bold" style={{textAlign:"center",justifyContent:"center",alignItems:"center",width:"33%"}} onClick={()=>{navigate('/signup')}}>SIGN UP</div>
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

