export interface DateRange {
  from: Date | string | null;
  to: Date | string | null;
}

export interface CourseOption {
  label: string;
  id: string;
}

export interface CourseItem {
  _id?: string;
  courseName?: string;
  [key: string]: any;
}

export interface MatchesSelectedCourseParams {
  row: Record<string, any>;
  selectedCourse?: CourseOption | null;
  courseInput?: string;
  courseIdKey?: string;
  courseNameKey?: string;
}

export const normalizeText = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

export const includesText = (value: unknown, searchText: unknown): boolean =>
  normalizeText(value).includes(normalizeText(searchText));

export const equalsText = (value: unknown, searchText: unknown): boolean =>
  normalizeText(value) === normalizeText(searchText);

export const getPresetDateRange = (presetKey?: string): DateRange => {
  if (!presetKey) return { from: null, to: null };

  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  const presetDays: Record<string, number> = {
    "7d": 7,
    "30d": 30,
  };

  if (presetKey === "today") return { from, to };

  if (presetDays[presetKey]) {
    from.setDate(now.getDate() - presetDays[presetKey]);
    return { from, to };
  }

  if (presetKey === "month") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to };
  }

  if (presetKey === "year") {
    return { from: new Date(now.getFullYear(), 0, 1), to };
  }

  return { from: null, to: null };
};

export const isWithinDateRange = (
  createdAt?: string | Date,
  from?: Date | string | null,
  to?: Date | string | null
): boolean => {
  if (!from && !to) return true;
  if (!createdAt) return false;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return false;

  const start = from ? new Date(from) : null;
  if (start) start.setHours(0, 0, 0, 0);

  const end = to ? new Date(to) : null;
  if (end) end.setHours(23, 59, 59, 999);

  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const isWithinSelectedDateFilter = (
  createdAt?: string | Date,
  datePreset?: string,
  dateRange?: DateRange
): boolean => {
  const isCustomRange = datePreset === "custom";
  const presetRange = isCustomRange
    ? { from: null, to: null }
    : getPresetDateRange(datePreset);

  const from = isCustomRange ? dateRange?.from : presetRange.from;
  const to = isCustomRange ? dateRange?.to : presetRange.to;

  return isWithinDateRange(createdAt, from, to);
};

export const buildCourseOptions = (courseData: CourseItem[] = []): CourseOption[] =>
  courseData
    .filter((course): course is Required<Pick<CourseItem, "_id" | "courseName">> & CourseItem =>
      Boolean(course?._id && course?.courseName)
    )
    .map((course) => ({ label: course.courseName, id: course._id }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const matchesSelectedCourse = ({
  row,
  selectedCourse,
  courseInput,
  courseIdKey = "courseId",
  courseNameKey = "courseName",
}: MatchesSelectedCourseParams): boolean => {
  if (selectedCourse?.id) {
    return row?.[courseIdKey] === selectedCourse.id;
  }

  if ((courseInput || "").trim()) {
    return equalsText(row?.[courseNameKey], courseInput);
  }

  return true;
};
