import React from "react";
import { Box, Button } from "@mui/material";
import { PersonAdd, FileUpload, FileDownload } from "@mui/icons-material";
import axios from "axios";


const ActionBtns = ({ setShowAdd,courseData, config, setStudentData, urlBase ,showAdd  }) => {
  return (
     <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 1,
        justifyContent: { xs: "flex-end", },
        alignItems: "center",
      }}
    >
      {/* Add Task Button */}
      <Button
        variant="contained"
        startIcon={<PersonAdd />}
        onClick={() => setShowAdd(true)}
        sx={{
          backgroundColor: "#1f3fbf",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          px: 2.5,
          py: 1,
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#1b50c2",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-1px)",
          },
        }}
      >
        Add Task
      </Button>

      {/* Bulk Upload ?? */}


   {/* Add TaskAdd modal */}
      {/* {showAdd && (
        <ModalAddAdmission
          show={showAdd}
          setShow={setShowAdd}
          courseData={courseData}
          setStudentData={setStudentData}
        />
      )} */}
    </Box>
   
  );
};

export default ActionBtns;