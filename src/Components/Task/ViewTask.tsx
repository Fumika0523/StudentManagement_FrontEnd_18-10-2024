import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import CustomisedTaskTables from "./Table/CustomisedTaskTables";
import TaskHeader from "./Header/TaskHeader";

import {
  url,
} from "../utils/constant";

import {
  buildCourseOptions,
  includesText,
  isWithinSelectedDateFilter,
  matchesSelectedCourse,
} from "../utils/filterUtils";

import type {
  CourseOption,
  DateRange,
} from "../utils/filterUtils";

import {
  useAuthConfig,
} from "../utils/useAuthConfig";

import {
  useFilteredTable,
} from "../utils/useFilteredTable";

import type {
  Course,
} from "../../types/course";

import type {
  TaskRecord,
} from "./Header/ActionButton/CreateTask/ModalAddTask";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * Describe only the data this page reads from
 * the backend responses.
 */
interface TaskListResponse {
  taskData?: TaskRecord[];
}


interface CourseListResponse {
  courseData?: Course[];
}


// ========================================
// COMPUTED TASK TYPE
// ========================================

/*
 * These two fields do NOT exist in MongoDB.
 *
 * They are calculated in ViewTask only so our
 * shared filter utilities can work with a simple,
 * consistent task row shape.
 */
interface ComputedTask
  extends TaskRecord {
  computedCourseName: string;

  computedCreatedAt: string;
}


// ========================================
// COMPONENT
// ========================================

