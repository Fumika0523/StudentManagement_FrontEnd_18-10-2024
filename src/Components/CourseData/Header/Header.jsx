import React, { useState } from "react";
import { Box } from "@mui/material";
import ActionBtns from "./ActionBtns";
import CourseFilter from "./Filter/CourseFilter";
import ModalAddCourse from "../Modals/ModalAddCourse";

const Header = ({
  config,
  courseData,  // Add this
  setCourseData,
  urlBase,
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
  setSessionType
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Action Buttons */}
      <ActionBtns setShowAdd={setShowAdd}  config={config} setCourseData={setCourseData}/>

      {/* Filters */}
      <CourseFilter
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={onApply}
        onReset={onReset}
        courseName={courseName}
        setCourseName={setCourseName}
        sessionType={sessionType}
        setSessionType={setSessionType}
        courseData={courseData}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* Add Course Modal */}
      {showAdd && (
        <ModalAddCourse
          show={showAdd}
          setShow={setShowAdd}
          setCourseData={setCourseData}
        />
      )}
    </Box>
  );
};

export default Header;