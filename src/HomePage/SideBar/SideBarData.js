export const ICONS = {
  dashboard: { name: "speed", size: 25 },
  student: { name: "student-male", size: 25 },
  batch: { name: "classmates-sitting", size: 25 },
  course: { name: "book-shelf", size: 25 },
  admission: { name: "enter-2", size: 25 },
  task: { name: "task", size: 25 },
  attendance: { name: "calendar", size: 25 },

  viewBatch: { name: "conference-call", size: 25 },
  viewAtten: { name: "planner", size: 25 },
  submitTask: { name: "open-book", size: 25 },
  raiseQuery: { name: "ask-question", size: 25 },
  certificate: { name: "certificate", size: 25 },
  invoice: { name: "us-dollar-circled", size: 25 },

  settings: { name: "settings", size: 25 },
  logo: { name: "graduation-cap", size: 30 },
};

export const getAcademicItems = (role) => {
  const adminItems = [
    { iconKey: "student", label: "Student", path: "/studentdata" },
    { iconKey: "batch", label: "Batch", path: "/batchdata" },
    { iconKey: "course", label: "Course", path: "/coursedata" },
    { iconKey: "admission", label: "Admission", path: "/admissiondata" },
    { iconKey: "task", label: "Task", path: "/task" },
    { iconKey: "attendance", label: "Update Attendance", path: "/attendance" },
  ];

  const studentItems = [
    { iconKey: "viewBatch", label: "View Batch", path: "/batchdata" },
    { iconKey: "viewAtten", label: "View Attendance", path: "/coursedata" },
    { iconKey: "submitTask", label: "Submit Task", path: "/task-submit" },
    { iconKey: "raiseQuery", label: "Raise Query", path: "/raise-query" },
    { iconKey: "certificate", label: "Download Certificate", path: "/certificate" },
    { iconKey: "invoice", label: "Invoice Download", path: "/invoice" },
  ];

  return role === "admin" || role === "staff" ? adminItems : studentItems;
};