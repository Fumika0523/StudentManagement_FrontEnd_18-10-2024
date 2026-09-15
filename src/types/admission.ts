// ========================================
// ADMISSION SHARED TYPES
// ========================================
//
// This file describes the Admission objects that the
// frontend receives from the backend.
//
// The backend Mongoose model still controls the database
// at runtime. This TypeScript interface gives the frontend
// compile-time type checking.


// ========================================
// ADMISSION STATUS
// ========================================

/*
 * TypeScript:
 * These are the two assignment states currently used
 * by the Admission UI.
 *
 * New admissions start as "Assigned".
 * The Edit Admission modal can change them to
 * "De-assigned".
 */
export type AdmissionStatus =
  | "Assigned"
  | "De-assigned";


// ========================================
// MAIN ADMISSION TYPE
// ========================================

export interface Admission {
  /*
   * MongoDB document ID.
   *
   * Mongoose ObjectIds are converted to strings when
   * they are sent to the React frontend as JSON.
   */
  _id: string;


  // Course information stored on the admission record.
  courseName: string;

  courseId: string;


  // Student information stored on the admission record.
  studentName: string;

  studentId: string;


  /*
   * Where the admission came from,
   * for example a referral or another source selected
   * in the Add Admission form.
   */
  admissionSource: string;


  // Course/admission fee.
  admissionFee: number;


  /*
   * Dates arrive from Express/MongoDB as ISO strings
   * in the frontend.
   */
  admissionDate: string;


  /*
   * These values are calculated from admissionDate
   * when an admission is created.
   */
  admissionYear?: number;

  admissionMonth?: string;


  /*
   * The backend schema currently makes batchNumber
   * optional, although the current Admission UI normally
   * assigns a batch when creating an admission.
   *
   * Keeping it optional accurately represents the API.
   */
  batchNumber?: string;


  /*
   * The current frontend uses:
   *
   * "Assigned"
   * "De-assigned"
   *
   * The backend field itself is not marked required,
   * so the property is optional here.
   */
  status?: AdmissionStatus;


  /*
   * The backend also contains admissionId as a separate
   * optional ObjectId field.
   *
   * This is different from MongoDB's normal _id.
   */
  admissionId?: string;


  // Added automatically by Mongoose timestamps.
  createdAt?: string;

  updatedAt?: string;
}