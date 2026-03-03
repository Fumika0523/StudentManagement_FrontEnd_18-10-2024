import React from "react";

export const FieldGroup = ({ icon, label, required, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#64748b",
        marginBottom: 6,
      }}
    >
      {icon &&
        React.cloneElement(icon, {
          sx: { fontSize: 15, color: "#94a3b8" },
        })}
         {/* Red asterisk shown only when the field is required */}
      <span>{label}</span>
      {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>

    {children}

    {error && (
      <div
        style={{
          marginTop: 6,
          padding: "7px 10px",
          borderRadius: 10,
          background: "#fff1f2",
          border: "1px solid #fecdd3",
          color: "#b91c1c",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {error}
      </div>
    )}
  </div>
);

//For card design
export const Section = ({ title, icon, children }) => (
  <div
    style={{
      backgroundColor: "#fff",
      borderRadius: 12,
      border: "1px solid #e9eef4",
      padding: "16px 18px",
      marginBottom: 14,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}
  >
    {title && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 12,
          fontWeight: 700,
          color: "#1f3fbf",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
         {/* Only render the icon if one was passed in.
          React.cloneElement lets us inject sx props into the icon
          without changing how it's passed from the parent. */}
        {icon && React.cloneElement(icon, { sx: { fontSize: 16 } })}
        {title}
      </div>
    )}
        {/* The actual input element (Form.Control, Form.Select, etc.)
        passed from the parent component */}
    {children}
  </div>
);

export const inputStyle = {
  fontSize: 13,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  padding: "9px 12px",
  backgroundColor: "#fff",
  color: "#1e293b",
  boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
};

export const panelStyle = {
  backgroundColor: "#fff",
  borderRadius: 14,
  border: "1px solid #e9eef4",
  padding: "16px 18px",
  boxShadow: "0 6px 18px rgba(2, 6, 23, 0.05)",
};