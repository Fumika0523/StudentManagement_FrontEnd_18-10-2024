import React from "react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import FilterFields from "./FilterFileds";

const StudentFilter = ({
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

  studentName,
  setStudentName,
  emailSearch,
  setEmailSearch,
  genderFilter,
  setGenderFilter,
  dateFilter,
  setDateFilter,
  sessionType,
  setSessionType,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        size="small"
        onClick={() => setOpenFilters((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderRadius: openFilters ? "10px 10px 0 0" : "10px",
          backgroundColor: "#2c51c1",
          textTransform: "none",
          fontWeight: 700,
          px: 2,
          py: 1,
        }}
      >
        <span>Filter</span>

        {/* slower icon rotation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            transition: "transform 900ms cubic-bezier(.2,.8,.2,1)",
            transform: openFilters ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          {openFilters ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </Box>
      </Button>

      {/* ✅ slower + smoother open AND close */}
      <Collapse
        in={openFilters}
        collapsedSize={0}
        timeout={950} // 👈 make height animation much slower
        easing={{
          enter: "cubic-bezier(.15,.9,.2,1)",
          exit: "cubic-bezier(.35,0,.2,1)",
        }}
        mountOnEnter
      >
        {/* content animation */}
        <Box
          sx={{
            transition: "opacity 850ms ease, transform 850ms ease",
            opacity: openFilters ? 1 : 0,
            transform: openFilters ? "translateY(0px)" : "translateY(-14px)",
            pointerEvents: openFilters ? "auto" : "none",
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              p: 2,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              boxShadow: 3,
              border: "1px solid rgba(0,0,0,0.06)",
              borderTop: "none",
            }}
          >
            <FilterFields
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
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              sessionType={sessionType}
              setSessionType={setSessionType}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                width: "100%",
                // mt: 1,
                // pt: 1,
                // borderTop: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={onReset}
                sx={{
                  borderColor: "#2c51c1",
                  color: "#2c51c1",
                  fontWeight: 700,
                }}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={onApply}
                sx={{ backgroundColor: "#2c51c1", fontWeight: 700 }}
              >
                Apply
              </Button>
            </Box>
          </Paper>
        </Box>
      </Collapse>
    </Box>
  );
};

export default StudentFilter;
