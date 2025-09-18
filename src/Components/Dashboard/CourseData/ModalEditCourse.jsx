import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { useEffect } from 'react';


const ModalEditCourse=({show,setShow,singleCourse,setCourseData})=>{
    // console.log(singleCourse)
//console.log(singleCourse._id)

    const notify = () => {
    toast.warning("Course is updated successfully!", {
        autoClose: 800, // auto close after 200ms
        style: {
            textWrap: "nowrap",
            textAlign: "center",
            padding: "0.5% 0% 0.5% 4%",
            color: "black",
        },
    });
};

    const navigate = useNavigate()
    const handleClose = ()=>{
        setShow(false)
        navigate('/coursedata')
    }

    const formSchema = Yup.object().shape(
    {
      courseName:Yup.string().required("Mandatory field !"),
        courseType:Yup.string().required("Mandatory field !"),
        courseAvailability:Yup.string().required("Mandatory field !"),
        dailySessionHrs: Yup.number()
            .typeError("Must be a number")
            .positive("Must be greater than 0")
            .required("Mandatory field !"),
        courseDuration:Yup.string().required("Mandatory field !"),
        courseFee:Yup.number().required("Mandatory field !"),
        noOfDays:Yup.number(),
    })
    
    const formik = useFormik({
        initialValues:{
            courseName:singleCourse?.courseName,
            courseType:singleCourse?.courseType,
            courseAvailability:singleCourse?.courseAvailability,
            dailySessionHrs:singleCourse?.dailySessionHrs,
            courseDuration:singleCourse?.courseDuration,
            courseFee:singleCourse?.courseFee,
            noOfDays:singleCourse?.noOfDays,
        },
        enableReinitialize:true,
        validationSchema:formSchema,
        onSubmit:(values)=>{
            console.log(values)
            updateCourse(values)
        }  
    })
    const token = localStorage.getItem('token')
    // console.log('token')

    let config = {
        headers:{
        Authorization:`Bearer ${token}`
    }}

    //Update
    const updateCourse = async(updatedCourse)=>{
        // console.log("Course posted to the DB")
    try{
        let res = await axios.put(`${url}/updatecourse/${singleCourse._id}`,updatedCourse,config)
        console.log(res)
        if(res){
        let res = await axios.get(`${url}/allcourse`,config)
        console.log(`successfully updated the Course`, updatedCourse)
        setCourseData(res.data.courseData)
        notify()
        setTimeout(()=>{
            handleClose()
        },3001)}
    }catch(e){
        console.error('Error Editing Course:',e);
    }}

    useEffect(() => {
  const { courseDuration, dailySessionHrs } = formik.values;
  if (courseDuration && dailySessionHrs > 0) {
    formik.setFieldValue("noOfDays", Math.ceil(courseDuration / dailySessionHrs));
  }
}, [formik.values.courseDuration, formik.values.dailySessionHrs]);


    return(
    <>
   <Modal show={show} onHide={handleClose} >
    <Modal.Header closeButton>
        <Modal.Title  >Edit Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-2' >
        <Modal.Body>
            <Row>
                <Col>
                {/* CourseName */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Name</Form.Label>
                <Form.Control type="text"
                name="courseName" value={formik.values.courseName} onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseName && formik.touched.courseName && <div className="text-danger text-center">{formik.errors.courseName}</div>}
                 </Form.Group>
                </Col>
                <Col>
                {/* courseType */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Type</Form.Label>
                <Form.Control type="text"
                name="courseType" value={formik.values.courseType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseType && formik.touched.courseType && <div className="text-danger text-center">{formik.errors.courseType}</div>}
                </Form.Group>
                </Col>
            </Row>
            <Row>
            <Col>
            {/* Fee */}
            <Form.Group className='my-3'>
            <Form.Label className='m-0'>Fee</Form.Label>
            <Form.Control type="number" 
            name="courseFee" value={formik.values.courseFee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}/>
             {/* Error Message */}
             {formik.errors.courseFee && formik.touched.courseFee && <div className="text-danger text-center">{formik.errors.courseFee}</div>}
            </Form.Group>
            </Col>
           {/* Daily Session Hours */}
            <Col>
              <Form.Group className='my-3'>
                <Form.Label className='m-0'>Daily Session Hours</Form.Label>
                <Form.Control
                  type="number"
                  name="dailySessionHrs"
                  value={formik.values.dailySessionHrs}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.dailySessionHrs && formik.touched.dailySessionHrs && (
                  <div className="text-danger text-center">{formik.errors.dailySessionHrs}</div>
                )}
              </Form.Group>
            </Col>
            </Row>
            <Row>
           {/*Availability*/}
            <Col sx={4}>
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Availability</Form.Label>
                <Form.Select
                  name="courseAvailability"
                  value={formik.values.courseAvailability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">--Select--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
                {formik.errors.courseAvailability && formik.touched.courseAvailability && (
                  <div className="text-danger text-center">{formik.errors.courseAvailability}</div>
                )}
              </Form.Group>
            </Col>

            {/* Course Duration */}
            <Col sx={4}>
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Total hours</Form.Label>
                <Form.Control   type="number"
                name="courseDuration" value={formik.values.courseDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
             {formik.errors.courseDuration && formik.touched.courseDuration && <div className="text-danger text-center">{formik.errors.courseDuration}</div>}
            </Form.Group>
            </Col>
            {/* No. of Days */}
            <Col sx={4}>
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>No. of Days</Form.Label>
                <Form.Control disabled
                type="number" 
                name="noOfDays" 
                value={formik.values.noOfDays}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
                {/* Error Message */}
                {formik.errors.noOfDays && formik.touched.noOfDays && (
                <div className="text-danger text-center">{formik.errors.noOfDays}</div>
                )}
            </Form.Group>
            </Col>

            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' style={{backgroundColor:"#4e73df"}}>
                    Save changes
                </Button>
                <Button  variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
        </>
    )
}
export default ModalEditCourse

//Pop up message should come up