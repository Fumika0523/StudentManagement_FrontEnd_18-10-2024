import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../../utils/constant";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { admissionInitialValues, studentSchema } from "./AdmissionSchema";
import { FieldGroup, Section, inputStyle, panelStyle } from "../../../StudentData/Modals/CreateStudent/studentFormStyle";
import ModalHeaderBlock from "../../../Common/ModalHeaderBlock";
import { MdAssignmentTurnedIn } from "react-icons/md";
import ModalFooterBlock from "../../../Common/ModalFooterBlock";
import {
  CalendarMonth,
  Person,
  School,
  LayersOutlined,
  PaymentsOutlined,
  ShareOutlined,
  AssignmentIndOutlined,
  EventAvailable,
} from "@mui/icons-material";

const ModalAddAdmission = ({
  show,
  setShow,
  setAdmissionData,
  admissionData,
  studentData,
  setStudentData,
}) => {
  const [courseValue, setCourseValue] = useState("");
  const [batchValue, setBatchValue] = useState("");
  const [batchTargetNo, setBatchTargetNo] = useState(0);
  const [batchAssignedCount, setBatchAssignedCount] = useState(0);
  const [studentValue, setStudentValue] = useState("");
  const [courseData, setCourseData] = useState([]);
  const [batchData, setBatchData] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const handleClose = () => {
    setShow(false);
    navigate("/admissiondata");
  };

  const getCourseData = async () => {
    const res = await axios.get(`${url}/allcourse`, config);
    setCourseData(res.data.courseData);
  };

  const getBatchData = async () => {
    const res = await axios.get(`${url}/allbatch`, config);
    setBatchData(res.data.batchData);
  };

  useEffect(() => {
    if (!show) return;
    getCourseData();
    getBatchData();
  }, [show]);

  const dateFun = (dateString) => {
    if (!dateString) return { month: "", year: "" };
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return { month, year };
  };

  const isOlderThan7Days = (dateString) => {
    if (!dateString) return false;
    const startDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - startDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  const COMPLETED_BATCH_STATUSES = new Set(["Batch Completed"]);

  const batchByNumber = useMemo(() => {
    const map = {};
    batchData?.forEach((b) => { map[b.batchNumber] = b; });
    return map;
  }, [batchData]);

  const admissionsByStudentId = useMemo(() => {
    const map = {};
    (admissionData || []).forEach((adm) => {
      const sid = String(adm.studentId);
      if (!map[sid]) map[sid] = [];
      map[sid].push(adm);
    });
    return map;
  }, [admissionData]);

  const canAssignStudent = (student) => {
    if (!student?._id) return false;
    if (student?.userId?.isActive === false) return false;
    const sid = String(student._id);
    const theirAdmissions = admissionsByStudentId[sid] || [];
    if (theirAdmissions.length === 0) return true;
    const hasAnyActiveAssignment = theirAdmissions.some((adm) => {
      const batch = batchByNumber[adm.batchNumber];
      return !COMPLETED_BATCH_STATUSES.has(batch?.status || "");
    });
    return !hasAnyActiveAssignment;
  };

  const eligibleStudents = useMemo(() => {
    return studentData.filter(canAssignStudent);
  }, [studentData, admissionsByStudentId, batchByNumber]);

  const formik = useFormik({
    initialValues: admissionInitialValues,
    validationSchema: studentSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const sid = values.studentId;
      const bno = values.batchNumber;

      const alreadySameBatch = admissionData.some(
        (adm) => String(adm.studentId) === String(sid) && String(adm.batchNumber) === String(bno)
      );
      if (alreadySameBatch) {
        toast.error("This student is already assigned to this batch. Please select a different batch.");
        return;
      }

      const theirAdmissions = admissionsByStudentId[String(sid)] || [];
      const hasActive = theirAdmissions.some((adm) => {
        const batch = batchByNumber[adm.batchNumber];
        return !COMPLETED_BATCH_STATUSES.has(batch?.status || "");
      });
      if (hasActive) {
        toast.error("This student is already assigned to an active batch. They can be reassigned only after the previous batch is completed.");
        return;
      }

      if (Number(batchAssignedCount) >= Number(batchTargetNo)) {
        toast.error("Sorry! This batch is full. Please try another batch or contact super admin.");
        return;
      }

      toast.success(`${values.studentName} is successfully assigned to ${values.batchNumber}!`);
      await addAdmission(values);
      handleClose();
    },
  });

  const handleBatchNumber = (e) => {
    const selectedBatchNumber = e.target.value;
    setBatchValue(selectedBatchNumber);
    formik.setFieldValue("batchNumber", selectedBatchNumber);

    const selectedBatch = batchData.find((b) => b.batchNumber === selectedBatchNumber);
    if (!selectedBatch) {
      setBatchAssignedCount(0);
      setBatchTargetNo(0);
      setCourseValue("");
      formik.setFieldValue("courseName", "");
      formik.setFieldValue("courseId", "");
      formik.setFieldValue("admissionFee", "");
      return;
    }

    setBatchAssignedCount(selectedBatch.assignedStudentCount ?? 0);
    setBatchTargetNo(Number(selectedBatch.targetStudent ?? 0));

    const cName = selectedBatch.courseName || "";
    setCourseValue(cName);
    formik.setFieldValue("courseName", cName);

    const selectedCourse = courseData.find((c) => c.courseName === cName);
    formik.setFieldValue("courseId", selectedCourse?._id || "");
    formik.setFieldValue("admissionFee", selectedCourse?.courseFee ?? "");
  };

  const handleStudentNameChange = (e) => {
    const selectedStudentName = e.target.value;
    setStudentValue(selectedStudentName);
    const selectedStudent = studentData?.find((s) => s.studentName === selectedStudentName);
    if (selectedStudent) {
      formik.setFieldValue("studentId", selectedStudent._id);
      formik.setFieldValue("studentName", selectedStudent.studentName);
    }
  };

  const handleAdmissionDateChange = (e) => {
    const picked = e.target.value;
    const { month, year } = dateFun(picked);
    formik.setFieldValue("admissionDate", picked);
    formik.setFieldValue("admissionMonth", month);
    formik.setFieldValue("admissionYear", year);
  };

  const addAdmission = async (newAdmission) => {
    const admission = {
      ...newAdmission,
      studentName: studentValue,
      courseName: courseValue,
      batchNumber: batchValue,
    };
    try {
      const res = await axios.post(`${url}/addadmission`, admission, config);
      if (res) {
        const list = await axios.get(`${url}/alladmission`, config);
        setAdmissionData(list.data.admissionData);
      }
    } catch (e) {
      console.error("Error adding Admission:", e?.response?.status, e?.response?.data || e);
      toast.error(e?.response?.data?.message || "Add admission failed");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered style={{ "--bs-modal-border-radius": "16px" }}>
      <ModalHeaderBlock title="Add Admission" icon={<MdAssignmentTurnedIn />} />

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "16px 18px", backgroundColor: "#f1f5f9" }}>
          <div style={panelStyle}>

            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup
                  label="Batch No."
                  icon={<LayersOutlined />}
                  required
                  error={formik.touched.batchNumber && formik.errors.batchNumber}
                >
                  <Form.Select
                    size="sm"
                    name="batchNumber"
                    value={formik.values.batchNumber}
                    onChange={handleBatchNumber}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                  >
                    <option value="">Select Batch</option>
                    {batchData
                      ?.filter((b) => !isOlderThan7Days(b.startDate))
                      .map((b) => (
                        <option key={b.batchNumber} value={b.batchNumber}>
                          {b.batchNumber}
                        </option>
                      ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Status" icon={<AssignmentIndOutlined />}>
                  <Form.Select
                    size="sm"
                    disabled
                    name="status"
                    value={formik.values.status || ""}
                    onChange={formik.handleChange}
                    style={inputStyle}
                  >
                    <option value="Assigned">Assigned</option>
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>

            {/* ── Course ── */}
            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup
                  label="Course Name"
                  icon={<School />}
                  error={formik.touched.courseName && formik.errors.courseName}
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="courseName"
                    value={formik.values.courseName}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled from batch"
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup
                  label="Course ID"
                  icon={<School />}
                  error={formik.touched.courseId && formik.errors.courseId}
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="courseId"
                    value={formik.values.courseId}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled"
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>
            </Row>

            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup
                  label="Student Name"
                  icon={<Person />}
                  required
                  error={formik.touched.studentName && formik.errors.studentName}
                >
                  {eligibleStudents.length === 0 ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 12px",
                      borderRadius: 8,
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      color: "#92400e",
                      fontSize: 12,
                      fontWeight: 500,
                    }}>
                      <span style={{ fontSize: 15 }}>⚠️</span>
                      No eligible students available
                    </div>
                  ) : (
                    <Form.Select
                      size="sm"
                      name="studentName"
                      value={formik.values.studentName}
                      onChange={handleStudentNameChange}
                      onBlur={formik.handleBlur}
                      style={inputStyle}
                    >
                      <option value="">-- Select --</option>
                      {eligibleStudents.map((student) => (
                        <option key={student._id} value={student.studentName}>
                          {student.studentName}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup
                  label="Student ID"
                  icon={<AssignmentIndOutlined />}
                  error={formik.touched.studentId && formik.errors.studentId}
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="studentId"
                    value={formik.values.studentId}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled"
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>
            </Row>

            <Row className="g-1">
              <Col xs={12} md={4}>
                <FieldGroup
                  label="Admission Date"
                  icon={<EventAvailable />}
                  required
                  error={formik.touched.admissionDate && formik.errors.admissionDate}
                >
                  <Form.Control
                    size="sm"
                    type="date"
                    name="admissionDate"
                    max={new Date().toISOString().split("T")[0]}
                    onChange={handleAdmissionDateChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={4}>
                <FieldGroup label="Month" icon={<CalendarMonth />}>
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionMonth"
                    value={dateFun(formik.values.admissionDate).month || ""}
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={4}>
                <FieldGroup label="Year" icon={<CalendarMonth />}>
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionYear"
                    value={dateFun(formik.values.admissionDate).year || ""}
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>
            </Row>

            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup
                  label="Fee"
                  icon={<PaymentsOutlined />}
                  error={formik.touched.admissionFee && formik.errors.admissionFee}
                >
                  <Form.Control
                    size="sm"
                    disabled
                    name="admissionFee"
                    value={formik.values.admissionFee}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled from course"
                    style={{ ...inputStyle, background: "#f8fafc", color: "#64748b" }}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup
                  label="Source"
                  icon={<ShareOutlined />}
                  required
                  error={formik.touched.admissionSource && formik.errors.admissionSource}
                >
                  <Form.Select
                    size="sm"
                    name="admissionSource"
                    value={formik.values.admissionSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                  >
                    <option value="">-- Select --</option>
                    <option value="Social">Social</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct">Direct</option>
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>

          </div>
        </Modal.Body>

        <ModalFooterBlock
          onClose={handleClose}
          submitText="Submit"
          submitting={formik.isSubmitting} 
        />
      </Form>
    </Modal>
  );
};

export default ModalAddAdmission;