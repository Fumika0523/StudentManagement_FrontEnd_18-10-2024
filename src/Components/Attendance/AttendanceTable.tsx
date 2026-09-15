import {
  useState,
} from "react";

import type {
  ChangeEvent,
  MouseEvent,
} from "react";

import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
} from "../utils/constant";

import type {
  Student,
} from "../../types/student";


// ========================================
// ATTENDANCE STUDENT TYPE
// ========================================

/*
 * The current Attendance table displays all
 * normal Student fields, but it also tries to
 * display item.date.
 *
 * `date` is not part of our shared Student model,
 * so keep it local to Attendance instead of
 * changing the global Student interface.
 */
export interface AttendanceStudent
  extends Student {
  date?: string | null;
}


// ========================================
// COMPONENT PROPS
// ========================================

interface AttendanceTableProps {
  /*
   * Default value is handled by the component,
   * but the prop itself remains optional so the
   * table is safe while data is loading.
   */
  studentData?: AttendanceStudent[];
}


// ========================================
// DATE COLUMN TYPE
// ========================================

interface AttendanceDate {
  day: number;

  label: string;

  isWeekend: boolean;
}


// ========================================
// COMPONENT
// ========================================

const AttendanceTable = ({
  studentData = [],
}: AttendanceTableProps) => {
  // ========================================
  // PAGINATION
  // ========================================

  const [
    page,
    setPage,
  ] =
    useState<number>(
      0
    );


  const [
    rowsPerPage,
    setRowsPerPage,
  ] =
    useState<number>(
      15
    );


  // ========================================
  // CHANGE PAGE
  // ========================================

  const handleChangePage = (
    _event:
      MouseEvent<HTMLButtonElement> | null,

    newPage:
      number
  ): void => {
    setPage(
      newPage
    );
  };


  // ========================================
  // CHANGE ROWS PER PAGE
  // ========================================

  const handleChangeRowsPerPage = (
    event:
      ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
  ): void => {
    const nextRowsPerPage =
      Number.parseInt(
        event.target.value,
        10
      );


    setRowsPerPage(
      nextRowsPerPage
    );


    // Return to the first page whenever
    // the number of rows changes.
    setPage(
      0
    );
  };


  // ========================================
  // PAGINATED STUDENTS
  // ========================================

  const paginatedData =
    studentData.slice(
      page *
        rowsPerPage,

      page *
          rowsPerPage +
        rowsPerPage
    );


  // ========================================
  // CURRENT MONTH DATES
  // ========================================

  /*
   * This helper already existed in the JSX file.
   *
   * It is not rendered yet, but we keep it because
   * it appears to be intended for the later
   * Attendance date columns.
   */
  const getDatesInCurrentMonth =
    (): AttendanceDate[] => {
      const now =
        new Date();


      const year =
        now.getFullYear();


      /*
       * JavaScript months are zero-based:
       * January = 0, February = 1, etc.
       */
      const month =
        now.getMonth();


      /*
       * Day 0 of the following month gives us
       * the final day of the current month.
       */
      const lastDay =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      return Array.from(
        {
          length:
            lastDay,
        },

        (
          _value,
          index
        ): AttendanceDate => {
          const date =
            new Date(
              year,
              month,
              index + 1
            );


          const dayOfWeek =
            date.getDay();


          return {
            day:
              index + 1,

            label:
              date.toLocaleDateString(
                "en-GB",
                {
                  weekday:
                    "short",
                }
              ),

            isWeekend:
              dayOfWeek === 0 ||
              dayOfWeek === 6,
          };
        }
      );
    };


  /*
   * Keep the helper available for the next stage
   * of Attendance development without changing
   * the existing UI yet.
   */
  void getDatesInCurrentMonth;


  return (
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
      {studentData.length >
      0 ? (
        <Paper
          sx={
            tableContainerStyles
          }
        >
          <TableContainer>
            <Table>
              {/* ========================================
                  TABLE HEADER
              ======================================== */}

              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    Student Name
                  </StyledTableCell>

                  <StyledTableCell />
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
                  ) => (
                    <StyledTableRow
                      key={
                        student._id
                      }
                    >
                      {/* Row number */}

                      <StyledTableCell>
                        {page *
                          rowsPerPage +
                          index +
                          1}
                      </StyledTableCell>


                      {/* Student name */}

                      <StyledTableCell>
                        {student.studentName ??
                          `${student.firstName} ${student.lastName}`.trim()}
                      </StyledTableCell>


                      {/* Existing temporary Attendance date field */}

                      <StyledTableCell>
                        {student.date ??
                          "-"}
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>


          {/* ========================================
              PAGINATION
          ======================================== */}

          <TablePagination
            rowsPerPageOptions={[
              15,
              30,
              50,
              100,
            ]}
            component="div"
            count={
              studentData.length
            }
            rowsPerPage={
              rowsPerPage
            }
            page={
              page
            }
            onPageChange={
              handleChangePage
            }
            onRowsPerPageChange={
              handleChangeRowsPerPage
            }
            labelRowsPerPage="Rows per page"
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
        // ========================================
        // EMPTY STATE
        // ========================================

        <Alert
          severity="info"
          sx={{
            mt:
              2,

            borderRadius:
              "10px",

            border:
              "1px solid #bfdbfe",

            backgroundColor:
              "#eff6ff",
          }}
        >
          No student data found
        </Alert>
      )}
    </Box>
  );
};

export default AttendanceTable;