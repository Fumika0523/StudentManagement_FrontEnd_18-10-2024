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


const ModalEditCourse=({show,setShow,singleCourse,setCourseData})=>{
    console.log(singleCourse)
    console.log(singleCourse._id)

    const notify=()=>{
        console.log("Toast Notification Added")
        toast.warning("Course is updated successfully !"
            ,{
                style:{
                    textWrap:"nowrap",
                    textAlign:"center",
                    padding:"0.5% 0% 0.5% 4%",
                    color:"black",
                }
            });
    }

    const navigate = useNavigate()
    const handleClose = ()=>{
        setShow(false)
        navigate('/coursedata')
    }

    const formSchema = Yup.object().shape(
        {
               courseName:Yup.string().required("Mandatory field !"),
                  courseType:Yup.string().required("Mandatory field !"),
                  courseTime:Yup.string().required("Mandatory field !"),
                  courseAvailability:Yup.string().required("Mandatory field !"),
                  courseDuration:Yup.string().required("Mandatory field !"),
                  courseFee:Yup.number().required("Mandatory field !"),
        })
    
    const formik = useFormik({
             initialValues:{
                courseName:singleCourse?.courseName,
                courseType:singleCourse?.courseType,
                courseTime:singleCourse?.courseTime,
                courseAvailability:singleCourse?.courseAvailability,
                courseDuration:singleCourse?.courseDuration,
                courseFee:singleCourse?.courseFee,
        },
        enableReinitialize:"true",
        validationSchema:formSchema,
        onSubmit:(values)=>{
            console.log(values)
            updateCourse(values)
        }  
    })
    const token = localStorage.getItem('token')
    console.log('token')

    let config = {
        headers:{
        Authorization:`Bearer ${token}`
    }}

    //Update
    const updateCourse = async(updatedCourse)=>{
        console.log("Course posted to the DB")
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

    return(
        <>
   <Modal show={show} onHide={handleClose} >
    <Modal.Header closeButton>
          <Modal.Title  >Edit Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit} className='px-5' style={{fontSize:"80%"}} >
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
            {/* courseFime */}
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
                <Col>
                    {/* courseTime */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Time</Form.Label>
                <Form.Control type="text" 
                name="courseTime" value={formik.values.courseTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                 {/* Error Message */}
             {formik.errors.courseTime && formik.touched.courseTime && <div className="text-danger text-center">{formik.errors.courseTime}</div>}
            </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                       {/* courseAvailability*/}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Availability</Form.Label>
                <Form.Control type="courseAvailability"
                name="courseAvailability" value={formik.values.courseAvailability}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
                {formik.errors.courseAvailability && formik.touched.courseAvailability && <div className="text-danger text-center">{formik.errors.courseAvailability}</div>}
            </Form.Group>
                </Col>
                <Col>
            {/* courseDuration */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Duration</Form.Label>
                <Form.Control type="courseDuration" 
                name="courseDuration" value={formik.values.courseDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}/>
                {/* Error Message */}
             {formik.errors.courseDuration && formik.touched.courseDuration && <div className="text-danger text-center">{formik.errors.courseDuration}</div>}
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