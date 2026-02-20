import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { url } from '../../utils/constant';

function SelectCourseModal({ show, setShow }) {
  const courses = ['HTML','CSS','JavaScript','Redux','Node JS','MongoDB','SQL','Bootstrap'];
  const [currentStudent, setCurrentStudent] = useState(null);
  console.log("currentStudent",currentStudent)
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const studentId = localStorage.getItem("studentId");
  console.log("studentId:",studentId)
  // Fetch current student
   useEffect(() => {
    if (!show) return;           // only fetch when modal opens
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${url}/student/${studentId}`, config);
        console.log("fetchSTudent res:",res.data.StudentData)
        setCurrentStudent(res.data.StudentData);
      } catch (e) {
        console.error("Error fetching student:", e);
      }
    };
    fetchStudent();
  }, [show, studentId]);

  // Formik for checkbox form
  const formik = useFormik({
    initialValues: { preferredCourses: currentStudent?.preferredCourses || [] },
    enableReinitialize: true,
    validationSchema: Yup.object({
      preferredCourses: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      if (!studentId) {
        return toast.error("Unable to get student data. Please contact to Admin")
      }
    //  try {
        const res1 = await axios.put(`${url}/updatestudent/${studentId}`, values, config);
        console.log("updatestudent:",res1.data);
        setShow(false);
      // } catch (e) {
      //   console.error("Error updating student:", e);
      // }
    },
  });

    // Skip button
  const handleSkip = async () => {
    if (!studentId) return;
    try {
      await axios.put(
        `${url}/updatestudent/${studentId}`, { preferredCourses: ["Skip"] }, config );
      setShow(false);
    } catch (e) {
      console.error("Error skipping courses:", e);
    }
  };

 return (
    <Modal show={show} backdrop="static" keyboard={false} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Preferred Courses</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} className="px-4">
        <Modal.Body>
          {courses.map((course) => (
            <Form.Check
              key={course}
              type="checkbox"
              name="preferredCourses"
              label={course}
              value={course}
              checked={formik.values.preferredCourses.includes(course)}
              onChange={(e) => {
                const { value, checked } = e.target;
                const updated = checked
                  ? [...formik.values.preferredCourses, value]
                  : formik.values.preferredCourses.filter((c) => c !== value);

                formik.setFieldValue("preferredCourses", updated);
              }}
            />
          ))}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          {formik.values.preferredCourses.length === 0 && (
            <Button variant="secondary" type="button" onClick={handleSkip}>
              Skip
            </Button>
          )}
          <Button type="submit" style={{ backgroundColor: "#4e73df" }}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SelectCourseModal;