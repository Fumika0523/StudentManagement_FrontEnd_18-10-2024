import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import React, { useState, useMemo } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { url } from "../../../../utils/constant";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { taskInitialValues, TaskSchema, emptyDetail } from "./TaskSchema"; // ← imported
import {
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
const ModalAddTask = ({ show, setShow, setTaskData, courseData, batchData }) => {
  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );
  console.log("courseData from Modal Add Task:",courseData)

const handleCourseNameChange=(e)=>{
  const selectedCourseName = e.target.value;
  const selectedCourse = courseData?.find(c => c.courseName === selectedCourseName)
  if(selectedCourse){
    formik.setFieldValue("taskCourseName", selectedCourse.taskCourseName)
  }
}
// console.log(selectedCourseName)

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const [filteredBatches, setFilteredBatches] = useState([]);

  // const handleCourseChange = (e) => {
  //   const chosen = e.target.value;
  //   formik.setFieldValue("taskCourseName", chosen);
  //   const matched = (batchData || []).filter((b) => b.courseName === chosen);
  //   setFilteredBatches(matched);
  //   const resetDetails = formik.values.taskDetail.map((d) => ({
  //     ...d,
  //     batchNumber: [],
  //   }));
  //   formik.setFieldValue("taskDetail", resetDetails);
  // };

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

  //Get Course Data

    // Input style
  const inputStyle = {
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
  };

    const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
  };

  const formik = useFormik({
    initialValues: taskInitialValues,
    validationSchema: TaskSchema,        // ← imported
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

  return (
    <Modal show={show} onHide={handleClose} size="lg"
       style={{ "--bs-modal-border-radius": "16px",  }}
       centered>
      <Modal.Header closeButton
        style={{
          background: "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
        }}>
        <Modal.Title style={{ padding: "0% 5%" }}>Add Task</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} style={{ padding: "1.5% 5%" }}>
        <Modal.Body>
          {/* Course Name */}
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mt-3">
                <Form.Label className="mb-0">Course Name</Form.Label>
             <Form.Select
                  name="taskCourseName"
                  value={formik.values.taskCourseName}
                  onChange={handleCourseNameChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">Select Course</option>
                  {courseData?.map(c => (
                    <option key={c._id} value={c.courseName}>{c.courseName}</option>
                  ))}
                </Form.Select>
                {formik.touched.taskCourseName && formik.errors.taskCourseName && (
                  <div className="text-danger">{formik.errors.taskCourseName}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Task Details */}
          <hr className="mt-4" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Task Details</strong>
            <Button variant="outline-primary" size="sm" type="button" onClick={addDetailRow}>
              <FiPlus className="me-1" />
              Add Row
            </Button>
          </div>

          {formik.values.taskDetail.map((detail, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-3"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontWeight: 600, color: "#475569" }}>Task #{index + 1}</span>
                {formik.values.taskDetail.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => removeDetailRow(index)}
                  >
                    <FiTrash2 />
                  </Button>
                )}
              </div>

              <Row>
                <Col xs={12} md={8}>
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">Task Question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name={`taskDetail[${index}].taskQuestion`}
                      value={detail.taskQuestion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter task question..."
                    />
                    {getDetailError(index, "taskQuestion") && (
                      <div className="text-danger">{getDetailError(index, "taskQuestion")}</div>
                    )}
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">Allocated Day</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      name={`taskDetail[${index}].allocatedDay`}
                      value={detail.allocatedDay}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. 3"
                    />
                    {getDetailError(index, "allocatedDay") && (
                      <div className="text-danger">{getDetailError(index, "allocatedDay")}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          ))}

          {typeof formik.errors.taskDetail === "string" && (
            <div className="text-danger">{formik.errors.taskDetail}</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex gap-3">
            <Button type="submit" style={{ backgroundColor: "#4e73df", border: "none" }}>
              Add Task
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

export default ModalAddTask;


//Task Number should be auto calculated/selected when you select courseName.