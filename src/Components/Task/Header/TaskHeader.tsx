import {
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Box,
} from "@mui/material";

import TaskFilter from "./Filter/TaskFilter";
import TaskActionBtns from "./ActionButton/TaskActionBtns";
import ModalAddTask from "./ActionButton/CreateTask/ModalAddTask";

import type {
  TaskRecord,
} from "./ActionButton/CreateTask/ModalAddTask";

import type {
  Course,
} from "../../../types/course";

import type {
  CourseOption,
  DateRange,
} from "../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface TaskHeaderProps {
  /*
   * Axios authentication configuration
   * created by the parent ViewTask component.
   */
  config: AxiosRequestConfig;


  /*
   * Updates the task list after a task
   * is created or uploaded.
   */
  setTaskData:
    Dispatch<
      SetStateAction<TaskRecord[]>
    >;


  /*
   * urlBase is still passed by ViewTask.jsx.
   *
   * TaskActionBtns now uses the shared `url`
   * constant directly, so this prop is no
   * longer required internally.
   *
   * We keep it temporarily so we do not break
   * the parent component while ViewTask is
   * still waiting to be migrated.
   */
  urlBase: string;


  // ========================================
  // FILTER PANEL
  // ========================================

  openFilters: boolean;

  setOpenFilters:
    Dispatch<
      SetStateAction<boolean>
    >;

  onApply: () => void;

  onReset: () => void;


  // ========================================
  // COURSE DATA
  // ========================================

  courseData: Course[];

  /*
   * This prop is currently passed from
   * ViewTask but is not used inside TaskHeader.
   *
   * Keep it typed until ViewTask is migrated.
   */
  setCourseData:
    Dispatch<
      SetStateAction<Course[]>
    >;

  uniqueCourses:
    CourseOption[];

  selectedCourse:
    CourseOption | null;

  setSelectedCourse:
    Dispatch<
      SetStateAction<
        CourseOption | null
      >
    >;

  courseInput: string;

  setCourseInput:
    Dispatch<
      SetStateAction<string>
    >;


  // ========================================
  // BATCH FILTER
  // ========================================

  batchNumberFilter: string;

  setBatchNumberFilter:
    Dispatch<
      SetStateAction<string>
    >;


  // ========================================
  // DATE FILTER
  // ========================================

  datePreset: string;

  setDatePreset:
    Dispatch<
      SetStateAction<string>
    >;

  dateRange: DateRange;

  setDateRange:
    Dispatch<
      SetStateAction<DateRange>
    >;
}


// ========================================
// COMPONENT
// ========================================

const TaskHeader = ({
  config,
  setTaskData,
  urlBase,
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  courseData,
  setCourseData,
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  batchNumberFilter,
  setBatchNumberFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}: TaskHeaderProps) => {
  /*
   * Explicit boolean state.
   *
   * TypeScript can infer boolean from false,
   * but this makes the intended state type
   * clear while we are migrating.
   */
  const [
    showAdd,
    setShowAdd,
  ] = useState<boolean>(
    false
  );


  /*
   * These two props are still supplied by the
   * JavaScript parent component, but TaskHeader
   * no longer needs them internally.
   *
   * `void` prevents unused-variable warnings
   * while preserving the existing component API.
   */
  void urlBase;
  void setCourseData;


  return (
    <div>
      {/* ========================================
          TASK ACTION BUTTONS
      ======================================== */}

      <TaskActionBtns
        setShowAdd={
          setShowAdd
        }
        config={
          config
        }
        setTaskData={
          setTaskData
        }
      />


      {/* ========================================
          TASK FILTER
      ======================================== */}

      <Box
        sx={{
          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          mt:
            1,

          gap:
            2,

          width:
            "100%",
        }}
      >
        <TaskFilter
          openFilters={
            openFilters
          }
          setOpenFilters={
            setOpenFilters
          }
          onApply={
            onApply
          }
          onReset={
            onReset
          }
          uniqueCourses={
            uniqueCourses
          }
          selectedCourse={
            selectedCourse
          }
          setSelectedCourse={
            setSelectedCourse
          }
          courseInput={
            courseInput
          }
          setCourseInput={
            setCourseInput
          }
          batchNumberFilter={
            batchNumberFilter
          }
          setBatchNumberFilter={
            setBatchNumberFilter
          }
          datePreset={
            datePreset
          }
          setDatePreset={
            setDatePreset
          }
          dateRange={
            dateRange
          }
          setDateRange={
            setDateRange
          }
        />
      </Box>


      {/* ========================================
          ADD TASK MODAL
      ======================================== */}

      <ModalAddTask
        show={
          showAdd
        }
        setShow={
          setShowAdd
        }
        setTaskData={
          setTaskData
        }
        courseData={
          courseData
        }
        batchData={
          []
        }
      />
    </div>
  );
};

export default TaskHeader;