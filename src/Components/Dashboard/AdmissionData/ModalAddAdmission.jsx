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
    const [courseData,setCourseData] = useState([])


        //Original Course Data
        const getCourseData=async()=>{
            console.log("Console data is called....")
            let res = await axios.get(`${url}/allcourse`,config)
            console.log("Course Data",res.data.courseData)
            setCourseData(res.data.courseData)
        }
        useEffect(()=>{
            getCourseData()
        },[])
        console.log(courseData)
        courseData?.map((element)=>console.log(element.courseName))


    const formSchema = Yup.object().shape({
        courseName:Yup.string().required(),
        admissionSource:Yup.string().required(),
        admissionFee:Yup.number().required(),
        admissionDate:Yup.date().required(),
        admissionYear:Yup.number().required(),
        admissionMonth:Yup.number().required(),
    })

    const formik = useFormik({
        initialValues:{
            courseName:"",
            admissionSource:"",
            admissionFee:"",
            admissionDate:"",
            admissionYear:2020,
            admissionMonth:"Jan",
        },
        validationSchema:formSchema,
        onSubmit:(values)=>{
            console.log(values)
            addAdmission(values)
        }
    })

    const token = sessionStorage.getItem('token')
    console.log(token)

    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }

    const formatDate = (dateString)=>{
        console.log(dateString)
        const date = new Date(dateString);
        console.log(date)
        return date.toLocaleDateString('en-US',{
          year:"numeric",
          month:'long',
          day:'numeric'
        })
      }
      console.log(new Date("03-01-2025"))
      
const dateFun=()=>{
    const date = new Date('Sat Mar 01 2025 00:00:00 GMT+0900 (Japan Standard Time)');
    // Get the full month name
    const month = date.toLocaleString('default', { month: 'long' });
    // Get the full year
    const year = date.getFullYear();
    console.log(`${month} ${year}`);
    return [month,year]
}


    const addAdmission = async(newAdmission)=>{
        console.log(newAdmission)
        try{
            const res = await axios.post(`${url}/addadmission`,newAdmission,config)
            console.log(res)
            if(res){
                let res = await axios.get(`${url}/alladmission`,config)
                console.log("Successfully a new admission added to the DB!", newAdmission)
                setAdmissionData(res.data.admissionData)
                // handleClose()
            }
        }catch(e){
            console.error("Error adding Admission:",e)
        }
    }


  return (
    <Modal show={show} 
    onHide={handleClose}
    size="lg" >
        <Modal.Header>
            <Modal.Title style={{padding:"0% 5%"}}>Add Admission</Modal.Title>
        </Modal.Header>
        <Form  style={{padding:"1.5% 5%"}}>
            <Modal.Body>

                {/* Course Name */}
                <Form.Group >
                    <Form.Label className='mb-1'>Course Name</Form.Label>
                  
                    <select name="courseName" id="" className="form-select" value={formik.values.courseName} onChange={formik.handleChange}>

                    {courseData?.map((element)=>
                    <option key={element.courseName} value={element.courseName} selected>{element.courseName}</option>
                    )}
                        
                    </select>
                </Form.Group>

                {/* Admission Source */}
                <Form.Group >
                    <Form.Label className='mb-1'>Source</Form.Label>
                  
                    <select onChange={formik.onChange} value={formik.values.admissionSource} name="admissionSource" id="" className="form-select">

                        <option value={"Social"} selected>Social</option>
                        <option value={"Referral"}>Referral</option>
                        <option value={"Direct"}>Direct</option>
                    </select>
                </Form.Group>

                {/* Admission Fee */}
                <Form.Group  className='mt-3'>
                    <Form.Label className='mb-0'>Fee</Form.Label>
                    <Form.Control
                    type="number" placeholder='Type your Admission Fee'
                    name='admissionFee' value={formik.values.admissionFee} onChange={formik.handleChange}
                    />
               
                </Form.Group>

                {/* Admission Date */}
                <Form.Group  className='mt-3'>
                    <Form.Label className='mb-0'>Date</Form.Label>
                    <Form.Control
                    type="date" placeholder='Type your Admission Date'
                    name='admissionDate' value={formik.values.admissionDate} onChange={formik.handleChange
                    } />
                </Form.Group>

                {/* Admission Year */}
                <Form.Group  className='mt-3'>
                    <Form.Label className='mb-0'>Year</Form.Label>
                    <Form.Control disabled
                    type="text" placeholder='Type your Admission Year'
                    name='admissionYear' value={formik.values.admissionYear} onChange={formik.handleChange}/>
                </Form.Group>

                {/* Admission Month */}
                <Form.Group className='mt-3'>
                    <Form.Label className='mb-0'>Month</Form.Label>
                    <Form.Control disabled
                    type="text" placeholder='Type your Admission Month'
                    name="admissionMonth" value={formik.values.admissionMonth} onChange={formik.handleChange}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
         
                {/* ADD BUTTON */}
                <Button type="submit" style={{backgroundColor:"#4e73df"}}>Add Admission</Button>

                {/* CLOSE BUTTON*/}
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
}

export default ModalAddAdmission