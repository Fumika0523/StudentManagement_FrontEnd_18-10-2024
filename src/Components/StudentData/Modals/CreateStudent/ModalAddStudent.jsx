import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { studentSchema, studentInitialValues } from "./StudentSchema";
import useCountryCode from "./CountryCode";
import { FieldGroup, Section, inputStyle, panelStyle } from "./studentFormStyle";

import { url } from "../../../utils/constant";
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
} from "@mui/icons-material";

function ModalAddStudent({ show, setShow, setStudentData, courseData }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
console.log("courseData from Modaladdstudent",courseData)
  const handleClose = () => {
    setShow(false);
    navigate("/studentdata");
  };
const { countries, countryLoading } = useCountryCode();

  const formik = useFormik({
    initialValues: studentInitialValues,
    validationSchema: studentSchema,
    onSubmit: async (values) => {
      console.log("onSubmit",values)
      addStudent(values)
    }})
         const addStudent = async(addedStudent)=>{
          console.log("Adding a new Student:",addedStudent)
          let res = await axios.post(`${url}/signup`,addedStudent,config)
          if(res){
            toast.success()
            setTimeout(() => handleClose(), 500);
          }    }
     
        const getStudentData = async()=>{
          console.log("getStudentData is called")
          let res = await fetch(`${url}/allstudent`,config)
          console.log("getStudentData res:",res)
          const data= await res.json()
          console.log("getStudentData data:",data)
        }
        useEffect(()=>{
          getStudentData()
        },[])
    

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
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <PersonAdd sx={{ fontSize: 24, color: "white" }} />
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: 18 }}>Add New Student</div>
          </div>
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
               {/* Gender */}
              <Col xs={12} md={6}>
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

                {/* Password */}
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

            <Row className="g-1">
              {/* Email */}
              <Col xs={12} md={6}>
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
            {/* PhoneNumber */}
              <Col xs={12} md={6} className="">
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
              
              {/* Birthdate */}
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
            {/* Country */}
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
            
            </Row>

            <Section title="Preferred Courses" icon={<School />}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {courseData 
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

export default ModalAddStudent