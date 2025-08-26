import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../utils/constant';
import { FcReading } from 'react-icons/fc';
import SelectCourseModal from '../../Components/Dashboard/StudentData/SelectCourseModal';

function StudentSignIn({ isAuthenticated, setIsAuthenticated }) {
  // const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required(),
      password: Yup.string().required()
    }),

onSubmit: async (values) => {
  try {
    const res = await axios.post(`${url}/signin`, values);

    // Check if token exists instead of res.status
    if (res.data.token) {
      // store token and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", values.username);

      setIsAuthenticated(true);
      // navigate to dashboard
      navigate("/dashboard");
    } else {
      console.error("Login failed: no token returned");
    }
  } catch (err) {
    console.error(err);
  }
}


})






  return (
    <div className="signInStyle container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <Form onSubmit={formik.handleSubmit} className="signinCard col-12 col-sm-7 col-md-6 col-lg-4 px-4">
        <h2 className="d-flex justify-content-center align-items-center">
          <FcReading className="mb-1" style={{ fontSize: '55px' }} />Student Sign In
        </h2>
        <Form.Group className="text-start">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={formik.values.username} onChange={formik.handleChange} />
        </Form.Group>
        <Form.Group className="text-start">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formik.values.password} onChange={formik.handleChange} />
        </Form.Group>
        <Button type="submit" className="sign-Btn my-4 w-100">SIGN IN</Button>
        <div className="text-center mt-3">Don't have account? <Link to="/student-signup">Create account</Link></div>
      </Form>

 
    </div>
  );
}

export default StudentSignIn;
