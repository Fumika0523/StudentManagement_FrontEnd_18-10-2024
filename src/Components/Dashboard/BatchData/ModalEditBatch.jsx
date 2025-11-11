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

const ModalEditBatch = ({ show, setShow, singleBatch, setBatchData }) => {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    assign: false,
    deassign: false,
    dropout: false,
    certificate: false,
  });

  const allChecked = Object.values(checkboxes).every(Boolean);
  const isCompleted = singleBatch?.status === "Completed";

  const handleClose = () => {
    setShow(false);
    navigate('/batchdata');
  };

  // 🔹 Lock if batch older than 7 days
  useEffect(() => {
    if (singleBatch?.startDate) {
      const diffDays =
        (new Date() - new Date(singleBatch.startDate)) / (1000 * 60 * 60 * 24);
      setIsLocked(diffDays > 7);
    }
  }, [singleBatch]);

  // 🔹 Validation Schema
  const formSchema = Yup.object().shape({
    batchNumber: Yup.string().required("Mandatory Field !"),
    courseName: Yup.string().required("Mandatory Field !"),
    sessionDay: Yup.string().required("Mandatory Field !"),
    targetStudent: Yup.string().required("Mandatory Field !"),
    location: Yup.string().required("Mandatory Field !"),
    sessionTime: Yup.string().required("Mandatory Field !"),
    fees: Yup.number().required("Mandatory Field !"),
    status: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      batchNumber: singleBatch?.batchNumber || "",
      courseName: singleBatch?.courseName || "",
      sessionType: singleBatch?.sessionType || "",
      sessionDay: singleBatch?.sessionDay || "",
      targetStudent: singleBatch?.targetStudent || "",
      location: singleBatch?.location || "",
      sessionTime: singleBatch?.sessionTime || "",
      fees: singleBatch?.fees || "",
      startDate: singleBatch?.startDate
        ? new Date(singleBatch.startDate).toISOString().split("T")[0]
        : "",
      status: singleBatch?.status || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateBatch(values);
    },
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 🔹 Update Batch API
  const updateBatch = async (updatedBatch) => {
    try {
      const res = await axios.put(`${url}/updatebatch/${singleBatch._id}`, updatedBatch, config);
      if (res) {
        const refreshed = await axios.get(`${url}/allbatch`, config);
        setBatchData(refreshed.data.batchData);
        handleClose();
      }
    } catch (e) {
      console.error('Error Editing Batch:', e);
    }
  };

  // 🔹 Checkbox handler
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  // 🔹 Unified status logic (same as table)
  useEffect(() => {
    if (singleBatch && singleBatch.startDate) {
      const startDate = new Date(singleBatch.startDate);
      const courseDays = singleBatch.noOfDays || singleBatch.course?.noOfDays || 0;
      const endDate = new Date(startDate.getTime() + courseDays * 24 * 60 * 60 * 1000);
      const today = new Date();

      let newStatus = singleBatch.status;

      // Only auto-update if not manually marked as Training Completed
      if (newStatus !== "Training Completed") {
        if (today < startDate) newStatus = "Not Started";
        else if (today >= startDate && today < endDate) newStatus = "In Progress";
        else newStatus = "Completed";
      }

      formik.setFieldValue("status", newStatus);
    }
  }, [singleBatch]);

  const disableFields = isLocked || isCompleted;

  return (
    <Modal show={show} onHide={handleClose} size="lg" style={{ minWidth: "550px" }}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Batch</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} className="px-2" style={{ fontSize: "13px" }}>
        <Modal.Body>

          {/* ✅ Checklist appears only if status = Completed */}
          {isCompleted && (
            <div className="mb-2 border rounded p-2 bg-light">
              <Row>
                <Col lg={3} md={3} sm={6}>
                  <Form.Check
                    type="checkbox"
                    label="Assign"
                    name="assign"
                    checked={checkboxes.assign}
                    onChange={handleCheckboxChange}
                  />
                </Col>
                <Col lg={3} md={3} sm={6}>
                  <Form.Check
                    type="checkbox"
                    label="Deassign"
                    name="deassign"
                    checked={checkboxes.deassign}
                    onChange={handleCheckboxChange}
                  />
                </Col>
                <Col lg={3} md={3} sm={6}>
                  <Form.Check
                    style={{ whiteSpace: "nowrap" }}
                    type="checkbox"
                    label="Drop-out"
                    name="dropout"
                    checked={checkboxes.dropout}
                    onChange={handleCheckboxChange}
                  />
                </Col>
                <Col lg={3} md={3} sm={6}>
                  <Form.Check
                    style={{ whiteSpace: "nowrap" }}
                    type="checkbox"
                    label="Certificate Generated"
                    name="certificate"
                    checked={checkboxes.certificate}
                    onChange={handleCheckboxChange}
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* 🔹 Main Form Fields */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Batch No.</Form.Label>
                <Form.Control
                  type="text"
                  name="batchNumber"
                  value={formik.values.batchNumber}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>

            {/* 🔹 Status (auto-calculated or manual Training Completed) */}
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Status</Form.Label>
                {allChecked ? (
                  <Form.Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Training Completed">Training Completed</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    type="text"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    disabled
                  />
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Course Name</Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={formik.values.courseName}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Session Type</Form.Label>
                <Form.Select
                  name="sessionType"
                  value={formik.values.sessionType}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                >
                  <option value="">Select Session Type</option>
                  <option value="Online">Online</option>
                  <option value="At School">At School</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Session Day</Form.Label>
                <Form.Select
                  name="sessionDay"
                  value={formik.values.sessionDay}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                >
                  <option value="">Select Session Day</option>
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Target Student</Form.Label>
                <Form.Control
                  type="text"
                  name="targetStudent"
                  value={formik.values.targetStudent}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Session Time</Form.Label>
                <Form.Select
                  name="sessionTime"
                  value={formik.values.sessionTime}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                >
                  <option value="">Select Session Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Fees</Form.Label>
                <Form.Control
                  type="number"
                  name="fees"
                  value={formik.values.fees}
                  onChange={formik.handleChange}
                  disabled={disableFields}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#4e73df" }}
            type="submit"
            disabled={disableFields && !(isCompleted && allChecked)}
          >
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditBatch;
