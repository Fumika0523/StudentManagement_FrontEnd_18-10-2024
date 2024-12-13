import { useFormik } from 'formik';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as Yup from "yup";
import { url } from '../../utils/constant';

const ModalEditBatch = ({show,setShow,singleBatch})=>{
console.log(singleBatch)

const formSchema = Yup.object().shape({
    //batchNumber:
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
console.log('token')

let config ={
    headers:{
        Authorization:`Bearer ${token}`
    }}

const updateBatch = async(updatedBatch)=>{
    console.log("Batch posted to the DB")
    console.log("Update Batch:",updatedBatch)

let res = await axios.put(`${url}/updatebatch/${singleBatch.id}`,updatedBatch,config)
console.log(res)
if(res){
    console.log("updatedBatch",updatedBatch)
}

}



    return(
    <>
    <Modal
    show={show} >
        {/* <h1>Edit Batch</h1> */}
        <Modal.Header>
            <Modal.Title>Edit Batch</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
                {/* Batch No. */}
                <Form.Group>
                    <Form.Label>Batch No.</Form.Label>
                    <Form.Control disabled="true"
                    name="batchNumber"
                    value={formik.values.batchNumber}></Form.Control>
                </Form.Group>

                {/* Session Type */}
                <Form.Group>
                    <Form.Label>Session Type</Form.Label>
                    <Form.Control
                    type="text"
                    value={formik.values.sessionType}
                    onChange={formik.handleChange}
                    />
                </Form.Group>

                {/* Course Name */}
                <Form.Group>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                    type="text"
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

                </Form.Group>
            </Modal.Body>
        </Form>
    </Modal>
    </>
)
}
export default ModalEditBatch


//Pop up message should come up