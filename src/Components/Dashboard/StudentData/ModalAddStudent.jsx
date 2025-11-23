import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ModalAddStudent({ show, setShow, setStudentData }) {

    const notify = () => {
      toast.success("Student added successfully !");
    };


  const formSchema = Yup.object().shape({
    studentName: Yup.string().required("Mandatory Field!"),
    password: Yup.string().required("Mandatory Field!"),
    username: Yup.string().required("Mandatory Field!"),
    email: Yup.string().required("Mandatory Field!"),
    phoneNumber: Yup.number().required("Mandatory Field!"),
    gender: Yup.string().required("Mandatory Field!"),
    birthdate: Yup.date().required("Mandatory Field!"),
    preferredCourses:Yup.string().required("Mandatory Field!"),
  })

  const formik = useFormik({
    initialValues: {
      studentName: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      gender: "",
      birthdate: "",
      preferredCourses:"",
    },
    //validationSchema: formSchema,
    onSubmit: (values) => {
     // console.log(values)
      addStudent(values)
    }
  })

  const token = localStorage.getItem('token')
  // console.log(token)

  let config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
// Adding student API
const addStudent = async (newStudent) => {
  try {
    const res = await axios.post(`${url}/registerstudent`, newStudent, config);
    if (res) {
      //console.log("Successfully added a new student to the DB");
      // Fetch latest data
      const updated = await axios.get(`${url}/allstudent`, config);
      setStudentData(updated.data.studentData);
        setTimeout(() => handleClose(), 1000);
      toast.success("Batch added successfully!");
    }
  } catch (e) {
    toast.error("Failed to add course. Please try again.");
    //console.error("Error Adding Student:", e);
  }
};


  return (
    <>
      <Modal
        show={show} onHide={handleClose} size='lg'  >
        <Modal.Header closeButton>
        <Modal.Title  >Add Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-3' style={{ fontSize: "" }}>
          <Modal.Body>
            <Row>
              <Col>
                {/* Studentname*/}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Student Name</Form.Label>
                  <Form.Control type="text"
                    placeholder='Type your Full Name'
                    name="studentName"
                    value={formik.values.studentName}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.studentName && formik.touched.studentName && <div className="text-danger text-center">{formik.errors.studentName}</div>}
                  </Form.Group>
              </Col>
              <Col>
                {/* Username */}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Username</Form.Label>
                  <Form.Control type="text" placeholder='Type your Username' name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.username && formik.touched.username && <div className="text-danger text-center">{formik.errors.username}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Gender */}
              <Col className='pt-4 pe-0 ' xs={6} md={6}>
                <div>Gender</div>
                <div className='form-check form-check-inline'>
                  <Form.Check style={{fontSize:"14px"}} type="radio" name="gender" label={`Male`}
                    value="male"
                    onChange={formik.handleChange} /></div>
                <div className='form-check form-check-inline'>
                  <Form.Check style={{fontSize:"14px"}} type="radio" name="gender" label={`Female`}
                    value="female"
                    onChange={formik.handleChange} /></div>
              </Col>
                 {/* Assign/De-assigned */}
              {/* <Col className='pt-4 pe-0' xs={6} md={6}>
                <div>Status</div>
                <Form.Select
                  name="status"
                  value={formik.values.status || ""}
                  onChange={formik.handleChange}
                  style={{ fontSize: "14px" }}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Assigned">Assigned</option>
                  <option value="De-assigned">De-assigned</option>
                </Form.Select>
              </Col> */}
                </Row>
              <Row>
             <Col className='pt-4 pe-0' xs={6}>
                {/* Email */}
                <Form.Group className='my-3'>
                  <Form.Label className='m-0'>Email Address</Form.Label>
                  <Form.Control type="email" placeholder='Type your Email Address' name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.email && formik.touched.email && <div className="text-danger text-center">{formik.errors.email}</div>}
                </Form.Group>
              </Col>
             <Col className='pt-4 pe-0' xs={6} >
                {/* B-Date*/}
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Birthdate</Form.Label>
                  <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                    value={formik.values.birthdate}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.birthdate && formik.touched.birthdate && <div className="text-danger text-center">{formik.errors.birthdate}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
     <Col>
  <Form.Label className='pt-4 m-0'>Preferred Courses</Form.Label>
  <div
    className="d-flex flex-wrap gap-3 mt-1"
    style={{ fontSize: "14px" }}
  >
    {[
      "HTML",
      "CSS",
      "Java Script",
      "Redux",
      "Node JS",
      "Mongo DB",
      "SQL",
      "Bootstrap",
    ].map((course, idx) => (
      <Form.Check
        key={idx}
        inline={false} // we don’t need inline since flex-wrap will handle layout
        label={course}
        name="preferredCourses"
        type="checkbox"
        value={course}
        id={`preferred-${course}`}
        onChange={formik.handleChange}
        checked={formik.values.preferredCourses?.includes(course) || false}
      />
    ))}
  </div>
</Col>


              </Row>
              <Row>
             {/* Phone No.*/}
              <Col>
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Phone No.</Form.Label>
                  <Form.Control type="number" placeholder="Type your Phone No." name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="text-danger text-center">{formik.errors.phoneNumber}</div>} 
                </Form.Group>
              </Col>
              <Col>
                {/* Password*/}
                <Form.Group className='mt-3'>
                  <Form.Label className='m-0'>Password</Form.Label>
                  <Form.Control type="password" placeholder="Type your Password" name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} />
                    {/* Error Message */}
                    {formik.errors.password && formik.touched.password && <div className="text-danger text-center">{formik.errors.password}</div>} 
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: "#4e73df" }} type="submit">
              Add Student
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export default ModalAddStudent