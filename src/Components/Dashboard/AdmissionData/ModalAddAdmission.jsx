import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import * as Yup from "yup";
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/constant';


const ModalAddAdmission = ({show,setShow,setAdmissionData}) => {
    const navigate = useNavigate()
    const handleClose = ()=>{
        setShow(false)
        navigate('/admissiondata')
    }
    const formSchema = Yup.object().shape({
        admissionSource:Yup.string().required(),
        admissionFee:Yup.number().required(),
        admissionDate:Yup.date().required(),
        admissionYear:Yup.number().required(),
        admissionMonth:Yup.number().required(),
    })

    const formik = useFormik({
        initialValues:{
            admissionSource:"",
            admissionFee:"",
            admissionDate:"",
            admissionYear:"",
            admissionMonth:""
        },
        validationSchema:formSchema,
        onSubmit:(values)=>{
            console.log(values)
            ddAdmission(values)
        }
    })

    const token = sessionStorage.getItem('token')
    console.log(token)

    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }

    const addAdmission = async(newAdmission)=>{
        try{
            const res = await axios.post(`${url}/addadmission`,newAdmission,config)
            console.log(res)
            if(res){
                let res = await axios.get(`${url}/alladmission`,config)
                console.log("Successfully a new admission added to the DB!", newAdmission)
                setAdmissionData(res.data.admissionData)
                handleClose()
            }
        }catch(e){
            console.error("Error adding Admission:",e)
        }
    }
  return (
    <Modal show={show} onHide={handleClose} >
        <Modal.Header>
            <Modal.Title>Add Admission</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
                {/* Admission Source */}
                <Form.Group>
                    <Form.Label>Admission Source</Form.Label>
                    {/* <Form.Control
                    type= placeholder='Type your Admission Source'
                    name="admissionSource" value={formik.values.admissionSource}
                    onChange={formik.handleChange}/> */}
                    <select name="admissionSource" id="">
                        <option value={formik.values.admissionSource}>Social</option>
                        <option value={formik.values.admissionSource}>Referral</option>
                        <option value={formik.values.admissionSource}>Direct</option>
                    </select>
                </Form.Group>

                {/* Admission Fee */}
                <Form.Group>
                    <Form.Label>Admission Fee</Form.Label>
                    <Form.Control
                    type="text" placeholder='Type your Admission Fee'
                    name="admissionFee" value={formik.values.admissionFee} 
                    onChange={formik.handleChange}/>
                </Form.Group>

                {/* Admission Date */}
                <Form.Group>
                    <Form.Label>Admission Date</Form.Label>
                    <Form.Control
                    type="text" placeholder='Type your Admission Date'
                    name='admissionDate' value={formik.values.admissionDate} onChange={formik.handleChange}/>
                </Form.Group>

                {/* Admission Year */}
                <Form.Group>
                    <Form.Label>Admission Year</Form.Label>
                    <Form.Control
                    type="text" placeholder='Type your Admission Year'
                    name='admissionYear' value={formik.values.admissionYear} onChange={formik.handleChange}/>
                </Form.Group>

                {/* Admission Month */}
                <Form.Group>
                    <Form.Label>Admission Month</Form.Label>
                    <Form.Control
                    type="text" placeholder='Type your Admission Month'
                    name="admissionMonth" value={formik.values.admissionMonth} onChange={formik.handleChange}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button>Close</Button>
                <Button type="submit">Add Admission</Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
}

export default ModalAddAdmission