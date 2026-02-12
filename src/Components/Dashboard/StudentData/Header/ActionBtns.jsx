// Child component: ActionBtns.jsx
import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

import BulkUploadBtns from "../../Bulkload/BulkUploadBtns";

const ActionBtns = ({ setShowAdd, config, setStudentData, urlBase }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        my: 1,
        justifyContent: { xs: "flex-start", md: "flex-end" },
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowAdd(true)}
        sx={{ borderRadius: 2, backgroundColor: " #2c51c1" }}
      >
        Add Student
      </Button>

      <BulkUploadBtns
        templateUrl="http://localhost:8001/api/excel/student-template"
        importUrl="http://localhost:8001/api/excel/student-import"
        modalTitle="Bulk Upload Students"
        axiosConfig={config}
        onRefresh={async () => {
          const refreshed = await axios.get(`${urlBase}/allstudent`, config);
          setStudentData(refreshed.data.studentData);
        }}
      />
    </Box>
  );
};

export default ActionBtns;
