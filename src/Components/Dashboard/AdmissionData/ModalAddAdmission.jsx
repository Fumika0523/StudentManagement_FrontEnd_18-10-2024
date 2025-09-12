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

const ModalAddAdmission = ({ show, setShow, setAdmissionData,admissionData, studentData,setStudentData }) => {
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
        //  console.log("selectedBatchNumber",selectedBatchNumber)
        setBatchValue(selectedBatchNumber)
        const selectedBatch = batchData.find(
            (element) => element.batchNumber === selectedBatchNumber
        );
        //  console.log("selected Batch",selectedBatch)
        //console.log("Batch assignedStudentCount",selectedBatch.assignedStudentCount)
        setBatchAssignedCount(selectedBatch.assignedStudentCount)
        console.log("BatchAssignedCo", batchAssignedCount)
        setBatchTargetNo(selectedBatch.targetStudent)
        console.log("Batch Target No,", batchTargetNo)
        // console.log("selected Batch' courseName",selectedBatch.courseName )
        if (selectedBatch) {
            formik.setFieldValue("batchNumber", selectedBatch.batchNumber);
            formik.setFieldValue("courseName", selectedBatch.courseName);
            setCourseValue(selectedBatch.courseName)
        }
        else {
            res.send({ message: "Please check again" })
        }
        const selectedCourse = courseData.find(
            (element) => element.courseName === selectedBatch.courseName
        )
        console.log(selectedCourse)
        formik.setFieldValue("courseId", selectedCourse._id)
        formik.setFieldValue("admissionFee", selectedCourse.courseFee)
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

    //student Data


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
        },
        validationSchema: formSchema,
        enableReinitialize: true,
onSubmit: async (values) => {
  console.log("Form values on submit:", values); 
  console.log("Current admissionData:", admissionData);
  console.log("Current studentData:", studentData);

  const matchedInfo = admissionData?.map(adm2 => {
    console.log("Checking admission:", adm2);
    const student = studentData?.find(stu => stu._id === adm2.studentId);
    console.log("Matched student from studentData:", student);

    if (student) {
      const info = { studentName: student.studentName, batchNumber: adm2.batchNumber, studentId: adm2.studentId };
      console.log("Info to add to matchedInfo:", info);
      return info;
    }
  }).filter(Boolean);

  console.log("Final matchedInfo array:", matchedInfo);

  const isAlreadyAssigned = matchedInfo.some(adm => {
    console.log("Comparing with matchedInfo:", adm);
    console.log("Current form values:", values.studentId, values.batchNumber);
    return adm.studentId === values.studentId && adm.batchNumber === values.batchNumber;
  });

  console.log("isAlreadyAssigned:", isAlreadyAssigned);

  if (isAlreadyAssigned) {
    console.log("Student already assigned. Stopping submission.");
    toast.error("This student is already assigned to this batch. Please select a different batch.", {
        style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black", }
    });
    return;
  }

  console.log("Batch Assigned Count:", batchAssignedCount, "Batch Target No:", batchTargetNo);

  if (batchAssignedCount >= batchTargetNo) {
    console.log("Batch is full. Stopping submission.");
    toast.error("Sorry! This batch is full. Try another batch.", {style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black", }});
    return;
  }

  console.log("All checks passed. Submitting admission for:", values);
  toast.success("Successfully assigned!", {style: { textWrap: "wrap", width: "250px", textAlign: "left", color: "black", }});
  await addAdmission(values);
  console.log("Admission added. Closing modal.");
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

    // const formatDate = (dateString) => {
    //     console.log(dateString)
    //     const date = new Date(dateString);
    //     console.log(date)
    //     return date.toLocaleDateString('en-US', {
    //         year: "numeric",
    //         month: 'long',
    //         day: 'numeric'
    //     })
    // }
    // console.log(new Date("03-01-2025"))

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
    //console.log("addAdmission", res.data)
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
        console.log(month, year)
        formik.setFieldValue("admissionDate", e.target.value)
        formik.setFieldValue("admissionMonth", month)
        formik.setFieldValue("admissionYear", year)
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
                            {/* Select Batch Number */}
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Batch No.</Form.Label>
                                <select name="batchNumber" id="" className="form-select"
                                    value={formik.values.batchNumber}
                                    // onChange={formik.handleChange} //e.target.value
                                    onChange={handleBatchNumber}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Batch</option>
                                    {batchData?.map((element) =>
                                        <option key={element.batchNumber}
                                            value={element.batchNumber} >{element.batchNumber}</option>
                                    )}
                                    {/* <option value="677a1998ed75982c18d258fb" >677a1998ed75982c18d258fb</option>  */}
                                </select>
                                {/* Error Message */}
                                {formik.errors.batchNumber && formik.touched.batchNumber && <div className="text-danger text-center" >{formik.errors.batchNumber}</div>}
                            </Form.Group>
                        </Col>
                        <Col>
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
                        <Col>
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
                                    <option value="">Select Student Name</option>
                                    {studentData?.map((element) => (
                                        <option key={element._id} value={element.studentName}>
                                            {element.studentName}
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
                                    //value={formik.values.admissionDate} 
                                    //onChange={formik.handleChange}
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
                                    <option value="">Select Admission Source</option>
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