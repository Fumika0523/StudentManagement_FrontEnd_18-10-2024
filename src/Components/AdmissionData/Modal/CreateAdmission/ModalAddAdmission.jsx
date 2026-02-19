import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../../utils/constant";
import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import { admissionInitialValues, studentSchema } from "../AdmissionSchema";

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
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const handleClose = () => {
    setShow(false);
    navigate("/admissiondata");
  };

  const getCourseData = async () => {
    const res = await axios.get(`${url}/allcourse`, config);
    setCourseData(res.data.courseData || []);
  };

  const getBatchData = async () => {
    const res = await axios.get(`${url}/allbatch`, config);
    setBatchData(res.data.batchData || []);
  };

  useEffect(() => {
    if (!show) return;
    getCourseData();
    getBatchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);


  const dateFun = (dateString) => {
    if (!dateString) return { month: "", year: "" };
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return { month, year };
  };

  // hide batches whose startDate is > 7 days ago
  const isOlderThan7Days = (dateString) => {
    if (!dateString) return false;
    const startDate = new Date(dateString);
    const today = new Date();
    const diffInDays = (today - startDate) / (1000 * 60 * 60 * 24);
    return diffInDays > 7;
  };

  //  what counts as "completed" for allowing re-assignment?
  const COMPLETED_BATCH_STATUSES = new Set(["Batch Completed"]); 
  // If you also want allow after Training Completed, add it:
  // const COMPLETED_BATCH_STATUSES = new Set(["Training Completed", "Batch Completed"]);

  // Batch lookup
  const batchByNumber = useMemo(() => {
    const map = {};
    (batchData || []).forEach((b) => {
      map[b.batchNumber] = b;
    });
    return map;
  }, [batchData]);

  // Admissions for a student
  const admissionsByStudentId = useMemo(() => {
    const map = {};
    (admissionData || []).forEach((adm) => {
      const sid = String(adm.studentId);
      if (!map[sid]) map[sid] = [];
      map[sid].push(adm);
    });
    return map;
  }, [admissionData]);

  // Determine if a student is eligible to be assigned now
  const canAssignStudent = (student) => {
    if (!student?._id) return false;

    //  disabled users blocked (User.isActive)
    // assumes you populate student.userId = { isActive: true/false }
    const isActive = student?.userId?.isActive;
    if (isActive === false) return false;

    const sid = String(student._id);
    const theirAdmissions = admissionsByStudentId[sid] || [];

    // If never assigned, OK
    if (theirAdmissions.length === 0) return true;

    // If they have ANY admission whose batch is NOT completed => block
    const hasAnyActiveAssignment = theirAdmissions.some((adm) => {
      const batch = batchByNumber[adm.batchNumber];
      const batchStatus = batch?.status || "";
      return !COMPLETED_BATCH_STATUSES.has(batchStatus);
    });

    return !hasAnyActiveAssignment;
  };

  // Eligible students list (used in dropdown)
  const eligibleStudents = useMemo(() => {
    return (studentData || []).filter(canAssignStudent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData, admissionsByStudentId, batchByNumber]);
console.log("eligibleStudents",eligibleStudents)

  const formik = useFormik({
    initialValues: admissionInitialValues,
    validationSchema: studentSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const sid = values.studentId;
      const bno = values.batchNumber;

      // 1) block same student same batch duplicate
      const alreadySameBatch = (admissionData || []).some(
        (adm) => String(adm.studentId) === String(sid) && String(adm.batchNumber) === String(bno)
      );
      if (alreadySameBatch) {
        toast.error("This student is already assigned to this batch. Please select a different batch.", {
          style: { textWrap: "wrap", width: "300px", textAlign: "left", color: "black" },
        });
        return;
      }

      // 2) block if student currently has any non-completed batch admission
      const theirAdmissions = admissionsByStudentId[String(sid)] || [];
      const hasActive = theirAdmissions.some((adm) => {
        const batch = batchByNumber[adm.batchNumber];
        const st = batch?.status || "";
        return !COMPLETED_BATCH_STATUSES.has(st);
      });

      if (hasActive) {
        toast.error(
          "This student is already assigned to an active batch. They can be reassigned only after the previous batch is completed.",
          {
            style: { textWrap: "wrap", width: "420px", textAlign: "left", color: "black" },
          }
        );
        return;
      }

      // 3) capacity check
      if (Number(batchAssignedCount) >= Number(batchTargetNo)) {
        toast.error("Sorry! This batch is full. Please try another batch or contact super admin.", {
          style: { textWrap: "wrap", width: "320px", textAlign: "left", color: "black" },
        });
        return;
      }

      toast.success(`${values.studentName} is successfully assigned to ${values.batchNumber}!`, {
        style: { textWrap: "wrap", width: "300px", textAlign: "left", color: "black" },
      });

      await addAdmission(values);
      handleClose();
    },
  });

  // Batch select handler
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
    setBatchTargetNo(Number(selectedBatch.targetStudent ?? 0)); // targetStudent is string in your schema

    const cName = selectedBatch.courseName || "";
    setCourseValue(cName);
    formik.setFieldValue("courseName", cName);

    const selectedCourse = courseData.find((c) => c.courseName === cName);
    formik.setFieldValue("courseId", selectedCourse?._id || "");
    formik.setFieldValue("admissionFee", selectedCourse?.courseFee ?? "");
  };

  // Student select handler
  const handleStudentNameChange = (e) => {
    const selectedStudentName = e.target.value;
    setStudentValue(selectedStudentName);

    const selectedStudent = (studentData || []).find((s) => s.displayName === selectedStudentName);
    console.log("selectedStudent",selectedStudent)
    if (selectedStudent) {
      formik.setFieldValue("studentId", selectedStudent._id);
      formik.setFieldValue("studentName", selectedStudent.displayName);
    }
  };

  const handleAdmissionDateChange = (e) => {
    const picked = e.target.value;
    const { month, year } = dateFun(picked);
    formik.setFieldValue("admissionDate", picked);
    formik.setFieldValue("admissionMonth", month);
    formik.setFieldValue("admissionYear", year);
  };

  // Submit
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
        setAdmissionData(list.data.admissionData || []);
      }
} catch (e) {
  console.error("Error adding Admission:", e?.response?.status, e?.response?.data || e);
  toast.error(e?.response?.data?.message || "Add admission failed");
}
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title style={{ padding: "0% 5%" }}>Add Admission</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} style={{ padding: "1.5% 5%" }}>
        <Modal.Body>
          <Row>
            <Col xs={6} md={6}>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Batch No.</Form.Label>
                <select
                  name="batchNumber"
                  className="form-select"
                  value={formik.values.batchNumber}
                  onChange={handleBatchNumber}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Batch</option>
                  {batchData
                    ?.filter((b) => !isOlderThan7Days(b.startDate))
                    .map((b) => (
                      <option key={b.batchNumber} value={b.batchNumber}>
                        {b.batchNumber}
                      </option>
                    ))}
                </select>

                {formik.errors.batchNumber && formik.touched.batchNumber && (
                  <div className="text-danger text-center">{formik.errors.batchNumber}</div>
                )}
              </Form.Group>
            </Col>

            <Col className="pt-4 pe-0">
              <div>Status</div>
              <Form.Select disabled name="status" value={formik.values.status || ""} onChange={formik.handleChange} style={{ fontSize: "14px" }}>
                <option value="Assigned">Assigned</option>
              </Form.Select>
            </Col>

            <Col xs={6} md={6}>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Course ID</Form.Label>
                <Form.Control disabled type="text" name="courseId" value={formik.values.courseId} onBlur={formik.handleBlur} />
                {formik.errors.courseId && formik.touched.courseId && (
                  <div className="text-danger text-center">{formik.errors.courseId}</div>
                )}
              </Form.Group>
              
            </Col>

            <Col xs={6} md={6}>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Course Name</Form.Label>
                <Form.Control disabled type="text" name="courseName" value={formik.values.courseName} onBlur={formik.handleBlur} />
                {formik.errors.courseName && formik.touched.courseName && (
                  <div className="text-danger text-center">{formik.errors.courseName}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Student Name</Form.Label>
                <select
                  name="studentName"
                  className="form-select"
                  value={formik.values.studentName}
                  onChange={handleStudentNameChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  {eligibleStudents.map((student) => (
                    <option key={student._id} value={student.displayName}>
                      {student.displayName}
                    </option>
                  ))}
                </select>

                {formik.errors.studentName && formik.touched.studentName && (
                  <div className="text-danger text-center">{formik.errors.studentName}</div>
                )}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Student ID</Form.Label>
                <Form.Control disabled type="text" name="studentId" value={formik.values.studentId} onBlur={formik.handleBlur} />
                {formik.errors.studentId && formik.touched.studentId && (
                  <div className="text-danger text-center">{formik.errors.studentId}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="admissionDate"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleAdmissionDateChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.admissionDate && formik.touched.admissionDate && (
                  <div className="text-danger text-center">{formik.errors.admissionDate}</div>
                )}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Month</Form.Label>
                <Form.Control disabled type="text" name="admissionMonth" value={dateFun(formik.values.admissionDate).month || ""} onBlur={formik.handleBlur} />
                {formik.errors.admissionMonth && formik.touched.admissionMonth && (
                  <div className="text-danger text-center">{formik.errors.admissionMonth}</div>
                )}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Year</Form.Label>
                <Form.Control disabled type="text" name="admissionYear" value={dateFun(formik.values.admissionDate).year || ""} onBlur={formik.handleBlur} />
                {formik.errors.admissionYear && formik.touched.admissionYear && (
                  <div className="text-danger text-center">{formik.errors.admissionYear}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Fee</Form.Label>
                <Form.Control disabled type="text" name="admissionFee" value={formik.values.admissionFee} onBlur={formik.handleBlur} />
                {formik.errors.admissionFee && formik.touched.admissionFee && (
                  <div className="text-danger text-center">{formik.errors.admissionFee}</div>
                )}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Source</Form.Label>
                <select
                  name="admissionSource"
                  className="form-select"
                  value={formik.values.admissionSource}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  <option value={"Social"}>Social</option>
                  <option value={"Referral"}>Referral</option>
                  <option value={"Direct"}>Direct</option>
                </select>
                {formik.errors.admissionSource && formik.touched.admissionSource && (
                  <div className="text-danger text-center">{formik.errors.admissionSource}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex gap-3">
            <Button type="submit" style={{ backgroundColor: "#4e73df" }}>
              Add Admission
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddAdmission;



