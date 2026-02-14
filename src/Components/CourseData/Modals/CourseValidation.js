import * as Yup from "yup";

// ==================== VALIDATION SCHEMAS ====================

/**
 * Reusable validation schema for Course forms (Add & Edit)
 */
export const courseValidationSchema = Yup.object().shape({
  courseName: Yup.string().required("Mandatory field!"),
  
  courseType: Yup.string().required("Mandatory field!"),
  
  dailySessionHrs: Yup.number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .required("Mandatory field!"),
  
  courseAvailability: Yup.string().required("Mandatory field!"),
  
  courseDuration: Yup.number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .required("Mandatory field!"),
  
  courseFee: Yup.number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .required("Enter Course Fee!"),
  
  noOfDays: Yup.number()
    .typeError("Must be a number")
    .positive("Must be greater than 0")
    .integer("Must be a whole number")
    .notRequired(),
});

// ==================== INITIAL VALUES ====================

/**
 * Initial values for Add Course form
 */
export const courseInitialValues = {
  courseName: "",
  courseType: "",
  dailySessionHrs: "",
  courseAvailability: "",
  courseDuration: "",
  courseFee: "",
  noOfDays: "",
};

/**
 * Get initial values for Edit Course form
 * @param {Object} course - The course object to edit
 * @returns {Object} Initial values populated with course data
 */
export const getCourseEditInitialValues = (course) => ({
  courseName: course?.courseName || "",
  courseType: course?.courseType || "",
  dailySessionHrs: course?.dailySessionHrs || "",
  courseAvailability: course?.courseAvailability || "",
  courseDuration: course?.courseDuration || "",
  courseFee: course?.courseFee || "",
  noOfDays: course?.noOfDays || "",
});

// ==================== FORM STYLES ====================

/**
 * Reusable label style for form fields
 */
export const labelStyle = {
  fontWeight: 600,
  fontSize: '12px',
  color: '#475569',
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

/**
 * Reusable input style for form fields
 */
export const inputStyle = {
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '13px',
  border: '1px solid #e2e8f0',
};

/**
 * Disabled input style (for auto-calculated fields)
 */
export const disabledInputStyle = {
  ...inputStyle,
  backgroundColor: '#f3f4f6',
  color: '#6b7280'
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate number of days based on total hours and daily session hours
 * @param {number} courseDuration - Total course duration in hours
 * @param {number} dailySessionHrs - Daily session hours
 * @returns {number} Calculated number of days
 */
export const calculateNoOfDays = (courseDuration, dailySessionHrs) => {
  if (!courseDuration || !dailySessionHrs || dailySessionHrs <= 0) {
    return "";
  }
  return Math.ceil(courseDuration / dailySessionHrs);
};

/**
 * Get axios config with authorization token
 * @returns {Object} Axios config object
 */
export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};