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
import { FieldGroup, Section, inputStyle, panelStyle } from "../CreateStudent/studentFormStyle";
import { studentSchema, studentInitialValues } from "../CreateStudent/StudentSchema";
import useCountryCode from "../CreateStudent/CountryCode";
import {
  PersonAdd,
  Person,
  Email,
  Phone,
  Lock,
  Cake,
  School,
  PublicOutlined,
  WcOutlined,
  Edit as EditIcon,
} from "@mui/icons-material";



function EditStudentData({ show, setShow, setSingleStudent, singleStudent, setStudentData, courseData }) {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
const { countries, countryLoading } = useCountryCode();

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

  const F = formik;

  const toggleCourse = (course) => {
    const current = Array.isArray(F.values.preferredCourses)
      ? F.values.preferredCourses
      : [];

    const next = current.includes(course)
      ? current.filter((c) => c !== course)
      : [...current, course];

    F.setFieldValue("preferredCourses", next, true);
    F.setFieldTouched("preferredCourses", true, false);
  };
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
          background: "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "16px 22px",
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

    <Form onSubmit={F.handleSubmit}>
        <Modal.Body style={{ padding: "16px 18px", backgroundColor: "#f1f5f9" }}>
          <div style={panelStyle}>
            <Row className="g-1">
              <Col xs={12} md={3}>
                <FieldGroup label="Title" icon={<Person />}>
                  <Form.Select
                    size="sm"
                    name="title"
                    value={F.values.title}
                    onChange={F.handleChange}
                    style={inputStyle}
                  >
                    {["", "Mr", "Ms", "Mrs", "Mx", "Dr", "Prof"].map((t) => (
                      <option key={t} value={t}>
                        {t || "—"}
                      </option>
                    ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={4}>
                <FieldGroup
                  label="First Name"
                  icon={<Person />}
                  required
                  error={F.touched.firstName && F.errors.firstName}
                >
                  <Form.Control
                    size="sm"
                    name="firstName"
                    value={F.values.firstName}
                    onChange={F.handleChange}
                    onBlur={F.handleBlur}
                    placeholder="e.g. John"
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={5}>
                <FieldGroup
                  label="Last Name"
                  icon={<Person />}
                  required
                  error={F.touched.lastName && F.errors.lastName}
                >
                  <Form.Control
                    size="sm"
                    name="lastName"
                    value={F.values.lastName}
                    onChange={F.handleChange}
                    onBlur={F.handleBlur}
                    placeholder="e.g. Doe"
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12}>
                <FieldGroup label="Gender" icon={<WcOutlined />}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["male", "female", "Rather not say"].map((g) => {
                      const checked = F.values.gender === g;
                      return (
                        <label
                          key={g}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                            padding: "8px 12px",
                            borderRadius: 999,
                            border: `1px solid ${checked ? "#93c5fd" : "#e2e8f0"}`,
                            background: checked ? "#eff6ff" : "#fff",
                            color: checked ? "#1d4ed8" : "#334155",
                            fontSize: 13,
                            fontWeight: 600,
                            userSelect: "none",
                          }}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={checked}
                            onChange={F.handleChange}
                            style={{ accentColor: "#2563eb" }}
                          />
                          {g === "Rather not say"
                            ? "Rather not say"
                            : g[0].toUpperCase() + g.slice(1)}
                        </label>
                      );
                    })}
                  </div>
                </FieldGroup>
              </Col>
            </Row>

            <Row className="g-1">
              <Col xs={12} md={7}>
                <FieldGroup
                  label="Email"
                  icon={<Email />}
                  required
                  error={F.touched.email && F.errors.email}
                >
                  <Form.Control
                    size="sm"
                    type="email"
                    name="email"
                    value={F.values.email}
                    onChange={F.handleChange}
                    onBlur={F.handleBlur}
                    placeholder="email@example.com"
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={5}>
                <FieldGroup
                  label="Phone"
                  icon={<Phone />}
                  error={F.touched.phoneNumber && F.errors.phoneNumber}
                >
                  <Form.Control
                    size="sm"
                    name="phoneNumber"
                    value={F.values.phoneNumber}
                    onChange={F.handleChange}
                    onBlur={F.handleBlur}
                    placeholder="+81 90-0000-0000"
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Birthdate" icon={<Cake />}>
                  <Form.Control
                    size="sm"
                    type="date"
                    name="birthdate"
                    value={F.values.birthdate}
                    onChange={F.handleChange}
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup label="Country" icon={<PublicOutlined />}>
                  <Form.Select
                    size="sm"
                    name="country"
                    value={F.values.country}
                    onChange={F.handleChange}
                    disabled={countryLoading}
                    style={inputStyle}
                  >
                    <option value="">
                      {countryLoading ? "Loading countries…" : "Select country"}
                    </option>
                    {countries?.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </Form.Select>
                </FieldGroup>
              </Col>

              <Col xs={12} md={6}>
                <FieldGroup
                  label="Password"
                  icon={<Lock />}
                  required
                  error={F.touched.password && F.errors.password}
                >
                  <Form.Control
                    size="sm"
                    type="password"
                    name="password"
                    value={F.values.password}
                    onChange={F.handleChange}
                    onBlur={F.handleBlur}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </FieldGroup>
              </Col>
            </Row>

            <Section title="Preferred Courses" icon={<School />}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(courseData || [])
                  .filter((c) => c?.courseName)
                  .map((c) => {
                    const name = String(c.courseName).trim();
                    const selected = (F.values.preferredCourses || []).includes(name);

                    return (
                      <button
                        key={c._id || name}
                        type="button"
                        onClick={() => toggleCourse(name)}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "5px 13px",
                          borderRadius: 20,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          border: `1.5px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
                          backgroundColor: selected ? "#eff6ff" : "#fff",
                          color: selected ? "#1d4ed8" : "#64748b",
                        }}
                      >
                        {selected ? "✓ " : ""}
                        {name}
                      </button>
                    );
                  })}
              </div>

              {F.touched.preferredCourses && F.errors.preferredCourses && (
                <p style={{ fontSize: 11, color: "#ef4444", marginTop: 6, marginBottom: 0 }}>
                  {F.errors.preferredCourses}
                </p>
              )}
            </Section>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderRadius: "0 0 16px 16px",
            gap: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 10,
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={F.isSubmitting}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "none",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 18px",
              borderRadius: 10,
              boxShadow: "0 10px 22px rgba(37, 99, 235, 0.22)",
            }}
          >
            Add Student
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditStudentData;