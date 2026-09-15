import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
} from "@mui/material";

import {
  FaEdit,
  FaKey,
} from "react-icons/fa";

import {
  MdDelete,
} from "react-icons/md";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import EditStudentData from "./Modals/EditStudent/EditStudentData";
import ModalShowPassword from "./Modals/ModalShowPassword";
import ModalDeleteStudent from "./Modals/ModalDeleteStudent";

import usePagination from "../utils/usePagination";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
  url,
} from "../utils/constant";

import type {
  Student,
} from "../../types/student";

import type {
  Course,
} from "../../types/course";

import type {
  Admission,
} from "../../types/admission";

import type {
  Batch,
} from "../../types/batch";


// ========================================
// LOCAL STUDENT TABLE TYPE
// ========================================

/*
 * The shared Student interface intentionally does
 * not expose password.
 *
 * However, this legacy table still reads
 * student.password for ModalShowPassword.
 *
 * Keep that compatibility local rather than adding
 * password to every Student usage in the project.
 */
type StudentTableRow =
  Student & {
    password?: string;
  };


// ========================================
// COMPONENT PROPS
// ========================================

interface CustomizedTablesProps {
  studentData:
    StudentTableRow[];

  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;

  admissionData:
    Admission[];

  courseData:
    Course[];

  batchData:
    Batch[];
}


// ========================================
// STUDENT / BATCH LOOKUP TYPE
// ========================================

interface StudentBatchInfo {
  batchNumber?:
    string;

  sessionTime:
    Batch["sessionTime"];

  source:
    string;

  batchStatus:
    Batch["status"];
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface StudentListResponse {
  studentData:
    Student[];
}


interface ApiErrorResponse {
  message?:
    string;
}


// ========================================
// STATUS BADGE PROPS
// ========================================

interface StatusBadgeProps {
  studentStatus?:
    string;

  studentName?:
    string;
}


// ========================================
// DATE FORMATTER
// ========================================

const formatDate = (
  dateString:
    | string
    | null
    | undefined
): string => {
  if (!dateString) {
    return "-";
  }


  const date =
    new Date(
      dateString
    );


  /*
   * TypeScript-safe invalid Date check.
   */
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }


  return date.toLocaleDateString(
    "en-US",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",
    }
  );
};


// ========================================
// DATE + TIME FORMATTER
// ========================================

const formatDateTime = (
  date:
    | string
    | null
    | undefined
): string => {
  if (!date) {
    return "-";
  }


  const parsedDate =
    new Date(
      date
    );


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }


  return parsedDate
    .toLocaleString(
      "en-US",
      {
        year:
          "numeric",

        month:
          "short",

        day:
          "2-digit",

        hour12:
          true,
      }
    )
    .replace(
      "at",
      ""
    );
};


// ========================================
// COMPONENT
// ========================================

