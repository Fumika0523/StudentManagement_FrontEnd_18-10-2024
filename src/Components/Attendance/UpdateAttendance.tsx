import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import type {
  SelectChangeEvent,
} from "@mui/material";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import {
  FaUserClock,
} from "react-icons/fa";

import {
  url,
} from "../utils/constant";

import type {
  Batch,
} from "../../types/batch";

import type {
  Admission,
} from "../../types/admission";

import type {
  Student,
} from "../../types/student";


// ========================================
// ATTENDANCE STATUS
// ========================================

type AttendanceStatus =
  | ""
  | "Present"
  | "Absent";


// ========================================
// API RESPONSE TYPES
// ========================================

interface BatchListResponse {
  batchData: Batch[];
}


interface AdmissionListResponse {
  admissionData: Admission[];
}


interface StudentListResponse {
  studentData: Student[];
}


// ========================================
// SAVE ATTENDANCE PAYLOAD
// ========================================

interface AttendanceStudentPayload {
  studentId: string;

  studentName: string;

  status:
    Exclude<
      AttendanceStatus,
      ""
    >;
}


interface AttendancePayload {
  batchNumber: string;

  attendanceDate: string;

  students:
    AttendanceStudentPayload[];

  recordedBy:
    string | null;
}


// ========================================
// COMPONENT
// ========================================

