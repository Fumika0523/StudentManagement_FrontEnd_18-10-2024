import { useEffect, useState, useMemo, useCallback  } from "react";
import CustomisedCourseTables from "./CustomisedCourseTables";
import ModalAddCourse from "./ModalAddCourse";
import { url } from "../utils/constant";
import axios from "axios";
import Header from "../CourseData/Header/Header";

function ViewCourse() {
  const [courseData, setCourseData] = useState([]);
  const [show, setShow] = useState(false);
  const [datePreset, setDatePreset] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [openFilters, setOpenFilters] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [sessionType, setSessionType] = useState("");

  // Filter states
  const [courseName, setCourseName] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch course data
  const getCourseData = async () => {
    try {
      let res = await axios.get(`${url}/allcourse`, config);
     // console.log("CourseData", res.data.courseData);
      setCourseData(res.data.courseData);
    } catch (error) {
      //console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  // Normalize strings for comparison
  const norm = (v) => String(v ?? "").trim().toLowerCase();

  // Get date range based on preset
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

  // Check if date is within range
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

  // Computed rows with any additional fields
  const computedRows = useMemo(() => {
    return (courseData || []).map((c) => ({
      ...c,
      computedCreatedAt: c.createdAt || "",
    }));
  }, [courseData]);

  // Function to apply current filters to data
  const applyCurrentFilters =useCallback( (data) => {
    let filtered = [...data];

    // Course name filter
    if (courseName?.trim()) {
      const q = norm(courseName);
      filtered = filtered.filter((c) => norm(c.courseName).includes(q));
    }

    // Session type filter
    if (sessionType) {
      filtered = filtered.filter(
        (s) => norm(s.computedSessionType) === norm(sessionType)
      );
    }

    // Created date filter (preset OR custom)
    const isCustom = datePreset === "custom";
    const presetRange = !isCustom
      ? getPresetRange(datePreset)
      : { from: null, to: null };

    const from = isCustom ? dateRange?.from : presetRange.from;
    const to = isCustom ? dateRange?.to : presetRange.to;

    if (from || to) {
      filtered = filtered.filter((c) =>
        isWithinRange(c.computedCreatedAt, from, to)
      );
    }

    return filtered;
  },[courseName, sessionType, datePreset, dateRange])

  // Apply filters when user clicks "Apply" button
  const handleApplyFilter = () => {
    const filtered = applyCurrentFilters(computedRows);
    setFilteredData(filtered);
    setShowTable(true);
  };

  // Auto-refresh: Re-apply filters when courseData changes (only if table is visible)
  useEffect(() => {
   if (showTable && courseData.length > 0) {
    const filtered = applyCurrentFilters(computedRows);
    setFilteredData(filtered);
  }
}, [courseData, showTable, applyCurrentFilters, computedRows]); 

  // Reset filters
  const handleResetFilter = () => {
    setCourseName("");
    setDatePreset("");
    setSessionType("");
    setDateRange({ from: null, to: null });
    setFilteredData([]);
    setShowTable(false); // Hide table
  };

  const displayData = showTable ? filteredData : computedRows;

  return (
    <div className="py-2 row mx-auto w-100">
      <Header
        config={config}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        dateRange={dateRange}
        setDateRange={setDateRange}
        courseData={courseData}
        setCourseData={setCourseData}
        urlBase={url}
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        sessionType={sessionType}
        courseName={courseName}
        setCourseName={setCourseName}
      />

      {/* Table - Only show when showTable is true */}
      {showTable && (
        <CustomisedCourseTables
          setCourseData={setCourseData}
          courseData={displayData}
        />
      )}
    </div>
  );
}

export default ViewCourse;