import React from "react";
import { Box, Button } from "@mui/material";
import { PersonAdd, FileUpload, FileDownload } from "@mui/icons-material";
import axios from "axios";
import BulkUploadBtns from "../../Bulkload/BulkUploadBtns";
import ModalAddAdmission from '../Modal/CreateAdmission/ModalAddAdmission'
import { RiFileEditFill } from "react-icons/ri";

const ActionBtns = ({
  setShowAdd,
  showAdd,
  config,
  urlBase,
  studentData,
  setStudentData,
  courseData,
  setCourseData,
  setAdmissionData,
  admissionData,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        startIcon={<RiFileEditFill />}
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
        Add Admission
      </Button>

      <BulkUploadBtns
        templateUrl="http://localhost:8001/api/excel/admission-template"
        importUrl="http://localhost:8001/api/excel/admission-import"
        modalTitle="Bulk Upload Admissions"
        axiosConfig={config}
        onRefresh={async () => {
          const refreshed = await axios.get(`${urlBase}/alladmission`, config);
          setAdmissionData(refreshed.data.admissionData);
        }}
      />

      {showAdd && (
        <ModalAddAdmission
          show={showAdd}
          setShow={setShowAdd}
          courseData={courseData}
          setStudentData={setStudentData}
          setAdmissionData={setAdmissionData}
          admissionData={admissionData}
          studentData={studentData}
        />
      )}
    </Box>
  );
};

export default ActionBtns;