import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { url } from '../../utils/constant';


const ModalDeleteWarning=({viewWarning,setViewWarning,singleBatch})=>{
    const handleClose = ()=>{
        setViewWarning(false)
        Navigate('/batchdata')
    }

    console.log(singleBatch)
    const token = sessionStorage.getItem('token');
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    // Delete
    const handleDeleteClick = async(id) =>{
        try{
            await axios.delete(`${url}/deletesbatch/${id}`,config);
            alert('Batch deleted Successfully!')
        }catch(error){
            console.error('Error Deleting Batch:', error);
        }
    }
    return(
        <>
        {/* Boolean value : show={true}, s */}
        <Modal show={viewWarning} onHide = {handleClose} >
       <Modal.Body>
       Are you sure you want to delete?
       </Modal.Body>
       <Modal.Footer>
    
                <Button style={{backgroundColor:"#4e73df"}}
                onClick={()=>{handleDeleteClick(singleBatch._id)
                }}>
                    Yes
                </Button>

                <Button variant="secondary" onClick={handleClose} >
                    No
                </Button>
            </Modal.Footer>
        </Modal>
        

        </>
    )
}
export default ModalDeleteWarning