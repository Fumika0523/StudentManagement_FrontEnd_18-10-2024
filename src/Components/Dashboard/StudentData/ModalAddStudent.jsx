import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';

function ModalAddStudent({show,setShow}){
  const handleClose = () => setShow(false);
    
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
        addStudent(values)
    }
})

const token = sessionStorage.getItem('token')
console.log(token)

let config = {
  headers:{
    Authorization:`Bearer ${token}`
  }
}

const navigate = useNavigate()

const addStudent = async (newStudent) => {
    console.log(newStudent)
    const res = await axios.post(`${url}/registerstudent`, newStudent,config)
    console.log(res)
    if (res.status == 200) {
        //navigate to signin page
        navigate('/studentdata')
    }
}


    return(
    <>

      <Modal     
         show={show} onHide={handleClose}
          size="xl"
          >
        <Modal.Header closeButton>
          <Modal.Title  >Student Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}}>
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
                    </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button style={{backgroundColor:"#4e73df"}} type="submit" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
    )
}
export default ModalAddStudent