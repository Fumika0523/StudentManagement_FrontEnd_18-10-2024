import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const ModalDeleteWarning = ({viewWarning,setViewWarning,singleBatch,setBatchData})=>{
const navigate = useNavigate()
const handleClose = ()=>{
    setViewWarning(false)
    navigate('/batchdata')}

console.log(singleBatch)
const token = localStorage.getItem('token');
const config = {
        headers:{
            Authorization:`Bearer ${token}`}}

// Delete
const handleDeleteClick = async(id) =>{
try{
    let res = await axios.delete(`${url}/deletesbatch/${id}`,config);
    console.log(res)
    if(res){
    let res = await axios.get(`${url}/allbatch`,config)
    console.log("BatchData",res.data.batchData)
    setBatchData(res.data.batchData) // updating the original Main batch data
    handleClose()}   
}catch(error){
    console.error('Error Deleting Batch:', error);
}}

return(
<>
{/* Boolean value : show={true}, s */}
<Modal show={viewWarning} onHide = {handleClose} >
  <Modal.Body style={{padding:"5%"}}  className='d-flex justify-content-center border boder-warning mb-2 gap-5 border-none'>
    Are you sure you want to delete?
  </Modal.Body>
  <Modal.Footer>
    <Button className='px-4 fs-5' style={{backgroundColor:"#4e73df"}} onClick={()=>{handleDeleteClick(singleBatch._id)}}>
        Yes
    </Button>

    <Button className='px-4 fs-5' variant="secondary" onClick={handleClose} >
        No
    </Button>
  </Modal.Footer>
</Modal>
</>
)}
export default ModalDeleteWarning