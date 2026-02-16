// src/components/BatchData/CreateBatch/ModalAddBatch.jsx
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { batchInitialValues, formSchema } from './BatchSchema';
import { Box } from '@mui/material';

// Material-UI Icons
import {
  GroupAdd,
  School,
  CalendarMonth,
  AccessTime,
  LocationOn,
  People,
  AttachMoney,
  Tag,
  Event,
  Wifi,
  WifiOff,
} from '@mui/icons-material';

/**
 * Add Batch Modal - Redesigned with modern gradient header and icons
 * Matches the style of ModalAddStudent
 */
function ModalAddBatch({ show, setShow, setBatchData }) {
  const [courseData, setCourseData] = useState([]);
  const [nextBatchNo, setNextBatchNo] = useState("");

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
  };

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const formik = useFormik({
    initialValues: batchInitialValues,
    validationSchema: formSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        batchNumber: nextBatchNo,
        fees: values.courseFee
      };
      addBatch(payload);
    }
  });

  // Fetch courses
  const getCourseData = async () => {
    try {
      const res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch next batch number
  const fetchNextBatchNo = async () => {
    try {
      const res = await axios.get(`${url}/nextbatchno`, config);
      setNextBatchNo(res.data.newBatch);
      formik.setFieldValue("batchNumber", res.data.newBatch);
    } catch (err) {
      console.error("Error fetching next batch no:", err);
      toast.error("Failed to get next batch number");
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  useEffect(() => {
    if (show) {
      fetchNextBatchNo();
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
      setBatchData(res.data.batchData);
      toast.success(`${newBatch.batchNumber} is added successfully!`);
      setTimeout(() => handleClose(), 600);
    } catch (e) {
      console.error("Error Adding Batch:", e);
      if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Failed to add batch. Please try again.");
      }
    }
  };

  // Label style
  const labelStyle = {
    fontWeight: 600,
    fontSize: "12px",
    color: "#475569",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  // Input style
  const inputStyle = {
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
  };

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{ "--bs-modal-border-radius": "16px" }}
    >
      {/* Header with gradient */}
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
        }}
      >
        <Modal.Title
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          <GroupAdd sx={{ fontSize: "32px" }} />
          Add New Batch
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
          {/* Row 1: Batch No, Course Name */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <Tag sx={{ fontSize: 14 }} />
                  Batch Number
                </Form.Label>
                <Form.Control
                  type="text"
                  name="batchNumber"
                  value={formik.values.batchNumber}
                  disabled
                  style={disabledInputStyle}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <School sx={{ fontSize: 14 }} />
                  Course Name
                </Form.Label>
                <Form.Select
                  name="courseName"
                  value={formik.values.courseName}
                  onChange={handleCourseNameChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">Select Course</option>
                  {courseData.map(c => (
                    <option key={c._id} value={c.courseName}>{c.courseName}</option>
                  ))}
                </Form.Select>
                {formik.errors.courseName && formik.touched.courseName && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.courseName}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: Start Date, Session Type, Session Day */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <CalendarMonth sx={{ fontSize: 14 }} />
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.errors.startDate && formik.touched.startDate && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.startDate}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <Wifi sx={{ fontSize: 14 }} />
                  Session Type
                </Form.Label>
                <Form.Select
                  name="sessionType"
                  value={formik.values.sessionType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">Select Type</option>
                  <option value="Online">🌐 Online</option>
                  <option value="At School">🏫 At School</option>
                </Form.Select>
                {formik.errors.sessionType && formik.touched.sessionType && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.sessionType}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <Event sx={{ fontSize: 14 }} />
                  Session Day
                </Form.Label>
                <Form.Select
                  name="sessionDay"
                  value={formik.values.sessionDay}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">Select Day</option>
                  <option value="Weekday">📅 Weekday</option>
                  <option value="Weekend">🎉 Weekend</option>
                </Form.Select>
                {formik.errors.sessionDay && formik.touched.sessionDay && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.sessionDay}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3: Target Student, Location */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <People sx={{ fontSize: 14 }} />
                  Target Student
                </Form.Label>
                <Form.Control
                  type="text"
                  name="targetStudent"
                  value={formik.values.targetStudent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., 15 students"
                  style={inputStyle}
                />
                {formik.errors.targetStudent && formik.touched.targetStudent && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.targetStudent}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <LocationOn sx={{ fontSize: 14 }} />
                  Location
                </Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Room 101 or Online"
                  style={inputStyle}
                />
                {formik.errors.location && formik.touched.location && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.location}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4: Session Time, Course Fee */}
          <Row className="g-2">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  Session Time
                </Form.Label>
                <Form.Select
                  name="sessionTime"
                  value={formik.values.sessionTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">Select Time</option>
                  <option value="Morning">🌅 Morning</option>
                  <option value="Afternoon">☀️ Afternoon</option>
                  <option value="Evening">🌆 Evening</option>
                </Form.Select>
                {formik.errors.sessionTime && formik.touched.sessionTime && (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.sessionTime}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <AttachMoney sx={{ fontSize: 14 }} />
                  Course Fee
                </Form.Label>
                <Form.Control
                  type="text"
                  name="courseFee"
                  value={formik.values.courseFee}
                  disabled
                  style={disabledInputStyle}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        {/* Footer with styled buttons */}
        <Modal.Footer
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "12px 20px",
            backgroundColor: "#ffffff",
            borderRadius: "0 0 16px 16px",
            gap: "8px",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              fontWeight: "600",
              fontSize: "13px",
              padding: "7px 18px",
              borderRadius: "6px",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              fontWeight: "600",
              fontSize: "13px",
              padding: "7px 20px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {formik.isSubmitting ? "Adding..." : "Add Batch"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalAddBatch;