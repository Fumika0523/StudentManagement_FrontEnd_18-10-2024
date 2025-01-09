import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';


const ModalAddAdmission = ({ show, setShow, setAdmissionData }) => {
    const navigate = useNavigate()
    const handleClose = () => {
        setShow(false)
        navigate('/admissiondata')
    }
    const [courseData, setCourseData] = useState([])
    const [studentData,setStudentData] = useState([])

    //Original Course Data
    const getCourseData = async () => {
        console.log("Console data is called....")
        let res = await axios.get(`${url}/allcourse`, config)
        console.log("Course Data", res.data.courseData)
        setCourseData(res.data.courseData)
    }
    useEffect(() => {
        getCourseData()
        getStudentData()
    }, [])
    console.log(courseData)

    // courseData?.map((element) => console.log(element.courseName))
    // courseData?.map((element)=>console.log(element._id))

    //student Data
    const getStudentData = async()=>{
    console.log("Student data is called.")
    let res = await axios.get(`${url}/allstudent`,config)
    console.log("Student Data",res.data.studentData)
    setStudentData(res.data.studentData)
    }
   
    const formSchema = Yup.object().shape({
        courseId:Yup.string().required("Mandatory field!"),
        studentId:Yup.string().required(("Mandatory field!")),
        courseName: Yup.string().required(("Mandatory field!")),
        studentName:Yup.string().required(("Mandatory field!")),
        admissionSource: Yup.string().required(("Mandatory field!")),
        admissionFee: Yup.number().required(("Mandatory field!")),
        admissionDate: Yup.date().required(("Mandatory field!")),
        admissionYear: Yup.number().required(("Mandatory field!")),
        admissionMonth: Yup.number().required(("Mandatory field!")),
    })

    const formik = useFormik({
        initialValues: {
            courseId:"",
            studentId:"",
            studentName:"",
            courseName: "",
            admissionSource: "",
            admissionFee: "",
            admissionDate: "",
            admissionYear: "",
            admissionMonth: "",
        },
        //validationSchema:formSchema,
        enableReinitialize:true,
        onSubmit: (values) => {
            console.log(formik)
            console.log(values)
            addAdmission(values)
        }
    })

    const token = sessionStorage.getItem('token')
    console.log(token)

    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const formatDate = (dateString) => {
        console.log(dateString)
        const date = new Date(dateString);
        console.log(date)
        return date.toLocaleDateString('en-US', {
            year: "numeric",
            month: 'long',
            day: 'numeric'
        })
    }
    console.log(new Date("03-01-2025"))

    const dateFun = () => {
        const date = new Date('Sat Mar 01 2025 00:00:00 GMT+0900 (Japan Standard Time)');
        // Get the full month name
        const month = date.toLocaleString('default', { month: 'long' });
        // Get the full year
        const year = date.getFullYear();
        console.log(`${month} ${year}`);
        return [month, year]
    }


    const addAdmission = async (newAdmission) => {
        console.log(newAdmission)
        const admission = {
            ...newAdmission,

            // Shoudld select from a dropdown
            studentId: "674f9d1a62c9d9c5ca9df624",
            courseId: "677a1998ed75982c18d258fb"
        }
        try {
            const res = await axios.post(`${url}/addadmission`, admission, config)
            console.log(res)
            if (res) {
                let res = await axios.get(`${url}/alladmission`, config)
                console.log("Successfully a new admission added to the DB!", admission)
                setAdmissionData(res.data.admissionData)
                // handleClose()
            }
        } catch (e) {
            console.error("Error adding Admission:", e)
        }
    }
    console.log(formik)

    const handleCourseIdChange=(e)=>{
        // formik.handleChange === e.target.value
        console.log(e.target.value) 
        const selectedCourseId=e.target.value
        //find() >> Array Method
        const selectedCourse = courseData.find((element)=>element._id==selectedCourseId)
        console.log(selectedCourse.courseName)
        console.log(selectedCourse.courseFee)

        formik.setFieldValue("courseId",selectedCourseId)
        formik.setFieldValue("courseName",selectedCourse.courseName)
        formik.setFieldValue("admissionFee",selectedCourse.courseFee)
    }
    
        const handleStudentIdChange=(e)=>{
            console.log(e.target.value)
            const selectedStudentId=e.target.value
            //find()
            const selectedStudent = studentData.find((element)=>element._id ==selectedStudentId)
            console.log(selectedStudent.studentName)

            formik.setFieldValue("studentId",selectedStudentId)
            formik.setFieldValue("studentName",(selectedStudent.studentName))
        }


    return (
        <Modal show={show}
            onHide={handleClose}
            size="lg" >
            <Modal.Header>
                <Modal.Title style={{ padding: "0% 5%" }}>Add Admission</Modal.Title>
            </Modal.Header>
            <Form onSubmit={formik.handleSubmit} style={{ padding: "1.5% 5%" }}>
                <Modal.Body>
                    <Row>
                    <Col>
                        {/* Course ID */}
                        <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Course ID</Form.Label>
                                <select name="courseId" id="" className="form-select" value={formik.values.courseId} 
                                // onChange={formik.handleChange} //e.target.value
                                onChange={handleCourseIdChange}
                                >
                                <option value="">Select Course ID</option>
                                    {courseData?.map((element) =>
                                        <option key={element._id} 
                                        value={element._id} >{element._id}</option>
                                    )}
                                    {/* <option value="677a1998ed75982c18d258fb" >677a1998ed75982c18d258fb</option> */}
                                </select>
                                {/* Error Message */}
                                {formik.errors.courseId && <div className="text-danger text-center">{formik.errors.courseId}</div>}
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* Course Name */}
                            <Form.Group className='mt-3' >
                                <Form.Label className='mb-0'>Course Name</Form.Label>
                                <Form.Control disabled
                                type="text" placeholder='Course Name'
                                name='courseName' value={formik.values.courseName}>
                                </Form.Control>
                                {/* Error Message */}
                                {formik.errors.courseName && <div className="text-danger text-center">{formik.errors.courseName}</div>}
                            </Form.Group>
                        </Col>
                     </Row>
                    <Row>

                        {/* Student ID */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Student ID</Form.Label>
                                <select name="studentId" id="" className="form-select" value={formik.values.studentId} 
                                // onChange={formik.handleChange}
                                onChange={handleStudentIdChange}
                                >
                                <option value="">Select Student ID</option>
                                    {studentData?.map((element)=>
                         <option key={element._id} value={element._id} >{element._id}</option>
                        )}                       
                            </select>
                            {/* Error Message */}
                            {formik.errors.studentId && <div className="text-danger text-center">{formik.errors.studentId}</div>}
                            </Form.Group>
                        </Col>

                        {/* Student Name */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Student Name</Form.Label>
                            <Form.Control disabled
                            type='text' placeholder='Enter Student Name' name='studentName' value={formik.values.studentName}>
                            </Form.Control>       
                                {/* Error Message */}
                                {formik.errors.studentName && <div className="text-danger text-center">{formik.errors.studentName}</div>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        {/* Admission Date */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Date</Form.Label>
                                <Form.Control
                                    type="date" placeholder='Type your Admission Date'
                                    name='admissionDate' value={formik.values.admissionDate} onChange={formik.handleChange
                                    } />
                                     {/* Error Message */}
                                {formik.errors.admissionDate && <div className="text-danger text-center">{formik.errors.admissionDate}</div>}
                            </Form.Group>
                        </Col>

                        {/* Admission Month */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Month</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder='Type your Admission Month'
                                    name="admissionMonth" value={formik.values.admissionMonth} onChange={formik.handleChange} />
                                     {/* Error Message */}
                                {formik.errors.admissionMonth && <div className="text-danger text-center">{formik.errors.admissionMonth}</div>}
                            </Form.Group>
                        </Col>

                        {/* Admission Year */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Year</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder='Type your Admission Year'
                                    name='admissionYear' value={formik.values.admissionYear} onChange={formik.handleChange} />
                                     {/* Error Message */}
                                {formik.errors.admissionYear && <div className="text-danger text-center">{formik.errors.admissionYear}</div>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            {/* Admission Fee */}
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Fee</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder='Type your Admission Fee'
                                    name='admissionFee' value={formik.values.admissionFee}  />
                                     {/* Error Message */}
                                {formik.errors.admissionFee && <div className="text-danger text-center">{formik.errors.admissionFee}</div>}
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* Admission Source */}
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Source</Form.Label>
                                <select
                                    name="admissionSource"
                                    className="form-select"
                                    value={formik.values.admissionSource}
                                    onChange={formik.handleChange}>
                                    <option value="">Select Admission Source</option>
                                    <option value={"Social"}>Social</option>
                                    <option value={"Referral"}>Referral</option>
                                    <option value={"Direct"}>Direct</option>
                                </select>
                                 {/* Error Message */}
                                 {formik.errors.admissionSource && <div className="text-danger text-center">{formik.errors.admissionSource}</div>}
                            </Form.Group>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex gap-3'>
                    {/* ADD BUTTON */}
                    <Button type="submit" style={{ backgroundColor: "#4e73df" }}>Add Admission</Button>

                    {/* CLOSE BUTTON*/}
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ModalAddAdmission