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
const token = sessionStorage.getItem('token');
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
  <Modal.Body className='text-center'>
    Are you sure you want to delete?
  </Modal.Body>
  <Modal.Footer>
    <Button style={{backgroundColor:"#4e73df"}} onClick={()=>{handleDeleteClick(singleBatch._id)}}>
        Yes
    </Button>

    <Button variant="secondary" onClick={handleClose} >
        No
    </Button>
  </Modal.Footer>
</Modal>
</>
)}
export default ModalDeleteWarninggit