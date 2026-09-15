/*
  Shared TypeScript definition for Student data received
  by the FRONTEND from the backend API.

  IMPORTANT:
  This is not the Mongoose schema itself.

  The Mongoose schema controls/database-validates the backend data.
  This interface tells TypeScript what data the React frontend
  should expect after that data has been converted to JSON.
*/

export interface Student {
  /*
    MongoDB automatically creates _id for every document.

    Although Mongoose uses ObjectId internally,
    when it is sent to the frontend as JSON we normally receive a string.
  */
  _id: string;

  /*
    Required in the backend schema.
  */
  firstName: string;
  lastName: string;
  email: string;

  /*
    studentName is generated automatically by your Mongoose pre-save hook:

      this.studentName =
        `${this.firstName} ${this.lastName}`

    It may technically be absent before the document is saved,
    so keeping it optional is safer during the migration.
  */
  studentName?: string;

  /*
    Optional in the backend schema.
  */
  googleId?: string;

  /*
    Phone numbers should remain strings.

    Example:
      +44 7123456789

    We do not want numeric calculations on phone numbers.
  */
  phoneNumber?: string;

  /*
    Your backend gives gender a default value:
      "Rather not say"

    We can make this stricter later if you have a fixed list
    such as Male | Female | Rather not say.
  */
  gender?: string;

  /*
    Mongoose stores this as Date.

    However, JSON responses normally convert Date objects
    into ISO strings before the frontend receives them.

    Example:
      "2000-05-21T00:00:00.000Z"
  */
  birthdate?: string | null;

  /*
    Course information currently stored directly on Student.
  */
  courseName?: string;

  /*
    Backend schema says:
      admissionFee: Number

    Therefore this should be number rather than number | string
    when we are describing API Student data.
  */
  admissionFee?: number;

  /*
    Batch can explicitly be null according to your Mongoose default:

      default: null

    Therefore the frontend needs to allow null.
  */
  batchNumber?: string | null;

  /*
    Backend:
      type: [String]

    So the frontend receives an array of strings.
  */
  preferredCourses?: string[];

  /*
    Optional country field.
  */
  country?: string;

  /*
    Backend default:
      "Not Assigned"

    For now we use string because we don't yet know
    every valid status value used throughout the application.

    Later we may create something stricter such as:

      type StudentStatus =
        | "Not Assigned"
        | "Active"
        | "Completed";
  */
  status?: string;

  /*
    These fields currently have empty Mongoose definitions:

      absenceDays: {}
      presentDays: {}

    That means the backend schema doesn't currently guarantee
    what data type they contain.

    We should NOT guess and use `any`.

    `unknown` means:
      "this value exists, but we need to determine its type
       before TypeScript lets us use it."

    Once we inspect how these fields are actually used,
    we can replace unknown with the correct type,
    probably number if they represent day counts.
  */
  absenceDays?: unknown;
  presentDays?: unknown;

  /*
    Mongoose ObjectId on the backend.

    When not populated and sent as JSON,
    ObjectId normally reaches the frontend as a string.
  */
  courseId?: string;

  /*
    Backend stores admissionDate as Date,
    so frontend JSON normally receives a string.
  */
  admissionDate?: string | null;

  /*
    Another MongoDB ObjectId reference.

    Therefore normally a string on the frontend.
  */
  admissionId?: string;

  /*
    Backend default is "student".
  */
  role?: string;

  /*
    Your schema uses:

      timestamps: true

    So Mongoose automatically creates:
      createdAt
      updatedAt

    Both normally arrive as ISO date strings.
  */
  createdAt?: string;
  updatedAt?: string;
}


/*
  Some frontend screens calculate additional properties
  that are NOT actually stored in the Student MongoDB document.

  Instead of pretending those fields are part of Student,
  we create another interface that extends Student.

  "extends Student" means:
      everything Student has
      +
      these extra frontend-only properties.
*/
export interface ComputedStudent extends Student {
  computedBatchStatus: string;
  computedSessionType: string;
  computedCreatedAt: string;
}