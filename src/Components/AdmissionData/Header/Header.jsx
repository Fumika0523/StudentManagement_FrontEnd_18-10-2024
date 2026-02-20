import React, { useState } from "react";
import { Box } from "@mui/material";

import ActionBtns from "./ActionBtns";
import AdmissionFilter from "./Filter/AdmissionFilter";


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
      showAdd={showAdd}
        setShowAdd={setShowAdd}
        config={config}
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
        <AdmissionFilter
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

    
    </div>
  );
};

export default Header;
