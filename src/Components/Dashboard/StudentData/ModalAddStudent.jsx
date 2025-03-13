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
import { Col, Row } from 'react-bootstrap';


function ModalAddStudent({ show, setShow, setStudentData }) {
  const navigate = useNavigate()
  const handleClose = () => {
    setShow(false)
    navigate('/studentdata')
  }

  const formSchema = Yup.object().shape({
    studentName: Yup.string().required("Mandatory Field!"),
    password: Yup.string().required("Mandatory Field!"),
    username: Yup.string().required("Mandatory Field!"),
    email: Yup.string().required("Mandatory Field!"),
    phoneNumber: Yup.number().required("Mandatory Field!"),
    gender: Yup.string().required("Mandatory Field!"),
    birthdate: Yup.date().required("Mandatory Field!"),
    preferredCourseName:Yup.string().required("Mandatory Field!"),
  })

  const formik = useFormik({
    initialValues: {
      studentName: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      gender: "",
      birthdate: "",
      preferredCourseName:"",
    },
    // validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values)
      addStudent(values)
    }
  })

  const token = sessionStorage.getItem('token')
  console.log(token)

  let config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const addStudent = async (newStudent) => {
    console.log(newStudent)
    try {
      const res = await axios.post(`${url}/registerstudent`, newStudent, config)
      console.log(res)
      if (res) {
        let res = await axios.get(`${url}/allstudent`, config)
        console.log("Successfully a new student to the DB", newStudent)
        setStudentData(res.data.studentData)
        handleClose()
      }
    } catch (e) {
      console.error('Error Adding Student:', e)
    }
  }
  // When you click the save.>> update

  return (
    <>
      <Modal
        show={show} onHide={handleClose} size='lg'
        style={{margin:"8% 0"}} >
        <Modal.Header closeButton>
        <Modal.Title  >Add Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{ fontSize: "80%" }}>
          <Modal.Body>
            <Row>
              <Col>
                {/* Studentname*/}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Student Name</Form.Label>
                  <Form.Control type="text"
                    placeholder='Type your Full Name'
                    name="studentName"
                    value={formik.values.studentName}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.studentName && formik.touched.studentName && <div className="text-danger text-center">{formik.errors.studentName}</div>}
                    </Form.Group>
              </Col>
              <Col>
                {/* Username */}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Username</Form.Label>
                  <Form.Control type="text" placeholder='Type your Username' name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.username && formik.touched.username && <div className="text-danger text-center">{formik.errors.username}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className='pt-4 pe-0'>
                {/* Gender */}
                <div>Gender</div>
                <div className='form-check form-check-inline'>
                  <Form.Check style={{fontSize:"14px"}} type="radio" name="gender" label={`Male`}
                    value="male"
                    onChange={formik.handleChange} /></div>
                <div className='form-check form-check-inline'>
                  <Form.Check style={{fontSize:"14px"}} type="radio" name="gender" label={`Female`}
                    value="female"
                    onChange={formik.handleChange} /></div>
              </Col>
              <Col>
                {/* Email */}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Email Address</Form.Label>
                  <Form.Control type="email" placeholder='Type your Email Address' name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.email && formik.touched.email && <div className="text-danger text-center">{formik.errors.email}</div>}
                </Form.Group>
              </Col>
              <Col>
                {/* B-Date*/}
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Birthdate</Form.Label>
                  <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                    value={formik.values.birthdate}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.birthdate && formik.touched.birthdate && <div className="text-danger text-center">{formik.errors.birthdate}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
              <Form.Label className='m-0'>Preferred Course</Form.Label>
              {['checkbox'].map((type) => (
        <div key={`inline-${type}`} className="mb-1 d-flex flex-row justify-content-between" style={{fontSize:"14px"}}>
       
          <Form.Check
            inline
            label="HTML"
            name="preferredCourseName"
            type={type}
            onChange={formik.handleChange} 
            id={`inline-${type}-1`}
            value="HTML"
          />
          <Form.Check
            inline
            label="CSS"
            value="CSS"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 
          />
                <Form.Check
            inline
            label="Java Script"
            value="Java Script"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 
          />
          <Form.Check
            inline
            label="Redux"
            value="Redux"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 
          />
            <Form.Check
            inline
            label="Node JS"
            value="Node JS"
             name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 

          />    
          <Form.Check
            inline
            label="Mongo DB"
            value="Mongo DB"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 

          />    
          <Form.Check
            inline
            label="SQL"
            value="SQL"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 

          />     
            <Form.Check
            inline
            label="Bootsrap"
            value="Bootsrap"
            name="preferredCourseName"
            type={type}
            id={`inline-${type}-2`}
            onChange={formik.handleChange} 
          />    
        </div>
      ))}
              </Col>
              </Row>
              <Row>
             {/* Phone No.*/}
              <Col>
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Phone No.</Form.Label>
                  <Form.Control type="number" placeholder="Type your Phone No." name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="text-danger text-center">{formik.errors.phoneNumber}</div>} 
                </Form.Group>
              </Col>
              <Col>
                {/* Password*/}
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Password</Form.Label>
                  <Form.Control type="password" placeholder="Type your Password" name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.password && formik.touched.password && <div className="text-danger text-center">{formik.errors.password}</div>} 
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: "#4e73df" }} type="submit">
              Add Student
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export default ModalAddStudent