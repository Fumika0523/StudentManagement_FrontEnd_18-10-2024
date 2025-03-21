import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModalDeleteAdmission = ({viewWarning,setViewWarning,singleAdmission,setAdmissionData}) => {

  const notify = () =>{
    console.log("Toast Notification Added")
        toast.error("Admission is deleted successfully !",{
            style:{
                textWrap:"nowrap",
                textAlign:"center",
                padding:"0.5% 0% 0.5% 4%",
                color:"black",
                // autoClose: "10000",
                // fontStyle:"italic"
            }
        })}

        const navigate = useNavigate()
        console.log(viewWarning   
        )
        const handleClose = () =>{
        setViewWarning(false)
         navigate('/admissiondata')}
            
        console.log(singleAdmission)
        const token = sessionStorage.getItem('token');
        const config = {
                headers:{
                    Authorization:`Bearer ${token}`}}
// Delete
const handleDeleteClick = async(id) =>{
  try{
      let res = await axios.delete(`${url}/deleteadmission/${id}`,config);
      console.log(res)
      if(res){
      let res = await axios.get(`${url}/alladmission`,config)
      console.log("Successfully a Admission is deleted from DB",res.data.admissionData)
      setAdmissionData(res.data.admissionData) // updating the original Main admission data
      notify()
      setTimeout(()=>{
          handleClose()
      },3001)
      handleClose()}   
  }catch(error){
      console.error('Error Deleting Admission:', error);    
  }}


  return (
    <>
    {/* Boolean value : show={true}, s */}
 <Modal style={{marginTop:"15%", border:"none !important",}} show={viewWarning} onHide = {handleClose} >
 <Modal.Title style={{padding:"10% 0%"}} className='text-center fs-3 border-none'>
   Are you sure you want to delete?
 </Modal.Title >

    <Modal.Body style={{padding:"5%"}}  className='d-flex justify-content-center border boder-warning mb-2 gap-5 border-none'>

   <Button className='px-4 fs-5' style={{backgroundColor:"#4e73df"}} onClick={()=>{handleDeleteClick(singleAdmission._id)}}>
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