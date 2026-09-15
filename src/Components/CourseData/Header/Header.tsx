import { useState } from "react";

/*
  Dispatch + SetStateAction are used for React state setter props.

  Example:

    const [showAdd, setShowAdd] = useState(false);

  The type of setShowAdd is:

    Dispatch<SetStateAction<boolean>>
*/
import type {
  Dispatch,
  SetStateAction,
} from "react";

import { Box } from "@mui/material";

import ActionBtns from "./ActionBtns";
import CourseFilter from "./Filter/CourseFilter";
import ModalAddCourse from "../Modals/ModalAddCourse";

/*
  Reuse the shared Course interface.

  We do NOT create another local Course interface here,
  because src/types/course.ts is now our single source of truth.
*/
import type {
  Course,
} from "../../../types/course";

/*
  DateRange already exists in our typed filter utilities.

  This keeps the same DateRange definition across:
    - ViewCourse
    - Header
    - CourseFilter
    - FilterFields
*/
import type {
  DateRange,
} from "../../utils/filterUtils";


/*
  This interface describes every prop Header genuinely uses.

  TypeScript can now check the contract between:

    ViewCourse.tsx
        ↓
    Header.tsx
*/
interface HeaderProps {
  // ---------------------------------
  // Course data
  // ---------------------------------

  courseData: Course[];

  /*
    Setter for:

      useState<Course[]>([])

    So Header/ModalAddCourse can update the
    entire course list after adding a course.
  */
  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;


  // ---------------------------------
  // Filter panel
  // ---------------------------------

  openFilters: boolean;

  /*
    Boolean React state setter.

    Allows:

      setOpenFilters(false)

    or:

      setOpenFilters(
        previous => !previous
      )
  */
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;


  /*
    These functions come from useFilteredTable.

    () => void means:
      - no arguments required
      - no useful return value
  */
  onApply: () => void;
  onReset: () => void;


  // ---------------------------------
  // Course name filter
  // ---------------------------------

  courseName: string;

  setCourseName: Dispatch<
    SetStateAction<string>
  >;


  // ---------------------------------
  // Date filter
  // ---------------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // ---------------------------------
  // Session type filter
  // ---------------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


const Header = ({
  courseData,
  setCourseData,

  openFilters,
  setOpenFilters,

  onApply,
  onReset,

  courseName,
  setCourseName,

  datePreset,
  setDatePreset,

  dateRange,
  setDateRange,

  sessionType,
  setSessionType,
}: HeaderProps) => {
  /*
    Local state for controlling the Add Course modal.

    showAdd can only ever be:
      true
      false
  */
  const [showAdd, setShowAdd] =
    useState<boolean>(false);


  return (
    <Box sx={{ mb: 2 }}>
      {/* =====================================
          Action Buttons
      ====================================== */}

      <ActionBtns
        /*
          ActionBtns only needs the setter.

          It calls:
            setShowAdd(true)

          when the user clicks Add Course.
        */
        setShowAdd={setShowAdd}
      />


      {/* =====================================
          Course Filters
      ====================================== */}

      <CourseFilter
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}

        onApply={onApply}
        onReset={onReset}

        courseName={courseName}
        setCourseName={setCourseName}

        /*
          CourseFilter uses courseData to create
          the Course Name autocomplete options.
        */
        courseData={courseData}

        datePreset={datePreset}
        setDatePreset={setDatePreset}

        dateRange={dateRange}
        setDateRange={setDateRange}

        sessionType={sessionType}
        setSessionType={setSessionType}
      />


      {/* =====================================
          Add Course Modal
      ====================================== */}

      {/*
        Only render the modal while showAdd === true.
      */}
      {showAdd && (
        <ModalAddCourse
          show={showAdd}

          /*
            Modal can close itself with:
              setShow(false)

            setShow therefore receives the same React
            boolean setter type as setShowAdd.
          */
          setShow={setShowAdd}

          /*
            After creating a new Course,
            the modal fetches the refreshed Course[]
            and updates the parent state.
          */
          setCourseData={
            setCourseData
          }
        />
      )}
    </Box>
  );
};


export default Header;