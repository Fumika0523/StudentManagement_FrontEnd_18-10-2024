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

  batchStatus,
  setBatchStatus,
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
        />
      </Box>

      {/* Add Student modal */}
      {showAdd && (
        <ModalAddStudent
          show={showAdd}
          setShow={setShowAdd}
          setStudentData={setStudentData}
        />
      )}
    </div>
  );
};

export default Header;
