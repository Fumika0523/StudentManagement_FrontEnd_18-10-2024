import {
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
} from "react";

import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
} from "@mui/material";

import {
  MdDelete,
} from "react-icons/md";

import {
  FaEdit,
} from "react-icons/fa";

import {
  toast,
} from "react-toastify";

import ModalDeleteAdmission from "./ModalDeleteAdmission";
import ModalEditAdmission from "./ModalEditAdmission";

import {
  StyledTableCell,
  StyledTableRow,
} from "../utils/constant";


// ========================================
// SHARED TYPES
// ========================================

import type {
  Admission,
} from "../../types/admission";

import type {
  Batch,
} from "../../types/batch";

import type {
  Student,
} from "../../types/student";

import type {
  Course,
} from "../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface CustomisedAdmissionTableProps {
  admissionData: Admission[];

  setAdmissionData: Dispatch<
    SetStateAction<Admission[]>
  >;

  batchData: Batch[];


  /*
   * These props are still passed by ViewAdmission.
   *
   * The current table itself no longer needs them,
   * but keeping them in the interface prevents us
   * from unnecessarily changing the parent component
   * during this migration step.
   */
  studentData: Student[];

  setStudentData: Dispatch<
    SetStateAction<Student[]>
  >;

  courseData: Course[];

  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;
}


// ========================================
// STATUS BADGE
// ========================================

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const backgroundColor =
    status === "Not Started"
      ? "#fdecea"
      : status === "In Progress"
        ? "#faf3cdff"
        : status ===
            "Training Completed"
          ? "#e6f4ea"
          : status ===
              "Batch Completed"
            ? "#a1c5feff"
            : "#eeeeee";


  const color =
    status === "Not Started"
      ? "#d32f2f"
      : status === "In Progress"
        ? "#e18b08ff"
        : status ===
            "Training Completed"
          ? "#2e7d32"
          : status ===
              "Batch Completed"
            ? "#042378ff"
            : "#333";


  return (
    <span
      style={{
        backgroundColor,
        color,

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
      }}
    >
      {status || "N/A"}
    </span>
  );
};


// ========================================
// COMPONENT
// ========================================

