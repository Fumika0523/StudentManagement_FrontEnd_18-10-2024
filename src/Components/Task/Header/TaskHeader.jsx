import React, { useState } from "react";
import { Box } from "@mui/material";
import TaskFilter from "./Filter/TaskFilter";
import TaskActionBtns from "./ActionButton/TaskActionBtns";

const TaskHeader = ({
  // AddTaskButton
  config,
  setTaskData,
  urlBase,

  // Filter state + handlers from parent
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  courseData,
  setCourseData,
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  batchNumberFilter,
  setBatchNumberFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}) => {

const [showAdd, setShowAdd] = useState(false);

return (
    <div>
      {/* Top actions */}
      <TaskActionBtns
        setShowAdd={setShowAdd}
        config={config}
        setTaskData={setTaskData}
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
        <TaskFilter
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}
          onApply={onApply}
          onReset={onReset}
          uniqueCourses={uniqueCourses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          courseInput={courseInput}
          setCourseInput={setCourseInput}
          batchNumberFilter={batchNumberFilter}
          setBatchNumberFilter={setBatchNumberFilter}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </Box>

  
    </div>
  );
};

export default TaskHeader;