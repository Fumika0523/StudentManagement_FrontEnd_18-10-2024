import React, { useState } from "react";
import { Box } from "@mui/material";
import TaskFilter from "./Filter/TaskFilter";
import TaskActionBtns from "./ActionButton/TaskActionBtns";
import ModalAddTask from "../Header/ActionButton/CreateTask/ModalAddTask";

const TaskHeader = ({
  config,
  setTaskData,
  urlBase,
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
      <TaskActionBtns
        setShowAdd={setShowAdd}
        config={config}
        setTaskData={setTaskData}
        urlBase={urlBase}
      />

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

      <ModalAddTask
        show={showAdd}
        setShow={setShowAdd}
        setTaskData={setTaskData}
        courseData={courseData}
        batchData={[]}
      />
    </div>
  );
};

export default TaskHeader;