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
        toast.success("Course added successfully !",{
            style:{
                // backgroundColor:"green",
                // textTransform:"uppercase",
                textWrap:"nowrap",
                textAlign:"center",
                padding:"0.5% 0% 0.5% 4%",
                color:"black",
                // autoClose: "10000",
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
        courseType:Yup.string().required(),
        courseTime:Yup.string().required(),
        courseAvailability:Yup.string().required(),
        courseDuration:Yup.string().required(),
        courseFee:Yup.number().required(),
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
    <Modal show={show} onHide={handleClose} >
    <Modal.Header closeButton>
          <Modal.Title  >Add Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}} >
            <Modal.Body>

            {/* CourseName */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Name</Form.Label>
                <Form.Control type="courseName"
                name="courseName" value={formik.values.courseName} onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseType */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Type</Form.Label>
                <Form.Control type="courseType"
                name="courseType" value={formik.values.courseType}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseFime */}
            <Form.Group className='my-3'>
            <Form.Label className='m-0'>Course Fee</Form.Label>
            <Form.Control type="courseFee" 
            name="courseFee" value={formik.values.courseFee}
            onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseTime */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Time</Form.Label>
                <Form.Control type="courseTime" 
                name="courseTime" value={formik.values.courseTime}
                onChange={formik.handleChange}/>
            </Form.Group>



            {/* courseAvailability*/}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Availability</Form.Label>
                <Form.Control type="courseAvailability"
                name="courseAvailability" value={formik.values.courseAvailability}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseDuration */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Duration</Form.Label>
                <Form.Control type="courseDuration" 
                name="courseDuration" value={formik.values.courseDuration}
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