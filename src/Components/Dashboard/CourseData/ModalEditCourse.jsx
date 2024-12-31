import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';


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
            }
        );
        
    }

    const navigate = useNavigate()
    const handleClose = ()=>{
        setShow(false)
        navigate('/coursedata')
    }

    const formSchema = Yup.object().shape(
        {
            courseName:Yup.string().required(),
            courseType:Yup.string().required(),
            courseTime:Yup.string().required(),
            courseAvailability:Yup.string().required(),
            courseDuration:Yup.string().required(),
        })
    
    const formik = useFormik({
             initialValues:{
                courseName:singleCourse?.courseName,
                courseType:singleCourse?.courseType,
                courseTime:singleCourse?.courseTime,
                courseAvailability:singleCourse?.courseAvailability,
                courseDuration:singleCourse?.courseDuration,
        },
        // validationSchema:formSchema,
        onSubmit:(values)=>{
            console.log(values)
            updateCourse(values)
        }  
    })
    const token = sessionStorage.getItem('token')
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

            {/* COurseName */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>Course Name</Form.Label>
                <Form.Control type="courseName"
                name="courseName" value={formik.values.courseName} onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseType */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>course Type</Form.Label>
                <Form.Control type="courseType"
                name="courseType" value={formik.values.courseType}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseTime */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>course Time</Form.Label>
                <Form.Control type="courseTime" 
                name="courseTime" value={formik.values.courseTime}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseAvailability*/}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>course Availability</Form.Label>
                <Form.Control type="courseAvailability"
                name="courseAvailability" value={formik.values.courseAvailability}
                onChange={formik.handleChange}/>
            </Form.Group>

            {/* courseDuration */}
            <Form.Group className='my-3'>
                <Form.Label className='m-0'>course Duration</Form.Label>
                <Form.Control type="courseDuration" 
                name="courseDuration" value={formik.values.courseDuration}
                onChange={formik.handleChange}/>
            </Form.Group>
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