import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModalDeleteAdmission = ({viewWarning,setViewWarning,singleAdmission,setAdmissionData}) => {
        const navigate = useNavigate()
        console.log(viewWarning   
        )
        const handleClose = () =>{
        setViewWarning(false)
         navigate('/admissiondata')}
        console.log("singleAdmission",singleAdmission)
        const token = localStorage.getItem('token');
        const config = {
                headers:{
                    Authorization:`Bearer ${token}`}}
// Delete
const handleDeleteClick = async (id) => {
  try {
    // Delete admission
    let deleteRes = await axios.delete(`${url}/deleteadmission/${id}`, config);

    console.log("deleteRes",deleteRes.data.deletedAdmission)
    // Fetch updated admission list
    let allRes = await axios.get(`${url}/alladmission`, config);
    setAdmissionData(allRes.data.admissionData);
    console.log("allRes.data.admissionData",allRes.data.admissionData)
    // Show toast
    toast.error(`Admission for ${deleteRes.data.deletedAdmission.studentName} has been deleted successfully!`, {
      style: {
        textWrap: "nowrap",
        textAlign: "center",
        fontSize: "14px",
        color: "black",
      },
    });

    // Close modal after a short delay
    setTimeout(() => {
      handleClose();
    }, 1000);

  } catch (error) {
    console.error('Error Deleting Admission:', error);
    toast.error("Failed to delete admission!");
  }
};

  return (
    <>
   <Modal style={{marginTop:"15%", border:"none !important",}} show={viewWarning} onHide = {handleClose} >
 <Modal.Title style={{padding:"10% 0%"}} className='text-center fs-3 border-none'>
   Are you sure you want to delete?
 </Modal.Title >

    <Modal.Body style={{padding:"10px"}}  className='d-flex justify-content-center gap-5 border boder-warning mb-2  border-none'>

   <Button className='px-4 fs-5' style={{backgroundColor:"#2c51c1"}} onClick={()=>{handleDeleteClick(singleAdmission._id)}}>
       Yes
   </Button>

   <Button className='px-4 fs-5' variant="secondary" onClick={handleClose} >
       No
   </Button>
   </Modal.Body>
</Modal>
</>
  )}

export default ModalDeleteAdmission