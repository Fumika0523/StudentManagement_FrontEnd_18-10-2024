/*
  Shared filtering utility types/functions.

  These utilities are used across multiple pages:
    - Students
    - Admissions
    - Courses
    - Tasks
    - Batches

  So we keep the types generic and reusable.
*/


/* =========================================================
   Shared types
========================================================= */

/*
  A course option used by MUI Autocomplete.

  Example:
    {
      label: "Full Stack Development",
      id: "67abc123..."
    }
*/
export interface CourseOption {
  label: string;
  id: string;
}


/*
  A value that can represent a date in our filtering functions.

  Backend dates normally arrive as strings,
  while frontend DatePicker state uses Date objects.

  We therefore support both.
*/
export type DateValue =
  | string
  | Date
  | null
  | undefined;


/*
  Represents a start/end date range.

  Both are optional because the user may select:
    - only from
    - only to
    - neither
*/
export interface DateRange {
  from: DateValue;
  to: DateValue;
}


/*
  Minimum shape required by buildCourseOptions().

  We intentionally do NOT define the entire Course here.

  The utility only needs:
    _id
    courseName
*/
interface CourseLike {
  _id?: unknown;
  courseName?: unknown;
}


/* =========================================================
   Text helpers
========================================================= */

/*
  `unknown` is safer than `any`.

  This utility may receive:
    string
    number
    null
    undefined
    etc.

  String(...) safely converts the value into text.
*/
export const normalizeText = (
  value: unknown
): string => {
  return String(value ?? "")
    .trim()
    .toLowerCase();
};


/*
  Checks whether one value contains another,
  ignoring case and surrounding spaces.

  Example:
    includesText("Fumika Mikami", "fumika")
    → true
*/
export const includesText = (
  value: unknown,
  searchText: unknown
): boolean => {
  return normalizeText(value).includes(
    normalizeText(searchText)
  );
};


/*
  Checks whether two values are equal
  after normalising them.

  Example:
    equalsText(" FEMALE ", "female")
    → true
*/
export const equalsText = (
  value: unknown,
  searchText: unknown
): boolean => {
  return (
    normalizeText(value) ===
    normalizeText(searchText)
  );
};


/* =========================================================
   Date helpers
========================================================= */

/*
  Internal helper for safely converting our DateValue
  into a new JavaScript Date object.

  We clone Date objects rather than modifying
  the original state value.
*/
const toDate = (
  value: DateValue
): Date | null => {
  if (value == null) {
    return null;
  }

  /*
    If the value is already Date,
    clone it using getTime().
  */
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  /*
    Invalid dates produce NaN from getTime().
  */
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};


/*
  Returns a date range based on a preset.

  Examples:
    "today"
    "7d"
    "30d"
    "month"
    "year"
*/
export const getPresetDateRange = (
  presetKey: string
): DateRange => {
  if (!presetKey) {
    return {
      from: null,
      to: null,
    };
  }


  const now = new Date();


  /*
    Create a separate Date for the end of the range.

    23:59:59.999 means the very end of today.
  */
  const to = new Date(now);

  to.setHours(
    23,
    59,
    59,
    999
  );


  /*
    Start at the beginning of today.
  */
  const from = new Date(now);

  from.setHours(
    0,
    0,
    0,
    0
  );


  /*
    Record<string, number> means:

      key   = string
      value = number

    Example:
      "7d"  → 7
      "30d" → 30
  */
  const presetDays: Record<
    string,
    number
  > = {
    "7d": 7,
    "30d": 30,
  };


  if (presetKey === "today") {
    return {
      from,
      to,
    };
  }


  /*
    TypeScript knows this may be:
      number
      OR
      undefined

    because somebody could pass an unknown preset.
  */
  const days =
    presetDays[presetKey];


  if (days !== undefined) {
    from.setDate(
      now.getDate() - days
    );

    return {
      from,
      to,
    };
  }


  if (presetKey === "month") {
    return {
      /*
        First day of the current month.
      */
      from: new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ),

      to,
    };
  }


  if (presetKey === "year") {
    return {
      /*
        January 1st of the current year.
      */
      from: new Date(
        now.getFullYear(),
        0,
        1
      ),

      to,
    };
  }


  /*
    Unknown preset:
    don't apply a date filter.
  */
  return {
    from: null,
    to: null,
  };
};


