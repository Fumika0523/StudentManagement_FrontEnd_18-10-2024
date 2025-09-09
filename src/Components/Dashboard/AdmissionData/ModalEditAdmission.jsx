import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';


const ModalEditAdmission = ({ show, setShow, singleAdmission, setAdmissionData }) => {
    console.log(singleAdmission._id)
    const [courseData, setCourseData] = useState([])
    const [studentData,setStudentData] = useState([])
    const [batchData,setBatchData] = useState([])
    
    const token = localStorage.getItem('token')
    // console.log(token)

    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    
    const navigate = useNavigate()
    const handleClose = () => {
        setShow(false)
        navigate('/admissiondata')
    }

    const formSchema = Yup.object().shape({
         batchNumber:Yup.string().required("Please select Batch Number!"),
        courseId: Yup.string().required("Mandatory field!"),
        studentId: Yup.string().required(("Mandatory field!")),
        courseName: Yup.string().required(("Mandatory field!")),
        studentName: Yup.string().required(("Mandatory field!")),
        admissionSource: Yup.string().required(("Mandatory field!")),
        admissionFee: Yup.number().required(("Mandatory field!")),
        admissionDate: Yup.date().required(("Mandatory field!")),
        admissionYear: Yup.number().required(("Mandatory field!")),
        admissionMonth: Yup.string(),
    })


    const formik = useFormik({
        initialValues: {
            batchNumber: singleAdmission?.batchNumber,
            courseId: singleAdmission?.courseId,
            studentId: singleAdmission?.studentId,
            studentName: singleAdmission?.studentName,
            courseName: singleAdmission?.courseName,
            admissionSource: singleAdmission?.admissionSource,
            admissionFee: singleAdmission?.admissionFee,
            admissionDate: singleAdmission.admissionDate
            ? new Date(singleAdmission.admissionDate).toISOString().split('T')[0]
        : "",
            admissionYear: singleAdmission?.admissionYear,
            admissionMonth: singleAdmission?.admissionMonth
        },
        validationSchema: formSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            //console.log(values)
            //console.log(formik)
            updateAdmission(values)
        }
    })
    //console.log(singleAdmission.admissionDate)

    const formatDate = (dateString) => {
        console.log(dateString)
        const date = new Date(dateString);
        console.log(date)
        return date.toLocaleDateString('en-US', {
            year: "numeric",
            month: 'short',
            day: 'numeric'
        })
    }
    // console.log(new Date("03-01-2025"))

    const dateFun = (dateString) => {
        const date = new Date(dateString)
        // Get the full month name
        const month = date.toLocaleString('default', { month: 'long' });
        // Get the full year
        const year = date.getFullYear();
       // console.log(`${month} ${year}`);
        return { month, year }
    }

    const a = dateFun(formik.values.admissionDate)
   // console.log(a.month) //['january' '2025']
    //console.log(a.year)

    const updateAdmission = async (updatedAdmission) => {
        try {
            let res = await axios.put(`${url}/updateadmission/${singleAdmission._id}`, updatedAdmission, config)
            console.log("updated studentName",res.data.updateAdmission.studentName)
            const updatedStudent = res.data.updateAdmission.studentName
            if (res) {
                let res = await axios.get(`${url}/alladmission`, config)
                    toast.success(`Successfully Updated for ${updatedStudent}`, {
                        style: {
                          textWrap: "nowrap",
                          textAlign: "center",
                          color: "black",
                          fontSize:"14px"
                        },
                      });
                console.log("Successfully Updated the Admission", updatedAdmission)
                setAdmissionData(res.data.admissionData)
                   setTimeout(() => {
                handleClose()
            }, 1000)
                handleClose()
            }
        } catch (e) {
            console.error("Error in Editting Admission:", e)
        }
    }
    //Batch Data
      const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }
    //student Data
    const getStudentData = async () => {
        console.log("Student data is called.")
        let res = await axios.get(`${url}/allstudent`, config)
       // console.log("Student Data", res.data.studentData)
        setStudentData(res.data.studentData)
    }

    //Original Course Data
     const getCourseData = async () => {
            console.log("Console data is called....")
            let res = await axios.get(`${url}/allcourse`, config)
         //   console.log("Course Data", res.data.courseData)
            setCourseData(res.data.courseData)
    }
        useEffect(() => {
            getCourseData()
            getStudentData()
            getBatchData()
        }, [])
        console.log(courseData)
 
        const handleBatchChange = (e) => {
         console.log("handleBatchChange",e.target.value)
        const selectedBatchNumber = e.target.value;
        console.log("selectedBatchNumber",selectedBatchNumber)
            // setBatchValue(selectedBatchNumber)
        const selectedBatch = batchData.find(
            (element) => element.batchNumber === selectedBatchNumber
        );
               console.log("selected Batch",selectedBatch)
        if (selectedBatch) {
            formik.setFieldValue("batchNumber", selectedBatch.batchNumber);
        }
    };
    const handleCourseIdChange = (e) => {
        // formik.handleChange === e.target.value
        //console.log("handleCourseIdChange",e.target.value)
        const selectedCourseId = e.target.value
        //find() >> Array Method
        const selectedCourse = courseData.find((element) => element._id == selectedCourseId)
        console.log(selectedCourse.courseName)
        console.log(selectedCourse.courseFee)

        formik.setFieldValue("courseId", selectedCourseId)
        formik.setFieldValue("courseName", selectedCourse.courseName)
        formik.setFieldValue("admissionFee", selectedCourse.courseFee)
    }

    const handleStudentIdChange = (e) => {
        console.log(e.target.value)
        const selectedStudentId = e.target.value
        //find()
        const selectedStudent = studentData.find((element) => element._id == selectedStudentId)
        console.log(selectedStudent.studentName)
        formik.setFieldValue("studentId", selectedStudentId)
        formik.setFieldValue("studentName", (selectedStudent.studentName))
    }



    return (
        <Modal show={show} onHide={handleClose}
            size="lg">
            <Modal.Header>
                <Modal.Title className='ms-5'>Edit Admission</Modal.Title>
            </Modal.Header>
            <Form onSubmit={formik.handleSubmit} className='px-5'
            >
                <Modal.Body>
                    <Row>
                         <Col>
                            {/* Select Batch Number */}
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Batch No.</Form.Label>
                                <select name="batchNumber" id="" className="form-select"
                                    value={formik.values.batchNumber}
                                    // onChange={formik.handleChange} //e.target.value
                                    onChange={handleBatchChange}
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
                            {/* Course ID << Editable*/}
                            <Form.Group>
                                <Form.Label>Course ID</Form.Label>
                                <select name="courseId" id="" className="form-select" value={formik.values.courseId}
                                    // onChange={formik.handleChange} //e.target.value
                                    onChange={handleCourseIdChange}
                                >
                                    <option value="">Select Course ID</option>
                                    {courseData?.map((element) =>
                                        <option key={element._id}
                                            value={element._id} >{element._id}</option>
                                    )}
                                </select>
                                {/* Error Message */}
                                {formik.errors.courseId && <div className="text-danger text-center">{formik.errors.courseId}</div>}
                            </Form.Group>
                        </Col>

                        {/* Course Name */}
                        <Col>
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
                        {/* Student ID <<< NOT Editable but pre-filled*/}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Student ID</Form.Label>
                                <select disabled name="studentId" id="" className="form-select" value={formik.values.studentId}
                                    // onChange={formik.handleChange}
                                    onChange={handleStudentIdChange}
                                >
                                    <option value="">Select Student ID</option>
                                    {studentData?.map((element) =>
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
                        {/* Admission Date << Editable */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Date</Form.Label>
                                <Form.Control
                                    type="date" placeholder='Type your Admission Date'
                                    name='admissionDate' value={formik.values.admissionDate} onChange={formik.handleChange
                                    } />
                                {/* console.log(new Date("03-01-2025")) */}
                                {/* Error Message */}
                                {formik.errors.admissionDate && <div className="text-danger text-center">{formik.errors.admissionDate}</div>}
                            </Form.Group>
                        </Col>

                        {/* Admission Month */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Month</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder='Month'
                                    //check
                                    name="admissionMonth" value={(dateFun(formik.values.admissionDate)).month} onChange={formik.handleChange} />
                                {/* Error Message */}
                                {formik.errors.admissionMonth && <div className="text-danger text-center">{formik.errors.admissionMonth}</div>}
                            </Form.Group>
                        </Col>
                        {/* Admission Year */}
                        <Col>
                            <Form.Group className='mt-3'>
                                <Form.Label className='mb-0'>Year</Form.Label>
                                <Form.Control disabled
                                    type="text" placeholder='Year'
                                    name='admissionYear' value={(dateFun(formik.values.admissionDate)).year}
                                    onChange={formik.handleChange} />
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
                                    name='admissionFee' value={formik.values.admissionFee} />
                                {/* Error Message */}
                                {formik.errors.admissionFee && <div className="text-danger text-center">{formik.errors.admissionFee}</div>}
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* Admission Source << Editable */}
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
                    {/* ADD BUTTON */}
                    <Button type="submit" style={{ backgroundColor: "#4e73df" }}>Update Admission</Button>
                    {/* CLOSE BUTTON*/}
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ModalEditAdmission