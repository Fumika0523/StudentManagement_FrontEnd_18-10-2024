import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import React, { useState, useMemo } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { url } from "../../../../utils/constant";
import { FiPlus, FiTrash2, FiBook, FiCheckCircle, FiClipboard, FiCalendar } from "react-icons/fi";
import { taskInitialValues, TaskSchema, emptyDetail } from "./TaskSchema";
import ModalHeaderBlock from "../../../../Common/ModalHeaderBlock";

const ModalAddTask = ({ show, setShow, setTaskData, courseData, batchData }) => {
  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const addDetailRow = () => {
    formik.setFieldValue("taskDetail", [
      ...formik.values.taskDetail,
      { ...emptyDetail },
    ]);
  };

  const removeDetailRow = (index) => {
    const updated = formik.values.taskDetail.filter((_, i) => i !== index);
    formik.setFieldValue("taskDetail", updated);
  };

  const formik = useFormik({
    initialValues: taskInitialValues,
    validationSchema: TaskSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${url}/addtask`, values, config);
        if (res.status === 200) {
          toast.success("Task successfully added!", { style: { color: "black" } });
          const list = await axios.get(`${url}/alltask`, config);
          setTaskData(list.data.taskData || []);
          handleClose();
        }
      } catch (e) {
        console.error("Error adding task:", e?.response?.data || e);
        toast.error(e?.response?.data?.message || "Failed to add task.");
      }
    },
  });

  const getDetailError = (index, field) =>
    formik.touched.taskDetail?.[index]?.[field] &&
    formik.errors.taskDetail?.[index]?.[field];

  // ── Shared styles (matches ModalAssignTask) ──────────────────────────────
  const infoCardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px 18px",
    marginBottom: "10px",
  };

  const iconWrapStyle = (color) => ({
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    backgroundColor: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
  };

  const selectStyle = {
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#1e293b",
    width: "100%",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#1e293b",
    width: "100%",
    outline: "none",
  };

  const taskCardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px 18px",
    marginBottom: "10px",
  };

  const isSubmitDisabled = formik.isSubmitting;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{ "--bs-modal-border-radius": "16px" }}
    >
      <ModalHeaderBlock title="Add Task" icon={<FiClipboard />} />

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: "20px 24px", backgroundColor: "#f9fafb" }}>

          {/* ── Course Name card ── */}
          <div style={infoCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={iconWrapStyle("#f0fdf4")}>
                <FiBook size={16} color="#22c55e" />
              </div>
              <div style={labelStyle}>Course Name</div>
            </div>

            <Form.Select
              name="taskCourseName"
              value={formik.values.taskCourseName}
              onChange={(e) => {
                formik.setFieldValue("taskCourseName", e.target.value, true);
                formik.setFieldTouched("taskCourseName", false, false);
              }}
              onBlur={formik.handleBlur}
              style={selectStyle}
            >
              <option value="">Select Course</option>
              {courseData?.map((c) => (
                <option key={c._id} value={c.courseName}>
                  {c.courseName}
                </option>
              ))}
            </Form.Select>

            {formik.touched.taskCourseName && formik.errors.taskCourseName && (
              <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                {formik.errors.taskCourseName}
              </div>
            )}
          </div>

          {/* ── Task Details section ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={iconWrapStyle("#f5f3ff")}>
                <FiClipboard size={15} color="#8b5cf6" />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Task Details
              </span>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              onClick={addDetailRow}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "5px 12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FiPlus size={13} />
              Add Row
            </Button>
          </div>

          {formik.values.taskDetail.map((detail, index) => (
            <div key={index} style={taskCardStyle}>
              {/* Task row header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={iconWrapStyle("#eff6ff")}>
                    <FiCalendar size={14} color="#3b82f6" />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Task #{index + 1}
                  </span>
                </div>
                {formik.values.taskDetail.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => removeDetailRow(index)}
                    style={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FiTrash2 size={13} />
                  </Button>
                )}
              </div>

              <Row>
                {/* Task Question */}
                <Col xs={12} md={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={labelStyle}>Task Question</div>
                    <textarea
                      rows={2}
                      name={`taskDetail[${index}].taskQuestion`}
                      value={detail.taskQuestion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter task question..."
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                    {getDetailError(index, "taskQuestion") && (
                      <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "3px" }}>
                        {getDetailError(index, "taskQuestion")}
                      </div>
                    )}
                  </div>
                </Col>

                {/* Allocated Day */}
                <Col xs={12} md={4}>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={labelStyle}>Allocated Day</div>
                    <input
                      type="number"
                      min={1}
                      name={`taskDetail[${index}].allocatedDay`}
                      value={detail.allocatedDay}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. 3"
                      style={inputStyle}
                    />
                    {getDetailError(index, "allocatedDay") && (
                      <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "3px" }}>
                        {getDetailError(index, "allocatedDay")}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          ))}

          {typeof formik.errors.taskDetail === "string" && (
            <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
              {formik.errors.taskDetail}
            </div>
          )}
        </Modal.Body>

        {/* Footer — identical structure to ModalAssignTask */}
        <Modal.Footer
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "14px 24px",
            backgroundColor: "#ffffff",
            borderRadius: "0 0 16px 16px",
            gap: "8px",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSubmitDisabled}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              fontWeight: 600,
              fontSize: "13px",
              padding: "7px 18px",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            style={{
              background: isSubmitDisabled
                ? "#e2e8f0"
                : "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
              border: "none",
              fontWeight: 700,
              fontSize: "13px",
              padding: "7px 22px",
              borderRadius: "8px",
              color: isSubmitDisabled ? "#94a3b8" : "#fff",
              boxShadow: isSubmitDisabled ? "none" : "0 2px 8px rgba(31,63,191,0.3)",
              cursor: isSubmitDisabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {/* <FiCheckCircle size={15} /> */}
            {formik.isSubmitting ? "Loading..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;