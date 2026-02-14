import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Warning, Delete } from "@mui/icons-material";
import { Box } from '@mui/material';

const ModalDeleteCourse = ({ viewWarning, setViewWarning, singleCourse, setCourseData }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setViewWarning(false);
    navigate('/coursedata');
  };

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      let res = await axios.delete(`${url}/deletecourse/${id}`, config);
      if (res) {
        let res = await axios.get(`${url}/allcourse`, config);
        setCourseData(res.data.courseData);
        toast.success("Course deleted successfully!");
        setTimeout(() => handleClose(), 1000);
      }
    } catch (error) {
      console.error('Error Deleting Course:', error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  return (
    <Modal
      show={viewWarning}
      onHide={handleClose}
      centered
      style={{ '--bs-modal-border-radius': '16px' }}
    >
      {/* Header */}
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          padding: '20px 24px',
        }}
      >
        <Modal.Title
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          <Warning sx={{ fontSize: "28px" }} />
          Delete Course
        </Modal.Title>
      </Modal.Header>

      {/* Body */}
    <Modal.Body style={{ padding: '15px 15px', textAlign: 'center' }}>
  {/* Line 1 - Bold question with course name */}
  <p style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
    Are you sure you want to delete "{singleCourse.courseName}"?
  </p>
  
  {/* Line 2 - Warning text */}
  <p style={{ fontSize: '14px', color: '#6b7280' }}>
    This action cannot be undone.
  </p>
</Modal.Body>
      {/* Footer */}
      <Modal.Footer
        style={{
          borderTop: '1px solid #e5e7eb',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderRadius: '0 0 16px 16px',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="secondary"
          onClick={handleClose}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            color: '#6b7280',
            fontWeight: '600',
            fontSize: '14px',
            padding: '8px 24px',
            borderRadius: '8px',
            minWidth: '100px',
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => handleDeleteClick(singleCourse._id)}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            padding: '8px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px 0 rgba(220, 38, 38, 0.2)',
            minWidth: '100px',
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteCourse;