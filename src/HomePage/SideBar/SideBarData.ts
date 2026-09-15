// ========================================
// SIDEBAR ICON TYPES
// ========================================

/*
 * Different icons currently use width/height
 * or a single size value.
 *
 * They are optional because not every icon
 * configuration defines every dimension.
 */
export interface SidebarIconConfig {
  name: string;
  height?: number;
  width?: number;
  size?: number;
}


// ========================================
// ICON CONFIGURATION
// ========================================

export const ICONS = {
  dashboard: {
    name: "speed",
    height: 53,
    width: 53,
  },

  student: {
    name: "student-male",
    width: 55,
    height: 50,
  },

  batch: {
    name: "badge",
    width: 55,
    height: 56,
  },

  course: {
    name: "book-shelf",
    width: 56,
  },

  admission: {
    name: "inscription",
    height: 48,
    width: 56,
  },

  task: {
    name: "todo-list",
    width: 51,
  },

  attendance: {
    name: "calendar",
    height: 53,
  },

  viewAttendance: {
    name: "data-sheet",
    height: 53,
    width: 53,
  },

  viewBatch: {
    name: "conference-call",
    size: 55,
  },

  viewAtten: {
    name: "planner",
    size: 55,
  },

  submitTask: {
    name: "open-book",
    size: 55,
  },

  raiseQuery: {
    name: "ask-question",
    size: 55,
  },

  certificate: {
    name: "certificate",
    size: 55,
  },

  invoice: {
    name: "us-dollar-circled",
    width: 55,
  },

  settings: {
    name: "settings",
    height: 52,
  },

  logo: {
    name: "graduation-cap",
    height: 55,
    width: 50,
  },
} satisfies Record<
  string,
  SidebarIconConfig
>;


// ========================================
// ICON KEY TYPE
// ========================================

/*
 * keyof typeof ICONS creates a union containing
 * every valid icon key.
 *
 * This prevents accidental values such as:
 *
 * iconKey: "studnet"
 *
 * from compiling.
 */
export type SidebarIconKey =
  keyof typeof ICONS;


// ========================================
// SIDEBAR ITEM TYPE
// ========================================

export interface AcademicSidebarItem {
  iconKey: SidebarIconKey;
  label: string;
  path: string;
}


// ========================================
// ADMIN / STAFF ITEMS
// ========================================

const adminItems:
  AcademicSidebarItem[] = [
  {
    iconKey: "student",
    label: "Student",
    path: "/studentdata",
  },

  {
    iconKey: "batch",
    label: "Batch",
    path: "/batchdata",
  },

  {
    iconKey: "course",
    label: "Course",
    path: "/coursedata",
  },

  {
    iconKey: "admission",
    label: "Admission",
    path: "/admissiondata",
  },

  {
    iconKey: "task",
    label: "Task",
    path: "/task",
  },

  {
    iconKey: "attendance",
    label: "Update Attendance",
    path: "/attendance",
  },

  {
    iconKey: "viewAttendance",
    label: "View Attendance",
    path: "/view-attendance",
  },

  {
    iconKey: "invoice",
    label: "Invoice",
    path: "/staff-invoice",
  },
];


// ========================================
// STUDENT ITEMS
// ========================================

const studentItems:
  AcademicSidebarItem[] = [
  {
    iconKey: "viewBatch",
    label: "View Batch",
    path: "/batchdata",
  },

  {
    iconKey: "viewAtten",
    label: "View Attendance",
    path: "/coursedata",
  },

  {
    iconKey: "submitTask",
    label: "Submit Task",
    path: "/task-submit",
  },

  {
    iconKey: "raiseQuery",
    label: "Raise Query",
    path: "/raise-query",
  },

  {
    iconKey: "certificate",
    label: "Download Certificate",
    path: "/certificate",
  },

  {
    iconKey: "invoice",
    label: "Invoice Download",
    path: "/student-invoice",
  },
];


// ========================================
// GET ITEMS FOR CURRENT ROLE
// ========================================

/*
 * localStorage.getItem() can return null,
 * so the role parameter supports string | null.
 */
export const getAcademicItems = (
  role: string | null
): AcademicSidebarItem[] => {
  return (
    role === "admin" ||
    role === "staff"
  )
    ? adminItems
    : studentItems;
};