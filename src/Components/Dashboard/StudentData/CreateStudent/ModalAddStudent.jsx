import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";

import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { url } from "../../../utils/constant";

import {
  PersonAdd, Person, Email, Phone, Lock, Cake, School,
  AccountCircle,
} from "@mui/icons-material";
import { Box } from "@mui/material";

import FormikField from "../../StudentData/CreateStudent/FormikField";
import { studentInitialValues, studentSchema } from "./StudentSchema";

function ModalAddStudent({ show, setShow, setStudentData, courseData, setCourseData }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    navigate("/studentdata");
  };

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const addStudent = async (newStudent) => {
    try {
      const res = await axios.post(`${url}/registerstudent`, newStudent, config);

      if (res) {
        const updated = await axios.get(`${url}/allstudent`, config);
        setStudentData(updated.data.studentData);

        toast.success(`${newStudent.studentName} added successfully!`);
        setTimeout(() => handleClose(), 600);
      }
    } catch (e) {
      console.error("Error Adding Student:", e);
      //Handle specific error message from backend
      if(e.response?.data?.message){
        toast.error(e.response.data.message)
      }else{
        toast.error("Failed to add student. Please try again.")
      }
    }
  };

  const formik = useFormik({
    initialValues: studentInitialValues,
    validationSchema: studentSchema,
    onSubmit: addStudent,
  });

  // Auto-fill username when studentName changes
  useEffect(() => {
    if (formik.values.studentName) {
      // Convert studentName to username format (lowercase, no spaces)
      const autoUsername = formik.values.studentName
        .toLowerCase()
        .replace(/\s+/g, ''); // Remove all spaces
      
      formik.setFieldValue("username", autoUsername);
    } else {
      // Clear username if studentName is empty
      formik.setFieldValue("username", "");
    }
  }, [formik.values.studentName]);

  // checkbox handler for array field
  const toggleCourse = (course) => {
    const current = formik.values.preferredCourses || [];
    const next = current.includes(course)
      ? current.filter((c) => c !== course)
      : [...current, course];

    formik.setFieldValue("preferredCourses", next);
  };

  const prefError =
    formik.touched.preferredCourses && formik.errors.preferredCourses;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{ "--bs-modal-border-radius": "16px" }}
    >
      {/* Header */}
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
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
          <PersonAdd sx={{ fontSize: "32px" }} />
          Add New Student
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
          {/* Row 1 */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={4}>
              <FormikField
                formik={formik}
                name="studentName"
                label="Student Name"
                Icon={Person}
                placeholder="Full Name"
              />
            </Col>

            <Col xs={12} md={4}>
              <FormikField
                formik={formik}
                name="username"
                label="Username"
                Icon={AccountCircle}
                placeholder=""
                disabled={true}  // Make username disabled
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "#475569",
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Person sx={{ fontSize: 14 }} />
                  Gender
                </Form.Label>

                <Box sx={{ display: "flex", gap: 2, paddingTop: "6px" }}>
                  <Form.Check
                    type="radio"
                    name="gender"
                    label="Male"
                    value="male"
                    onChange={formik.handleChange}
                    checked={formik.values.gender === "male"}
                    style={{ fontSize: "13px" }}
                  />
                  <Form.Check
                    type="radio"
                    name="gender"
                    label="Female"
                    value="female"
                    onChange={formik.handleChange}
                    checked={formik.values.gender === "female"}
                    style={{ fontSize: "13px" }}
                  />
                </Box>

                {formik.touched.gender && formik.errors.gender ? (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.gender}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <FormikField
                formik={formik}
                name="email"
                label="Email"
                Icon={Email}
                type="email"
                placeholder="email@example.com"
              />
            </Col>

            <Col xs={12} md={6}>
              <FormikField
                formik={formik}
                name="birthdate"
                label="Birthdate"
                Icon={Cake}
                type="date"
              />
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <FormikField
                formik={formik}
                name="phoneNumber"
                label="Phone"
                Icon={Phone}
                type="text"
                placeholder="Phone Number"
              />
            </Col>

            <Col xs={12} md={6}>
              <FormikField
                formik={formik}
                name="password"
                label="Password"
                Icon={Lock}
                type="password"
                placeholder="Password"
              />
            </Col>
          </Row>

          {/* Row 4 */}
          <Row className="g-2">
            <Col>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <School sx={{ fontSize: 14 }} />
                  Preferred Courses
                </Form.Label>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    backgroundColor: "white",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {(courseData || [])
                    .filter((c) => c?.courseName)
                    .map((c) => {
                      const courseName = String(c.courseName).trim();

                      return (
                        <Form.Check
                          key={c._id || courseName}
                          label={courseName}
                          type="checkbox"
                          id={`preferred-${c._id || courseName}`}
                          checked={(formik.values.preferredCourses || []).includes(courseName)}
                          onChange={() => toggleCourse(courseName)}
                          onBlur={() => formik.setFieldTouched("preferredCourses", true)}
                          style={{ fontSize: "13px" }}
                        />
                      );
                    })}
                </Box>

                {prefError ? (
                  <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
                    {formik.errors.preferredCourses}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

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
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "none",
              fontWeight: "600",
              fontSize: "13px",
              padding: "7px 20px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            Add Student
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalAddStudent;