import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';


function ModalAddCourse({show,setShow,setCourseData}){
    const notify = ()=>{
        console.log("Toast Notification Added")
        toast.success("Course added successfully !")
    }

    const navigate = useNavigate()
    const handleClose=()=>{
        setShow(false)
        navigate('/coursedata')
    }

const formSchema = Yup.object().shape(
    {
        courseName:Yup.string().required("Mandatory field !"),
        courseType:Yup.string().required("Mandatory field !"),
        courseTime:Yup.string().required("Mandatory field !"),
        courseAvailability:Yup.string().required("Mandatory field !"),
        courseDuration:Yup.string().required("Mandatory field !"),
        courseFee:Yup.number().required("Mandatory field !"),
    })

const formik = useFormik({
         initialValues:{
            courseName:"",
            courseType:"",
            courseTime:"",
            courseAvailability:"",
            courseDuration:"",
            courseFee:"",
    },
    validationSchema:formSchema,
    onSubmit:(values)=>{
        console.log(values)
        addCourse(values)
    }  
})

const token = sessionStorage.getItem('token')
console.log(token)

let config = {
    headers:{
        Authorization:`Bearer ${token}`
}}

const addCourse = async(newCourse)=>{
console.log(newCourse)
try{
const res = await axios.post(`${url}/addcourse`,newCourse,config)
console.log(res)
if(res){
    let res = await axios.get(`${url}/allcourse`,config)
    console.log("Successfully a new course to the DB",newCourse)
    setCourseData(res.data.courseData)
    notify()
    setTimeout(()=>{
        handleClose()
    },3001)
}
}catch(e){
    console.error('Error Adding Course:',e)
}}

return(
    <>
    <Modal show={show} onHide={handleClose} size='lg' style={{margin:"10% 0"}}>
    <Modal.Header closeButton>
          <Modal.Title  >Add Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}} >
            <Modal.Body>
            <Row>
                <Col>
                {/* CourseName */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Name</Form.Label>
                <Form.Control type="text"
                name="courseName" value={formik.values.courseName} onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseName && formik.touched.courseName && <div className="text-danger text-center">{formik.errors.courseName}</div>}
                 </Form.Group>
                </Col>
                <Col>
                {/* courseType */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Type</Form.Label>
                <Form.Control type="text"
                name="courseType" value={formik.values.courseType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseType && formik.touched.courseType && <div className="text-danger text-center">{formik.errors.courseType}</div>}
                </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
            {/* courseFime */}
            <Form.Group className='my-3'>
            <Form.Label className='m-0'>Fee</Form.Label>
            <Form.Control type="number" 
            name="courseFee" value={formik.values.courseFee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}/>
             {/* Error Message */}
             {formik.errors.courseFee && formik.touched.courseFee && <div className="text-danger text-center">{formik.errors.courseFee}</div>}
            </Form.Group>
                </Col>
                <Col>
                    {/* courseTime */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Time</Form.Label>
                <Form.Control type="text" 
                name="courseTime" value={formik.values.courseTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                 {/* Error Message */}
             {formik.errors.courseTime && formik.touched.courseTime && <div className="text-danger text-center">{formik.errors.courseTime}</div>}
            </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                       {/* courseAvailability*/}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Availability</Form.Label>
                <Form.Control type="courseAvailability"
                name="courseAvailability" value={formik.values.courseAvailability}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseAvailability && formik.touched.courseAvailability && <div className="text-danger text-center">{formik.errors.courseAvailability}</div>}
            </Form.Group>
                </Col>
                <Col>
            {/* courseDuration */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Duration</Form.Label>
                <Form.Control type="courseDuration" 
                name="courseDuration" value={formik.values.courseDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
             {formik.errors.courseDuration && formik.touched.courseDuration && <div className="text-danger text-center">{formik.errors.courseDuration}</div>}
            </Form.Group>
                </Col>
            </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button type='submit' style={{backgroundColor:"#4e73df"}}>
                    Add Course
                </Button>
                <Button  variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Form>

    </Modal>
    </>
)}
export default ModalAddCourse