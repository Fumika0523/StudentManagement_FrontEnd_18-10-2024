import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ModalDeleteCourse=({viewWarning, setViewWarning, singleCourse, setCourseData})=>{

const notify = () =>{
    console.log("Toast Notification Added")
    toast("Course is Deleted!")
    }

const navigate = useNavigate()
console.log(viewWarning   
)
const handleClose = () =>{
setViewWarning(false)
 navigate('/coursedata')}
    
console.log(singleCourse)
const token = sessionStorage.getItem('token');
const config = {
        headers:{
            Authorization:`Bearer ${token}`}}

// Delete
const handleDeleteClick = async(id) =>{
try{
    let res = await axios.delete(`${url}/deletecourse/${id}`,config);
    console.log(res)
    if(res){
    let res = await axios.get(`${url}/allcourse`,config)
    console.log("Successfully a course is deleted from DB",res.data.courseData)
    setCourseData(res.data.courseData) // updating the original Main course data
    notify()
    setTimeout(()=>{
        handleClose()
    },4001)
    handleClose()}   
}catch(error){
    console.error('Error Deleting Course:', error);    
}}

return(
<>
{/* Boolean value : show={true}, s */}
 <Modal style={{marginTop:"15%", border:"none !important",}} show={viewWarning} onHide = {handleClose} >
  <Modal.Title style={{padding:"10% 0%"}} className='text-center fs-3 border-none'>
    Are you sure you want to delete?
  </Modal.Title >
     <Modal.Body style={{padding:"5%"}}  className='d-flex justify-content-center border boder-warning mb-2 gap-5 border-none'>
    <Button className='px-4 fs-5' style={{backgroundColor:"#4e73df"}} onClick={()=>{handleDeleteClick(singleCourse._id)}}>
        Yes
    </Button>

    <Button className='px-4 fs-5' variant="secondary" onClick={handleClose} >
        No
    </Button>
    </Modal.Body>
 </Modal>
    </>
)

}
export default ModalDeleteCourse