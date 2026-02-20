// src/components/StudentData/EditStudent/EditStudentData.jsx
import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { url } from "../../../utils/constant";
import { editStudentSchema } from "./editStudentSchema";
import FormikField from "../FormikField";

import {
  Edit as EditIcon,
  Person,
  Email,
  Phone,
  Lock,
  Cake,
  AccountCircle,
} from "@mui/icons-material";
import { Box } from "@mui/material";

function EditStudentData({ show, setShow, setSingleStudent, singleStudent, setStudentData }) {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleClose = () => {
    setShow(false);
    setSingleStudent(null);
  };

  // Format birthdate for form
  const formattedDate = singleStudent?.birthdate
    ? new Date(singleStudent.birthdate).toISOString().split("T")[0]
    : "";

  // Update student function
  const updateStudent = async (updatedStudent) => {
    console.log("🔄 Updating student with data:", updatedStudent);
    
    try {
      const res = await axios.put(
        `${url}/updatestudent/${singleStudent._id}`,
        updatedStudent,
        config
      );
      console.log(" Update response:", res.data);

      if (res) {
        const refreshed = await axios.get(`${url}/allstudent`, config);
        setStudentData(refreshed.data.studentData);
        toast.success(`${updatedStudent.studentName} updated successfully!`);
        setTimeout(() => handleClose(), 600);
      }
    } catch (e) {
      console.error("Error updating student:", e);
      console.error("Error response:", e.response?.data);
      if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Failed to update student. Please try again.");
      }
    }
  };

  // Formik setup - IMPORTANT: initialValues must be set here, NOT in schema file
  const formik = useFormik({
    initialValues: {
      studentName: singleStudent?.studentName || "",
      username: singleStudent?.username || "",
      password: singleStudent?.password || "",
      email: singleStudent?.email || "",
      phoneNumber: singleStudent?.phoneNumber || "",
      gender: singleStudent?.gender || "",
      birthdate: formattedDate, // Use the formatted date from above
    },
    validationSchema: editStudentSchema,
    enableReinitialize: true, // This is KEY - it updates form when singleStudent changes
    onSubmit: (values) => {
      console.log("📋 Form submitted with values:", values);
      updateStudent(values);
    },
  });

  // Debug: Log initial values
  React.useEffect(() => {
    console.log(" Formik Initial Values:", formik.initialValues);
    console.log(" Formik Current Values:", formik.values);
  }, [formik.initialValues, formik.values]);

  // Auto-update username when studentName changes
  React.useEffect(() => {
    if (formik.values.studentName && formik.values.studentName !== singleStudent?.studentName) {
      // Convert studentName to username format (lowercase, no spaces)
      const autoUsername = formik.values.studentName
        .toLowerCase()
        .replace(/\s+/g, ''); // Remove all spaces
      
      formik.setFieldValue("username", autoUsername);
      console.log("🔄 Auto-updated username to:", autoUsername);
    }
  }, [formik.values.studentName, singleStudent?.studentName]);

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
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
          <EditIcon sx={{ fontSize: "32px" }} />
          Edit Student Information
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f9fafb" }}>
          {/* Row 1: Student Name, Username, Gender */}
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
                placeholder="Username"
                disabled={true}
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

          {/* Row 2: Email, Birthdate */}
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

          {/* Row 3: Phone, Password */}
          <Row className="g-2">
            <Col xs={12} md={6}>
              <FormikField
                formik={formik}
                name="phoneNumber"
                label="Phone Number"
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
                disabled={true}
              />
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
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "none",
              fontWeight: "600",
              fontSize: "13px",
              padding: "7px 20px",
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            {formik.isSubmitting ? "Updating..." : "Update Student"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditStudentData;