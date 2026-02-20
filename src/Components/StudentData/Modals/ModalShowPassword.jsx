import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function ModalShowPassword({viewPassword,setViewPassword,password,setPassword}){
    const handleClose = () => {
        setViewPassword(false)
        navigate('/studentdata')
        }

   return(
    <>
    <Modal show={viewPassword} onHide={handleClose}
    size="lg">
    <Modal.Header closeButton>
          <Modal.Title  >Password</Modal.Title>
        </Modal.Header>
            <Modal.Body>
           {password}  
            </Modal.Body>
            <Modal.Footer> 
            <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
            </Modal.Footer>
    </Modal>
    </>
   )
}
export default ModalShowPassword