/*
  Determines whether createdAt falls inside
  the requested date range.
*/
export const isWithinDateRange = (
  createdAt: DateValue,
  from: DateValue,
  to: DateValue
): boolean => {
  /*
    No start/end date means:
    don't filter this row out.
  */
  if (!from && !to) {
    return true;
  }


  /*
    Convert the row's createdAt value safely.
  */
  const date = toDate(createdAt);

  if (!date) {
    return false;
  }


  /*
    Convert filter values into Date objects.

    toDate() returns:
      Date | null
  */
  const start = toDate(from);
  const end = toDate(to);


  /*
    Start date should include the whole day,
    beginning at midnight.
  */
  if (start) {
    start.setHours(
      0,
      0,
      0,
      0
    );
  }


  /*
    End date should include the whole day,
    ending at 23:59:59.999.
  */
  if (end) {
    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  if (
    start &&
    date < start
  ) {
    return false;
  }


  if (
    end &&
    date > end
  ) {
    return false;
  }


  return true;
};


/*
  Combines:
    - preset date filtering
    - custom date filtering

  into one reusable function.
*/
export const isWithinSelectedDateFilter = (
  createdAt: DateValue,
  datePreset: string,
  dateRange: DateRange
): boolean => {
  /*
    "custom" means use the manually selected
    from/to values instead of a preset.
  */
  const isCustomRange =
    datePreset === "custom";


  const presetRange =
    isCustomRange
      ? {
          from: null,
          to: null,
        }
      : getPresetDateRange(
          datePreset
        );


  const from =
    isCustomRange
      ? dateRange?.from
      : presetRange.from;


  const to =
    isCustomRange
      ? dateRange?.to
      : presetRange.to;


  return isWithinDateRange(
    createdAt,
    from,
    to
  );
};


/* =========================================================
   Course helpers
========================================================= */

/*
  Converts backend course data into the format
  required by our course Autocomplete.

  The generic <T extends CourseLike> means:

    T can be any object type,
    as long as it may contain:
      _id
      courseName

  So later we can pass Course[] without using any.
*/
export const buildCourseOptions = <
  T extends CourseLike
>(
  courseData: T[] = []
): CourseOption[] => {
  return courseData
    /*
      We only want courses that contain valid
      string IDs and course names.

      This also protects us from incomplete API data.
    */
    .filter(
      (
        course
      ): course is T & {
        _id: string;
        courseName: string;
      } =>
        typeof course?._id ===
          "string" &&
        typeof course?.courseName ===
          "string" &&
        course.courseName.trim()
          .length > 0
    )

    /*
      After the filter above, TypeScript knows:
        course._id = string
        course.courseName = string
    */
    .map((course) => ({
      label:
        course.courseName,

      id:
        course._id,
    }))

    /*
      Sort alphabetically by course name.
    */
    .sort((a, b) =>
      a.label.localeCompare(
        b.label
      )
    );
};


/* =========================================================
   Selected course matching
========================================================= */

/*
  Props accepted by matchesSelectedCourse().

  T represents the row type.

  For Student:
    T = ComputedStudent

  For Task:
    T will eventually be Task.

  keyof T means:
    "one of the property names that exists on T"
*/
interface MatchesSelectedCourseArgs<
  T extends object
> {
  row: T;

  selectedCourse:
    | CourseOption
    | null;

  courseInput: string;

  /*
    These optional keys let other pages reuse
    this function with differently named properties.

    Student normally uses:
      courseId
      courseName

    Task currently uses:
      computedCourseName
  */
  courseIdKey?: keyof T;

  courseNameKey?: keyof T;
}


/*
  Checks whether a row matches the selected/typed course.
*/
export const matchesSelectedCourse = <
  T extends object
>({
  row,
  selectedCourse,
  courseInput,

  /*
    These defaults are cast as keyof T because
    this generic function cannot know every future
    row type at compile time.

    The callers can override them where necessary.
  */
  courseIdKey =
    "courseId" as keyof T,

  courseNameKey =
    "courseName" as keyof T,
}: MatchesSelectedCourseArgs<T>): boolean => {
  /*
    If the user selected a CourseOption,
    compare its MongoDB ID with the row's course ID.
  */
  if (selectedCourse?.id) {
    return (
      normalizeText(
        row[courseIdKey]
      ) ===
      normalizeText(
        selectedCourse.id
      )
    );
  }


  /*
    If the user typed a course name manually,
    compare against the row's course-name field.
  */
  if (courseInput.trim()) {
    return equalsText(
      row[courseNameKey],
      courseInput
    );
  }


  /*
    No course filter selected.
  */
  return true;
};