import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';


function EditStudentData({show,setShow,setSingleStudent,singleStudent}){
  console.log(singleStudent._id)
  console.log(singleStudent)

    const navigate = useNavigate()
     const [studentData,setStudentData] = useState([])
    // const [show, setShow] = useState(false);

    const handleClose = () => {
    setShow(false)
    navigate('/studentdata')
    }
  
  const formSchema = Yup.object().shape({
    password: Yup.string().required(),
    studentname: Yup.string().required(),
    email: Yup.string().required(),
    phoneNumber: Yup.number().required(),
    gender:Yup.string().required(),
    birthdate:Yup.date().required()
})
//updating in a single data
const formattedDate = singleStudent.birthdate
? new Date(singleStudent.birthdate).toISOString().split('T')[0]
:"";


console.log("update birthdate",formattedDate)
// 1 data need to update
const formik = useFormik({
    initialValues: {
        username: singleStudent?.username,
        password: singleStudent?.password,
        email: singleStudent?.email,
        phoneNumber: singleStudent?.phoneNumber,
        gender:singleStudent?.gender,
        birthdate:formattedDate,
    },
    // enableReinitialize: true, //if there is any update in my initial value, please make it update >> enable > true
    onSubmit:(values)=>{
        console.log(values)
        updateStudent(values)
 }})
 console.log(singleStudent)

 const token = sessionStorage.getItem('token')
 console.log('token')
 
 let config = {
     headers:{
         Authorization:`Bearer ${token}`
     }
 }
 
     const updateStudent = async(updatedStudent)=>{
         console.log("student posted to the DB")
         console.log("update student:",updatedStudent)
     
     let res = await axios.put(`${url}/updatestudent/${singleStudent._id}`,updatedStudent,config)
     console.log(res)
     if(res){
         console.log("updatedStudent:",updatedStudent)
     }} 
     



    return(
    <>
    <div>
      <Modal     
         show={show} onHide={handleClose}
          size="xl"
          >
        <Modal.Header closeButton>
          <Modal.Title  >Edit Student Info</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}}>
        <Modal.Body>
                        {/* studentname */}
                        <Form.Group className='my-3'>
                            <Form.Label className='m-0'>username</Form.Label>
                            <Form.Control type="username" placeholder='Type your username' name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                 />
                        </Form.Group>
                        {/* Gender */}
                        <div>Gender</div>
                        {/* <div className='form-check form-check-inline'>                 
                        <Form.Check type="radio" name="gender" label={`Male`}
                            value="male"
                            onChange={formik.handleChange} /></div>
                         <div className='form-check form-check-inline'>
                            <Form.Check type="radio" name="gender" label={`Female`}
                            value="female"
                            onChange={formik.handleChange} /></div> */}

                          {/* MALE */}
                          <div className='form-check form-check-inline'>                 
                          <Form.Check type="radio" name="gender" label="Male" value="male" 
                          onChange={formik.handleChange}
                          checked={formik.values.gender ==="male"}
                          />
                          {formik.errors.gender && formik.touched.gender?(
                              <div>{formik.errors.gender}</div>
                          ): null }
                          </div>

                          {/* FEMALE */}
                          <div className='form-check form-check-inline'>
                          <Form.Check type="radio" name="gender" label="Female" value="female"
                          onChange={formik.handleChange}
                          //  if formik.values.gender is equal to female , then check
                          checked={formik.values.gender === "female"}
                          />
                            {formik.errors.gender && formik.touched.gender?(
                              <div>{formik.errors.gender}</div>
                          ): null }
                          </div>

                        {/* Email */}
                        <Form.Group className='my-3'>
                            <Form.Label className='m-0'>Email Address</Form.Label>
                            <Form.Control type="email" placeholder='Type your Email Address' name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        {/* B-Date*/}
                        <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Birthdate</Form.Label>
                            <Form.Control type="date" placeholder="Type your Birthdate" name="birthdate"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange} />
                        </Form.Group>

                       {/* Phone No.*/}
                        <Form.Group className='mt-3'>
                          <Form.Label className='m-0'>Phone No.</Form.Label>
                        <Form.Control type="phoneNumber"  name="phoneNumber"
                              value={formik.values.phoneNumber}
                                onChange={formik.handleChange} />
                              {formik.errors.phoneNumber && formik.touched.phoneNumber? (
                            <div>{formik.errors.phoneNumber}</div>
                            ) : null }
                            </Form.Group>

                        {/* Password*/}
                        <Form.Group className='mt-3'>
                            <Form.Label className='m-0'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type your Password" name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                                {formik.errors.password && formik.touched.password? (
                                <div>{formik.errors.password}</div>
                                ) : null }
                        </Form.Group>         
                     </Modal.Body>
                   <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >
                    Close
                </Button>
                <Button style={{backgroundColor:"#4e73df"}} type="submit">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Form>
      </Modal>
      </div>
    </>
    )
}
export default EditStudentData