export default function ViewTask() {
  // ========================================
  // API DATA
  // ========================================

  const [
    taskData,
    setTaskData,
  ] = useState<TaskRecord[]>(
    []
  );


  const [
    courseData,
    setCourseData,
  ] = useState<Course[]>(
    []
  );


  // ========================================
  // FILTER STATE
  // ========================================

  const [
    datePreset,
    setDatePreset,
  ] = useState<string>(
    ""
  );


  /*
   * Reuse the shared DateRange interface rather
   * than creating another date-range shape here.
   */
  const [
    dateRange,
    setDateRange,
  ] = useState<DateRange>({
    from:
      null,

    to:
      null,
  });


  const [
    selectedCourse,
    setSelectedCourse,
  ] = useState<CourseOption | null>(
    null
  );


  const [
    courseInput,
    setCourseInput,
  ] = useState<string>(
    ""
  );


  const [
    batchNumberFilter,
    setBatchNumberFilter,
  ] = useState<string>(
    ""
  );


  const [
    openFilters,
    setOpenFilters,
  ] = useState<boolean>(
    true
  );


  // ========================================
  // AUTH CONFIG
  // ========================================

  /*
   * Existing shared hook provides the Axios
   * Authorization configuration.
   */
  const config =
    useAuthConfig();


  // ========================================
  // FETCH TASK DATA
  // ========================================

  const getTaskData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<TaskListResponse>(
              `${url}/alltask`,
              config
            );


          setTaskData(
            response.data.taskData ??
              []
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript catch variables are unknown.
           * Narrow Axios errors before accessing
           * response or message properties.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Fetch tasks failed:",
              error.response?.data ??
                error.message
            );
          } else {
            console.error(
              "Fetch tasks failed:",
              error
            );
          }


          setTaskData(
            []
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // FETCH COURSE DATA
  // ========================================

  const getCourseData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<CourseListResponse>(
              `${url}/allcourse`,
              config
            );


          setCourseData(
            response.data.courseData ??
              []
          );
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Fetch courses failed:",
              error.response?.data ??
                error.message
            );
          } else {
            console.error(
              "Fetch courses failed:",
              error
            );
          }


          setCourseData(
            []
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // INITIAL DATA LOAD
  // ========================================

  useEffect(() => {
    void getTaskData();

    void getCourseData();
  }, [
    getCourseData,
    getTaskData,
  ]);


  // ========================================
  // COURSE FILTER OPTIONS
  // ========================================

  /*
   * buildCourseOptions() is already generic,
   * so Course[] can be passed directly.
   */
  const uniqueCourses =
    useMemo<CourseOption[]>(
      () =>
        buildCourseOptions(
          courseData
        ),
      [
        courseData,
      ]
    );


  // ========================================
  // BUILD COMPUTED TASK ROWS
  // ========================================

  const computedRows =
    useMemo<ComputedTask[]>(
      () => {
        /*
         * Record<string, Course> means:
         *
         *   key   = course MongoDB ID
         *   value = Course object
         */
        const coursesById:
          Record<
            string,
            Course
          > = {};


        courseData.forEach(
          (
            course
          ) => {
            coursesById[
              course._id
            ] = course;
          }
        );


        return taskData.map(
          (
            task
          ): ComputedTask => ({
            ...task,

            /*
             * Prefer the course linked through
             * courseId.
             *
             * Fall back to the course name already
             * present on the task if necessary.
             */
            computedCourseName:
              (
                task.courseId
                  ? coursesById[
                      task.courseId
                    ]?.courseName
                  : undefined
              ) ??
              task.courseName ??
              task.taskCourseName ??
              "",


            /*
             * createdAt is optional in TaskRecord,
             * so provide an empty string for the
             * shared date-filter utility.
             */
            computedCreatedAt:
              task.createdAt ??
              "",
          })
        );
      },
      [
        courseData,
        taskData,
      ]
    );


  // ========================================
  // FILTER TASK ROWS
  // ========================================

  const filterRows =
    useCallback(
      (
        rows: ComputedTask[]
      ): ComputedTask[] => {
        return rows.filter(
          (
            task
          ) => {
            // ========================================
            // COURSE FILTER
            // ========================================

            if (
              !matchesSelectedCourse({
                row:
                  task,

                selectedCourse,

                courseInput,

                /*
                 * courseId uses the default
                 * "courseId" field.
                 *
                 * Course-name matching uses our
                 * computed frontend-only field.
                 */
                courseNameKey:
                  "computedCourseName",
              })
            ) {
              return false;
            }


            // ========================================
            // BATCH NUMBER FILTER
            // ========================================

            if (
              batchNumberFilter.trim() &&
              !includesText(
                task.batchNumber,
                batchNumberFilter
              )
            ) {
              return false;
            }


            // ========================================
            // DATE FILTER
            // ========================================

            return isWithinSelectedDateFilter(
              task.computedCreatedAt,
              datePreset,
              dateRange
            );
          }
        );
      },
      [
        batchNumberFilter,
        courseInput,
        datePreset,
        dateRange,
        selectedCourse,
      ]
    );


  // ========================================
  // RESET FILTER STATE
  // ========================================

  const resetFilters =
    useCallback(
      (): void => {
        setDatePreset(
          ""
        );


        setDateRange({
          from:
            null,

          to:
            null,
        });


        setSelectedCourse(
          null
        );


        setCourseInput(
          ""
        );


        setBatchNumberFilter(
          ""
        );
      },
      []
    );


  // ========================================
  // SHARED FILTERED TABLE HOOK
  // ========================================

  /*
   * Because computedRows is ComputedTask[],
   * the generic hook keeps displayData typed
   * as ComputedTask[] automatically.
   */
  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable<ComputedTask>({
    rows:
      computedRows,

    filterRows,

    resetFilters,
  });


  // ========================================
  // UI
  // ========================================

  return (
    <div className="py-2 border-4 border-danger row mx-auto w-100">
      <TaskHeader
        config={
          config
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

        /*
         * TaskHeader currently keeps these two
         * props temporarily for compatibility.
         * We can remove them in a small cleanup
         * after the Task module migration passes.
         */
        urlBase={
          url
        }
        courseData={
          courseData
        }
        setCourseData={
          setCourseData
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
        openFilters={
          openFilters
        }
        setOpenFilters={
          setOpenFilters
        }
        onApply={
          applyFilters
        }
        onReset={
          resetTable
        }
        setTaskData={
          setTaskData
        }
      />


      {showTable && (
        <CustomisedTaskTables
          /*
           * ComputedTask extends TaskRecord,
           * so it is safe to pass these rows to
           * the task table.
           */
          taskData={
            displayData
          }
          setTaskData={
            setTaskData
          }
        />
      )}
    </div>
  );
}