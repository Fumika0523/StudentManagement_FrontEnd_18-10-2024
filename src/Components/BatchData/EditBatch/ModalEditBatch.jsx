import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { calcEndDate } from '../calcEndDate';

import {
  Edit, School, CalendarMonth,
  AccessTime, People, AttachMoney, Tag, Event, Wifi, CheckBox,
} from '@mui/icons-material';

const ModalEditBatch = ({ show, setShow, singleBatch, setBatchData, courseData }) => {
  const navigate = useNavigate();
  const courses = Array.isArray(courseData) ? courseData : [];
  const role = localStorage.getItem("role");
  const isStaff = role === "staff";

  const approval = singleBatch?.approvalStatus ?? "none";

  const [isLocked, setIsLocked] = useState(false);
  const [checkboxes, setCheckboxes] = useState({ assign: false, deassign: false, dropout: false, certificate: false });
  const allChecked = Object.values(checkboxes).every(Boolean);
  const [batchStatus, setBatchStatus] = useState(singleBatch?.status);
  const [endDate, setEndDate] = useState(""); // ✅ auto-calculated end date

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleClose = () => { setShow(false); navigate('/batchdata'); };

  const isTrainingCompleted = batchStatus === "Training Completed";
  const canSelectBatchCompleted = isTrainingCompleted && allChecked && isStaff && approval === "approved";
  const canEditWhenTrainingCompleted = isStaff && approval === "approved";
  const canEditFields = !isTrainingCompleted || canEditWhenTrainingCompleted;

  const formSchema = Yup.object().shape({
    batchNumber: Yup.string().required("Mandatory Field !"),
    courseName: Yup.string().required("Mandatory Field !"),
    sessionDay: Yup.string().required("Mandatory Field !"),
    targetStudent: Yup.string().required("Mandatory Field !"),
    sessionTime: Yup.string().required("Mandatory Field !"),
    fees: Yup.number().required("Mandatory Field !"),
    status: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      batchNumber: singleBatch?.batchNumber || "",
      courseName: singleBatch?.courseName || "",
      sessionType: singleBatch?.sessionType || "",
      sessionDay: singleBatch?.sessionDay || "",
      targetStudent: singleBatch?.targetStudent || "",
      sessionTime: singleBatch?.sessionTime || "",
      fees: singleBatch?.fees || "",
      startDate: singleBatch?.startDate
        ? new Date(singleBatch.startDate).toISOString().split("T")[0]
        : "",
      status: singleBatch?.status || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => updateBatch(values),
  });

  // ✅ Recalculate endDate whenever startDate or courseName changes
  useEffect(() => {
    const course = courses.find(
      (c) => c.courseName?.trim().toLowerCase() === formik.values.courseName?.trim().toLowerCase()
    );
    const calculated = calcEndDate(formik.values.startDate, course?.noOfDays);
    setEndDate(calculated);
  }, [formik.values.startDate, formik.values.courseName, courseData]);

  // Auto-calculate batch status from dates
  useEffect(() => {
    if (!singleBatch?.startDate) return;

    const course = courses.find(
      (c) => c.courseName?.trim().toLowerCase() === singleBatch?.courseName?.trim().toLowerCase()
    );
    const days = Number(course?.noOfDays);
    if (!Number.isFinite(days) || days <= 0) {
      setBatchStatus(singleBatch.status || "");
      formik.setFieldValue("status", singleBatch.status || "");
      return;
    }

    const end = new Date(calcEndDate(singleBatch.startDate, course?.noOfDays));
    const today = new Date();
    const start = new Date(singleBatch.startDate);
    let newStatus = singleBatch.status || "";

    if (singleBatch.status === "Batch Completed") {
      newStatus = "Batch Completed";
    } else {
      if (today < start) newStatus = "Not Started";
      else if (today >= start && today < end) newStatus = "In Progress";
      else newStatus = "Training Completed";
    }

    setBatchStatus(newStatus);
    formik.setFieldValue("status", newStatus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleBatch, courseData]);

  const updateBatch = async (updatedBatch) => {
    try {
      const payload = { ...updatedBatch, status: batchStatus, endDate };
      const res = await axios.put(`${url}/updatebatch/${singleBatch._id}`, payload, config);
      if (res) {
        const refreshed = await axios.get(`${url}/allbatch`, config);
        setBatchData(refreshed.data.batchData);
        toast.success("Batch updated successfully!", { autoClose: 2000 });
        handleClose();
      }
    } catch (e) {
      console.error('Error Editing Batch:', e);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    if (!singleBatch?._id || !batchStatus || batchStatus === singleBatch.status) return;
    const updateStatusOnly = async () => {
      try {
        await axios.put(`${url}/updatebatch/${singleBatch._id}`, { status: batchStatus }, config);
      } catch (e) {
        console.error("Error updating batch status only:", e);
      }
    };
    updateStatusOnly();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchStatus]);

  const canSave = !isLocked || (batchStatus === "Batch Completed" && allChecked);

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
      <Modal.Header closeButton style={{
        background: "linear-gradient(180deg, #1f3fbf 0%, #1b2f7a 100%)",
        color: "white", borderBottom: "none",
        borderRadius: "16px 16px 0 0", padding: "20px 24px",
      }}>
        <Modal.Title style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: 700 }}>
          <Edit sx={{ fontSize: "28px" }} />
          Edit Batch
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "24px", backgroundColor: "#f9fafb" }}>

          {/* Checklist — only visible when Training Completed */}
          {isTrainingCompleted && (
            <div style={{ marginBottom: "16px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px", backgroundColor: "#fff" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <CheckBox sx={{ fontSize: 14, mr: 0.5 }} />
                Completion Checklist
              </p>
              <Row>
                {[
                  { name: "assign",      label: "Assign" },
                  { name: "deassign",    label: "Deassign" },
                  { name: "dropout",     label: "Drop-out" },
                  { name: "certificate", label: "Certificate Generated" },
                ].map((item) => (
                  <Col key={item.name} lg={3} md={3} sm={6}>
                    <Form.Check type="checkbox" label={item.label} name={item.name}
                      checked={checkboxes[item.name]} onChange={handleCheckboxChange}
                      style={{ fontSize: "13px", whiteSpace: "nowrap" }}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Row 1: Batch No + Status + Course Name */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><Tag sx={{ fontSize: 14 }} />Batch Number</Form.Label>
              <Form.Control type="text" name="batchNumber" value={formik.values.batchNumber}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              />
              {formik.errors.batchNumber && formik.touched.batchNumber && <div style={errorStyle}>{formik.errors.batchNumber}</div>}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}>Status</Form.Label>
              {canSelectBatchCompleted ? (
                <Form.Select name="status" value={batchStatus} style={inputStyle}
                  onChange={(e) => { setBatchStatus(e.target.value); formik.setFieldValue("status", e.target.value); }}
                >
                  <option value="">Select</option>
                  <option value="Batch Completed">Batch Completed</option>
                </Form.Select>
              ) : (
                <Form.Control type="text" value={batchStatus} disabled style={disabledInputStyle} />
              )}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><School sx={{ fontSize: 14 }} />Course Name</Form.Label>
              <Form.Control type="text" name="courseName" value={formik.values.courseName}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              />
              {formik.errors.courseName && formik.touched.courseName && <div style={errorStyle}>{formik.errors.courseName}</div>}
            </Col>
          </Row>

          {/* Row 2: Start Date + End Date (auto) + Session Type */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><CalendarMonth sx={{ fontSize: 14 }} />Start Date</Form.Label>
              <Form.Control type="date" name="startDate" value={formik.values.startDate}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              />
            </Col>

            {/* ✅ End Date — always disabled, auto-calculated from startDate + course noOfDays */}
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><CalendarMonth sx={{ fontSize: 14 }} />End Date (auto)</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                disabled
                style={disabledInputStyle}
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><Wifi sx={{ fontSize: 14 }} />Session Type</Form.Label>
              <Form.Select name="sessionType" value={formik.values.sessionType}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              >
                <option value="">Select Type</option>
                <option value="Online">🌐 Online</option>
                <option value="At School">🏫 At School</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Row 3: Session Day + Session Time + Target Students */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><Event sx={{ fontSize: 14 }} />Session Day</Form.Label>
              <Form.Select name="sessionDay" value={formik.values.sessionDay}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              >
                <option value="">Select Day</option>
                <option value="Weekday">📅 Weekday</option>
                <option value="Weekend">🎉 Weekend</option>
              </Form.Select>
              {formik.errors.sessionDay && formik.touched.sessionDay && <div style={errorStyle}>{formik.errors.sessionDay}</div>}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><AccessTime sx={{ fontSize: 14 }} />Session Time</Form.Label>
              <Form.Select name="sessionTime" value={formik.values.sessionTime}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              >
                <option value="">Select Time</option>
                <option value="Morning">🌅 Morning</option>
                <option value="Afternoon">☀️ Afternoon</option>
                <option value="Evening">🌆 Evening</option>
              </Form.Select>
              {formik.errors.sessionTime && formik.touched.sessionTime && <div style={errorStyle}>{formik.errors.sessionTime}</div>}
            </Col>

            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><People sx={{ fontSize: 14 }} />Target Students</Form.Label>
              <Form.Control type="number" name="targetStudent" value={formik.values.targetStudent}
                onChange={formik.handleChange} disabled={!canEditFields} min={1} placeholder="e.g. 20"
                style={!canEditFields ? disabledInputStyle : inputStyle}
              />
              {formik.errors.targetStudent && formik.touched.targetStudent && <div style={errorStyle}>{formik.errors.targetStudent}</div>}
            </Col>
          </Row>

          {/* Row 4: Fees */}
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Label style={labelStyle}><AttachMoney sx={{ fontSize: 14 }} />Fees</Form.Label>
              <Form.Control type="number" name="fees" value={formik.values.fees}
                onChange={formik.handleChange} disabled={!canEditFields}
                style={!canEditFields ? disabledInputStyle : inputStyle}
              />
              {formik.errors.fees && formik.touched.fees && <div style={errorStyle}>{formik.errors.fees}</div>}
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer style={{ borderTop: "1px solid #e5e7eb", padding: "14px 24px", backgroundColor: "#ffffff", borderRadius: "0 0 16px 16px", gap: "8px" }}>
          <Button onClick={handleClose} style={{ backgroundColor: "transparent", border: "1px solid #d1d5db", color: "#6b7280", fontWeight: 600, fontSize: "13px", padding: "7px 18px", borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSave || formik.isSubmitting}
            style={{
              background: canSave ? "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)" : "#e2e8f0",
              border: "none", fontWeight: 700, fontSize: "13px", padding: "7px 22px", borderRadius: "8px",
              color: canSave ? "#fff" : "#94a3b8",
              boxShadow: canSave ? "0 2px 8px rgba(31,63,191,0.3)" : "none",
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditBatch;