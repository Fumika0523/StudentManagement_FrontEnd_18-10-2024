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
import { toast } from 'react-toastify';

const ModalAddAdmission = ({ show, setShow, setAdmissionData, admissionData, studentData, setStudentData }) => {
    const [courseValue, setCourseValue] = useState("")
    const [batchValue, setBatchValue] = useState("")
    const [batchTargetNo, setBatchTargetNo] = useState("")
    const [batchAssignedCount, setBatchAssignedCount] = useState("")
    const [studentValue, setStudentValue] = useState("");
    const [courseData, setCourseData] = useState([])
    const [batchData, setBatchData] = useState([])
    //console.log("courseValue", courseValue)

    const navigate = useNavigate()
    const handleClose = () => {
        setShow(false)
        navigate('/admissiondata')
    }

    //Original Course Data
    const getCourseData = async () => {
        //console.log("Console data is called....")
        let res = await axios.get(`${url}/allcourse`, config)
        //console.log("Course Data", res.data.courseData)
        setCourseData(res.data.courseData)
    }
    useEffect(() => {
        getCourseData()
    }, [])
    //console.log(courseData)
    // courseData?.map((element) => console.log(element.courseName))
    // courseData?.map((element)=>console.log(element._id))
    const handleBatchNumber = (e) => {
        const selectedBatchNumber = e.target.value;
        setBatchValue(selectedBatchNumber);

        const selectedBatch = batchData.find(
            (element) => element.batchNumber === selectedBatchNumber
        );

        if (!selectedBatch) {
            // clear related fields if nothing selected
            setBatchAssignedCount(0);
            setBatchTargetNo(0);
            formik.setFieldValue("batchNumber", "");
            formik.setFieldValue("courseName", "");
            formik.setFieldValue("courseId", "");
            formik.setFieldValue("admissionFee", "");
            return;
        }

        // set numbers (use fallback zero if missing)
        setBatchAssignedCount(selectedBatch.assignedStudentCount ?? 0);
        setBatchTargetNo(selectedBatch.targetStudent ?? 0);

        // populate formik and local state
        formik.setFieldValue("batchNumber", selectedBatch.batchNumber);
        formik.setFieldValue("courseName", selectedBatch.courseName);
        setCourseValue(selectedBatch.courseName);

        // find course to set courseId and admission fee
        const selectedCourse = courseData.find(
            (element) => element.courseName === selectedBatch.courseName
        );
        if (selectedCourse) {
            formik.setFieldValue("courseId", selectedCourse._id);
            formik.setFieldValue("admissionFee", selectedCourse.courseFee);
        } else {
            formik.setFieldValue("courseId", "");
            formik.setFieldValue("admissionFee", "");
        }
    };

    //Get Batch Data
    const getBatchData = async () => {
        let res = await axios.get(`${url}/allbatch`, config)
        //console.log("BatchData",res.data.batchData)
        // console.log("batchAssignedCount",batchAssignedCount)
        // setBatchTargetNo(res.data.batchData.targetStudent)
        //   console.log(batchTargetNo)
        setBatchData(res.data.batchData)
    }
    useEffect(() => {
        getBatchData()
    }, [])


    const formSchema = Yup.object().shape({
        batchNumber: Yup.string().required("Please select Batch Number!"),
        courseId: Yup.string().required("Mandatory field!"),
        studentId: Yup.string().required(("Mandatory field!")),
        courseName: Yup.string().required(("Select Course Name!")),
        studentName: Yup.string().required(("Please select Student Name!")),
        admissionSource: Yup.string().required(("Please Select Source")),
        admissionFee: Yup.number().required(("Please select Course ID!")),
        admissionDate: Yup.date().required(("Please select Date!")),
        admissionYear: Yup.number().required(("Mandatory field!")),
        admissionMonth: Yup.string(),
        status:Yup.string(),
    })

    const formik = useFormik({
        initialValues: {
            batchNumber: "",
            courseId: "",
            studentId: "",
            studentName: "",
            courseName: "",
            admissionSource: "",
            admissionFee: "",
            admissionDate: "",
            admissionYear: "",
            admissionMonth: "",
            status:"Assigned"
        },
        validationSchema: formSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            // Existing matchedInfo logic
            const matchedInfo = admissionData?.map(adm2 => {
                const student = studentData?.find(stu => stu._id === adm2.studentId);
                if (student) {
                    return { studentName: student.studentName, batchNumber: adm2.batchNumber, studentId: adm2.studentId };
                }
            }).filter(Boolean);

            // Check if student already assigned to this batch
            const isAlreadyAssigned = matchedInfo.some(adm =>
                adm.studentId === values.studentId && adm.batchNumber === values.batchNumber
            );

            if (isAlreadyAssigned) {
                toast.error("This student is already assigned to this batch. Please select a different batch.", {
                    style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black" }
                });
                return;
            }

            // Check how many batches this student is assigned to
            const totalBatchesAssigned = matchedInfo.filter(adm => adm.studentId === values.studentId).length;

            if (totalBatchesAssigned >= 1) {
                toast.error("Multiple batch assignment is restricted. Please contact the super admin for assistance.", {
                    style: { textWrap: "wrap", width: "360px", textAlign: "left", color: "black" }
                });
                return;
            }

            // Check batch capacity
            if (batchAssignedCount >= batchTargetNo) {
                toast.error("Sorry! This batch is full. Please try another batch or contact to super admin.", {
                    style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black" }
                });
                return;
            }
            toast.success(`${values.studentName} is successfully assigned to ${values.batchNumber}!`, {
                style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black" }
            });
            await addAdmission(values);
            handleClose();
        }
    })

    const token = localStorage.getItem('token')
    // console.log(token)

    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const dateFun = (dateString) => {
        if (!dateString) {
            return { month: "", year: "" }
        }
        const date = new Date(dateString)
        // Get the full month name
        const month = date.toLocaleString('default', { month: 'short' });
        // Get the full year
        const year = date.getFullYear();
        // console.log(`${month} ${year}`);
        // console.log(`${month}`)
        return { month, year }
    }

    const a = dateFun(formik.values.admissionDate)
    //console.log(a.month) //['january' '2025']
    // console.log(a.year)

    const addAdmission = async (newAdmission) => {
        //console.log("newAdmission", newAdmission)
        const admission = {
            ...newAdmission,
            studentName: studentValue,
            courseName: courseValue,
            batchNumber: batchValue,
        }
        try {
            console.log("Submitting admission data:", formik.values);
            const res = await axios.post(`${url}/addadmission`, admission, config)
            if (res) {
                let res = await axios.get(`${url}/alladmission`, config)
                // console.log("Successfully a new admission added to the DB!", admission)
                setAdmissionData(res.data.admissionData)
                setTimeout(() => {
                    handleClose()
                }, 1000)
                handleClose()
            }
        } catch (e) {
            console.error("Error adding Admission:", e)
        }
    }
    // console.log(formik)

    const handleStudentNameChange = (e) => {
        const selectedStudentName = e.target.value;
        setStudentValue(selectedStudentName)
        const selectedStudent = studentData.find(
            (element) => element.studentName === selectedStudentName
        );
        if (selectedStudent) {
            //console.log("Selected student", selectedStudent);
            formik.setFieldValue("studentId", selectedStudent._id);
            formik.setFieldValue("studentName", selectedStudent.studentName);
            //console.log("studentName", selectedStudent.studentName);
        }
    };

    const handleAdmissionDateChange = (e) => {
        let res = dateFun(e.target.value)
        console.log(res)
        let month = res.month
        let year = res.year
        //console.log(month, year)
        console.log("e.target.value",e.target.value)
        formik.setFieldValue("admissionDate", e.target.value)
        formik.setFieldValue("admissionMonth", month)
        formik.setFieldValue("admissionYear", year)
    }

    // hide batches whose startDate is > 7 days ago
    const isOlderThan7Days = (dateString) => {
        if (!dateString) return false; // treat missing date as allowed
        const startDate = new Date(dateString);
        const today = new Date();
        const diffInMs = today - startDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays > 7;
    };
    console.log("studentData", studentData);

    
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
                        <Col xs={6} md={6}>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Batch No.</Form.Label>
                                <select
                                    name="batchNumber"
                                    className="form-select"
                                    value={formik.values.batchNumber}
                                    onChange={handleBatchNumber}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Batch</option>

                                    {batchData
                                        // remove batches whose startDate is more than 7 days ago
                                        ?.filter((element) => !isOlderThan7Days(element.startDate))
                                        .map((element) => (
                                            <option key={element.batchNumber} value={element.batchNumber}>
                                                {element.batchNumber}
                                            </option>
                                        ))}
                                </select>

                                {formik.errors.batchNumber && formik.touched.batchNumber && (
                                    <div className="text-danger text-center">{formik.errors.batchNumber}</div>
                                )}
                            </Form.Group>

                        </Col>
                        {/* Status */}
                        <Col className='pt-4 pe-0' >
                            <div>Status</div>
                            <Form.Select
                            disabled
                                name="status"
                                value={formik.values.status || ""}
                                onChange={formik.handleChange}
                                style={{ fontSize: "14px" }}
                            >
                                <option value="Assigned">Assigned</option>
                            </Form.Select>
                        </Col>
                         {/* Course ID */}
                        <Col xs={6} md={6}>
                                {/* AUto generate Course ID */}
                                <Form.Group className='mt-3' >
                                    <Form.Label className='mb-0'>Course ID</Form.Label>
                                    <Form.Control disabled
                                        type="text" placeholder=''
                                        name='courseId' value={formik.values.courseId}
                                        onBlur={formik.handleBlur}
                                    >
                                    </Form.Control>
                                    {formik.errors.courseId && formik.touched.courseId && <div className="text-danger text-center">{formik.errors.courseId}</div>}
                                </Form.Group>
                        </Col>
                        <Col xs={6} md={6}>
                        {/* Select Course Name */}
                        <Form.Group className='mt-3' >
                                <Form.Label className='mb-0'>Course Name</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder=''
                                    name='courseName' value={formik.values.courseName}
                                    onBlur={formik.handleBlur}
                                >
                                </Form.Control>
                                {formik.errors.courseName && formik.touched.courseName && <div className="text-danger text-center">{formik.errors.courseName}</div>}
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>

                        {/* Student Name */}
                        <Col>
                            <Form.Group className="mt-3">
                                <Form.Label className="mb-0">Student Name</Form.Label>
                                <select
                                    name="studentName"
                                    className="form-select"
                                    value={formik.values.studentName}
                                    onChange={handleStudentNameChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">--Select--</option>

                                    {studentData?.filter(student => {
                                            // check if this student is already assigned to any batch
                                            return !admissionData?.some(adm => adm.studentId === student._id);
                                        })
                                        .map(student => (
                                            <option key={student._id} value={student.studentName}>
                                                {student.studentName}
                                            </option>
                                        ))}
                                </select>

                                {formik.errors.studentName && formik.touched.studentName && (
                                    <div className="text-danger text-center">
                                        {formik.errors.studentName}
                                    </div>
                                )}
                            </Form.Group>
                            {/* <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Student ID</Form.Label>
                                <select name="studentId" id="" className="form-select" value={formik.values.studentId} 
                                onChange={handleStudentIdChange}
                                onBlur={formik.handleBlur}
                                >
                                <option value="">Select Student ID</option>
                                    {studentData?.map((element)=>
                         <option key={element._id} value={element._id} >{element._id}</option>
                        )}                       
                            </select>
                            {formik.errors.studentId && formik.touched.studentId && <div className="text-danger text-center">{formik.errors.studentId}</div>}
                            </Form.Group> */}
                        </Col>

                        {/* Student Name */}
                        <Col>
                            {/* <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Student Name</Form.Label>
                            <Form.Control disabled
                            type='text' placeholder='Enter Student Name' name='studentName' value={formik.values.studentName}
                            onBlur={formik.handleBlur}>
                            </Form.Control>       
                                {formik.errors.studentName && formik.touched.studentName && <div className="text-danger text-center">{formik.errors.studentName}</div>}
                            </Form.Group> */}
                            <Form.Group className="mt-3">
                                <Form.Label className="mb-0">Student ID</Form.Label>
                                <Form.Control
                                    disabled
                                    type="text"
                                    name="studentId"
                                    value={formik.values.studentId}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.studentId && formik.touched.studentId && (
                                    <div className="text-danger text-center">{formik.errors.studentId}</div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        {/* Admission Date */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Date</Form.Label>
                                <Form.Control
                                    type="date" placeholder=''
                                    name='admissionDate'
                                    max={new Date().toISOString().split('T')[0]}
                                    //value={formik.values.admissionDate} 
                                    onChange={handleAdmissionDateChange}
                                    onBlur={formik.handleBlur} />
                                {/* console.log(new Date("03-01-2025")) */}
                                {/* Error Message */}
                                {formik.errors.admissionDate && formik.touched.admissionDate && <div className="text-danger text-center">{formik.errors.admissionDate}</div>}
                            </Form.Group>
                        </Col>

                        {/* Admission Month */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Month</Form.Label>
                                <Form.Control disabled
                                    type="text"
                                    placeholder=''
                                    //check
                                    name="admissionMonth"
                                    value={((dateFun(formik.values.admissionDate)).month) || ""}
                                
                                    onBlur={formik.handleBlur}
                                >
                                </Form.Control>

                                {/* Error Message */}
                                {formik.errors.admissionMonth && formik.touched.admissionMonth && (<div role="alert" className="text-danger text-center">{formik.errors.admissionMonth}</div>)}
                            </Form.Group>
                        </Col>

                        {/* Admission Year */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Year</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder=''
                                    name='admissionYear'
                                    value={(dateFun(formik.values.admissionDate)).year}
                                    onBlur={formik.handleBlur}>
                                </Form.Control>

                                {/* Error Message */}
                                {formik.errors.admissionYear && formik.touched.admissionYear && <div className="text-danger text-center">{formik.errors.admissionYear}</div>}
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
                                    name='admissionFee' value={formik.values.admissionFee}
                                    onBlur={formik.handleBlur} />
                                {/* Error Message */}
                                {formik.errors.admissionFee && formik.touched.admissionFee && <div className="text-danger text-center">{formik.errors.admissionFee}</div>}
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">--Select--</option>
                                    <option value={"Social"}>Social</option>
                                    <option value={"Referral"}>Referral</option>
                                    <option value={"Direct"}>Direct</option>
                                </select>
                                {/* Error Message */}
                                {formik.errors.admissionSource && formik.touched.admissionSource && <div className="text-danger text-center">{formik.errors.admissionSource}</div>}
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