export const UpdateAttendance = () => {
  // ========================================
  // API DATA
  // ========================================

  const [
    batchData,
    setBatchData,
  ] =
    useState<Batch[]>(
      []
    );


  const [
    admissionData,
    setAdmissionData,
  ] =
    useState<Admission[]>(
      []
    );


  const [
    studentData,
    setStudentData,
  ] =
    useState<Student[]>(
      []
    );


  // ========================================
  // ATTENDANCE FORM STATE
  // ========================================

  const [
    selectedBatch,
    setSelectedBatch,
  ] =
    useState<string>(
      ""
    );


  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      false
    );


  const [
    attendanceDate,
    setAttendanceDate,
  ] =
    useState<string>(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  const [
    attendanceStatus,
    setAttendanceStatus,
  ] =
    useState<AttendanceStatus>(
      ""
    );


  // ========================================
  // EXPANDED STUDENT LIST
  // ========================================

  const [
    showStudentList,
    setShowStudentList,
  ] =
    useState<boolean>(
      false
    );


  /*
   * Students belonging to the currently
   * selected Batch.
   */
  const [
    students,
    setStudents,
  ] =
    useState<Student[]>(
      []
    );


  /*
   * Stores Student MongoDB _id values which are
   * currently checked in the Attendance table.
   */
  const [
    selectedStudentIds,
    setSelectedStudentIds,
  ] =
    useState<string[]>(
      []
    );


  // ========================================
  // AUTH
  // ========================================

  const token =
    sessionStorage.getItem(
      "token"
    );


  const email =
    sessionStorage.getItem(
      "email"
    );


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
  // FETCH BATCHES
  // ========================================

  const getBatchData =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(
            true
          );


          const response =
            await axios.get<BatchListResponse>(
              `${url}/allbatch`,
              config
            );


          /*
           * Attendance can currently only be
           * entered for active/in-progress batches.
           */
          const inProgressBatches =
            response.data.batchData.filter(
              (
                batch
              ) =>
                batch.status ===
                "In Progress"
            );


          setBatchData(
            inProgressBatches
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load batch data:",
            error
          );


          toast.error(
            "Failed to load batch data"
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // FETCH ADMISSIONS
  // ========================================

  const getAdmissionData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<AdmissionListResponse>(
              `${url}/alladmission`,
              config
            );


          setAdmissionData(
            response.data.admissionData
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load admission data:",
            error
          );


          toast.error(
            "Failed to load admission data"
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // FETCH STUDENTS
  // ========================================

  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<StudentListResponse>(
              `${url}/all-student`,
              config
            );


          setStudentData(
            response.data.studentData
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load student data:",
            error
          );


          toast.error(
            "Failed to load student data"
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // INITIAL DATA LOAD
  // ========================================

  useEffect(() => {
    void getBatchData();

    void getAdmissionData();

    void getStudentData();
  }, [
    getBatchData,
    getAdmissionData,
    getStudentData,
  ]);


  // ========================================
  // RESET LIST WHEN FORM CHANGES
  // ========================================

  useEffect(() => {
    /*
     * If Batch, date or default status changes,
     * close the existing Student list so stale
     * selections cannot accidentally be saved.
     */
    setShowStudentList(
      false
    );

    setStudents(
      []
    );

    setSelectedStudentIds(
      []
    );
  }, [
    selectedBatch,
    attendanceDate,
    attendanceStatus,
  ]);


  // ========================================
  // FORM CHANGE HANDLERS
  // ========================================

  const handleBatchChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    setSelectedBatch(
      event.target.value
    );
  };


  const handleStatusChange = (
    event:
      SelectChangeEvent<AttendanceStatus>
  ): void => {
    setAttendanceStatus(
      event.target
        .value as AttendanceStatus
    );
  };


  const handleDateChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    setAttendanceDate(
      event.target.value
    );
  };


  // ========================================
  // SHOW STUDENT LIST
  // ========================================

  const handleSubmitClick =
    (): void => {
      if (
        !selectedBatch
      ) {
        toast.warning(
          "Please select a batch"
        );

        return;
      }


      /*
       * Prevent saving an empty status.
       *
       * The original JavaScript allowed this,
       * which could create an invalid Attendance
       * payload.
       */
      if (
        !attendanceStatus
      ) {
        toast.warning(
          "Please select Present or Absent"
        );

        return;
      }


      setLoading(
        true
      );


      try {
        /*
         * Admissions determine which Students
         * belong to the selected Batch.
         */
        const studentsInBatchNames =
          admissionData
            .filter(
              (
                admission
              ) =>
                admission.batchNumber ===
                selectedBatch
            )
            .map(
              (
                admission
              ) =>
                admission.studentName
            );


        const batchStudents =
          studentData.filter(
            (
              student
            ) =>
              student.studentName
                ? studentsInBatchNames.includes(
                    student.studentName
                  )
                : false
          );


        if (
          batchStudents.length ===
          0
        ) {
          toast.info(
            "No students found in this batch."
          );


          setStudents(
            []
          );


          setShowStudentList(
            false
          );


          return;
        }


        setStudents(
          batchStudents
        );


        /*
         * If the global status is Present,
         * check everyone by default.
         *
         * If the global status is Absent,
         * leave everyone unchecked.
         */
        if (
          attendanceStatus ===
          "Present"
        ) {
          setSelectedStudentIds(
            batchStudents.map(
              (
                student
              ) =>
                student._id
            )
          );
        } else {
          setSelectedStudentIds(
            []
          );
        }


        setShowStudentList(
          true
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Student filtering error:",
          error
        );


        toast.error(
          "Error on fetching student data"
        );
      } finally {
        setLoading(
          false
        );
      }
    };


  // ========================================
  // TOGGLE ONE STUDENT
  // ========================================

  const handleToggleStudent = (
    id: string
  ): void => {
    setSelectedStudentIds(
      (
        previous
      ) =>
        previous.includes(
          id
        )
          ? previous.filter(
              (
                studentId
              ) =>
                studentId !==
                id
            )
          : [
              ...previous,
              id,
            ]
    );
  };


  // ========================================
  // SELECT / DESELECT ALL
  // ========================================

  const handleSelectAll = (
    checked: boolean
  ): void => {
    if (
      checked
    ) {
      setSelectedStudentIds(
        students.map(
          (
            student
          ) =>
            student._id
        )
      );

      return;
    }


    setSelectedStudentIds(
      []
    );
  };


  // ========================================
  // CANCEL / RESET
  // ========================================

  const handleCancel =
    (): void => {
      setShowStudentList(
        false
      );


      setStudents(
        []
      );


      setSelectedStudentIds(
        []
      );


      setSelectedBatch(
        ""
      );


      setAttendanceDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );


      /*
       * Preserve the existing component's
       * reset behaviour.
       */
      setAttendanceStatus(
        "Present"
      );
    };


  // ========================================
  // SAVE ATTENDANCE
  // ========================================

  const handleSaveAttendance =
    async (): Promise<void> => {
      if (
        !students.length
      ) {
        toast.warning(
          "No students to save."
        );

        return;
      }


      if (
        !attendanceStatus
      ) {
        toast.warning(
          "Please select Present or Absent"
        );

        return;
      }


      try {
        /*
         * If the selected default is Present,
         * unchecked Students become Absent.
         *
         * If the selected default is Absent,
         * unchecked Students become Present.
         */
        const oppositeStatus:
          Exclude<
            AttendanceStatus,
            ""
          > =
          attendanceStatus ===
          "Present"
            ? "Absent"
            : "Present";


        const studentsPayload:
          AttendanceStudentPayload[] =
          students.map(
            (
              student
            ) => ({
              studentId:
                student._id,

              studentName:
                student.studentName ??
                `${student.firstName} ${student.lastName}`.trim(),

              /*
               * Important bug fix:
               *
               * The old JavaScript checked
               * `selectedStudentIds ? ...`
               *
               * Arrays are always truthy, so EVERY
               * Student received attendanceStatus.
               *
               * We must check whether this specific
               * Student ID is selected.
               */
              status:
                selectedStudentIds.includes(
                  student._id
                )
                  ? attendanceStatus
                  : oppositeStatus,
            })
          );


        const payload:
          AttendancePayload = {
          batchNumber:
            selectedBatch,

          attendanceDate,

          students:
            studentsPayload,

          recordedBy:
            email,
        };


        await axios.post(
          `${url}/update-attendance`,
          payload,
          config
        );


        toast.success(
          "Attendance recorded successfully!"
        );


        handleCancel();
      } catch (
        error: unknown
      ) {
        console.error(
          "Error saving attendance:",
          error
        );


        /*
         * Preserve the current user-facing
         * backend error message.
         */
        toast.error(
          "Already added the attendance record"
        );
      }
    };


  return (
    <Box
      sx={{
        p:
          4,

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "flex-start",

        minHeight:
          "calc(100vh - 130px)",

        backgroundColor:
          "#f8f9fc",
      }}
    >
      <Paper
        elevation={
          3
        }
        sx={{
          p:
            3,

          borderRadius:
            3,

          width:
            "100%",

          maxWidth:
            "1000px",
        }}
      >
        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <Stack
          direction="row"
          spacing={
            2
          }
          alignItems="center"
          sx={{
            mb:
              3,

            pb:
              3,

            borderBottom:
              "2px solid #e0e0e0",
          }}
        >
          <Box
            sx={{
              width:
                48,

              height:
                48,

              borderRadius:
                2,

              background:
                "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",
            }}
          >
            <FaUserClock
              size={
                24
              }
              color="#fff"
            />
          </Box>


          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight:
                  700,

                color:
                  "#2c3e50",
              }}
            >
              Attendance Entry
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
            >
              Mark student attendance for the selected batch
            </Typography>
          </Box>
        </Stack>


        {/* ========================================
            ATTENDANCE FORM
        ======================================== */}

        <Grid
          container
          spacing={
            4
          }
          sx={{
            justifyContent:
              "end",

            alignItems:
              "center",
          }}
        >
          {/* Batch */}

          <Grid
            size={{
              xs:
                12,

              sm:
                6,

              md:
                4,
            }}
          >
            <FormControl
              fullWidth
              size="small"
            >
              <InputLabel>
                Select Batch
              </InputLabel>


              <Select<string>
                value={
                  selectedBatch
                }
                onChange={
                  handleBatchChange
                }
                label="Select Batch"
                sx={{
                  borderRadius:
                    2,

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "#e0e0e0",
                    },
                }}
              >
                {batchData.map(
                  (
                    batch
                  ) => (
                    <MenuItem
                      key={
                        batch._id
                      }
                      value={
                        batch.batchNumber
                      }
                    >
                      {batch.batchNumber}
                    </MenuItem>
                  )
                )}


                {batchData.length ===
                  0 && (
                  <MenuItem
                    disabled
                  >
                    No active batches found
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>


          {/* Date */}

          <Grid
            size={{
              xs:
                12,

              sm:
                6,

              md:
                4,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={
                attendanceDate
              }
              onChange={
                handleDateChange
              }
              slotProps={{
                inputLabel: {
                  shrink:
                    true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      2,

                    "& fieldset":
                      {
                        borderColor:
                          "#e0e0e0",
                      },
                  },
              }}
            />
          </Grid>


          {/* Attendance Status */}

          <Grid
            size={{
              xs:
                12,

              sm:
                6,

              md:
                4,
            }}
          >
            <FormControl
              fullWidth
              size="small"
            >
              <InputLabel>
                Mark as
              </InputLabel>


              <Select<AttendanceStatus>
                value={
                  attendanceStatus
                }
                onChange={
                  handleStatusChange
                }
                label="Mark as"
                sx={{
                  borderRadius:
                    2,

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "#e0e0e0",
                    },
                }}
              >
                <MenuItem value="Present">
                  Present
                </MenuItem>

                <MenuItem value="Absent">
                  Absent
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>


          {/* Submit */}

          <Grid
            size={{
              xs:
                12,

              md:
                8,
            }}
          >
            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "flex-end",
              }}
            >
              <Button
                type="button"
                variant="contained"
                onClick={
                  handleSubmitClick
                }
                disabled={
                  loading
                }
                size="medium"
                sx={{
                  py:
                    1.2,

                  px:
                    4,

                  borderRadius:
                    2,

                  backgroundColor:
                    "#4e73df",

                  textTransform:
                    "none",

                  fontSize:
                    "0.95rem",

                  fontWeight:
                    600,

                  boxShadow:
                    "0 2px 6px rgba(78, 115, 223, 0.3)",

                  "&:hover":
                    {
                      backgroundColor:
                        "#224abe",

                      boxShadow:
                        "0 4px 10px rgba(78, 115, 223, 0.4)",
                    },
                }}
              >
                {loading
                  ? "Loading..."
                  : "Submit & Show Student List"}
              </Button>
            </Box>
          </Grid>
        </Grid>


        {/* ========================================
            STUDENT ATTENDANCE LIST
        ======================================== */}

        <Collapse
          in={
            showStudentList
          }
          timeout="auto"
          unmountOnExit
        >
          <Divider
            sx={{
              my:
                4,
            }}
          />


          <Box
            sx={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap:
                2,

              mb:
                3,

              pb:
                2,

              borderBottom:
                "2px solid #e0e0e0",

              flexWrap:
                "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  700,

                color:
                  "#2c3e50",
              }}
            >
              Mark Attendance — Batch{" "}
              {selectedBatch}{" "}
              ({attendanceDate})
            </Typography>


            <Typography
              variant="body2"
              sx={{
                color:
                  "#4e73df",

                fontWeight:
                  600,
              }}
            >
              {selectedStudentIds.length} of{" "}
              {students.length} students selected
            </Typography>
          </Box>


          {/* ========================================
              STUDENT TABLE
          ======================================== */}

          <Box
            sx={{
              overflowX:
                "auto",

              border:
                "1px solid #e0e0e0",

              borderRadius:
                2,
            }}
          >
            <Table
              size="small"
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor:
                      "#f8f9fc",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight:
                        700,

                      py:
                        2,
                    }}
                  >
                    Student Name
                  </TableCell>


                  <TableCell
                    align="right"
                    sx={{
                      fontWeight:
                        700,

                      py:
                        2,
                    }}
                  >
                    {attendanceStatus ||
                      "Selected"}


                    <Checkbox
                      sx={{
                        ml:
                          1,

                        color:
                          "#4e73df",

                        "&.Mui-checked":
                          {
                            color:
                              "#4e73df",
                          },
                      }}
                      checked={
                        students.length >
                          0 &&
                        selectedStudentIds.length ===
                          students.length
                      }
                      indeterminate={
                        selectedStudentIds.length >
                          0 &&
                        selectedStudentIds.length <
                          students.length
                      }
                      onChange={(
                        event
                      ) =>
                        handleSelectAll(
                          event.target.checked
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>


              <TableBody>
                {students.map(
                  (
                    student,
                    index
                  ) => {
                    const studentName =
                      student.studentName ??
                      `${student.firstName} ${student.lastName}`.trim();


                    return (
                      <TableRow
                        key={
                          student._id
                        }
                        sx={{
                          backgroundColor:
                            index %
                              2 ===
                            0
                              ? "#fff"
                              : "#fafbfc",

                          "&:hover":
                            {
                              backgroundColor:
                                "#f0f2f5",
                            },
                        }}
                      >
                        <TableCell
                          sx={{
                            py:
                              2,
                          }}
                        >
                          {studentName.toUpperCase()}
                        </TableCell>


                        <TableCell
                          align="right"
                        >
                          <Checkbox
                            checked={
                              selectedStudentIds.includes(
                                student._id
                              )
                            }
                            onChange={() =>
                              handleToggleStudent(
                                student._id
                              )
                            }
                            sx={{
                              color:
                                "#4e73df",

                              "&.Mui-checked":
                                {
                                  color:
                                    "#4e73df",
                                },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </Box>


          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

          <Box
            sx={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              gap:
                2,

              mt:
                3,

              pt:
                3,

              borderTop:
                "2px solid #e0e0e0",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={
                handleCancel
              }
              sx={{
                borderRadius:
                  2,

                textTransform:
                  "none",

                fontWeight:
                  600,

                borderColor:
                  "#4e73df",

                color:
                  "#4e73df",

                px:
                  4,

                py:
                  1.5,

                "&:hover":
                  {
                    borderColor:
                      "#224abe",

                    backgroundColor:
                      "rgba(78, 115, 223, 0.05)",
                  },
              }}
            >
              Cancel
            </Button>


            <Button
              type="button"
              variant="contained"
              onClick={() =>
                void handleSaveAttendance()
              }
              sx={{
                borderRadius:
                  2,

                textTransform:
                  "none",

                fontWeight:
                  600,

                backgroundColor:
                  "#4e73df",

                px:
                  4,

                py:
                  1.5,

                boxShadow:
                  "0 2px 6px rgba(78, 115, 223, 0.3)",

                "&:hover":
                  {
                    backgroundColor:
                      "#224abe",

                    boxShadow:
                      "0 4px 10px rgba(78, 115, 223, 0.4)",
                  },
              }}
            >
              Save Attendance
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};