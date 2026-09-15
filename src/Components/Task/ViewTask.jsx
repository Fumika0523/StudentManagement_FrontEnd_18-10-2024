import { useCallback, useEffect, useMemo, useState } from "react";
import CustomisedTaskTables from "./Table/CustomisedTaskTables";
import TaskHeader from "./Header/TaskHeader";
import axios from "axios";
import { url } from "../utils/constant";
import {
  buildCourseOptions,
  includesText,
  isWithinSelectedDateFilter,
  matchesSelectedCourse,
} from "../utils/filterUtils";
import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

export default function ViewTask() {
  const [taskData, setTaskData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const [datePreset, setDatePreset] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInput, setCourseInput] = useState("");
  const [batchNumberFilter, setBatchNumberFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);

  const config = useAuthConfig();

  const getTaskData = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/alltask`, config);
      setTaskData(res.data.taskData);
    } catch (err) {
      console.error("Fetch tasks failed:", err?.response?.data || err.message);
      setTaskData([]);
    }
  }, [config]);

  const getCourseData = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (err) {
      console.error("Fetch courses failed:", err?.response?.data || err.message);
      setCourseData([]);
    }
  }, [config]);

  useEffect(() => {
    getTaskData();
    getCourseData();
  }, [getCourseData, getTaskData]);

  const uniqueCourses = useMemo(() => {
    return buildCourseOptions(courseData);
  }, [courseData]);

  const computedRows = useMemo(() => {
    const coursesById = {};
    (courseData || []).forEach((c) => { coursesById[c._id] = c; });

    return (taskData || []).map((t) => ({
      ...t,
      computedCourseName: coursesById[t.courseId]?.courseName || t.courseName || "",
      computedCreatedAt: t.createdAt || "",
    }));
  }, [taskData, courseData]);

  const filterRows = useCallback((rows) => {
    return rows.filter((task) => {
      if (!matchesSelectedCourse({
        row: task,
        selectedCourse,
        courseInput,
        courseNameKey: "computedCourseName",
      })) {
        return false;
      }

      if (
        batchNumberFilter.trim() &&
        !includesText(task.batchNumber, batchNumberFilter)
      ) {
        return false;
      }

      return isWithinSelectedDateFilter(
        task.computedCreatedAt,
        datePreset,
        dateRange
      );
    });
  }, [batchNumberFilter, courseInput, datePreset, dateRange, selectedCourse]);

  const resetFilters = useCallback(() => {
    setDatePreset("");
    setDateRange({ from: null, to: null });
    setSelectedCourse(null);
    setCourseInput("");
    setBatchNumberFilter("");
  }, []);

  const {
    displayData,
    showTable,
    applyFilters,
    resetTable,
  } = useFilteredTable({
    rows: computedRows,
    filterRows,
    resetFilters,
  });

  return (
    <div className="py-2 border-4 border-danger row mx-auto w-100">
      <TaskHeader
        config={config}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        dateRange={dateRange}
        setDateRange={setDateRange}
        urlBase={url}
        courseData={courseData}
        setCourseData={setCourseData}
        uniqueCourses={uniqueCourses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        courseInput={courseInput}
        setCourseInput={setCourseInput}
        batchNumberFilter={batchNumberFilter}
        setBatchNumberFilter={setBatchNumberFilter}
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={applyFilters}
        onReset={resetTable}
        setTaskData={setTaskData}
      />
      {showTable && (
        <CustomisedTaskTables
          taskData={displayData}
          setTaskData={setTaskData}
        />
      )}
    </div>
  );
}
