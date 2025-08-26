// import React from 'react';
// import { Modal, Form, Button } from 'react-bootstrap';
// import axios from 'axios';
// import { url } from '../../utils/constant';
// import { useEffect, useState } from 'react'
// import { Formik, useFormik } from 'formik';
// import * as Yup from "yup";

// function SelectCourseModal({ show, setShow }) {
//   const courses = ['HTML','CSS','JavaScript','Redux','Node JS','MongoDB','SQL','Bootstrap'];
//     const [studentData,setStudentData] = useState([])
//      const token = localStorage.getItem('token')
//  console.log('token')
 
//  let config = {
//      headers:{
//          Authorization:`Bearer ${token}`
//      }
//  }
//     const username = localStorage.getItem('username') 
//     console.log(username)
  
//   const formSchema = Yup.object().shape({
//     preferredCourses: Yup.string([]),
//   })
//     // Student Data API
//     const getStudentData = async()=>{
//         console.log("Student data is called........")
//         let res = await axios.get(`${url}/allstudent`,config)
//         console.log("StudentData",res.data.studentData)
//         setStudentData(res.data.studentData)
//         }
//         useEffect(()=>{
//          getStudentData()
//         },[])
//     console.log(studentData)

// const formik = useFormik({
//     initialValues: {
//  preferredCourses:""
//     },
//     validationSchema:formSchema,
//     enableReinitialize: true, //if there is any update in my initial value, please make it update >> enable > true
//     onSubmit:(values)=>{
//         console.log(values)
//         updateStudent(values)
//  }})

//  //update
//   const updateStudent = async(updatedStudent)=>{
//     console.log("student posted to the DB")
//     try{
//       let res = await axios.put(`${url}/updatestudent/${_id}`,updatedStudent,config)
//       console.log(res)
//       if(res){
//         let res = await axios.get(`${url}/allstudent`,config)
//           console.log("updatedStudent:",updatedStudent)
//           setStudentData(res.data.studentData)
//           handleClose()
//       }
//     }catch(e){
//       console.error('Error Editing Student:',e)
//     }} 

//   // Skip Button function
//   const handleSkip = () => {
//     setShow(false);
//   };

// //Whatever you select, you should get in the console

//   return (
//     <Modal show={show} backdrop="static" keyboard={false} centered>
//       <Modal.Header>
//         <Modal.Title>Preferred Courses</Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={formik.handleSubmit} className="px-4">
//         <Modal.Body>
//           {courses.map((course, index) => (
//             <Form.Check
//             style={{fontSize:"14px"}} 
//               key={index}
//               inline
//               name="preferredCourses"
//               label={course}
//               type="checkbox"
//               value={course}
//               checked={formik.values.preferredCourses}
//                onChange={formik.handleChange}
//             />
//           ))}
//         </Modal.Body>
//         <Modal.Footer className='d-flex justify-content-between'>
//           {formik.values.preferredCourses.length === 0 && (
//             <Button variant="secondary" onClick={handleSkip}>
//               Skip
//             </Button>
//           )}
//           <Button type="submit" style={{ backgroundColor: '#4e73df' }}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// }

// export default SelectCourseModal;

import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useFormik } from 'formik';
import * as Yup from "yup";

function SelectCourseModal({ show, setShow }) {
  const courses = ['HTML','CSS','JavaScript','Redux','Node JS','MongoDB','SQL','Bootstrap'];
  const [studentData, setStudentData] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username'); // logged in user

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const formSchema = Yup.object().shape({
    preferredCourses: Yup.array().of(Yup.string()),
  });

  // Fetch students and find current one
  const getStudentData = async () => {
    try {
      let res = await axios.get(`${url}/allstudent`, config);
      setStudentData(res.data.studentData);

      console.log("username from localStorage:", username);
      console.log("all usernames from studentData", res.data.studentData.map(s => s.username));

      const found = res.data.studentData.find(
        (student) => student.username === username
      );
      setCurrentStudent(found || null);
      console.log("Matched student:", found);
    } catch (e) {
      console.error("Error fetching studentData:", e);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);

  const formik = useFormik({
    initialValues: {
      preferredCourses: currentStudent?.preferredCourses || [],
    },
    validationSchema: formSchema,
    enableReinitialize: true, // will update when currentStudent changes
    onSubmit: (values) => {
      console.log("Selected values:", values);
      updateStudent(values);
    },
  });

  const updateStudent = async (updatedStudent) => {
    if (!currentStudent) {
      console.error("No matched student found!");
      return;
    }
    try {
      const res = await axios.put(
        `${url}/updatestudent/${currentStudent._id}`,
        updatedStudent,
        config
      );
      if (res) {
        let refreshed = await axios.get(`${url}/allstudent`, config);
        setStudentData(refreshed.data.studentData);
        setShow(false); // close modal
      }
    } catch (e) {
      console.error('Error Editing Student:', e);
    }
  };

  const handleSkip = () => setShow(false);

  // const handleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     formik.setFieldValue("preferredCourses", [
  //       ...formik.values.preferredCourses,
  //       value,
  //     ]);
  //   } else {
  //     formik.setFieldValue(
  //       "preferredCourses",
  //       formik.values.preferredCourses.filter((course) => course !== value)
  //     );
  //   }
  // };
const handleCheckboxChange = (e) => {
  const { value, checked } = e.target;
  if (checked) {
    formik.setFieldValue("preferredCourses", [
      ...formik.values.preferredCourses,
      value,
    ]);
  } else {
    formik.setFieldValue(
      "preferredCourses",
      formik.values.preferredCourses.filter((course) => course !== value)
    );
  }

  // 👇 log the updated selection
  console.log("selected course:", 
    checked 
      ? [...formik.values.preferredCourses, value] 
      : formik.values.preferredCourses.filter((course) => course !== value)
  );
};

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Preferred Courses</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit} className="px-4">
        <Modal.Body>
          {courses.map((course, index) => (
            <Form.Check
              style={{ fontSize: "14px" }}
              key={index}
              inline
              name="preferredCourses"
              label={course}
              type="checkbox"
              value={course}
              checked={formik.values.preferredCourses.includes(course)}
              onChange={handleCheckboxChange}
            />
          ))}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {formik.values.preferredCourses.length === 0 && (
            <Button variant="secondary" onClick={handleSkip}>
              Skip
            </Button>
          )}
          <Button type="submit" style={{ backgroundColor: '#4e73df' }}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SelectCourseModal;
