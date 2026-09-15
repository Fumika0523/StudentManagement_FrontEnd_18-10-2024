import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import axios from "axios";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import {
  toast,
} from "react-toastify";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
  url,
} from "../../utils/constant";

import usePagination from "../../utils/usePagination";

import ModalAssignTask from "./ModalAssignTask";

import type {
  AssignTaskPayload,
  TaskTableRow,
} from "./ModalAssignTask";

import type {
  TaskRecord,
} from "../Header/ActionButton/CreateTask/ModalAddTask";

import type {
  Batch,
} from "../../../types/batch";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * These interfaces describe only the parts
 * of the backend responses used by this
 * component.
 */

interface BatchListResponse {
  batchData?: Batch[];
}


interface TaskListResponse {
  taskData?: TaskRecord[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface CustomisedTaskTablesProps {
  /*
   * taskData comes from ViewTask.
   *
   * We reuse TaskRecord rather than creating
   * another duplicate task interface.
   */
  taskData: TaskRecord[];

  /*
   * Used after assigning a task so the parent
   * task list can be refreshed.
   */
  setTaskData:
    Dispatch<
      SetStateAction<TaskRecord[]>
    >;
}


// ========================================
// COMPONENT
// ========================================

export default function CustomisedTaskTables({
  taskData,
  setTaskData,
}: CustomisedTaskTablesProps) {
  // ========================================
  // STATE
  // ========================================

  const [
    batchData,
    setBatchData,
  ] = useState<Batch[]>(
    []
  );


  const [
    showAssign,
    setShowAssign,
  ] = useState<boolean>(
    false
  );


  /*
   * null means no task has currently been
   * selected for assignment.
   */
  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<string | null>(
    null
  );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * Type the Axios configuration explicitly.
   *
   * useMemo keeps the object stable instead of
   * creating a new config object on every render.
   */
  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [
        token,
      ]
    );


  // ========================================
  // FETCH BATCH DATA
  // ========================================

  useEffect(() => {
    const getBatchData =
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<BatchListResponse>(
              `${url}/allbatch`,
              config
            );


          setBatchData(
            response.data.batchData ??
              []
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript treats caught errors as
           * unknown, so narrow Axios errors before
           * accessing response/message properties.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Error fetching batches:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching batches:",
            error
          );
        }
      };


    void getBatchData();
  }, [
    config,
  ]);


  // ========================================
  // ASSIGN TASK
  // ========================================

  const handleAssignTask =
    async ({
      taskDetailId,
      batchId,
      batchNumber,
    }: AssignTaskPayload): Promise<void> => {
      try {
        /*
         * The backend update endpoint currently
         * needs only batchId and batchNumber.
         */
        const response =
          await axios.put(
            `${url}/update-task/${taskDetailId}`,
            {
              batchId,
              batchNumber,
            },
            config
          );


        console.log(
          "Updated task:",
          response.data
        );


        if (
          response.status ===
          200
        ) {
          /*
           * Refresh the complete task list after
           * the assignment succeeds.
           */
          const refreshResponse =
            await axios.get<TaskListResponse>(
              `${url}/alltask`,
              config
            );


          setTaskData(
            refreshResponse.data.taskData ??
              []
          );


          toast.success(
            `Task assigned successfully to Batch ${batchNumber}`
          );
        }
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Error assigning task:",
            error.response?.data ??
              error.message
          );

          return;
        }


        console.error(
          "Error assigning task:",
          error
        );
      }
    };


  // ========================================
  // BUILD TABLE ROWS
  // ========================================

  /*
   * One TaskRecord can contain multiple
   * taskDetail entries.
   *
   * flatMap converts those nested task details
   * into the flat row structure displayed by
   * the MUI table.
   */
  const rows =
    useMemo<TaskTableRow[]>(
      () =>
        taskData.flatMap(
          (
            task
          ) =>
            (
              task.taskDetail ??
              []
            ).map(
              (
                detail
              ): TaskTableRow => ({
                courseName:
                  task.taskCourseName ??
                  task.courseName ??
                  "-",

                taskId:
                  detail._id ??
                  "-",

                taskQuestion:
                  detail.taskQuestion ??
                  "-",

                batchNumbers:
                  Array.isArray(
                    detail.batchNumber
                  )
                    ? detail.batchNumber
                    : [],

                allocatedDay:
                  detail.allocatedDay ??
                  "-",
              })
            )
        ),
      [
        taskData,
      ]
    );


  // ========================================
  // OPEN ASSIGN MODAL
  // ========================================

  const handleAssignClick = (
    row: TaskTableRow
  ): void => {
    setSelectedTaskId(
      row.taskId
    );

    setShowAssign(
      true
    );
  };


  // ========================================
  // SELECTED ROW
  // ========================================

  /*
   * Find the full row corresponding to the
   * selected task ID.
   *
   * ModalAssignTask accepts null when no row
   * is selected.
   */
  const selectedRow:
    TaskTableRow | null =
    rows.find(
      (
        row
      ) =>
        row.taskId ===
        selectedTaskId
    ) ??
    null;


  // ========================================
  // CLOSE ASSIGN MODAL
  // ========================================

  const closeAssignModal =
    (): void => {
      setShowAssign(
        false
      );

      setSelectedTaskId(
        null
      );
    };


  // ========================================
  // PAGINATION
  // ========================================

  /*
   * usePagination is generic.
   *
   * Because rows is typed as TaskTableRow[],
   * TypeScript automatically preserves that
   * row type inside paginatedData.
   */
  const {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination(
    rows,
    {
      initialRowsPerPage:
        10,
    }
  );


  /*
   * Return to the first page whenever the
   * number of displayed task rows changes.
   */
  useEffect(() => {
    resetPage();
  }, [
    rows.length,
    resetPage,
  ]);


  // ========================================
  // UI
  // ========================================

  return (
    <Box
      sx={{
        width:
          "100%",
      }}
    >
      {rows.length >
      0 ? (
        <Paper
          sx={{
            ...tableContainerStyles,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    #
                  </StyledTableCell>

                  <StyledTableCell>
                    Allocate Day
                  </StyledTableCell>

                  <StyledTableCell>
                    Course Name
                  </StyledTableCell>

                  <StyledTableCell>
                    Task ID
                  </StyledTableCell>

                  <StyledTableCell>
                    Task Question
                  </StyledTableCell>

                  <StyledTableCell>
                    Batch Number
                  </StyledTableCell>

                  <StyledTableCell
                    align="center"
                  >
                    Assign
                  </StyledTableCell>
                </TableRow>
              </TableHead>


              <TableBody>
                {paginatedData.map(
                  (
                    row,
                    index
                  ) => {
                    const rowNumber =
                      page *
                        rowsPerPage +
                      index +
                      1;


                    return (
                      <StyledTableRow
                        key={
                          row.taskId ||
                          `${rowNumber}-${index}`
                        }
                      >
                        <StyledTableCell>
                          {rowNumber}
                        </StyledTableCell>


                        <StyledTableCell>
                          {row.allocatedDay ===
                          "-"
                            ? "-"
                            : `Day ${row.allocatedDay}`}
                        </StyledTableCell>


                        <StyledTableCell>
                          {
                            row.courseName
                          }
                        </StyledTableCell>


                        <StyledTableCell>
                          {
                            row.taskId
                          }
                        </StyledTableCell>


                        <StyledTableCell>
                          {
                            row.taskQuestion
                          }
                        </StyledTableCell>


                        <StyledTableCell>
                          {row
                            .batchNumbers
                            .length >
                          0
                            ? row.batchNumbers.join(
                                ", "
                              )
                            : "-"}
                        </StyledTableCell>


                        <StyledTableCell
                          align="center"
                        >
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleAssignClick(
                                row
                              )
                            }
                            sx={{
                              textTransform:
                                "none",

                              borderRadius:
                                2,

                              px:
                                2,
                            }}
                          >
                            Assign
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>


          {/* ========================================
              PAGINATION
          ======================================== */}

          <TablePagination
            component="div"
            count={
              totalCount
            }
            page={
              page
            }
            onPageChange={
              handleChangePage
            }
            rowsPerPage={
              rowsPerPage
            }
            onRowsPerPageChange={
              handleChangeRowsPerPage
            }
            rowsPerPageOptions={[
              5,
              10,
              25,
              50,
            ]}
            sx={{
              borderTop:
                "1px solid rgba(0,0,0,0.08)",

              "& .MuiTablePagination-toolbar":
                {
                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  flexWrap:
                    "wrap",

                  gap:
                    0,

                  py:
                    0,

                  px:
                    1,

                  minHeight:
                    "unset",
                },

              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  m:
                    0,

                  whiteSpace:
                    "nowrap",
                },

              "& .MuiTablePagination-actions":
                {
                  m:
                    0,

                  display:
                    "flex",

                  alignItems:
                    "center",
                },

              "& .MuiInputBase-root":
                {
                  mt:
                    0,
                },
            }}
          />
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            mt:
              2,
          }}
        >
          No tasks found
        </Alert>
      )}


      {/* ========================================
          ASSIGN TASK MODAL
      ======================================== */}

      <ModalAssignTask
        show={
          showAssign
        }
        onClose={
          closeAssignModal
        }
        task={
          selectedRow
        }
        batchData={
          batchData
        }
        onConfirm={
          handleAssignTask
        }
      />
    </Box>
  );
}