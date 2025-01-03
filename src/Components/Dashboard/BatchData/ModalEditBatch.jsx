import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';

const ModalEditBatch = ({show,setShow,singleBatch,setBatchData})=>{
console.log(singleBatch)
console.log(singleBatch._id)

const navigate = useNavigate()
const handleClose =()=>{
    setShow(false)
    navigate('/batchdata')
}

const formSchema = Yup.object().shape({
    batchNumber:Yup.string(),
    courseName:Yup.string().required(),
    sessionType:Yup.string().required(),
    sessionDay:Yup.string().required(),
    targetStudent:Yup.string().required(),
    location:Yup.string().required(),
    sessionTime:Yup.string().required(),
    fees:Yup.number().required()
})

const formik=useFormik({
 initialValues:{
    batchNumber:singleBatch?.batchNumber,
    courseName:singleBatch?.courseName,
    sessionType:singleBatch?.sessionType,
    sessionDay:singleBatch?.sessionDay,
    targetStudent:singleBatch?.targetStudent,
    location:singleBatch?.location,
    sessionTime:singleBatch?.sessionTime,
    fees:singleBatch?.fees
},
    onSubmit:(values)=>{
        console.log(values)
        updateBatch(values)
    }
})
console.log(singleBatch)

const token = sessionStorage.getItem('token')
console.log(token)

let config ={
    headers:{
        Authorization:`Bearer ${token}`
}}

//Update
const updateBatch = async(updatedBatch)=>{
    console.log("Batch posted to the DB")
try{
    let res = await axios.put(`${url}/updatebatch/${singleBatch._id}`,updatedBatch,config)
console.log(res)
if(res){
    let res = await axios.get(`${url}/allbatch`,config)
    console.log("successfully updated the Batch",updatedBatch)
    setBatchData(res.data.batchData)
    handleClose()}
}catch(e){
    console.error('Error Editing Batch:',e);
}}

return(
<>
<Modal show={show} onHide={handleClose} size="xl">
 <Modal.Header>
   <Modal.Title>Edit Batch</Modal.Title>
     </Modal.Header>
        <Form onSubmit={formik.handleSubmit}  className='px-5' >
            <Modal.Body>
                {/* Batch No. */}
                <Form.Group>
                    <Form.Label>Batch No.</Form.Label>
                    <Form.Control disabled="true"
                    name="batchNumber"
                    value={formik.values.batchNumber}
                    onChange={formik.handleChange}></Form.Control>
                </Form.Group>

                {/* Session Type */}
                <Form.Group>
                    <Form.Label>Session Type</Form.Label>
                    <Form.Control
                    type="text" name="sessionType"
                    value={formik.values.sessionType}
                    onChange={formik.handleChange}
                    />
                </Form.Group>

                {/* Course Name */}
                <Form.Group>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                    type="text" name="courseName"
                    value={formik.values.courseName}
                    onChange={formik.handleChange}/>
                </Form.Group>

                {/* Session Day */}
                <Form.Group>
                    <Form.Label>Session Day</Form.Label>
                    <Form.Control
                    type="text" name="sessionDay"
                    value={formik.values.sessionDay}
                    onChange={formik.handleChange}/>
                </Form.Group>

                {/* Target Student */}
                <Form.Group>
                    <Form.Label>Target Student</Form.Label>
                    <Form.Control type="text" name="targetStudent"
                    value={formik.values.targetStudent}
                    onChange={formik.handleChange}/>
                </Form.Group>

                 {/* Location */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Location</Form.Label>
                <Form.Control type="text"  name='location'
                    value={formik.values.location}
                    onChange={formik.handleChange}/>
                </Form.Group>

                {/* Session Time */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Session Time</Form.Label>
                <Form.Control type="text"  name="sessionTime"
                value={formik.values.sessionTime}
                onChange={formik.handleChange} />
                </Form.Group>

                {/* Fees */}
                <Form.Group className='my-3'>
                <Form.Label className='m-0'>Fees</Form.Label>
                <Form.Control type="number"  name="fees"
                value={formik.values.fees}
                onChange={formik.handleChange} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                
            {/* SAVE */}
            <Button style={{backgroundColor:"#4e73df"}} 
            type="submit">
            Save Changes
            </Button>

            {/* CLOSE */}
            <Button variant="secondary" onClick={handleClose} >
            Close
            </Button>
            
        </Modal.Footer>
    </Form>
</Modal>
</>
)
}
export default ModalEditBatch
