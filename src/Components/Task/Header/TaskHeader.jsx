import React, { useState } from "react";
import { Box } from "@mui/material";
import AddTaskButton from "./ActionButton/AddTaskButton";
import TaskFilter from "./Filter/TaskFilter";
// import ModalAddTask from "../../Task/Table/ModalAssignTask"; // adjust path if needed

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
      <AddTaskButton
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

      {/* Add Task modal */}
      {showAdd && (
        <ModalAddTask
          show={showAdd}
          setShow={setShowAdd}
          setTaskData={setTaskData}
        />
      )}
    </div>
  );
};

export default TaskHeader;