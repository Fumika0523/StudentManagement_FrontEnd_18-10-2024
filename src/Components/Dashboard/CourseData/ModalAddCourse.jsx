import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';


function ModalAddCourse({show,setShow,setCourseData}){
    const handleClose=()=>{
        setShow(false)
        Navigate('/coursedata')
    }


return(
    <>
    <Modal show={show} >
    <Modal.Header closeButton>
          <Modal.Title  >Add Course</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
            {/* COurseName */}
            <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Control type="courseName" placeholder='Type your Course Name'
                name="courseName" value={formik.values.courseName}
                onChange={formik.handleChange}/>
            </Form.Group>
            {/* SessionType */}

            {/* SessionTime */}

            {/* SessionAvailability*/}

            {/* SessopnDuration */}


            </Modal.Body>
        </Form>

    </Modal>
    </>
)}
export default ModalAddCourse