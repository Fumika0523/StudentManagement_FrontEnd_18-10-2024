import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import { url } from "../utils/constant";
import CustomizedTables from "./CustomisedTables";
import Header from "./Header/Header";

import {
  buildCourseOptions,
  equalsText,
  includesText,
  isWithinSelectedDateFilter,
  matchesSelectedCourse,
} from "../utils/filterUtils";

import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

/*
  `import type` tells TypeScript that these imports are used
  only for type checking.

  They will not become JavaScript imports in the final bundle.
*/
import type {
  Student,
  ComputedStudent,
} from "../../types/student";


/*
  These are small supporting interfaces for data used by THIS component.

  Later, when we migrate the Course, Batch and Admission sections,
  we can move these into shared files such as:

    src/types/course.ts
    src/types/batch.ts
    src/types/admission.ts
*/


interface Course {
  // MongoDB ObjectId arrives in the frontend as a string.
  _id: string;

  courseName?: string;

  // Used below to calculate computedSessionType.
  courseType?: string;
}


interface Batch {
  _id?: string;

  // batchNumber can be used as a lookup key.
  batchNumber?: string;

  // Example: "In Progress", "Batch Completed", etc.
  status?: string;
}


interface Admission {
  _id?: string;

  /*
    These are the fields ViewStudent currently uses
    when connecting an admission to a student/batch.
  */
  studentName?: string;
  batchNumber?: string;
  status?: string;
}


/*
  buildCourseOptions() creates objects like:

    {
      label: "Web Development",
      id: "mongo-object-id"
    }
*/
interface CourseOption {
  label: string;
  id: string;
}


/*
  DatePicker stores actual JavaScript Date objects
  in your current FilterFields component.

  Both values may also be null when no date is selected.
*/
interface DateRange {
  from: Date | null;
  to: Date | null;
}


/*
  These interfaces describe the JSON responses returned
  from each backend API endpoint.

  This lets Axios know what `res.data` should contain.
*/
interface StudentsResponse {
  studentData: Student[];
}

interface CoursesResponse {
  courseData: Course[];
}

interface AdmissionsResponse {
  admissionData: Admission[];
}

interface BatchesResponse {
  batchData: Batch[];
}


