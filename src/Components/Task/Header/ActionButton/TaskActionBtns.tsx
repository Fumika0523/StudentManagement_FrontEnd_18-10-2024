import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  Box,
  Button,
} from "@mui/material";

import {
  RiTaskFill,
} from "react-icons/ri";

import BulkUploadBtns from "../../../Bulkload/BulkUploadBtns";

import {
  url,
} from "../../../utils/constant";

import type {
  TaskRecord,
} from "./CreateTask/ModalAddTask";


// ========================================
// TASK LIST RESPONSE
// ========================================

interface TaskListResponse {
  taskData?: TaskRecord[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface TaskActionBtnsProps {
  /*
   * Controls the Add Task modal in the
   * parent component.
   */
  setShowAdd:
    Dispatch<
      SetStateAction<boolean>
    >;

  /*
   * Authentication configuration already
   * created by the parent with useAuthConfig().
   */
  config:
    AxiosRequestConfig;

  /*
   * Updates the task list after a successful
   * bulk upload.
   */
  setTaskData:
    Dispatch<
      SetStateAction<TaskRecord[]>
    >;
}


// ========================================
// COMPONENT
// ========================================

const TaskActionBtns = ({
  setShowAdd,
  config,
  setTaskData,
}: TaskActionBtnsProps) => {
  // ========================================
  // REFRESH TASK DATA
  // ========================================

  const refreshTaskData =
    async (): Promise<void> => {
      try {
        const response =
          await axios.get<TaskListResponse>(
            `${url}/alltask`,
            config
          );


        setTaskData(
          response.data.taskData ??
            []
        );
      } catch (
        error: unknown
      ) {
        /*
         * Narrow Axios errors instead of
         * reading properties from unknown.
         */
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Failed to refresh tasks:",
            error.response?.data ??
              error.message
          );

          return;
        }


        console.error(
          "Failed to refresh tasks:",
          error
        );
      }
    };


  return (
    <Box
      sx={{
        display:
          "flex",

        flexWrap:
          "wrap",

        gap:
          1.5,

        mb:
          1,

        justifyContent: {
          xs:
            "flex-end",
        },

        alignItems:
          "center",
      }}
    >
      {/* ========================================
          ADD TASK
      ======================================== */}

      <Button
        variant="contained"
        startIcon={
          <RiTaskFill />
        }
        onClick={() =>
          setShowAdd(
            true
          )
        }
        sx={{
          backgroundColor:
            "#1f3fbf",

          textTransform:
            "none",

          fontWeight:
            600,

          fontSize:
            "14px",

          px:
            2.5,

          py:
            1,

          borderRadius:
            "8px",

          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1)",

          transition:
            "all 0.2s ease",

          "&:hover": {
            backgroundColor:
              "#1b50c2",

            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)",

            transform:
              "translateY(-1px)",
          },
        }}
      >
        Add Task
      </Button>


      {/* ========================================
          BULK UPLOAD
      ======================================== */}

      <BulkUploadBtns
        templateUrl="http://localhost:8001/api/excel/task-template"
        importUrl="http://localhost:8001/api/excel/task-import"
        modalTitle="Bulk Upload Tasks"
        axiosConfig={
          config
        }
        onRefresh={
          refreshTaskData
        }
      />
    </Box>
  );
};

export default TaskActionBtns;