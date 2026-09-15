/*
  Shared frontend TypeScript definition for Course data.

  IMPORTANT:
  This interface is based on how Course data is currently used
  in the frontend.

  Once we inspect the backend Course Mongoose model,
  we can tighten any fields if necessary.
*/

export interface Course {
  /*
    MongoDB document ID.

    Mongoose uses ObjectId internally,
    but the frontend normally receives it as a string.
  */
  _id: string;


  /*
    Main course information.
  */
  courseName: string;
  courseType: string;


  /*
    These fields are shown in your Course table
    and used by the Add/Edit Course forms.

    Your Yup validation expects them to be numeric values.
  */
  courseFee?: number;
  courseDuration?: number;
  dailySessionHrs?: number;
  noOfDays?: number;


  /*
    Example values may be things such as:
      Available
      Unavailable

    We keep this as string until we confirm the exact
    values allowed by the backend.
  */
  courseAvailability?: string;


  /*
    Your backend appears to use Mongoose timestamps,
    because the frontend displays createdAt and updatedAt.

    API dates normally arrive as ISO strings.
  */
  createdAt?: string;
  updatedAt?: string;
}


/*
  Some pages add calculated/frontend-only values.

  ViewCourse currently adds:
    computedCreatedAt

  This property does not need to exist in the database.
*/
export interface ComputedCourse extends Course {
  computedCreatedAt: string;
}