const CustomizedTables = ({
  studentData,
  setStudentData,
  admissionData,
  courseData,
  batchData,
}: CustomizedTablesProps) => {
  // ========================================
  // LOOKUP / MODAL STATE
  // ========================================

  /*
   * TypeScript:
   * Object keys are Student names.
   *
   * Example:
   *
   * {
   *   "John Smith": {
   *      batchNumber: "B001",
   *      sessionTime: "Morning",
   *      ...
   *   }
   * }
   */
  const [
    studentBatchMap,
    setStudentBatchMap,
  ] =
    useState<
      Record<
        string,
        StudentBatchInfo
      >
    >({});


  const [
    singleStudent,
    setSingleStudent,
  ] =
    useState<Student | null>(
      null
    );


  const [
    viewPassword,
    setViewPassword,
  ] =
    useState<boolean>(
      false
    );


  const [
    password,
    setPassword,
  ] =
    useState<string | null>(
      null
    );


  const [
    showEdit,
    setShowEdit,
  ] =
    useState<boolean>(
      false
    );


  const [
    showDelete,
    setShowDelete,
  ] =
    useState<boolean>(
      false
    );


  const [
    studentToDelete,
    setStudentToDelete,
  ] =
    useState<Student | null>(
      null
    );


  // ========================================
  // AUTH
  // ========================================

  const role =
    localStorage.getItem(
      "role"
    );


  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * Memoizing the Axios config keeps the same
   * object reference until the token changes.
   */
  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [token]
    );


  // ========================================
  // EDIT STUDENT
  // ========================================

  const handleEditClick = (
    student:
      StudentTableRow
  ): void => {
    setSingleStudent(
      student
    );

    setShowEdit(
      true
    );
  };


  // ========================================
  // OPEN DELETE MODAL
  // ========================================

  const handleDeleteClick = (
    student:
      StudentTableRow
  ): void => {
    if (
      role ===
      "admin"
    ) {
      setStudentToDelete(
        student
      );

      setShowDelete(
        true
      );

      return;
    }


    toast.error(
      "To delete the information, please contact Super-Admin",
      {
        autoClose:
          2000,
      }
    );
  };


  // ========================================
  // CONFIRM DELETE
  // ========================================

  const handleConfirmDelete =
    async (
      id:
        string
    ): Promise<void> => {
      const studentName =
        studentToDelete
          ?.studentName ||
        "Student";


      try {
        await axios.delete(
          `${url}/deletestudent/${id}`,
          config
        );


        /*
         * Refresh the table after deletion.
         */
        const refreshed =
          await axios.get<StudentListResponse>(
            `${url}/all-student`,
            config
          );


        setStudentData(
          refreshed.data.studentData
        );


        toast.success(
          `🗑️ ${studentName} has been deleted successfully!`,
          {
            position:
              "top-right",

            autoClose:
              3000,
          }
        );


        /*
         * Clear the selected Student after
         * deletion so stale data is not retained.
         */
        setStudentToDelete(
          null
        );
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript:
         * catch variables are unknown, so narrow
         * Axios errors before reading response.data.
         */
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          const errorMessage =
            error.response
              ?.data
              ?.message ??
            "Failed to delete student. Please try again.";


          console.error(
            "Error deleting student:",
            error.response?.data ??
              error.message
          );


          toast.error(
            `Delete Failed: ${errorMessage}`,
            {
              position:
                "top-right",

              autoClose:
                4000,
            }
          );

          return;
        }


        console.error(
          "Error deleting student:",
          error
        );


        toast.error(
          "Delete Failed: Failed to delete student. Please try again.",
          {
            position:
              "top-right",

            autoClose:
              4000,
          }
        );
      }
    };


  // ========================================
  // PASSWORD MODAL
  // ========================================

  const handlePasswordClick = (
    studentPassword:
      string | null
  ): void => {
    setPassword(
      studentPassword
    );

    setViewPassword(
      true
    );
  };


  // ========================================
  // BUILD STUDENT -> BATCH MAP
  // ========================================

  useEffect(() => {
    const map:
      Record<
        string,
        StudentBatchInfo
      > = {};


    /*
     * Only active / assigned Admissions should
     * supply current Batch information.
     */
    admissionData
      .filter(
        (
          admission
        ) =>
          admission.status ===
          "Assigned"
      )
      .forEach(
        (
          admission
        ) => {
          const batch =
            batchData.find(
              (
                currentBatch
              ) =>
                currentBatch.batchNumber ===
                admission.batchNumber
            );


          if (batch) {
            map[
              admission.studentName
            ] = {
              batchNumber:
                admission.batchNumber,

              sessionTime:
                batch.sessionTime,

              source:
                admission.admissionSource,

              batchStatus:
                batch.status,
            };
          }
        }
      );


    /*
     * Setting an empty object is also important.
     * It prevents old Batch information remaining
     * visible if Admission data becomes empty.
     */
    setStudentBatchMap(
      map
    );
  }, [
    admissionData,
    batchData,
  ]);


  // ========================================
  // COURSE LOOKUP MAP
  // ========================================

  const courseMap =
    useMemo<
      Record<
        string,
        Course
      >
    >(
      () => {
        const map:
          Record<
            string,
            Course
          > = {};


        courseData.forEach(
          (
            course
          ) => {
            map[
              course._id
            ] =
              course;
          }
        );


        return map;
      },
      [
        courseData,
      ]
    );


  // ========================================
  // STATUS BADGE
  // ========================================

  const StatusBadge = ({
    studentStatus,
    studentName,
  }: StatusBadgeProps) => {
    /*
     * studentName is optional on Student,
     * therefore use an empty string only for
     * lookup purposes.
     */
    const batchStatus =
      studentBatchMap[
        studentName ??
          ""
      ]?.batchStatus;


    const displayStatus =
      studentStatus ===
      "Assigned"
        ? batchStatus ??
          "Assigned"
        : studentStatus;


    let backgroundColor =
      "#eeeeee";

    let textColor =
      "#333";


    switch (
      displayStatus
    ) {
      case "Not Started":
        backgroundColor =
          "#fdecea";

        textColor =
          "#d32f2f";

        break;


      case "In Progress":
        backgroundColor =
          "#faf3cdff";

        textColor =
          "#e18b08ff";

        break;


      case "Training Completed":
        backgroundColor =
          "#e6f4ea";

        textColor =
          "#2e7d32";

        break;


      case "Batch Completed":
        backgroundColor =
          "#a1c5feff";

        textColor =
          "#042378ff";

        break;


      case "De-assigned":
        backgroundColor =
          "#cfd8dc";

        textColor =
          "#455a64";

        break;


      default:
        backgroundColor =
          "#eeeeee";

        textColor =
          "#333";
    }


    return (
      <span
        style={{
          backgroundColor,

          color:
            textColor,

          padding:
            "4px 8px",

          borderRadius:
            "12px",

          fontWeight:
            600,

          fontSize:
            "11px",

          display:
            "inline-block",

          minWidth:
            "110px",

          textAlign:
            "center",

          boxShadow:
            "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {displayStatus ||
          "N/A"}
      </span>
    );
  };


  // ========================================
  // PAGINATION
  // ========================================

  /*
   * The generic pagination hook now preserves
   * StudentTableRow as the row type.
   */
  const {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } =
    usePagination<StudentTableRow>(
      studentData,
      {
        initialRowsPerPage:
          10,
      }
    );


  /*
   * Return to page 0 whenever the Student
   * dataset changes.
   */
  useEffect(() => {
    resetPage();
  }, [
    studentData,
    resetPage,
  ]);


  return (
    <div>
      <Box
        sx={{
          width:
            "100%",

          overflowX:
            "auto",
        }}
      >
        {/* ========================================
            STUDENT TABLE
        ======================================== */}

        <TableContainer
          sx={{
            ...tableContainerStyles,

            maxWidth:
              "100%",

            overflowX:
              "auto",

            // Custom horizontal scrollbar.
            "&::-webkit-scrollbar":
              {
                height:
                  "10px",
              },

            "&::-webkit-scrollbar-track":
              {
                backgroundColor:
                  "#f1f1f1",

                borderRadius:
                  "10px",
              },

            "&::-webkit-scrollbar-thumb":
              {
                backgroundColor:
                  "#888",

                borderRadius:
                  "10px",
              },

            "&::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor:
                  "#555",
              },
          }}
        >
          <Table
            sx={{
              /*
               * Keep the original wide table
               * and horizontal scrolling.
               */
              minWidth:
                2000,
            }}
          >
            {/* ========================================
                TABLE HEADER
            ======================================== */}

            <TableHead>
              <TableRow>
                <StyledTableCell>
                  No.
                </StyledTableCell>

                <StyledTableCell>
                  Actions
                </StyledTableCell>

                <StyledTableCell>
                  Batch No.
                </StyledTableCell>

                <StyledTableCell>
                  Status
                </StyledTableCell>

                <StyledTableCell>
                  Student ID
                </StyledTableCell>

                <StyledTableCell>
                  First Name
                </StyledTableCell>

                <StyledTableCell>
                  Last Name
                </StyledTableCell>

                <StyledTableCell>
                  Email
                </StyledTableCell>

                <StyledTableCell>
                  Phone No.
                </StyledTableCell>

                <StyledTableCell>
                  Gender
                </StyledTableCell>

                <StyledTableCell>
                  Birthdate
                </StyledTableCell>

                <StyledTableCell>
                  Preferred Courses
                </StyledTableCell>

                <StyledTableCell>
                  Mapped Course
                </StyledTableCell>

                <StyledTableCell>
                  Course ID
                </StyledTableCell>

                <StyledTableCell>
                  Session Time
                </StyledTableCell>

                <StyledTableCell>
                  Session Type
                </StyledTableCell>

                <StyledTableCell>
                  Daily Session Hours
                </StyledTableCell>

                <StyledTableCell>
                  No. of Days
                </StyledTableCell>

                <StyledTableCell>
                  Admission Fee
                </StyledTableCell>

                <StyledTableCell>
                  Admission Date
                </StyledTableCell>

                <StyledTableCell>
                  Created Date
                </StyledTableCell>
              </TableRow>
            </TableHead>


            {/* ========================================
                TABLE BODY
            ======================================== */}

            <TableBody>
              {paginatedData.map(
                (
                  student,
                  index
                ) => {
                  /*
                   * courseId is optional on Student.
                   */
                  const course =
                    student.courseId
                      ? courseMap[
                          student.courseId
                        ]
                      : undefined;


                  const rowNumber =
                    page *
                      rowsPerPage +
                    index +
                    1;


                  const studentName =
                    student.studentName ??
                    "";


                  return (
                    <StyledTableRow
                      key={
                        student._id
                      }
                    >
                      {/* Row Number */}

                      <StyledTableCell>
                        {rowNumber}
                      </StyledTableCell>


                      {/* ========================================
                          ACTIONS
                      ======================================== */}

                      <StyledTableCell>
                        <div
                          style={{
                            display:
                              "flex",

                            justifyContent:
                              "space-evenly",

                            alignItems:
                              "center",
                          }}
                        >
                          {/* Edit */}

                          <FaEdit
                            className={
                              role ===
                              "admin"
                                ? "text-success fs-5"
                                : "text-muted fs-5"
                            }
                            style={{
                              cursor:
                                "pointer",

                              opacity:
                                role ===
                                "admin"
                                  ? 1
                                  : 0.5,
                            }}
                            onClick={() => {
                              if (
                                role ===
                                "admin"
                              ) {
                                handleEditClick(
                                  student
                                );
                              } else {
                                toast.error(
                                  "To edit the information, please contact Admin",
                                  {
                                    autoClose:
                                      2000,
                                  }
                                );
                              }
                            }}
                            title="Edit Student"
                          />


                          {/* Delete */}

                          <MdDelete
                            className={
                              role ===
                              "admin"
                                ? "text-danger fs-5"
                                : "text-muted fs-5"
                            }
                            style={{
                              cursor:
                                "pointer",

                              opacity:
                                role ===
                                "admin"
                                  ? 1
                                  : 0.5,
                            }}
                            onClick={() =>
                              handleDeleteClick(
                                student
                              )
                            }
                            title="Delete Student"
                          />


                          {/* Password */}

                          <FaKey
                            className="text-secondary fs-6"
                            style={{
                              cursor:
                                "pointer",
                            }}
                            onClick={() =>
                              handlePasswordClick(
                                student.password ??
                                  null
                              )
                            }
                            title="View Password"
                          />
                        </div>
                      </StyledTableCell>


                      {/* Batch Number */}

                      <StyledTableCell>
                        {student.batchNumber ||
                          "-"}
                      </StyledTableCell>


                      {/* Status */}

                      <StyledTableCell>
                        <StatusBadge
                          studentStatus={
                            student.status
                          }
                          studentName={
                            student.studentName
                          }
                        />
                      </StyledTableCell>


                      {/* Student ID */}

                      <StyledTableCell>
                        {student._id}
                      </StyledTableCell>


                      {/* First Name */}

                      <StyledTableCell>
                        {student.firstName}
                      </StyledTableCell>


                      {/* Last Name */}

                      <StyledTableCell>
                        {student.lastName}
                      </StyledTableCell>


                      {/* Email */}

                      <StyledTableCell>
                        {student.email ||
                          "-"}
                      </StyledTableCell>


                      {/* Phone */}

                      <StyledTableCell>
                        {student.phoneNumber ||
                          "-"}
                      </StyledTableCell>


                      {/* Gender */}

                      <StyledTableCell>
                        {student.gender ||
                          "-"}
                      </StyledTableCell>


                      {/* Birthdate */}

                      <StyledTableCell>
                        {formatDate(
                          student.birthdate
                        )}
                      </StyledTableCell>


                      {/* Preferred Courses */}

                      <StyledTableCell>
                        {Array.isArray(
                          student.preferredCourses
                        ) &&
                        student
                          .preferredCourses
                          .length
                          ? student.preferredCourses.join(
                              ", "
                            )
                          : "Skipped"}
                      </StyledTableCell>


                      {/* Mapped Course */}

                      <StyledTableCell>
                        {student.courseName ||
                          "-"}
                      </StyledTableCell>


                      {/* Course ID */}

                      <StyledTableCell>
                        {course?._id ||
                          "-"}
                      </StyledTableCell>


                      {/* Session Time */}

                      <StyledTableCell>
                        {studentBatchMap[
                          studentName
                        ]?.sessionTime ||
                          "-"}
                      </StyledTableCell>


                      {/* Session Type */}

                      <StyledTableCell>
                        {course?.courseType ||
                          "-"}
                      </StyledTableCell>


                      {/* Daily Session Hours */}

                      <StyledTableCell>
                        {course
                          ?.dailySessionHrs ??
                          "-"}
                      </StyledTableCell>


                      {/* Number of Days */}

                      <StyledTableCell>
                        {course?.noOfDays ??
                          "-"}
                      </StyledTableCell>


                      {/* Admission Fee */}

                      <StyledTableCell>
                        {student.admissionFee ??
                          "-"}
                      </StyledTableCell>


                      {/* Admission Date */}

                      <StyledTableCell>
                        {formatDate(
                          student.admissionDate
                        )}
                      </StyledTableCell>


                      {/* Created Date */}

                      <StyledTableCell>
                        {formatDateTime(
                          student.createdAt
                        )}
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
      </Box>


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEdit &&
        singleStudent && (
          <EditStudentData
            show={
              showEdit
            }
            setShow={
              setShowEdit
            }
            singleStudent={
              singleStudent
            }
            setSingleStudent={
              setSingleStudent
            }
            setStudentData={
              setStudentData
            }
            courseData={
              courseData
            }
          />
        )}


      {/* ========================================
          PASSWORD MODAL
      ======================================== */}

      {viewPassword && (
        <ModalShowPassword
          viewPassword={
            viewPassword
          }
          setViewPassword={
            setViewPassword
          }
          password={
            password
          }
          setPassword={
            setPassword
          }
        />
      )}


      {/* ========================================
          DELETE MODAL
      ======================================== */}

      {showDelete &&
        studentToDelete && (
          <ModalDeleteStudent
            show={
              showDelete
            }
            setShow={
              setShowDelete
            }
            studentToDelete={
              studentToDelete
            }
            onConfirmDelete={
              handleConfirmDelete
            }
          />
        )}
    </div>
  );
};

export default CustomizedTables;