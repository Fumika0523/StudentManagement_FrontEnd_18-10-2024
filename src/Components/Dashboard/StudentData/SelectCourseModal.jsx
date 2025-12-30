import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { url } from '../../utils/constant';

function SelectCourseModal({ show, setShow }) {
  const courses = ['HTML','CSS','JavaScript','Redux','Node JS','MongoDB','SQL','Bootstrap'];
  const [currentStudent, setCurrentStudent] = useState(null);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch current student
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${url}/allstudent`, config);
        const found = res.data.studentData.find(s => s.username === username);
        setCurrentStudent(found || null);
      } catch (e) {
        console.error("Error fetching student:", e);
      }
    };
    fetchStudent();
  }, [username]);

  // Formik for checkbox form
  const formik = useFormik({
    initialValues: { preferredCourses: currentStudent?.preferredCourses || [] },
    enableReinitialize: true,
    validationSchema: Yup.object({ preferredCourses: Yup.array().of(Yup.string()) }),
    onSubmit: async (values) => {
      if (!currentStudent) return;
      try {
        await axios.put(`${url}/updatestudent/${currentStudent._id}`, values, config);
        setShow(false);
      } catch (e) {
        console.error("Error updating student:", e);
      }
    },
  });

  

  // Skip button
  const handleSkip = async () => {
    if (!currentStudent) return;
    try {
      await axios.put(`${url}/updatestudent/${currentStudent._id}`, { preferredCourses: ["Skip"] }, config);
      setShow(false);
    } catch (e) {
      console.error("Error skipping courses:", e);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Preferred Courses</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit} className="px-4">
        <Modal.Body>
          {courses.map((course, idx) => (
            <Form.Check
              key={idx}
              inline
              type="checkbox"
              name="preferredCourses"
              label={course}
              value={course}
              checked={formik.values.preferredCourses.includes(course)}
              onChange={(e) => {
                const { value, checked } = e.target;
                const updated = checked
                  ? [...formik.values.preferredCourses, value]
                  : formik.values.preferredCourses.filter(c => c !== value);
                formik.setFieldValue("preferredCourses", updated);
              }}
            />
          ))}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {formik.values.preferredCourses.length === 0 && (
            <Button variant="secondary" onClick={handleSkip}>Skip</Button>
          )}
          <Button type="submit" style={{ backgroundColor: '#4e73df' }}>Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SelectCourseModal;