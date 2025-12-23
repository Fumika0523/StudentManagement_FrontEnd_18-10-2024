import Button from 'react-bootstrap/Button'
import { useFormik } from 'formik'
import * as Yup from "yup"
import React, { useEffect } from "react"
import Form from 'react-bootstrap/Form'
import GoogleIcon from '@mui/icons-material/Google'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { url } from '../utils/constant'
import { FcReading } from "react-icons/fc"
import { toast } from 'react-toastify'

function StudentSignIn() {

    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get("redirect")
    const batchId = searchParams.get("batchId")

    //  Auto-redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (token && role === 'student') {
            if (redirect && batchId) {
                const targetUrl = `${redirect}?batchId=${batchId}`
                console.log(" AUTO REDIRECT (STUDENT):", targetUrl)
                window.location.href = targetUrl
            } else {
                window.location.href = '/studentdata'
            }
        }
    }, [])

    const formSchema = Yup.object().shape({
        username: Yup.string().required(),
        password: Yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log('Student login submit:', values)
            postSignInUser(values)
        }
    })

    const postSignInUser = async (loginUser) => {
        console.log('Calling Student Signin API')

        try {
            const res = await axios.post(`${url}/signin`, loginUser)
            console.log(' Student login success:', res.data)

            // Save auth info
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('username', res.data.user.username)
            localStorage.setItem('role', res.data.role)

             if (res.data.token) {
            toast.success(res.data.message)
            navigate('/dashboard') // Add navigation here
        }
        } catch (e) {
            console.error('Student login error:', e)

            if (e.response?.data?.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        }
    }

    //  Google login
    const handleGoogleSignIn = () => {
        console.log("Student Google Login")
        window.location.href = "http://localhost:8001/auth/google?role=student"
    }

    
    return (
        <>
            <div className='signInStyle justify-content-center d-flex container-fluid min-vh-100 align-items-center'>
                <div className='row justify-content-center flex-column align-items-center w-100 gap-4'>

                    <Form onSubmit={formik.handleSubmit}
                        className='signinCard col-12 col-sm-7 col-md-6 col-lg-4 px-4'>

                        {/* TITLE */}
                        <div className="row">
                            <h2
                                style={{ fontSize: "30px" }}
                                className="d-flex justify-content-center align-items-center"
                            >
                                <FcReading className='mb-1' style={{ fontSize: "55px" }} />
                                Student
                            </h2>
                        </div>

                        {/* Username */}
                        <Form.Group className='text-start'>
                            <Form.Label className='formLabel m-0'>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                            />
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className='text-start'>
                            <Form.Label className='formLabel m-0'>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </Form.Group>

                        {/* Sign In */}
                        <div className="row d-flex justify-content-center">
                            <Button
                                type="submit"
                                className="sign-Btn fw-bold my-4"
                                style={{ fontSize: "18px", width: "94%" }}
                            >
                                SIGN IN
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="row mb-3">
                            <div className="d-flex align-items-center justify-content-center">
                                <div style={{ height: "1px", width: "35%", background: "#ddd" }} />
                                <span style={{ margin: "0 12px", fontSize: "14px", color: "#777" }}>
                                    OR
                                </span>
                                <div style={{ height: "1px", width: "35%", background: "#ddd" }} />
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <div className="row d-flex justify-content-center">
                            <Button
                                type="button"
                                className="google-btn d-flex align-items-center justify-content-center gap-2"
                                style={{
                                width: "100%",
                                backgroundColor: "#fff",
                                color: "#444",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px 0",
                                fontWeight: "500",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                    }}
                                           onClick={handleGoogleSignIn}
                                    >
                                        <GoogleIcon sx={{ color: "#ea4335", fontSize: 22 }} />
                                        Sign up with Google
                            </Button>
                        </div>
                    </Form>

                    {/* Footer */}
                    <div className='signinCard2 col-12 col-sm-7 col-md-6 col-lg-4 d-flex'>
                        <div className='text-center message'>Don't have account? &nbsp;</div>
                        <Link
                            className='link-underline link-underline-opacity-0 text-center'
                            to='/student-signup'
                        >
                            Create an account
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StudentSignIn
