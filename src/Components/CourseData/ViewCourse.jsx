import { useCallback, useEffect, useMemo, useState } from "react";
import CustomisedCourseTables from "./CustomisedCourseTables";
import { url } from "../utils/constant";
import axios from "axios";
import Header from "../CourseData/Header/Header";
import {
  includesText,
  isWithinSelectedDateFilter,
} from "../utils/filterUtils";
import { useAuthConfig } from "../utils/useAuthConfig";
import { useFilteredTable } from "../utils/useFilteredTable";

function ViewCourse() {
  const [courseData, setCourseData] = useState([]);
  const [datePreset, setDatePreset] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [openFilters, setOpenFilters] = useState(true);
  const [sessionType, setSessionType] = useState("");
  const [courseName, setCourseName] = useState("");

  const config = useAuthConfig();

  const getCourseData = useCallback(async () => {
    try {
      let res = await axios.get(`${url}/allcourse`, config);
      setCourseData(res.data.courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [config]);

  useEffect(() => {
    getCourseData();
  }, [getCourseData]);

  const computedRows = useMemo(() => {
    return (courseData || []).map((c) => ({
      ...c,
      computedCreatedAt: c.createdAt || "",
    }));
  }, [courseData]);

  const filterRows = useCallback((rows) => {
    return rows.filter((course) => {
      if (courseName?.trim() && !includesText(course.courseName, courseName)) {
        return false;
      }

      if (sessionType && course.courseType !== sessionType) {
        return false;
      }

      return isWithinSelectedDateFilter(
        course.computedCreatedAt,
        datePreset,
        dateRange
      );
    });
  }, [courseName, datePreset, dateRange, sessionType]);

  const resetFilters = useCallback(() => {
    setCourseName("");
    setDatePreset("");
    setSessionType("");
    setDateRange({ from: null, to: null });
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
        onApply={applyFilters}
        onReset={resetTable}
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
