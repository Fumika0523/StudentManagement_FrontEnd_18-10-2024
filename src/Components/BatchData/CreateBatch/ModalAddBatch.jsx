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
import { calcEndDate } from '../calcEndDate'; 

import {
  GroupAdd, School, CalendarMonth,
  AccessTime, People, AttachMoney, Tag, Event, Wifi,
} from '@mui/icons-material';
import ModalHeaderBlock from '../../Common/ModalHeaderBlock';
import ModalFooterBlock from '../../Common/ModalFooterBlock';

function ModalAddBatch({ show, setShow, setBatchData }) {
  const [courseData, setCourseData] = useState([]);
  const [nextBatchNo, setNextBatchNo] = useState("");
  const [endDate, setEndDate] = useState(""); // auto-calculated, display only

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const formik = useFormik({
    initialValues: batchInitialValues,
    validationSchema: formSchema,
    onSubmit: (values) => {
      addBatch({ ...values, batchNumber: nextBatchNo, fees: values.courseFee, endDate });
    }
  });

  const getCourseData = async () => {
    try {
      const res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

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

  useEffect(() => { getCourseData(); }, []);
  useEffect(() => { if (show) fetchNextBatchNo(); }, [show]);

  // Recalculate end date whenever startDate or courseName changes
  useEffect(() => {
    const selectedCourse = courseData.find(c => c.courseName === formik.values.courseName);
    const calculated = calcEndDate(formik.values.startDate, selectedCourse?.noOfDays);
    setEndDate(calculated);
  }, [formik.values.startDate, formik.values.courseName, courseData]);

  const handleCourseNameChange = (e) => {
    const selectedCourse = courseData.find(c => c.courseName === e.target.value);
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
      toast.success(`${newBatch.batchNumber} added successfully!`);
      setTimeout(() => handleClose(), 600);
    } catch (e) {
      console.error("Error Adding Batch:", e);
      toast.error(e.response?.data?.message || "Failed to add batch. Please try again.");
    }
  };

  const labelStyle = {
    fontWeight: 600, fontSize: "12px", color: "#475569",
    marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px",
  };
  const inputStyle = {
    borderRadius: "8px", padding: "9px 12px", fontSize: "13px",
    border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#1e293b",
  };
  const disabledInputStyle = {
    ...inputStyle, backgroundColor: "#f8fafc", color: "#94a3b8",
    cursor: "not-allowed", border: "1px solid #f1f5f9",
  };
  const errorStyle = { fontSize: "11px", marginTop: "4px", color: "#ef4444" };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered style={{ "--bs-modal-border-radius": "16px" }}>
    <ModalHeaderBlock title="Add Batch" icon={ <GroupAdd />}/>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "24px", backgroundColor: "#f9fafb" }}>
          {/* Row 1: Batch No + Course Name */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={6}>
              <Form.Label style={labelStyle}><Tag sx={{ fontSize: 14 }} />Batch Number</Form.Label>
              <Form.Control type="text" name="batchNumber" value={formik.values.batchNumber} disabled style={disabledInputStyle} />
            </Col>
            <Col xs={12} md={6}>
              <Form.Label style={labelStyle}><School sx={{ fontSize: 14 }} />Course Name</Form.Label>
              <Form.Select name="courseName" value={formik.values.courseName} onChange={handleCourseNameChange} onBlur={formik.handleBlur} style={inputStyle}>
                <option value="">Select Course</option>
                {courseData.map(c => <option key={c._id} value={c.courseName}>{c.courseName}</option>)}
              </Form.Select>
              {formik.errors.courseName && formik.touched.courseName && <div style={errorStyle}>{formik.errors.courseName}</div>}
            </Col>
          </Row>

          {/* Row 2: Start Date + End Date (auto) + Session Type */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><CalendarMonth sx={{ fontSize: 14 }} />Start Date</Form.Label>
              <Form.Control type="date" name="startDate" value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle} />
              {formik.errors.startDate && formik.touched.startDate && <div style={errorStyle}>{formik.errors.startDate}</div>}
            </Col>

            {/* End date is auto-calculated from startDate + course noOfDays */}
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><CalendarMonth sx={{ fontSize: 14 }} />End Date (auto)</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                disabled
                style={disabledInputStyle}
                placeholder="Select course & start date"
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><Wifi sx={{ fontSize: 14 }} />Session Type</Form.Label>
              <Form.Select name="sessionType" value={formik.values.sessionType} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle}>
                <option value="">Select Type</option>
                <option value="Online">🌐 Online</option>
                <option value="At School">🏫 At School</option>
              </Form.Select>
              {formik.errors.sessionType && formik.touched.sessionType && <div style={errorStyle}>{formik.errors.sessionType}</div>}
            </Col>
          </Row>

          {/* Row 3: Session Day + Session Time + Target Students */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><Event sx={{ fontSize: 14 }} />Session Day</Form.Label>
              <Form.Select name="sessionDay" value={formik.values.sessionDay} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle}>
                <option value="">Select Day</option>
                <option value="Weekday">📅 Weekday</option>
                <option value="Weekend">🎉 Weekend</option>
              </Form.Select>
              {formik.errors.sessionDay && formik.touched.sessionDay && <div style={errorStyle}>{formik.errors.sessionDay}</div>}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><AccessTime sx={{ fontSize: 14 }} />Session Time</Form.Label>
              <Form.Select name="sessionTime" value={formik.values.sessionTime} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle}>
                <option value="">Select Time</option>
                <option value="Morning">🌅 Morning</option>
                <option value="Afternoon">☀️ Afternoon</option>
                <option value="Evening">🌆 Evening</option>
              </Form.Select>
              {formik.errors.sessionTime && formik.touched.sessionTime && <div style={errorStyle}>{formik.errors.sessionTime}</div>}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><People sx={{ fontSize: 14 }} />Target Students</Form.Label>
              <Form.Control type="number" name="targetStudent" value={formik.values.targetStudent} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. 20" min={1} style={inputStyle} />
              {formik.errors.targetStudent && formik.touched.targetStudent && <div style={errorStyle}>{formik.errors.targetStudent}</div>}
            </Col>
          </Row>

          {/* Row 4: Course Fee */}
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><AttachMoney sx={{ fontSize: 14 }} />Course Fee</Form.Label>
              <Form.Control type="text" name="courseFee" value={formik.values.courseFee} disabled style={disabledInputStyle} />
            </Col>
          </Row>
        </Modal.Body>
        <ModalFooterBlock onClose={handleClose} submitText="Submit" submitting={formik.isSubmitting}/>
      </Form>
    </Modal>
  );
}

export default ModalAddBatch;