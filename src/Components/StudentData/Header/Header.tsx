import { useState } from "react";

/*
  Dispatch and SetStateAction are used to type React state setter functions.

  Example:
    const [open, setOpen] = useState(false);

  `setOpen` has the type:
    Dispatch<SetStateAction<boolean>>
*/
import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { AxiosRequestConfig } from "axios";

import { Box } from "@mui/material";

import ActionBtns from "./ActionBtns";
import StudentFilter from "./Filter/StudentFilter";
import ModalAddStudent from "../Modals/CreateStudent/ModalAddStudent";

/*
  We already created our shared Student interface,
  so we reuse it instead of defining Student again here.
*/
import type { Student } from "../../../types/student";


/*
  Course is currently only defined locally while we migrate.

  Later, when more Course components are converted,
  we should create:

    src/types/course.ts

  and reuse one shared Course interface.
*/
interface Course {
  // MongoDB ObjectId sent to frontend as a string.
  _id: string;

  courseName?: string;
  courseType?: string;
}


/*
  Course options are created by buildCourseOptions().

  Example:
    {
      label: "Full Stack Development",
      id: "67abc123..."
    }
*/
interface CourseOption {
  label: string;
  id: string;
}


/*
  Represents the custom date range used by Student filters.

  Either date may be null when the user has not selected it.
*/
interface DateRange {
  from: Date | null;
  to: Date | null;
}


/*
  This interface describes every prop that Header receives
  from ViewStudent.tsx.

  This is one of the main advantages of TypeScript:
  we can see exactly what Header expects from its parent.
*/
interface HeaderProps {
  /*
    Axios configuration containing things such as:

      Authorization: Bearer <token>
  */
  config: AxiosRequestConfig;


  /*
    Student state setter coming from:

      const [studentData, setStudentData]
        = useState<Student[]>([]);

    This means Header receives React's setter
    for an array of Student objects.
  */
  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;


  /*
    Base backend URL.

    Example:
      http://localhost:8001
  */
  urlBase: string;


  // -----------------------------
  // Filter panel
  // -----------------------------

  openFilters: boolean;

  /*
    React setter for boolean state.

    Remember:

      Dispatch<SetStateAction<boolean>>

    allows BOTH:

      setOpenFilters(false)

    and:

      setOpenFilters(previous => !previous)
  */
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    Functions passed from useFilteredTable.

    () => void means:
      - takes no arguments
      - doesn't return a value we care about
  */
  onApply: () => void;
  onReset: () => void;


  // -----------------------------
  // Course filter
  // -----------------------------

  uniqueCourses: CourseOption[];

  /*
    null is required because initially no course is selected.
  */
  selectedCourse: CourseOption | null;

  setSelectedCourse: Dispatch<
    SetStateAction<CourseOption | null>
  >;

  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Course data
  // -----------------------------

  courseData: Course[];

  /*
    ViewStudent currently passes setCourseData to Header.

    Header itself does not currently use it, but we type the prop
    for now because it is part of the current parent API.

    We may remove this prop later if Header truly doesn't need it.
  */
  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;


  // -----------------------------
  // Batch filter
  // -----------------------------

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Student name filter
  // -----------------------------

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Gender filter
  // -----------------------------

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Date filter
  // -----------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // -----------------------------
  // Session type filter
  // -----------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


const Header = ({
  config,
  setStudentData,
  urlBase,

  openFilters,
  setOpenFilters,
  onApply,
  onReset,

  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,

  courseData,

  batchStatus,
  setBatchStatus,

  studentName,
  setStudentName,

  genderFilter,
  setGenderFilter,

  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,

  sessionType,
  setSessionType,
}: HeaderProps) => {
  /*
    Since the initial value is false,
    TypeScript could infer boolean automatically.

    We explicitly use <boolean> here while learning
    so the state type is very clear.
  */
  const [showAdd, setShowAdd] =
    useState<boolean>(false);


  return (
    <div>
      {/* --------------------------------
          Top action buttons
      -------------------------------- */}

      <ActionBtns
        /*
          setShowAdd has type:

            Dispatch<SetStateAction<boolean>>

          ActionBtns uses it to open the Add Student modal.
        */
        setShowAdd={setShowAdd}

        config={config}

        setStudentData={setStudentData}

        urlBase={urlBase}
      />


      {/* --------------------------------
          Student filters
      -------------------------------- */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          justifyContent: "space-between",
          alignItems: "flex-start",
          mt: 1,
          gap: 2,
          width: "100%",
        }}
      >
        <StudentFilter
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}

          onApply={onApply}
          onReset={onReset}

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

          datePreset={datePreset}
          setDatePreset={setDatePreset}

          dateRange={dateRange}
          setDateRange={setDateRange}

          sessionType={sessionType}
          setSessionType={setSessionType}
        />
      </Box>


      {/* --------------------------------
          Add Student modal

          Only render the modal while
          showAdd === true.
      -------------------------------- */}

      {showAdd && (
        <ModalAddStudent
          show={showAdd}

          /*
            ModalAddStudent can call this:

              setShow(false)

            to close itself.
          */
          setShow={setShowAdd}

          courseData={courseData}

          setStudentData={
            setStudentData
          }
        />
      )}
    </div>
  );
};


export default Header;
