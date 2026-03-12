export const ICONS = {
  dashboard: { name: "speed", height: 
    54, width:54
   },
  student: { name: "student-male", 
    width: 55, height: 50,
   },
  batch: { name: "badge", width: 55, height: 56,
   },
  course: { name: "book-shelf", width: 
    56
   },
  admission: { name: "inscription", height: 48, width: 56
   },
  task: { name: "todo-list", width: 51
   },
  attendance: { name: "calendar", height: 
    53
   },

  viewBatch: { name: "conference-call", size: 
    55
   },
  viewAtten: { name: "planner", size: 
    55
   },
  submitTask: { name: "open-book", size: 
    55
   },
  raiseQuery: { name: "ask-question", size: 
    55
   },
  certificate: { name: "certificate", size: 
    55
   },
  invoice: { name: "us-dollar-circled", width: 55
   },

  settings: { name: "settings", height: 
    52
   },
  logo: { name: "graduation-cap", height: 55,width: 52},
};

export const getAcademicItems = (role) => {
  const adminItems = [
    { iconKey: "student", label: "Student", path: "/studentdata" },
    { iconKey: "batch", label: "Batch", path: "/batchdata" },
    { iconKey: "course", label: "Course", path: "/coursedata" },
    { iconKey: "admission", label: "Admission", path: "/admissiondata" },
    { iconKey: "task", label: "Task", path: "/task" },
    { iconKey: "attendance", label: "Update Attendance", path: "/attendance" },
     { iconKey: "invoice", label: "Invoice", path: "/staff-invoice" },
  ];

  const studentItems = [
    { iconKey: "viewBatch", label: "View Batch", path: "/batchdata" },
    { iconKey: "viewAtten", label: "View Attendance", path: "/coursedata" },
    { iconKey: "submitTask", label: "Submit Task", path: "/task-submit" },
    { iconKey: "raiseQuery", label: "Raise Query", path: "/raise-query" },
    { iconKey: "certificate", label: "Download Certificate", path: "/certificate" },
    { iconKey: "invoice", label: "Invoice Download", path: "/student-invoice" },
  ];

  return role === "admin" || role === "staff" ? adminItems : studentItems;
};