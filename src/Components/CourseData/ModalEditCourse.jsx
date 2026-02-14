import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import axios from 'axios';
import { url } from '../utils/constant';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { Edit, School, AttachMoney, Schedule, CalendarToday, AccessTime } from "@mui/icons-material";

// Import reusable utilities
import {
  courseValidationSchema,
  getCourseEditInitialValues,
  labelStyle,
  inputStyle,
  disabledInputStyle,
  calculateNoOfDays,
  getAuthConfig
} from './Modals/CourseValidation';

const ModalEditCourse = ({ show, setShow, singleCourse, setCourseData }) => {
  const handleClose = () => {
    setShow(false);
  };

  const formik = useFormik({
    initialValues: getCourseEditInitialValues(singleCourse),
    enableReinitialize: true,
    validationSchema: courseValidationSchema,
    onSubmit: (values) => {
      updateCourse(values);
    }
  });

  const updateCourse = async (updatedCourse) => {
    try {
      const updateRes = await axios.put(
        `${url}/updatecourse/${singleCourse._id}`, 
        updatedCourse, 
        getAuthConfig()
      );
      
      if (updateRes.data) {
        const freshData = await axios.get(`${url}/allcourse`, getAuthConfig());
        setCourseData(freshData.data.courseData);
        toast.success("Course updated successfully!");
        setTimeout(() => handleClose(), 1000);
      }
    } catch (e) {
   //   console.error('Error Editing Course:', e);
      toast.error("Failed to update course. Please try again.");
    }
  };

  // Auto-calculate number of days
  useEffect(() => {
    const { courseDuration, dailySessionHrs } = formik.values;
    const days = calculateNoOfDays(courseDuration, dailySessionHrs);
    formik.setFieldValue("noOfDays", days);
  }, [formik.values.courseDuration, formik.values.dailySessionHrs]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size='lg'
      centered
      style={{ '--bs-modal-border-radius': '16px' }}
    >
      {/* Header with Gradient */}
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)',
          color: 'white',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          padding: '20px 24px',
        }}
      >
        <Modal.Title style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '22px',
          fontWeight: '600'
        }}>
          <Edit sx={{ fontSize: "32px" }} />
          Edit Course
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body style={{ padding: '20px', backgroundColor: '#f9fafb' }}>
          {/* Row 1: Name & Type */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <School sx={{ fontSize: 14 }} />
                  Course Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={formik.values.courseName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.errors.courseName && formik.touched.courseName && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.courseName}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <Schedule sx={{ fontSize: 14 }} />
                  Course Type
                </Form.Label>
                <Form.Select
                  name="courseType"
                  value={formik.values.courseType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">--Select Type--</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Form.Select>
                {formik.errors.courseType && formik.touched.courseType && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.courseType}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: Fee & Daily Hours */}
          <Row className="g-2 mb-2">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <AttachMoney sx={{ fontSize: 14 }} />
                  Course Fee
                </Form.Label>
                <Form.Control
                  type="number"
                  name="courseFee"
                  value={formik.values.courseFee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.errors.courseFee && formik.touched.courseFee && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.courseFee}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  Daily Session Hours
                </Form.Label>
                <Form.Control
                  type="number"
                  name="dailySessionHrs"
                  value={formik.values.dailySessionHrs}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.errors.dailySessionHrs && formik.touched.dailySessionHrs && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.dailySessionHrs}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3: Availability, Total Hours, Days */}
          <Row className="g-2">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <CalendarToday sx={{ fontSize: 14 }} />
                  Availability
                </Form.Label>
                <Form.Select
                  name="courseAvailability"
                  value={formik.values.courseAvailability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                >
                  <option value="">--Select--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
                {formik.errors.courseAvailability && formik.touched.courseAvailability && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.courseAvailability}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <Schedule sx={{ fontSize: 14 }} />
                  Total Hours
                </Form.Label>
                <Form.Control
                  type="number"
                  name="courseDuration"
                  value={formik.values.courseDuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.errors.courseDuration && formik.touched.courseDuration && (
                  <div className="text-danger" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {formik.errors.courseDuration}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <CalendarToday sx={{ fontSize: 14 }} />
                  Number of Days
                </Form.Label>
                <Form.Control
                  disabled
                  type="number"
                  name="noOfDays"
                  value={formik.values.noOfDays}
                  style={disabledInputStyle}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer style={{
          borderTop: '1px solid #e5e7eb',
          padding: '12px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '0 0 16px 16px',
          gap: '8px'
        }}>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              color: '#6b7280',
              fontWeight: '600',
              fontSize: '13px',
              padding: '7px 18px',
              borderRadius: '6px',
            }}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              fontWeight: '600',
              fontSize: '13px',
              padding: '7px 20px',
              borderRadius: '6px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditCourse;