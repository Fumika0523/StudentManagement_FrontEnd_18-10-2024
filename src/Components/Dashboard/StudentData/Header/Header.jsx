import React, { useState } from "react";
import { Box } from "@mui/material";

import ActionBtns from "./ActionBtns";
import StudentFilter from "./Filter/StudentFilter";
import ModalAddStudent from "../CreateStudent/ModalAddStudent";

const Header = ({
  // ActionBtns
  config,
  setStudentData,
  urlBase,

  // Filters state + handlers from parent
  openFilters,
  setOpenFilters,
  onApply,
  onReset,

  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  courseData, setCourseData,
  batchStatus,
  setBatchStatus,
  studentName, setStudentName,
  emailSearch, setEmailSearch,
  genderFilter, setGenderFilter,
  datePreset, setDatePreset, dateRange, setDateRange,
  sessionType, setSessionType,
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      {/* Top actions */}
      <ActionBtns
        setShowAdd={setShowAdd}
        config={config}
        setStudentData={setStudentData}
        urlBase={urlBase}
      />

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          mt: 1,
          gap: 2,
          width: "100%",
        }}
      >
        <StudentFilter
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}
          onApply={onApply}
          onReset={onReset}
          uniqueCourses={uniqueCourses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          courseInput={courseInput}
          setCourseInput={setCourseInput}
          batchStatus={batchStatus}
          setBatchStatus={setBatchStatus}
          studentName={studentName}
          setStudentName={setStudentName}
          emailSearch={emailSearch}
          setEmailSearch={setEmailSearch}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          dateRange={dateRange}
          setDateRange={setDateRange}
          sessionType={sessionType}
          setSessionType={setSessionType}
        />
      </Box>

      {/* Add Student modal */}
      {showAdd && (
        <ModalAddStudent
          show={showAdd}
          setShow={setShowAdd}
          courseData={courseData}
          setStudentData={setStudentData}
        />
      )}
    </div>
  );
};

export default Header;
