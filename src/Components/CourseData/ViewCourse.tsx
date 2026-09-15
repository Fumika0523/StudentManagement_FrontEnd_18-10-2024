import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import CustomisedCourseTables from "./CustomisedCourseTables";
import Header from "../CourseData/Header/Header";

import { url } from "../utils/constant";

import {
  includesText,
  isWithinSelectedDateFilter,
} from "../utils/filterUtils";

/*
  DateRange is a TypeScript type exported from filterUtils.ts.

  We use `import type` because it only exists for TypeScript
  checking and is not needed in the browser at runtime.
*/
import type {
  DateRange,
} from "../utils/filterUtils";

import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

/*
  Reuse our shared Course definitions.

  Course
    = normal course data returned by backend

  ComputedCourse
    = Course + frontend-calculated fields
*/
import type {
  Course,
  ComputedCourse,
} from "../../types/course";


/*
  This describes the response expected from:

    GET /allcourse

  So instead of TypeScript treating res.data as unknown/untyped,
  it knows that:

    res.data.courseData

  should be Course[].
*/
interface CoursesResponse {
  courseData: Course[];
}


function ViewCourse() {
  /*
    Previously:

      useState([])

    TypeScript would not know what type of objects belong
    inside this array.

    Now:
      Course[]

    means only Course objects can be stored here.
  */
  const [courseData, setCourseData] =
    useState<Course[]>([]);


  const [datePreset, setDatePreset] =
    useState<string>("");


  /*
    DateRange is:

      {
        from: DateValue;
        to: DateValue;
      }

    Both begin as null because no date filter
    has been selected yet.
  */
  const [dateRange, setDateRange] =
    useState<DateRange>({
      from: null,
      to: null,
    });


  const [openFilters, setOpenFilters] =
    useState<boolean>(true);


  const [sessionType, setSessionType] =
    useState<string>("");


  const [courseName, setCourseName] =
    useState<string>("");


  /*
    useAuthConfig() now returns AxiosRequestConfig
    because we already migrated that utility to TypeScript.
  */
  const config = useAuthConfig();


  /* ========================================================
     Fetch Course Data
  ======================================================== */

  const getCourseData =
    useCallback(async (): Promise<void> => {
      try {
        /*
          axios.get<CoursesResponse>()

          tells Axios exactly what we expect the backend
          response body to look like.
        */
        const res =
          await axios.get<CoursesResponse>(
            `${url}/allcourse`,
            config
          );


        /*
          courseData state accepts Course[].

          ?? [] protects us in case courseData unexpectedly
          comes back null or undefined.
        */
        setCourseData(
          res.data.courseData ?? []
        );
      } catch (error: unknown) {
        /*
          In strict TypeScript, caught errors should be
          treated as `unknown`.

          We aren't reading properties such as:
            error.message

          so it is safe to log the unknown value directly.
        */
        console.error(
          "Error fetching courses:",
          error
        );
      }
    }, [config]);


  useEffect(() => {
    getCourseData();
  }, [getCourseData]);


  /* ========================================================
     Create Frontend Computed Rows
  ======================================================== */

  /*
    courseData contains Course[].

    But the table/filter also needs:
      computedCreatedAt

    Therefore the resulting array is:
      ComputedCourse[]
  */
  const computedRows =
    useMemo<ComputedCourse[]>(() => {
      return courseData.map(
        (course): ComputedCourse => ({
          /*
            Copy every property from the original Course.
          */
          ...course,

          /*
            computedCreatedAt is NOT stored in MongoDB.

            It is a frontend-only property used
            for date filtering.
          */
          computedCreatedAt:
            course.createdAt ?? "",
        })
      );
    }, [courseData]);


  /* ========================================================
     Filtering
  ======================================================== */

  /*
    This callback accepts ComputedCourse[]
    and returns ComputedCourse[].

    That is important because useFilteredTable<T>
    should preserve the type of each row.
  */
  const filterRows = useCallback(
    (
      rows: ComputedCourse[]
    ): ComputedCourse[] => {
      return rows.filter((course) => {
        /*
          Course name search.

          Because courseName is already typed as string,
          `?.` is no longer necessary here.

          We can simply use:
            courseName.trim()
        */
        if (
          courseName.trim() &&
          !includesText(
            course.courseName,
            courseName
          )
        ) {
          return false;
        }


        /*
          Session type filter.

          Examples:
            Online
            Offline

          course.courseType is a string according
          to our shared Course interface.
        */
        if (
          sessionType &&
          course.courseType !== sessionType
        ) {
          return false;
        }


        /*
          Date filtering uses the computedCreatedAt
          frontend field we created above.
        */
        return isWithinSelectedDateFilter(
          course.computedCreatedAt,
          datePreset,
          dateRange
        );
      });
    },
    [
      courseName,
      datePreset,
      dateRange,
      sessionType,
    ]
  );


  /* ========================================================
     Reset Filters
  ======================================================== */

  const resetFilters =
    useCallback((): void => {
      setCourseName("");
      setDatePreset("");
      setSessionType("");

      setDateRange({
        from: null,
        to: null,
      });
    }, []);


  /* ========================================================
     Shared Filter Hook
  ======================================================== */

  /*
    TypeScript can infer:

      T = ComputedCourse

    because:
      rows = ComputedCourse[]
      filterRows accepts ComputedCourse[]

    Therefore:
      displayData = ComputedCourse[]
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
    <div className="py-2 row mx-auto w-100">
     <Header
  datePreset={datePreset}
  setDatePreset={setDatePreset}

  dateRange={dateRange}
  setDateRange={setDateRange}

  courseData={courseData}
  setCourseData={setCourseData}

  openFilters={openFilters}
  setOpenFilters={setOpenFilters}

  onApply={applyFilters}
  onReset={resetTable}

  sessionType={sessionType}
  setSessionType={setSessionType}

  courseName={courseName}
  setCourseName={setCourseName}
/>

      {/*
        Only display the table after Apply Filters
        has been clicked.

        displayData is now typed as:
          ComputedCourse[]
      */}
      {showTable && (
        <CustomisedCourseTables
          setCourseData={setCourseData}
          courseData={displayData}
        />
      )}
    </div>
  );
}


export default ViewCourse;