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

const ModalEditBatch = ({ show, setShow, singleBatch, setBatchData, courseData }) => {
  const navigate = useNavigate();
const courses = Array.isArray(courseData) ? courseData : [];
const role = localStorage.getItem("role");
const isAdmin = role === "admin";
const isStaff = role === "staff";

const approval = singleBatch?.approvalStatus ?? "none";

const course = courses.find(
  (c) => c.courseName?.trim().toLowerCase() === singleBatch?.courseName?.trim().toLowerCase()
);

const courseDays = Number(course?.noOfDays || 0);

  //  Lock rule (older than 7 days from startDate)
  const [isLocked, setIsLocked] = useState(false);

  //  Checklist for Training Completed → Batch Completed
  const [checkboxes, setCheckboxes] = useState({
    assign: false,
    deassign: false,
    dropout: false,
    certificate: false,
  });

  const allChecked = Object.values(checkboxes).every(Boolean);

  //  Separate state for batch status (tutor suggestion)
  const [batchStatus, setBatchStatus] = useState(singleBatch?.status );
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleClose = () => {
    setShow(false);
    navigate('/batchdata');
  };
  useEffect(() => {
  if (!singleBatch?.startDate) return;

  const startDate = new Date(singleBatch.startDate);
  if (isNaN(startDate.getTime())) return;

  const courses = Array.isArray(courseData) ? courseData : [];
  const course = courses.find(
    (c) =>
      c.courseName?.trim().toLowerCase() === singleBatch?.courseName?.trim().toLowerCase()
  );

  const days = Number(course?.noOfDays);
  if (!Number.isFinite(days) || days <= 0) {
    // If we don't know the duration yet, DO NOT auto override status
    setBatchStatus(singleBatch.status || "");
    formik.setFieldValue("status", singleBatch.status || "");
    return;
  }

  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  const today = new Date();
  let newStatus = singleBatch.status || "";
  // Keep final status
  if (singleBatch.status === "Batch Completed") {
    newStatus = "Batch Completed";
  } else {
    if (today < startDate) newStatus = "Not Started";
    else if (today >= startDate && today < endDate) newStatus = "In Progress";
    else newStatus = "Training Completed";
  }
  setBatchStatus(newStatus);
  formik.setFieldValue("status", newStatus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [singleBatch, courseData]);

const isTrainingCompleted = batchStatus === "Training Completed";
const canSelectBatchCompleted =
  isTrainingCompleted &&
  allChecked &&
  isStaff &&
  approval === "approved";
const canEditWhenTrainingCompleted =
  isStaff && approval === "approved";

const canEditFields =
  !isTrainingCompleted || canEditWhenTrainingCompleted;

  //  Validation Schema
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
      status: singleBatch?.status || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateBatch(values);
    },
  });

  //  Update Batch API (full form save)
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
      console.log("updateBatch",res)
      if (res) {
        const refreshed = await axios.get(`${url}/allbatch`, config);
        setBatchData(refreshed.data.batchData);
            toast.success("Batch is successfully completed!", { autoClose: 2000 });
        handleClose();
      }
    } catch (e) {
      console.error('Error Editing Batch:', e);
    }
  };

  //  Checkbox handler
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  // //  Unified status logic: auto status from dates (up to Training Completed)
  // useEffect(() => {
  //   if (!singleBatch || !singleBatch.startDate) return;

  //   const startDate = new Date(singleBatch.startDate);
  //   const courseDays = singleBatch.noOfDays || singleBatch.course?.noOfDays || 0;
  //   const endDate = new Date(startDate.getTime() + courseDays * 24 * 60 * 60 * 1000);
  //   const today = new Date();

  //   let newStatus = singleBatch.status || "";

  //   // If already manually completed → DO NOT override
  //   if (singleBatch.status === "Batch Completed") {
  //     newStatus = "Batch Completed";
  //   } else {
  //     // Auto-generate up to Training Completed
  //     if (today < startDate) newStatus = "Not Started";
  //     else if (today >= startDate && today < endDate) newStatus = "In Progress";
  //     else newStatus = "Training Completed";
  //   }

  //   setBatchStatus(newStatus);
  //   formik.setFieldValue("status", newStatus);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [singleBatch]);

  //  Tutor suggestion: when batchStatus changes, sync to DB
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

  //  Save button logic
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

          {/*  Checklist appears only if status = Training Completed */}
          {isTrainingCompleted   && (
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

          {/*  Main Form Fields */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Batch No.</Form.Label>
                <Form.Control
                  type="text"
                  name="batchNumber"
                  value={formik.values.batchNumber}
                  onChange={formik.handleChange}
                  disabled={!canEditFields}
                />
              </Form.Group>
            </Col>

            {/*  Status (auto-calculated + manual Batch Completed) */}
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="m-0">Status</Form.Label>

                {canSelectBatchCompleted  ? (
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
                  disabled={!canEditFields}
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
