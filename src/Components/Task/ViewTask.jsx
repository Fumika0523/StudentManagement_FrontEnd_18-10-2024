import React, { useEffect, useState, useMemo } from "react";
import CustomisedTaskTables from "./Table/CustomisedTaskTables";
import TaskHeader from "./Header/TaskHeader";
import axios from "axios";
import { url } from "../utils/constant";

export default function ViewTask() {
  const [taskData, setTaskData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [datePreset, setDatePreset] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInput, setCourseInput] = useState("");
  const [batchNumberFilter, setBatchNumberFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);
  const [showTable, setShowTable] = useState(false);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getTaskData = async () => {
    try {
      const res = await axios.get(`${url}/alltask`, config);
      setTaskData(res.data.taskData);
    } catch (err) {
      console.error("Fetch tasks failed:", err?.response?.data || err.message);
      setTaskData([]);
    }
  };

  const getCourseData = async () => {
    try {
      const res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (err) {
      console.error("Fetch courses failed:", err?.response?.data || err.message);
      setCourseData([]);
    }
  };

  useEffect(() => {
    getTaskData();
    getCourseData();
  }, []);

  const norm = (v) => String(v ?? "").trim().toLowerCase();

  const uniqueCourses = useMemo(() => {
    return (courseData || [])
      .filter((c) => c?._id && c?.courseName)
      .map((c) => ({ label: c.courseName, id: c._id }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [courseData]);

  // Enrich task rows with computed fields if needed
  const computedRows = useMemo(() => {
    const coursesById = {};
    (courseData || []).forEach((c) => { coursesById[c._id] = c; });

    return (taskData || []).map((t) => ({
      ...t,
      computedCourseName: coursesById[t.courseId]?.courseName || t.courseName || "",
      computedCreatedAt: t.createdAt || "",
    }));
  }, [taskData, courseData]);

  const getPresetRange = (presetKey) => {
    if (!presetKey) return { from: null, to: null };
    const now = new Date();
    const to = new Date(now);
    to.setHours(23, 59, 59, 999);

    if (presetKey === "today") {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    if (presetKey === "7d") {
      const from = new Date(now);
      from.setDate(now.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    if (presetKey === "30d") {
      const from = new Date(now);
      from.setDate(now.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    if (presetKey === "month") {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    if (presetKey === "year") {
      const from = new Date(now.getFullYear(), 0, 1);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    return { from: null, to: null };
  };

  const isWithinRange = (createdAt, from, to) => {
    if (!from && !to) return true;
    const d = new Date(createdAt);
    if (isNaN(d)) return false;
    const start = from ? new Date(from) : null;
    if (start) start.setHours(0, 0, 0, 0);
    const end = to ? new Date(to) : null;
    if (end) end.setHours(23, 59, 59, 999);
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  const applyCurrentFilters = (dataToFilter) => {
    let filtered = [...dataToFilter];

    // Course filter
    if (selectedCourse?.id) {
      filtered = filtered.filter((t) => t.courseId === selectedCourse.id);
    } else if ((courseInput || "").trim()) {
      filtered = filtered.filter(
        (t) => norm(t.computedCourseName) === norm(courseInput)
      );
    }

    // Batch number filter
    if (batchNumberFilter.trim()) {
      const q = norm(batchNumberFilter);
      filtered = filtered.filter((t) =>
        norm(t.batchNumber).includes(q)
      );
    }

    // Date filter (preset OR custom)
    const isCustom = datePreset === "custom";
    const presetRange = !isCustom ? getPresetRange(datePreset) : { from: null, to: null };
    const from = isCustom ? dateRange?.from : presetRange.from;
    const to = isCustom ? dateRange?.to : presetRange.to;

    if (from || to) {
      filtered = filtered.filter((t) =>
        isWithinRange(t.computedCreatedAt, from, to)
      );
    }

    return filtered;
  };

  const handleApplyFilter = () => {
    const filtered = applyCurrentFilters(computedRows);
    setFilteredData(filtered);
    setShowTable(true);
  };

  // Re-apply filters automatically when underlying data refreshes
  useEffect(() => {
    if (showTable) {
      const filtered = applyCurrentFilters(computedRows);
      setFilteredData(filtered);
    }
  }, [computedRows, showTable]);

  const handleResetFilter = () => {
    setDatePreset("");
    setDateRange({ from: null, to: null });
    setSelectedCourse(null);
    setCourseInput("");
    setBatchNumberFilter("");
    setFilteredData([]);
    setShowTable(false);
  };

  const displayData = showTable ? filteredData : computedRows;

  return (
    <div className="py-2 border-4 border-danger row mx-auto w-100">
      <TaskHeader
        config={config}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        dateRange={dateRange}
        setDateRange={setDateRange}
        urlBase={url}
        uniqueCourses={uniqueCourses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        courseInput={courseInput}
        setCourseInput={setCourseInput}
        batchNumberFilter={batchNumberFilter}
        setBatchNumberFilter={setBatchNumberFilter}
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
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