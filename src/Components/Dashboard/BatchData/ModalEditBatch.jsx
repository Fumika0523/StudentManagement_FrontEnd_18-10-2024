import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';


const ModalEditBatch = ({ show, setShow, singleBatch, setBatchData }) => {
    console.log(singleBatch)
    console.log(singleBatch._id)

    const navigate = useNavigate()
    const handleClose = () => {
        setShow(false)
        navigate('/batchdata')
    }

    const formSchema = Yup.object().shape({
        batchNumber: Yup.string().required("Mandatory Field !"),
        courseName: Yup.string().required("Mandatory Field !"),
        sessionDay: Yup.string().required("Mandatory Field !"),
        targetStudent: Yup.string().required("Mandatory Field !"),
        location: Yup.string().required("Mandatory Field !"),
        sessionTime: Yup.string().required("Mandatory Field !"),
        fees: Yup.number().required("Mandatory Field !")
    })

    const formik = useFormik({
        initialValues: {
            batchNumber: singleBatch?.batchNumber,
            courseName: singleBatch?.courseName,
            sessionType: singleBatch?.sessionType,
            sessionDay: singleBatch?.sessionDay,
            targetStudent: singleBatch?.targetStudent,
            location: singleBatch?.location,
            sessionTime: singleBatch?.sessionTime,
            fees: singleBatch?.fees
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            updateBatch(values)
        }
    })
    console.log(singleBatch)

    const token = sessionStorage.getItem('token')
    console.log(token)

    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    //Update
    const updateBatch = async (updatedBatch) => {
        console.log("Batch posted to the DB")
        try {
            let res = await axios.put(`${url}/updatebatch/${singleBatch._id}`, updatedBatch, config)
            console.log(res)
            if (res) {
                let res = await axios.get(`${url}/allbatch`, config)
                console.log("successfully updated the Batch", updatedBatch)
                setBatchData(res.data.batchData)
                handleClose()
            }
        } catch (e) {
            console.error('Error Editing Batch:', e);
        }
    }

    return (
        <>
            <Modal
                show={show} onHide={handleClose}
                size="lg" style={{ margin: "8% 0%" }} >
                <Modal.Header closeButton>
                    <Modal.Title  >Add Batch</Modal.Title>
                </Modal.Header>
                <Form onSubmit={formik.handleSubmit} className='px-5' style={{ fontSize: "80%" }}>
                    <Modal.Body>
                        <Row>
                            <Col>
                                {/* Batch Number*/}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Batch No.</Form.Label>
                                    <Form.Control type="text"
                                        placeholder='Type your Batch No.'
                                        name="batchNumber"
                                        value={formik.values.batchNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.batchNumber && formik.touched.batchNumber && <div className="text-danger text-center">{formik.errors.batchNumber}</div>}
                                </Form.Group>
                            </Col>
                            <Col>
                                {/* Course Name */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Course Name</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Course Name' name="courseName"
                                        value={formik.values.courseName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.courseName && formik.touched.courseName && <div className="text-danger text-center">{formik.errors.courseName}</div>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Session Type */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Session Type</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Session Type' name="sessionType"
                                        value={formik.values.sessionType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.batchNumber && formik.touched.batchNumber && <div className="text-danger text-center">{formik.errors.batchNumber}</div>}
                                </Form.Group>
                            </Col>
                            <Col>
                                {/* Session Day */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Session Day</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Session Day' name="sessionDay"
                                        value={formik.values.sessionDay}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.sessionDay && formik.touched.sessionDay && <div className="text-danger text-center">{formik.errors.sessionDay}</div>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Target Student */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Target Student</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Target Student' name="targetStudent"
                                        value={formik.values.targetStudent}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.targetStudent && formik.touched.targetStudent && <div className="text-danger text-center">{formik.errors.targetStudent}</div>}
                                </Form.Group>
                            </Col>
                            <Col>
                                {/* Location */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Location</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Location' name='location'
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.location && formik.touched.location && <div className="text-danger text-center">{formik.errors.location}</div>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                {/* Session Time */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Session Time</Form.Label>
                                    <Form.Control type="text" placeholder='Type your Session Time' name="sessionTime"
                                        value={formik.values.sessionTime}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.sessionTime && formik.touched.sessionTime && <div className="text-danger text-center">{formik.errors.sessionTime}</div>}
                                </Form.Group>
                            </Col>
                            <Col>
                                {/* Fees */}
                                <Form.Group className='my-3'>
                                    <Form.Label className='m-0'>Fees</Form.Label>
                                    <Form.Control type="number" placeholder='Type your Fees' name="fees"
                                        value={formik.values.fees}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {/* Error Message */}
                                    {formik.errors.fees && formik.touched.fees && <div className="text-danger text-center">{formik.errors.fees}</div>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* ADD */}
                        <Button style={{ backgroundColor: "#4e73df" }}
                            type="submit"
                        >
                            Save Changes
                        </Button>
                        {/* CLOSE */}
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
export default ModalEditBatch