function ViewStudent() {
  /*
    TypeScript can infer string here from "",
    but writing <string> explicitly makes the type clear
    while we are learning/migrating.
  */
  const [datePreset, setDatePreset] =
    useState<string>("");

  /*
    Without <DateRange>, TypeScript could have difficulty
    knowing what values `from` and `to` may later contain.
  */
  const [dateRange, setDateRange] =
    useState<DateRange>({
      from: null,
      to: null,
    });


  /*
    JavaScript previously had:

      useState([])

    An empty array does not tell TypeScript what kind
    of objects will eventually be stored in it.

    So we explicitly say:
      Student[]
      Course[]
      Admission[]
      Batch[]
  */
  const [studentData, setStudentData] =
    useState<Student[]>([]);

  const [courseData, setCourseData] =
    useState<Course[]>([]);

  const [admissionData, setAdmissionData] =
    useState<Admission[]>([]);

  const [batchData, setBatchData] =
    useState<Batch[]>([]);


  const [openFilters, setOpenFilters] =
    useState<boolean>(true);


  // -----------------------------
  // Filter states
  // -----------------------------

  const [studentName, setStudentName] =
    useState<string>("");

  const [genderFilter, setGenderFilter] =
    useState<string>("");

  const [sessionType, setSessionType] =
    useState<string>("");

  const [batchStatus, setBatchStatus] =
    useState<string>("");


  /*
    selectedCourse can be either:

      CourseOption
    OR
      null

    because initially no course is selected.
  */
  const [selectedCourse, setSelectedCourse] =
    useState<CourseOption | null>(null);

  const [courseInput, setCourseInput] =
    useState<string>("");


  /*
    useAuthConfig is still JavaScript at the moment.

    We can migrate and type that utility separately later.
  */
  const config = useAuthConfig();


  // -----------------------------
  // API calls
  // -----------------------------

  const getBatchData = useCallback(async () => {
    /*
      axios.get<BatchesResponse>()

      tells Axios:

      "The response data from this API should follow
       the BatchesResponse interface."
    */
    const res =
      await axios.get<BatchesResponse>(
        `${url}/allbatch`,
        config
      );

    setBatchData(res.data.batchData ?? []);
  }, [config]);


  const getStudentData = useCallback(async () => {
    const res =
      await axios.get<StudentsResponse>(
        `${url}/all-student`,
        config
      );

    /*
      Because studentData state is Student[],
      TypeScript now verifies that what we put inside
      setStudentData is compatible with Student[].
    */
    setStudentData(res.data.studentData ?? []);
  }, [config]);


  const getCourseData = useCallback(async () => {
    const res =
      await axios.get<CoursesResponse>(
        `${url}/allcourse`,
        config
      );

    setCourseData(res.data.courseData ?? []);
  }, [config]);


  const getAdmissionData = useCallback(async () => {
    const res =
      await axios.get<AdmissionsResponse>(
        `${url}/alladmission`,
        config
      );

    setAdmissionData(
      res.data.admissionData ?? []
    );
  }, [config]);


  useEffect(() => {
    getStudentData();
    getCourseData();
    getAdmissionData();
    getBatchData();
  }, [
    getAdmissionData,
    getBatchData,
    getCourseData,
    getStudentData,
  ]);


  // -----------------------------
  // Course filter options
  // -----------------------------

 const uniqueCourses =
  useMemo(() => {
    return buildCourseOptions(
      courseData
    );
  }, [courseData]);


  // -----------------------------
  // Build computed student rows
  // -----------------------------

  const computedRows =
    useMemo<ComputedStudent[]>(() => {
      /*
        Record<string, Course> means:

          an object whose keys are strings
          and whose values are Course objects.

        Example:

        {
          "courseMongoId1": { ...course },
          "courseMongoId2": { ...course }
        }
      */
      const coursesById: Record<
        string,
        Course
      > = {};

      courseData.forEach((course) => {
        coursesById[course._id] = course;
      });


      /*
        Another lookup object.

        Key   = batchNumber
        Value = Batch
      */
      const batchByNumber: Record<
        string,
        Batch
      > = {};

      batchData.forEach((batch) => {
        if (batch.batchNumber) {
          batchByNumber[
            batch.batchNumber
          ] = batch;
        }
      });


      /*
        Key   = studentName
        Value = assigned batchNumber

        Because batchNumber may be missing,
        the stored value can be string | undefined.
      */
      const assignedBatchByStudent: Record<
        string,
        string | undefined
      > = {};


      admissionData
        .filter(
          (admission) =>
            admission.status === "Assigned"
        )
        .forEach((admission) => {
          /*
            We check studentName before using it as an
            object key because Student/Admission fields
            can currently be optional.
          */
          if (admission.studentName) {
            assignedBatchByStudent[
              admission.studentName
            ] = admission.batchNumber;
          }
        });


      return studentData.map(
        (student): ComputedStudent => {
          /*
            courseId is optional in Student.

            We cannot safely do:

              coursesById[student.courseId]

            because courseId might be undefined.

            So TypeScript encourages us to check first.
          */
          const course = student.courseId
            ? coursesById[student.courseId]
            : undefined;


          /*
            studentName is also optional in our current
            Student interface, so we check it first.
          */
          const assignedBatchNumber =
            student.studentName
              ? assignedBatchByStudent[
                  student.studentName
                ]
              : undefined;


          const batch =
            assignedBatchNumber
              ? batchByNumber[
                  assignedBatchNumber
                ]
              : undefined;


          /*
            ComputedStudent extends Student.

            So this object contains:
              all Student properties
              +
              computedBatchStatus
              computedSessionType
              computedCreatedAt
          */
          return {
            ...student,

            computedBatchStatus:
              batch?.status ?? "",

            computedSessionType:
              course?.courseType ?? "",

            computedCreatedAt:
              student.createdAt ?? "",
          };
        }
      );
    }, [
      studentData,
      courseData,
      admissionData,
      batchData,
    ]);


  // -----------------------------
  // Filtering
  // -----------------------------

  /*
    rows must be ComputedStudent[].

    The function also returns ComputedStudent[].

    This matches the generic useFilteredTable<T>
    hook we migrated earlier.
  */
  const filterRows = useCallback(
    (
      rows: ComputedStudent[]
    ): ComputedStudent[] => {
      return rows.filter((student) => {
        if (
          studentName.trim() &&
          !includesText(
            student.studentName,
            studentName
          )
        ) {
          return false;
        }


        if (
          genderFilter &&
          !equalsText(
            student.gender,
            genderFilter
          )
        ) {
          return false;
        }


        if (
          !matchesSelectedCourse({
            row: student,
            selectedCourse,
            courseInput,
          })
        ) {
          return false;
        }


        if (
          batchStatus &&
          !equalsText(
            student.computedBatchStatus,
            batchStatus
          )
        ) {
          return false;
        }


        if (
          sessionType &&
          !equalsText(
            student.computedSessionType,
            sessionType
          )
        ) {
          return false;
        }


        return isWithinSelectedDateFilter(
          student.computedCreatedAt,
          datePreset,
          dateRange
        );
      });
    },
    [
      batchStatus,
      courseInput,
      datePreset,
      dateRange,
      genderFilter,
      selectedCourse,
      sessionType,
      studentName,
    ]
  );


  const resetFilters =
    useCallback((): void => {
      setStudentName("");
      setGenderFilter("");
      setDatePreset("");

      setDateRange({
        from: null,
        to: null,
      });

      setSessionType("");
      setSelectedCourse(null);
      setCourseInput("");
      setBatchStatus("");
    }, []);


  /*
    TypeScript can infer T = ComputedStudent here because:

      rows: computedRows

    and computedRows is ComputedStudent[].
  */
  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable({
    rows: computedRows,
    filterRows,
    resetFilters,
  });


  return (
    <>
      <div className="py-2 border-4 border-danger row mx-auto w-100">
        <Header
          config={config}

          datePreset={datePreset}
          setDatePreset={setDatePreset}

          dateRange={dateRange}
          setDateRange={setDateRange}

          courseData={courseData}
          setCourseData={setCourseData}

          setStudentData={setStudentData}

          urlBase={url}

          openFilters={openFilters}
          setOpenFilters={setOpenFilters}

          onApply={applyFilters}
          onReset={resetTable}

          uniqueCourses={uniqueCourses}

          selectedCourse={selectedCourse}
          setSelectedCourse={
            setSelectedCourse
          }

          courseInput={courseInput}
          setCourseInput={setCourseInput}

          batchStatus={batchStatus}
          setBatchStatus={setBatchStatus}

          studentName={studentName}
          setStudentName={setStudentName}

          genderFilter={genderFilter}
          setGenderFilter={
            setGenderFilter
          }

          sessionType={sessionType}
          setSessionType={setSessionType}
        />


        {/* Show the table after filters have been applied. */}
        {showTable && (
          <CustomizedTables
            studentData={displayData}
            setStudentData={
              setStudentData
            }

            courseData={courseData}
            setCourseData={
              setCourseData
            }

            admissionData={
              admissionData
            }
            setAdmissionData={
              setAdmissionData
            }

            batchData={batchData}
            setBatchData={
              setBatchData
            }
          />
        )}
      </div>
    </>
  );
}

export default ViewStudent;