import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/constant';
import axios from 'axios';

const ModalEditAdmission = ({show,setShow,singleAdmission,setAdmissionData}) => {
  console.log(singleAdmission)
  console.log(singleAdmission._id)

  const navigate = useNavigate()
  const handleClose=()=>{
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
              admissionSource:singleAdmission?.admissionSource,
              admissionFee:singleAdmission?.admissionFee,
              admissionDate:singleAdmission?.admissionDate,
              admissionYear:singleAdmission?.admissionYear,
              admissionMonth:singleAdmission?.admissionMonth
          },
          onSubmit:(values)=>{
              console.log(values)
              updateAdmission(values)
          }
      })
      console.log(singleAdmission)

      const token = sessionStorage.getItem('token')
      console.log(token)
  
      let config = {
          headers:{
              Authorization:`Bearer ${token}`
          }
      }

      const updateAdmission = async(updatedAdmission)=>{
        console.log("Admission posted to the DB")
        try{
          let res = await axios.put(`${url}/updateadmission/${singleAdmission._id}`,updatedAdmission,config)
          console.log(res)
          if(res){
            let res = await axios.get(`${url}/alladmission`,config)
            console.log("Successfully Updated the Admission",updatedAdmission)
            setAdmissionData(res.data.admissionData)
            handleClose()
          }
        }catch(e){
          console.error("Error in Editting Admission:",e)
        }
      }
  return (
    <Modal show={show} onHide={handleClose} >
    <Modal.Header>
        <Modal.Title>Edit Admission</Modal.Title>
    </Modal.Header>
    <Form onSubmit={formik.handleSubmit}  className='px-5'>
        <Modal.Body>
            {/* Admission Source */}
            <Form.Group>
                <Form.Label>Admission Source</Form.Label>
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
            {/* ADD BUTTON */}
            <Button type="submit" style={{backgroundColor:"#4e73df"}}>Update Admission</Button>
            {/* CLOSE BUTTON*/}
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
    </Form>
</Modal>
  )
}

export default ModalEditAdmission