const CustomisedAdmissionTable = ({
  admissionData,
  setAdmissionData,
  batchData,
}: CustomisedAdmissionTableProps) => {
  // ========================================
  // MODAL STATES
  // ========================================

  const [
    showEdit,
    setShowEdit,
  ] = useState<boolean>(
    false
  );

  const [
    viewWarning,
    setViewWarning,
  ] = useState<boolean>(
    false
  );


  /*
   * TypeScript:
   *
   * No Admission is selected when the page first loads,
   * therefore this state must allow null.
   */
  const [
    singleAdmission,
    setSingleAdmission,
  ] = useState<
    Admission | null
  >(null);


  // ========================================
  // PAGINATION
  // ========================================

  const [
    page,
    setPage,
  ] = useState<number>(
    0
  );

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState<number>(
    15
  );


  // ========================================
  // CURRENT USER ROLE
  // ========================================

  const role =
    localStorage.getItem(
      "role"
    );


  // ========================================
  // BATCH STATUS LOOKUP
  // ========================================

  /*
   * Example:
   *
   * {
   *   "BATCH001": "In Progress",
   *   "BATCH002": "Batch Completed"
   * }
   *
   * This avoids running .find() repeatedly for
   * every Admission row rendered by the table.
   */
  const batchStatusMap =
    useMemo<
      Record<
        string,
        string
      >
    >(() => {
      const map:
        Record<
          string,
          string
        > = {};


      batchData.forEach(
        (batch) => {
          if (
            batch.batchNumber
          ) {
            map[
              batch.batchNumber
            ] =
              batch.status ??
              "N/A";
          }
        }
      );


      return map;
    }, [batchData]);


  // ========================================
  // GET BATCH STATUS
  // ========================================

  const getBatchStatusByBatchNumber =
    (
      batchNumber:
        string | undefined
    ): string => {
      if (!batchNumber) {
        return "N/A";
      }


      return (
        batchStatusMap[
          batchNumber
        ] ?? "N/A"
      );
    };


  // ========================================
  // PAGINATION HANDLERS
  // ========================================

  const handleChangePage = (
    _event:
      MouseEvent<HTMLButtonElement> |
      null,
    newPage: number
  ): void => {
    setPage(
      newPage
    );
  };


  const handleChangeRowsPerPage =
    (
      event:
        ChangeEvent<
          HTMLInputElement |
          HTMLTextAreaElement
        >
    ): void => {
      setRowsPerPage(
        parseInt(
          event.target.value,
          10
        )
      );

      setPage(
        0
      );
    };


  // ========================================
  // EDIT ADMISSION
  // ========================================

  const handleEditClick = (
    admission: Admission
  ): void => {
    setSingleAdmission(
      admission
    );

    setShowEdit(
      true
    );
  };


  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (
    dateString:
      string | null | undefined
  ): string => {
    if (!dateString) {
      return "N/A";
    }


    const date =
      new Date(
        dateString
      );


    /*
     * Protect the table from displaying
     * "Invalid Date" if bad data is returned.
     */
    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "N/A";
    }


    return date.toLocaleDateString(
      "en-US",
      {
        day:
          "numeric",

        month:
          "short",

        year:
          "numeric",
      }
    );
  };


  // ========================================
  // DATA TO DISPLAY
  // ========================================

  /*
   * Filtering is already handled by the Admission
   * page/header.
   *
   * The old component contained another internal
   * filter system, but there was no UI connected
   * to those handlers anymore.
   *
   * Therefore the table simply displays
   * admissionData here.
   */
  const displayData =
    admissionData;


  const paginatedData =
    displayData.slice(
      page *
        rowsPerPage,

      page *
        rowsPerPage +
        rowsPerPage
    );


  // ========================================
  // ACTION PERMISSION
  // ========================================

  type AdmissionAction =
    | "edit"
    | "delete";


  const handleActionClick = (
    actionType:
      AdmissionAction,
    admission:
      Admission
  ): void => {
    /*
     * Staff users are not allowed to edit
     * or delete Admissions.
     */
    if (
      role === "staff"
    ) {
      toast.error(
        "You don't have permission for this action, please contact to super admin",
        {
          position:
            "top-right",

          autoClose:
            3000,

          hideProgressBar:
            false,

          closeOnClick:
            true,

          pauseOnHover:
            true,

          draggable:
            true,
        }
      );

      return;
    }


    if (
      actionType ===
      "edit"
    ) {
      handleEditClick(
        admission
      );

      return;
    }


    /*
     * Delete modal requires a selected Admission.
     */
    setSingleAdmission(
      admission
    );

    setViewWarning(
      true
    );
  };


  return (
    <Box className="row mx-auto w-100">
      {/* ========================================
          TABLE
      ======================================== */}

      <Box
        sx={{
          display:
            "flex",

          flexDirection:
            "column",

          marginTop:
            "10px",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth:
              "100%",

            overflowX:
              "auto",
          }}
        >
          <Table
            sx={{
              minWidth:
                650,
            }}
          >
            {/* ========================================
                TABLE HEADER
            ======================================== */}

            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Action
                </StyledTableCell>

                <StyledTableCell>
                  Status
                </StyledTableCell>

                <StyledTableCell>
                  Batch No.
                </StyledTableCell>

                <StyledTableCell>
                  Course ID
                </StyledTableCell>

                <StyledTableCell>
                  Course Name
                </StyledTableCell>

                <StyledTableCell>
                  Student ID
                </StyledTableCell>

                <StyledTableCell>
                  Student Name
                </StyledTableCell>

                <StyledTableCell>
                  Source
                </StyledTableCell>

                <StyledTableCell>
                  Fee
                </StyledTableCell>

                <StyledTableCell>
                  Date
                </StyledTableCell>

                <StyledTableCell>
                  Month
                </StyledTableCell>

                <StyledTableCell>
                  Year
                </StyledTableCell>

                <StyledTableCell>
                  CreatedAt
                </StyledTableCell>

                <StyledTableCell>
                  UpdatedAt
                </StyledTableCell>
              </TableRow>
            </TableHead>


            {/* ========================================
                TABLE BODY
            ======================================== */}

            <TableBody>
              {paginatedData.length >
              0 ? (
                paginatedData.map(
                  (
                    admission
                  ) => (
                    <StyledTableRow
                      key={
                        admission._id
                      }
                    >
                      {/* ========================================
                          ACTIONS
                      ======================================== */}

                      <StyledTableCell>
                        <Box
                          sx={{
                            display:
                              "flex",

                            gap:
                              2,

                            justifyContent:
                              "center",
                          }}
                        >
                          {/* Edit */}

                          <FaEdit
                            className={
                              role ===
                              "staff"
                                ? "text-muted fs-5"
                                : "text-success fs-5"
                            }
                            style={{
                              cursor:
                                "pointer",

                              opacity:
                                role ===
                                "staff"
                                  ? 0.5
                                  : 1,
                            }}
                            onClick={() =>
                              handleActionClick(
                                "edit",
                                admission
                              )
                            }
                          />


                          {/* Delete */}

                          <MdDelete
                            className={
                              role ===
                              "staff"
                                ? "text-muted fs-5"
                                : "text-danger fs-5"
                            }
                            style={{
                              cursor:
                                "pointer",

                              opacity:
                                role ===
                                "staff"
                                  ? 0.5
                                  : 1,
                            }}
                            onClick={() =>
                              handleActionClick(
                                "delete",
                                admission
                              )
                            }
                          />
                        </Box>
                      </StyledTableCell>


                      {/* ========================================
                          STATUS
                      ======================================== */}

                      <StyledTableCell>
                        <StatusBadge
                          status={
                            admission.status ===
                            "Assigned"
                              ? getBatchStatusByBatchNumber(
                                  admission.batchNumber
                                )
                              : admission.status ??
                                "N/A"
                          }
                        />
                      </StyledTableCell>


                      {/* ========================================
                          ADMISSION DATA
                      ======================================== */}

                      <StyledTableCell>
                        {admission.batchNumber ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.courseId ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.courseName ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.studentId ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.studentName ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.admissionSource ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.admissionFee ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {formatDate(
                          admission.admissionDate
                        )}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.admissionMonth ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {admission.admissionYear ??
                          "N/A"}
                      </StyledTableCell>


                      <StyledTableCell>
                        {formatDate(
                          admission.createdAt
                        )}
                      </StyledTableCell>


                      <StyledTableCell>
                        {formatDate(
                          admission.updatedAt
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )
              ) : (
                // ========================================
                // EMPTY TABLE
                // ========================================

                <TableRow>
                  <StyledTableCell
                    colSpan={
                      14
                    }
                    align="center"
                  >
                    No data available
                  </StyledTableCell>
                </TableRow>
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
            displayData.length
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
            boxShadow:
              2,

            p:
              1,

            width:
              "100%",

            maxWidth:
              "100%",

            display:
              "flex",

            justifyContent:
              "center",
          }}
        />
      </Box>


      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {showEdit &&
        singleAdmission && (
          <ModalEditAdmission
            show={
              showEdit
            }
            setShow={
              setShowEdit
            }
            singleAdmission={
              singleAdmission
            }
            setAdmissionData={
              setAdmissionData
            }
          />
        )}


      {/* ========================================
          DELETE MODAL
      ======================================== */}

      {viewWarning &&
        singleAdmission && (
          <ModalDeleteAdmission
            viewWarning={
              viewWarning
            }
            setViewWarning={
              setViewWarning
            }
            singleAdmission={
              singleAdmission
            }
            setAdmissionData={
              setAdmissionData
            }
          />
        )}
    </Box>
  );
};

export default CustomisedAdmissionTable;