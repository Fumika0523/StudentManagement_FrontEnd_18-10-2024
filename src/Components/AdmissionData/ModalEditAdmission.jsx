import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../utils/constant';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ModalHeaderBlock from '../Common/ModalHeaderBlock';
import { RiEdit2Fill } from "react-icons/ri";
import ModalFooterBlock from '../Common/ModalFooterBlock';
import { FieldGroup, inputStyle, panelStyle } from '../StudentData/Modals/CreateStudent/studentFormStyle';
import {
  LayersOutlined,
  AssignmentIndOutlined,
  School,
  Person,
  EventAvailable,
  CalendarMonth,
  PaymentsOutlined,
  ShareOutlined,
} from "@mui/icons-material";

const ModalEditAdmission = ({ show, setShow, singleAdmission, setAdmissionData }) => {
  const [courseData, setCourseData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [batchData, setBatchData] = useState([]);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    navigate('/admissiondata');
  };

  const formSchema = Yup.object().shape({
    batchNumber: Yup.string().required("Please select Batch Number!"),
    courseId: Yup.string().required("Mandatory field!"),
    studentId: Yup.string().required("Mandatory field!"),
    courseName: Yup.string().required("Mandatory field!"),
    studentName: Yup.string().required("Mandatory field!"),
    admissionSource: Yup.string().required("Mandatory field!"),
    admissionFee: Yup.number().required("Mandatory field!"),
    admissionDate: Yup.date().required("Mandatory field!"),
    admissionYear: Yup.number().required("Mandatory field!"),
    admissionMonth: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      batchNumber: singleAdmission?.batchNumber,
      courseId: singleAdmission?.courseId,
      studentId: singleAdmission?.studentId,
      studentName: singleAdmission?.studentName,
      courseName: singleAdmission?.courseName,
      admissionSource: singleAdmission?.admissionSource,
      admissionFee: singleAdmission?.admissionFee,
      admissionDate: singleAdmission.admissionDate
        ? new Date(singleAdmission.admissionDate).toISOString().split('T')[0]
        : "",
      admissionYear: singleAdmission?.admissionYear,
      admissionMonth: singleAdmission?.admissionMonth,
      status: singleAdmission?.status || "Assign",
    },
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => updateAdmission(values),
  });

  const dateFun = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { month, year };
  };

  const updateAdmission = async (updatedAdmission) => {
    try {
      let res = await axios.put(`${url}/updateadmission/${singleAdmission._id}`, updatedAdmission, config);
     // console.log("res from updateAdmission",res.data)
      const updatedStudent = res.data.admission.studentName;
      if (res) {
        let list = await axios.get(`${url}/alladmission`, config);
        toast.success(`Successfully Updated for ${updatedStudent}`);
        setAdmissionData(list.data.admissionData);
        setTimeout(() => handleClose(), 1000);
        handleClose();
      }
    } catch (e) {
      console.error("Error in Editing Admission:", e);
    }
  };

  const getBatchData = async () => {
    let res = await axios.get(`${url}/allbatch`, config);
    setBatchData(res.data.batchData);
  };

  const getStudentData = async () => {
    let res = await axios.get(`${url}/all-student`, config);
    setStudentData(res.data.studentData);
  };

  const getCourseData = async () => {
    let res = await axios.get(`${url}/allcourse`, config);
    setCourseData(res.data.courseData);
  };

  useEffect(() => {
    getCourseData();
    getStudentData();
    getBatchData();
  }, []);

  // Selecting batch auto-fills courseId, courseName, admissionFee
  const handleBatchChange = (e) => {
    const selectedBatchNumber = e.target.value;
    const selectedBatch = batchData.find((b) => b.batchNumber === selectedBatchNumber);
    if (selectedBatch) {
      formik.setFieldValue("batchNumber", selectedBatch.batchNumber);
      const matchedCourse = courseData.find((c) => c.courseName === selectedBatch.courseName);
      formik.setFieldValue("courseName", selectedBatch.courseName || "");
      formik.setFieldValue("courseId", matchedCourse?._id || "");
      formik.setFieldValue("admissionFee", matchedCourse?.courseFee ?? "");
    } else {
      formik.setFieldValue("batchNumber", selectedBatchNumber);
    }
  };

  const handleStatusChange = (e) => {
    formik.setFieldValue("status", e.target.value);
    toast.info("The status is marked as De-assigned.");
  };

  const handleCourseIdChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courseData.find((c) => c._id === selectedCourseId);
    formik.setFieldValue("courseId", selectedCourseId);
    formik.setFieldValue("courseName", selectedCourse?.courseName || "");
    formik.setFieldValue("admissionFee", selectedCourse?.courseFee ?? "");
  };

  const handleStudentIdChange = (e) => {
    const selectedStudentId = e.target.value;
    const selectedStudent = studentData.find((s) => s._id === selectedStudentId);
    formik.setFieldValue("studentId", selectedStudentId);
    formik.setFieldValue("studentName", selectedStudent?.studentName || "");
  };

  const disabledStyle = { ...inputStyle, background: "#f8fafc", color: "#64748b" };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered style={{ "--bs-modal-border-radius": "16px" }}>
      <ModalHeaderBlock title="Edit Admission" icon={<RiEdit2Fill />} />

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "16px 18px", backgroundColor: "#f1f5f9" }}>
          <div style={panelStyle}>

            {/* Batch & Status */}
            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup label="Batch No." icon={<LayersOutlined />} required error={formik.touched.batchNumber && formik.errors.batchNumber}>
                  <Form.Select size="sm" name="batchNumber" value={formik.values.batchNumber} onChange={handleBatchChange} onBlur={formik.handleBlur} style={inputStyle}>
                    <option value="">Select Batch</option>
                    {batchData
                      ?.filter((b) => {
                        if (!b.startDate) return true;
                        const diffInDays = (new Date() - new Date(b.startDate)) / (1000 * 60 * 60 * 24);
                        return diffInDays <= 7;
                      })
                      .map((b) => (
                        <option key={b.batchNumber} value={b.batchNumber}>{b.batchNumber}</option>
                      ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Assignment Status" icon={<AssignmentIndOutlined />}>
                  <Form.Select size="sm" name="status" value={formik.values.status} onChange={handleStatusChange} onBlur={formik.handleBlur} style={inputStyle}>
                    <option value="Assigned">Assigned</option>
                    <option value="De-assigned">De-assigned</option>
                  </Form.Select>
                </FieldGroup>
              </Col>
            </Row>

            {/* Course — auto-filled from batch */}
            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup label="Course ID" icon={<School />} error={formik.errors.courseId}>
                  <Form.Select size="sm" name="courseId" value={formik.values.courseId} onChange={handleCourseIdChange}
                  placeholder="Auto-filled from batch" style={disabledStyle} >
                    <option value="">Select Course ID</option>
                    {courseData?.map((c) => (
                      <option key={c._id} value={c._id}>{c._id}</option>
                    ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Course Name" icon={<School />} error={formik.errors.courseName}>
                  <Form.Control size="sm" disabled name="courseName" value={formik.values.courseName} placeholder="Auto-filled from batch" style={disabledStyle} />
                </FieldGroup>
              </Col>
            </Row>

            {/* Student — locked */}
            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup label="Student ID" icon={<Person />} error={formik.errors.studentId}>
                  <Form.Select size="sm" disabled name="studentId" value={formik.values.studentId} onChange={handleStudentIdChange} style={disabledStyle}>
                    <option value="">Select Student ID</option>
                    {studentData?.map((s) => (
                      <option key={s._id} value={s._id}>{s._id}</option>
                    ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Student Name" icon={<Person />} error={formik.errors.studentName}>
                  <Form.Control size="sm" disabled name="studentName" value={formik.values.studentName} style={disabledStyle} />
                </FieldGroup>
              </Col>
            </Row>

            {/* Date */}
            <Row className="g-1">
              <Col xs={12} md={4}>
                <FieldGroup label="Admission Date" icon={<EventAvailable />} required error={formik.touched.admissionDate && formik.errors.admissionDate}>
                  <Form.Control size="sm" type="date" name="admissionDate" value={formik.values.admissionDate} onChange={formik.handleChange} style={inputStyle} />
                </FieldGroup>
              </Col>

              <Col xs={12} md={4}>
                <FieldGroup label="Month" icon={<CalendarMonth />}>
                  <Form.Control size="sm" disabled value={dateFun(formik.values.admissionDate).month} style={disabledStyle} />
                </FieldGroup>
              </Col>

              <Col xs={12} md={4}>
                <FieldGroup label="Year" icon={<CalendarMonth />}>
                  <Form.Control size="sm" disabled value={dateFun(formik.values.admissionDate).year} style={disabledStyle} />
                </FieldGroup>
              </Col>
            </Row>

            {/* Fee & Source */}
            <Row className="g-1">
              <Col xs={12} md={6}>
                <FieldGroup label="Fee" icon={<PaymentsOutlined />} error={formik.errors.admissionFee}>
                  <Form.Control size="sm" disabled name="admissionFee" value={formik.values.admissionFee} style={disabledStyle} />
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Source" icon={<ShareOutlined />} required error={formik.touched.admissionSource && formik.errors.admissionSource}>
                  <Form.Select size="sm" name="admissionSource" value={formik.values.admissionSource} onChange={formik.handleChange} onBlur={formik.handleBlur} style={inputStyle}>
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

        <ModalFooterBlock onClose={handleClose} submitText="Update" submitting={formik.isSubmitting} />
      </Form>
    </Modal>
  );
};

export default ModalEditAdmission;