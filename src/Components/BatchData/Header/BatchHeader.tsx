import { useState } from "react";
import type {
  Dispatch,
  SetStateAction,
} from "react";

import { Box } from "@mui/material";

import BatchActionButtons from "./BatchActionButtons";
import BatchFilter from "./Filter/BatchFilter";
import ModalAddBatch from "../CreateBatch/ModalAddBatch";

// TypeScript:
// Reuse our shared Batch and Course types instead of
// redefining their data structures inside this component.
import type { Batch } from "../../../types/batch";
import type { Course } from "../../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface BatchHeaderProps {
  // Controls whether the filter panel is visible.
  openFilters: boolean;

  // TypeScript:
  // This setter comes directly from useState<boolean>(),
  // so we use React's Dispatch + SetStateAction types.
  setOpenFilters: Dispatch<
    SetStateAction<boolean>
  >;

  // Functions received from useFilteredTable.
  onApply: () => void;
  onReset: () => void;

  // ========================================
  // FILTER VALUES + SETTERS
  // ========================================

  batchNumber: string;
  setBatchNumber: Dispatch<
    SetStateAction<string>
  >;

  courseName: string;
  setCourseName: Dispatch<
    SetStateAction<string>
  >;

  location: string;
  setLocation: Dispatch<
    SetStateAction<string>
  >;

  createdBy: string;
  setCreatedBy: Dispatch<
    SetStateAction<string>
  >;

  status: string;
  setStatus: Dispatch<
    SetStateAction<string>
  >;

  sessionType: string;
  setSessionType: Dispatch<
    SetStateAction<string>
  >;

  sessionDay: string;
  setSessionDay: Dispatch<
    SetStateAction<string>
  >;

  // ========================================
  // DATA PROPS
  // ========================================

  batchData: Batch[];
  courseData: Course[];

  /*
   * TypeScript:
   * ModalAddBatch updates the Batch array after
   * successfully creating a new batch.
   */
  setBatchData: Dispatch<
    SetStateAction<Batch[]>
  >;
}


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
}: BatchHeaderProps) => {
  /*
   * TypeScript:
   * showAdd is always true or false, so we explicitly
   * define the state as boolean.
   */
  const [showAdd, setShowAdd] =
    useState<boolean>(false);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Action Button */}
      <BatchActionButtons
        setShowAdd={setShowAdd}
      />

      {/* Batch Filters */}
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