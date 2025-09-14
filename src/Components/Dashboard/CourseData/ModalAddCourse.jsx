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

function ModalAddCourse({ show, setShow, setCourseData }) {
  const notify = () => {
    toast.success("Course added successfully !");
  };

  const navigate = useNavigate();
  const handleClose = () => {
    setShow(false);
    navigate('/coursedata');
  };

  // ✅ Yup Schema
  const formSchema = Yup.object().shape({
    courseName: Yup.string().required("Mandatory field !"),
    courseType: Yup.string().required("Mandatory field !"),
    courseTime: Yup.string().required("Mandatory field !"),
    courseAvailability: Yup.string().required("Mandatory field !"),
    courseDuration: Yup.number().required("Mandatory field !"),
    courseFee: Yup.number().required("Mandatory field !"),
    noOfDays: Yup.number().required("Enter Number of Days"),
  });

  const formik = useFormik({
    initialValues: {
      courseName: "",
      courseType: "",
      courseTime: "",
      courseAvailability: "",
      courseDuration: "",
      courseFee: "",
      noOfDays: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      addCourse(values);
    },
  });

  const token = localStorage.getItem('token');

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const addCourse = async (newCourse) => {
    try {
      const res = await axios.post(`${url}/addcourse`, newCourse, config);
      if (res) {
        let res = await axios.get(`${url}/allcourse`, config);
        setCourseData(res.data.courseData);
        notify();
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (e) {
      console.error('Error Adding Course:', e);
      toast.error("Failed to add course. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size='lg' style={{ margin: "10% 0" }}>
      <Modal.Header closeButton>
        <Modal.Title>Add Course</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit} className='px-3' style={{ fontSize: "80%" }}>
        <Modal.Body>
          <Row>
            <Col>
              {/* Course Name */}
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={formik.values.courseName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.courseName && formik.touched.courseName && (
                  <div className="text-danger text-center">{formik.errors.courseName}</div>
                )}
              </Form.Group>
            </Col>

            {/* Course Type */}
            <Col>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Type</Form.Label>
                <Form.Select
                  name="courseType"
                  value={formik.values.courseType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Form.Select>
                {formik.errors.courseType && formik.touched.courseType && (
                  <div className="text-danger text-center">{formik.errors.courseType}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Fee */}
            <Col>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Fee</Form.Label>
                <Form.Control
                  type="number"
                  name="courseFee"
                  value={formik.values.courseFee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.courseFee && formik.touched.courseFee && (
                  <div className="text-danger text-center">{formik.errors.courseFee}</div>
                )}
              </Form.Group>
            </Col>

            {/* Time */}
            <Col>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Time</Form.Label>
                <Form.Select
                  name="courseTime"
                  value={formik.values.courseTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </Form.Select>
                {formik.errors.courseTime && formik.touched.courseTime && (
                  <div className="text-danger text-center">{formik.errors.courseTime}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Availability */}
            <Col xs={4}>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Availability</Form.Label>
                <Form.Select
                  name="courseAvailability"
                  value={formik.values.courseAvailability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
                {formik.errors.courseAvailability && formik.touched.courseAvailability && (
                  <div className="text-danger text-center">{formik.errors.courseAvailability}</div>
                )}
              </Form.Group>
            </Col>

            {/* Duration */}
            <Col xs={4}>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Total Hours</Form.Label>
                <Form.Control
                  type="number"
                  name="courseDuration"
                  value={formik.values.courseDuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.courseDuration && formik.touched.courseDuration && (
                  <div className="text-danger text-center">{formik.errors.courseDuration}</div>
                )}
              </Form.Group>
            </Col>

            {/* Number of Days */}
            <Col xs={4}>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Number of Days</Form.Label>
                <Form.Control
                  type="number"
                  name="noOfDays"
                  value={formik.values.noOfDays}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.noOfDays && formik.touched.noOfDays && (
                  <div className="text-danger text-center">{formik.errors.noOfDays}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button type='submit' style={{ backgroundColor: "#4e73df" }}>
            Add Course
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalAddCourse;
