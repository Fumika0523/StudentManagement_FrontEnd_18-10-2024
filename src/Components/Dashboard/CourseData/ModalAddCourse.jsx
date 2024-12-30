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


function ModalAddCourse({show,setShow,setCourseData}){
    const notify = ()=>{
        console.log("Toast Notification Added")
        toast.success("Course Added Successfully !",{
            style:{
                color:"white",
                backgroundColor:"green",
                textTransform:"uppercase",
                textWrap:"nowrap",
                padding:"0.5% 3%"
                // fontStyle:"italic"
            }
        })
    }

    const navigate = useNavigate()
    const handleClose=()=>{
        setShow(false)
        navigate('/coursedata')
    }

const formSchema = Yup.object().shape(
    {
        courseName:Yup.string().required(),
        sessionType:Yup.string().required(),
        sessionTime:Yup.string().required(),
        sessionAvailability:Yup.string().required(),
        sessionDuration:Yup.string().required(),
    })

const formik = useFormik({
         initialValues:{
            courseName:"",
            sessionType:"",
            sessionTime:"",
            sessionAvailability:"",
            sessionDuration:"",
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
    <Modal show={show} onHide={handleClose} >
    <Modal.Header closeButton>
          <Modal.Title  >Add Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}} >
            <Modal.Body>

            {/* COurseName */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Name</Form.Label>
                <Form.Control type="courseName"
                name="courseName" value={formik.values.courseName} onChange={formik.handleChange}/>
            </Form.Group>

            {/* SessionType */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Session Type</Form.Label>
                <Form.Control type="sessionType"
                name="sessionType" value={formik.values.sessionType}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* SessionTime */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Session Time</Form.Label>
                <Form.Control type="sessionTime" 
                name="sessionTime" value={formik.values.sessionTime}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* SessionAvailability*/}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Session Availability</Form.Label>
                <Form.Control type="sessionAvailability"
                name="sessionAvailability" value={formik.values.sessionAvailability}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* SessionDuration */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Session Duration</Form.Label>
                <Form.Control type="sessionDuration" 
                name="sessionDuration" value={formik.values.sessionDuration}
                onChange={formik.handleChange}/>
            </Form.Group>
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