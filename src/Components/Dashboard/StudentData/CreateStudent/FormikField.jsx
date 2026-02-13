import React from "react";
import Form from "react-bootstrap/Form";

const labelStyle = {
  fontWeight: 600,
  fontSize: "12px",
  color: "#475569",
  marginBottom: "6px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const inputStyle = {
  borderRadius: "6px",
  padding: "8px 12px",
  fontSize: "13px",
  border: "1px solid #e2e8f0",
};

export default function FormikField({
  formik,
  name,
  label,
  Icon,
  type = "text",
  placeholder,
  as, // optional for textarea etc
}) {
  const showError = formik.touched?.[name] && formik.errors?.[name];

  return (
    <Form.Group>
      <Form.Label style={labelStyle}>
        {Icon ? <Icon sx={{ fontSize: 14 }} /> : null}
        {label}
      </Form.Label>

      <Form.Control
        as={as}
        type={type}
        placeholder={placeholder}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={inputStyle}
      />

      {showError ? (
        <div className="text-danger" style={{ fontSize: "11px", marginTop: "2px" }}>
          {formik.errors[name]}
        </div>
      ) : null}
    </Form.Group>
  );
}
