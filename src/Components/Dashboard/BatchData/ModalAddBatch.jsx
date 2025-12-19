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
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ModalAddBatch({ show, setShow, setBatchData }) {
  const [courseData, setCourseData] = useState([]);
  const [nextBatchNo, setNextBatchNo] = useState(""); // auto batch no

  const token = localStorage.getItem('token');

  const handleClose = () => {
    setShow(false);
  };

  const formSchema = Yup.object().shape({
    courseName: Yup.string().required("Mandatory Field!"),
    sessionType: Yup.string().required("Mandatory Field!"),
    sessionDay: Yup.string().required("Mandatory Field!"),
    sessionTime: Yup.string().required("Mandatory Field!"),
    targetStudent: Yup.string().required("Mandatory Field!"),
    location: Yup.string().required("Mandatory Field!"),
  });

  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      sessionType: "",
      courseName: "",
      sessionDay: "",
      sessionTime: "",
      targetStudent: "",
      location: "",
      courseFee: ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const payload = { 
        ...values, 
        batchNumber: nextBatchNo, 
        fees: values.courseFee // map courseFee to fees for backend
      };
      addBatch(payload);
    }
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch courses
  const getCourseData = async () => {
    const res = await axios.get(`${url}/allcourse`, config);
    setCourseData(res.data.courseData);
  };
  useEffect(() => {
    getCourseData();
  }, []);

  // Fetch next batch number whenever modal opens
  const fetchNextBatchNo = async () => {
    try {
      const res = await axios.get(`${url}/nextbatchno`, config);
      //console.log("fetchNextBatchNo",res.data.newBatch)
      setNextBatchNo(res.data.newBatch);
      formik.setFieldValue("batchNumber", res.data.newBatch);
    } catch (err) {
      //console.error("Error fetching next batch no:", err);
      toast.error("Failed to get next batch number");
    }
  };
  useEffect(() => {
    if (show) {
     // formik.resetForm();   // reset form on modal open
      fetchNextBatchNo();   // fetch latest batch number
    }
  }, [show]);

  const handleCourseNameChange = (e) => {
    const selectedCourseName = e.target.value;
    const selectedCourse = courseData.find(c => c.courseName === selectedCourseName);
    if (selectedCourse) {
      formik.setFieldValue("courseId", selectedCourse._id);
      formik.setFieldValue("courseName", selectedCourse.courseName);
      formik.setFieldValue("courseFee", selectedCourse.courseFee);
    }
  };


  const addBatch = async (newBatch) => {
    try {
      await axios.post(`${url}/addbatch`, newBatch, config);
      const res = await axios.get(`${url}/allbatch`, config);
      //console.log("res",res.data.batchData)
      setBatchData(res.data.batchData);
        setTimeout(() => handleClose(), 1000);
      toast.success("Batch added successfully!");
    } catch (e) {
     // console.error("Error Adding Batch:", e);
      toast.error("Failed to add batch.");
    }
  };
// console.log("nextBatchNo",nextBatchNo)

  return (
    <Modal show={show} onHide={handleClose} size="lg" style={{ margin: "8% 0%" }}>
      <Modal.Header closeButton>
        <Modal.Title>Add Batch</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit} className="px-3" style={{ fontSize: "80%" }}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Batch No.</Form.Label>
                <Form.Control type="text" name="batchNumber" value={formik.values.batchNumber}  disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Course Name</Form.Label>
                <select
                  name="courseName"
                  className="form-select"
                  value={formik.values.courseName}
                  onChange={handleCourseNameChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Course</option>
                  {courseData.map(c => (
                    <option key={c._id} value={c.courseName}>{c.courseName}</option>
                  ))}
                </select>
                {formik.errors.courseName && formik.touched.courseName && (
                  <div className="text-danger text-center">{formik.errors.courseName}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
             <Col>
              <Form.Group className='my-3'>
                <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" placeholder="" name="startDate"
                    value={formik.values.startDate}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                {formik.errors.startDate && formik.touched.startDate && (
                  <div className="text-danger text-center">{formik.errors.startDate}</div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Session Type</Form.Label>
                <Form.Select
                  name="sessionType"
                  value={formik.values.sessionType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Session Type</option>
                  <option value="Online">Online</option>
                  <option value="At School">At School</option>
                </Form.Select>
                {formik.errors.sessionType && formik.touched.sessionType && (
                  <div className="text-danger text-center">{formik.errors.sessionType}</div>
                )}
              </Form.Group>
            </Col>
                   {/* Session Day */}
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Session Day</Form.Label>
                <Form.Select
                  name="sessionDay"
                  value={formik.values.sessionDay}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Session Day</option>
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                </Form.Select>
                {formik.errors.sessionDay && formik.touched.sessionDay && (
                  <div className="text-danger text-center">{formik.errors.sessionDay}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Target Student</Form.Label>
                <Form.Control
                  type="text"
                  name="targetStudent"
                  value={formik.values.targetStudent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Type your Target Student"
                />
                {formik.errors.targetStudent && formik.touched.targetStudent && (
                  <div className="text-danger text-center">{formik.errors.targetStudent}</div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Type your Location"
                />
                {formik.errors.location && formik.touched.location && (
                  <div className="text-danger text-center">{formik.errors.location}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Session Time</Form.Label>
                <Form.Select
                  name="sessionTime"
                  value={formik.values.sessionTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Session Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </Form.Select>
                {formik.errors.sessionTime && formik.touched.sessionTime && (
                  <div className="text-danger text-center">{formik.errors.sessionTime}</div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='my-3'>
                <Form.Label>Course Fee</Form.Label>
                <Form.Control type="text" name="courseFee" value={formik.values.courseFee} disabled />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button style={{ backgroundColor: "#4e73df" }} type="submit">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalAddBatch;

