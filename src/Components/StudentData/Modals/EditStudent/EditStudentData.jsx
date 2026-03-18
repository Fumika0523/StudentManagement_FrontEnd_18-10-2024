// src/components/StudentData/EditStudent/EditStudentData.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";

import { url } from "../../../utils/constant";
import { FieldGroup, Section, panelStyle } from "../CreateStudent/studentFormStyle";
import { editStudentSchema } from "./editStudentSchema";
import useCountryCode from "../CreateStudent/CountryCode";

import {
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

function EditStudentData({
  show,
  setShow,
  setSingleStudent,
  singleStudent,
  setStudentData,
  courseData,
}) {
  const [focusedField, setFocusedField] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const { countries, countryLoading } = useCountryCode();

  const handleClose = () => {
    setShow(false);
    setSingleStudent(null);
  };

  // --------------------------
  // Focus + disabled styles
  // --------------------------
  const inputBase = {
    fontSize: 13,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    padding: "9px 12px",
    backgroundColor: "#fff",
    color: "#1e293b",
    boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
    transition: "border-color .15s ease, box-shadow .15s ease, transform .05s ease",
  };

  const inputFocus = {
    border: "1px solid #60a5fa",
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.18)",
  };

  const inputDisabled = {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
  };

  const getInputStyle = ({ focused, disabled }) => ({
    ...inputBase,
    ...(focused ? inputFocus : {}),
    ...(disabled ? inputDisabled : {}),
  });

  // helper for blur/focus
  const focusProps = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: (e) => {
      formik.handleBlur(e);
      setFocusedField(null);
    },
  });

  // --------------------------
  // Formik initial values
  // --------------------------
  const formattedBirthDate = singleStudent?.userId?.birthdate
    ? new Date(singleStudent.userId.birthdate).toISOString().split("T")[0]
    : "";
  // console.log("singleStudent",singleStudent)
  const formik = useFormik({
    initialValues: {
      title: singleStudent?.userId?.title || "",
      firstName: singleStudent?.userId?.firstName || "",
      lastName: singleStudent?.userId?.lastName || "",

      // password stays blank & disabled in UI
      password: "",
      email: singleStudent?.userId?.email || "",
      phoneNumber: singleStudent?.userId?.phoneNumber || "",
      gender: singleStudent?.userId?.gender || "Rather not say",
      birthdate: formattedBirthDate,
      country: singleStudent?.userId?.country || "",
      preferredCourses: Array.isArray(singleStudent?.preferredCourses)
  ? singleStudent.preferredCourses
  : [],
    },
    validationSchema: editStudentSchema,
    enableReinitialize: true,
onSubmit: async (values, { setSubmitting }) => {
  try {
    //  do NOT send password
    const { password, ...payload } = values;

    console.log("Sending payload:", payload);
    console.log("Endpoint:", `${url}/updatestudent/${singleStudent?._id}`);

    await updateStudent(payload);

    //  refresh list so you can see the update
    const refreshed = await axios.get(`${url}/all-student`, config);
    setStudentData(refreshed.data.studentData);

    toast.success("Student updated successfully!");
    setTimeout(() => handleClose(), 400);
  } catch (e) {
    console.error("Update failed:", e.response?.data || e.message);
    toast.error(e.response?.data?.message || "Failed to update student.");
  } finally {
    setSubmitting(false);
  }
}})

const updateStudent = async (updatedStudent) => {
  if (!singleStudent?._id) throw new Error("Missing student id");

  console.log("updating student data...");
  const res = await axios.put(
    `${url}/updatestudent/${singleStudent._id}`,
    updatedStudent,
    config
  );
  console.log("update student res:", res.data);
  return res.data;
};

  const F = formik;

  const toggleCourse = (course) => {
    const current = Array.isArray(F.values.preferredCourses) ? F.values.preferredCourses : [];
    const next = current.includes(course)
      ? current.filter((c) => c !== course)
      : [...current, course];

    F.setFieldValue("preferredCourses", next, true);
    F.setFieldTouched("preferredCourses", true, false);
  };

  // if you want to disable some fields in edit, do it here:
  const lockFields = false;
// console.log("courseData:",courseData)
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered style={{ "--bs-modal-border-radius": "16px" }}>
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
            gap: 12,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <EditIcon sx={{ fontSize: 32 }} />
          Edit Student Information
        </Modal.Title>
      </Modal.Header>

      <Form   onSubmit={(e) => {
    e.preventDefault();
    console.log("HTML FORM SUBMITTED");
    F.handleSubmit(e);
  }}>
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
                    {...focusProps("title")}
                    disabled={lockFields}
                    style={getInputStyle({ focused: focusedField === "title", disabled: lockFields })}
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
                    {...focusProps("firstName")}
                    disabled={lockFields}
                    placeholder="e.g. John"
                    style={getInputStyle({ focused: focusedField === "firstName", disabled: lockFields })}
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
                    {...focusProps("lastName")}
                    disabled={lockFields}
                    placeholder="e.g. Doe"
                    style={getInputStyle({ focused: focusedField === "lastName", disabled: lockFields })}
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
                            cursor: lockFields ? "not-allowed" : "pointer",
                            opacity: lockFields ? 0.6 : 1,
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
                            disabled={lockFields}
                            style={{ accentColor: "#2563eb" }}
                          />
                          {g === "Rather not say" ? "Rather not say" : g[0].toUpperCase() + g.slice(1)}
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
                    {...focusProps("email")}
                    disabled={lockFields}
                    placeholder="email@example.com"
                    style={getInputStyle({ focused: focusedField === "email", disabled: lockFields })}
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
                    {...focusProps("phoneNumber")}
                    disabled={lockFields}
                    placeholder="+81 90-0000-0000"
                    style={getInputStyle({ focused: focusedField === "phoneNumber", disabled: lockFields })}
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
                    {...focusProps("birthdate")}
                    disabled={lockFields}
                    style={getInputStyle({ focused: focusedField === "birthdate", disabled: lockFields })}
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
                    {...focusProps("country")}
                    disabled={lockFields || countryLoading}
                    style={getInputStyle({
                      focused: focusedField === "country",
                      disabled: lockFields || countryLoading,
                    })}
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

              {/* ✅ Password locked */}
              <Col xs={12} md={6}>
                <FieldGroup label="Password" icon={<Lock />}>
                  <Form.Control
                    size="sm"
                    type="password"
                    name="password"
                    value={F.values.password}
                    disabled
                    readOnly
                    placeholder="********"
                    style={getInputStyle({ focused: false, disabled: true })}
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
                        onClick={() => !lockFields && toggleCourse(name)}
                        disabled={lockFields}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "5px 13px",
                          borderRadius: 20,
                          cursor: lockFields ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          border: `1.5px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
                          backgroundColor: selected ? "#eff6ff" : "#fff",
                          color: selected ? "#1d4ed8" : "#64748b",
                          opacity: lockFields ? 0.6 : 1,
                        }}
                      >
                        {selected ? "✓ " : ""}
                        {name}
                      </button>
                    );
                  })}
              </div>
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
  disabled={F.isSubmitting }  
  style={{
    // background: F.dirty
    //   ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
    //   : "#cbd5e1",  // grey when disabled
    border: "none",
    fontWeight: 900,
    fontSize: 13,
    padding: "8px 18px",
    borderRadius: 10,
    boxShadow: F.dirty ? "0 10px 22px rgba(37, 99, 235, 0.22)" : "none",
    transition: "all 0.2s",
    cursor: F.dirty ? "pointer" : "not-allowed",
  }}
>
  Save Changes
</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditStudentData;