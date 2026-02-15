import React, { useState } from "react";
import { Box } from "@mui/material";
import BatchActionButtons from "./BatchActionButtons";
import BatchFilter from "./Filter/BatchFilter";
import ModalAddBatch from "../CreateBatch/ModalAddBatch";

const BatchHeader = ({
  // Filter props
  openFilters,
  setOpenFilters,
  onApply,
  onReset,
  batchNumber,
  setBatchNumber,
  courseName,
  setCourseName,
  location,
  setLocation,
  createdBy,
  setCreatedBy,
  status,
  setStatus,
  sessionType,
  setSessionType,
  sessionDay,
  setSessionDay,
  // Data props
  batchData,
  courseData,
  setBatchData,
}) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
         {/* Action Button (fixed width) */}
          <BatchActionButtons setShowAdd={setShowAdd} />
        {/* Filter */}
          <BatchFilter
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            onApply={onApply}
            onReset={onReset}
            batchNumber={batchNumber}
            setBatchNumber={setBatchNumber}
            courseName={courseName}
            setCourseName={setCourseName}
            location={location}
            setLocation={setLocation}
            createdBy={createdBy}
            setCreatedBy={setCreatedBy}
            status={status}
            setStatus={setStatus}
            sessionType={sessionType}
            setSessionType={setSessionType}
            sessionDay={sessionDay}
            setSessionDay={setSessionDay}
            batchData={batchData}
            courseData={courseData}
          />
        {/* </Box>        */}
      

      {/* Add Batch Modal */}
      {showAdd && (
        <ModalAddBatch
          show={showAdd}
          setShow={setShowAdd}
          setBatchData={setBatchData}
        />
      )}
    </Box>
  );
};

export default BatchHeader;