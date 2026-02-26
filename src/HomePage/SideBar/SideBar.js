// sidebar.data.js
import React from "react";

const IC = (name, size = 24) => (
  <img
    width={size}
    height={size}
    src={`https://img.icons8.com/color/${size * 2}/${name}.png`}
    alt={name}
    style={{ display: "block", flexShrink: 0, margin: "0 auto" }}
  />
);

export const ICONS = {
  dashboard: () => IC("speed", 24),
  student: () => IC("student-male", 22),
  batch: () => IC("classmates-sitting", 22),
  course: () => IC("book-shelf", 22),
  admission: () => IC("enter-2", 22),
  task: () => IC("task", 22),
  attendance: () => IC("calendar", 22),

  viewBatch: () => IC("conference-call", 22),
  viewAtten: () => IC("planner", 22),
  submitTask: () => IC("submit-document", 22),
  raiseQuery: () => IC("ask-question", 22),
  certificate: () => IC("certificate", 22),
  invoice: () => IC("invoice", 22),

  settings: () => IC("settings", 22),
  logo: () => IC("graduation-cap", 30),
};

export const getAcademicItems = (role) => {
  const adminItems = [
    { icon: ICONS.student(), label: "Student", path: "/studentdata" },
    { icon: ICONS.batch(), label: "Batch", path: "/batchdata" },
    { icon: ICONS.course(), label: "Course", path: "/coursedata" },
    { icon: ICONS.admission(), label: "Admission", path: "/admissiondata" },
    { icon: ICONS.task(), label: "Task", path: "/task" },
    { icon: ICONS.attendance(), label: "Update Attendance", path: "/attendance" },
  ];

  const studentItems = [
    { icon: ICONS.viewBatch(), label: "View Batch", path: "/batchdata" },
    { icon: ICONS.viewAtten(), label: "View Attendance", path: "/coursedata" },
    { icon: ICONS.submitTask(), label: "Submit Task", path: "/coursedata" },
    { icon: ICONS.raiseQuery(), label: "Raise Query", path: "/raise-query" },
    { icon: ICONS.certificate(), label: "Download Certificate", path: "/" },
    { icon: ICONS.invoice(), label: "Invoice Download", path: "/" },
  ];

  return role === "admin" || role === "staff" ? adminItems : studentItems;
};