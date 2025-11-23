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

  // 🔹 Lock rule (older than 7 days from startDate)
  const [isLocked, setIsLocked] = useState(false);

  // 🔹 Checklist for Training Completed → Batch Completed
  const [checkboxes, setCheckboxes] = useState({
    assign: false,
    deassign: false,
    dropout: false,
    certificate: false,
  });

  const allChecked = Object.values(checkboxes).every(Boolean);

  // 🔹 Separate state for batch status (tutor suggestion)
  const [batchStatus, setBatchStatus] = useState(singleBatch?.status || "");

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleClose = () => {
    setShow(false);
    toast.success("Batch is successfully completed!", { autoClose: 2000 });
      setTimeout(() => {
        handleClose(); 
      }, 500);

    navigate('/batchdata');
  };

  // 🔹 Reset lock & checkboxes when opening for a new batch
  useEffect(() => {
    if (singleBatch?.startDate) {
      const diffDays =
        (new Date() - new Date(singleBatch.startDate)) / (1000 * 60 * 60 * 24);
      setIsLocked(diffDays > 7);
    } else {
      setIsLocked(false);
    }

    // reset checklist when switching batch
    setCheckboxes({
      assign: false,
      deassign: false,
      dropout: false,
      certificate: false,
    });

    // initial batchStatus from prop
    setBatchStatus(singleBatch?.status || "");
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

  // 🔹 Formik
  const formik = useFormik({
    enableReinitialize: true,
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
      status: batchStatus || singleBatch?.status || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateBatch(values);
    },
  });

  // 🔹 Is Training Completed (from current status state)
  const isTrainingCompleted = batchStatus === "Training Completed" || "Batch Completed";

  // 🔹 Update Batch API (full form save)
  const updateBatch = async (updatedBatch) => {
    try {
      const payload = {
        ...updatedBatch,
        status: batchStatus, // ensure we send the latest status state
      };

      const res = await axios.put(
        `${url}/updatebatch/${singleBatch._id}`,
        payload,
        config
      );

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

  // 🔹 Unified status logic: auto status from dates (up to Training Completed)
  useEffect(() => {
    if (!singleBatch || !singleBatch.startDate) return;

    const startDate = new Date(singleBatch.startDate);
    const courseDays = singleBatch.noOfDays || singleBatch.course?.noOfDays || 0;
    const endDate = new Date(startDate.getTime() + courseDays * 24 * 60 * 60 * 1000);
    const today = new Date();

    let newStatus = singleBatch.status || "";

    // If already manually completed → DO NOT override
    if (singleBatch.status === "Batch Completed") {
      newStatus = "Batch Completed";
    } else {
      // Auto-generate up to Training Completed
      if (today < startDate) newStatus = "Not Started";
      else if (today >= startDate && today < endDate) newStatus = "In Progress";
      else newStatus = "Training Completed";
    }

    setBatchStatus(newStatus);
    formik.setFieldValue("status", newStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleBatch]);

  // 🔹 Tutor suggestion: when batchStatus changes, sync to DB
  useEffect(() => {
    if (!singleBatch?._id) return;
    if (!batchStatus) return;
    if (batchStatus === singleBatch.status) return; // no change

    const updateStatusOnly = async () => {
      try {
        await axios.put(
          `${url}/updatebatch/${singleBatch._id}`,
          { status: batchStatus },
          config
        );
        // You could optionally refresh table here if needed
      } catch (e) {
        console.error("Error updating batch status only:", e);
      }
    };

    updateStatusOnly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchStatus]);

  // 🔹 Save button logic
  // - If NOT locked → can always save
  // - If locked → only can save when we are finalizing to Batch Completed
  const canSave =
    !isLocked ||
    (batchStatus === "Batch Completed" && allChecked);

  return (
    <Modal show={show} onHide={handleClose} size="lg" style={{ minWidth: "550px" }}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Batch</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} className="px-2" style={{ fontSize: "13px" }}>
        <Modal.Body>

          {/* 🔹 Checklist appears only if status = Training Completed */}
          {isTrainingCompleted && (
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
                  disabled={isLocked}
                />
              </Form.Group>
            </Col>

            {/* 🔹 Status (auto-calculated + manual Batch Completed) */}
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Status</Form.Label>

                {isTrainingCompleted && allChecked ? (
                  // Once all tasks are done → allow Training Completed / Batch Completed switch
                  <Form.Select
                    name="status"
                    value={batchStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setBatchStatus(newStatus);
                      formik.setFieldValue("status", newStatus);
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Batch Completed">Batch Completed</option>
                  </Form.Select>
                ) : (
                  // Otherwise → display read-only current status
                  <Form.Control
                    type="text"
                    name="status"
                    value={batchStatus}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#4e73df" }}
            type="submit"
            disabled={!canSave}
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
