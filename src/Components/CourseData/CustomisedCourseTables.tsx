import { useState } from "react";
import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
} from "react";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  TablePagination,
} from "@mui/material";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import ModalEditCourse from "./Modals/ModalEditCourse";
import ModalDeleteCourse from "./Modals/ModalDeleteCourse";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
} from "../utils/constant";

/*
 * TypeScript:
 * Reuse our shared Course types instead of
 * defining the course structure again here.
 *
 * ComputedCourse extends Course and is used by
 * the Course filtering/view layer.
 */
import type {
  Course,
  ComputedCourse,
} from "../../types/course";

/*
 * TypeScript:
 * courseData is the data displayed by this table.
 *
 * ViewCourse can pass ComputedCourse[] because the
 * filtering layer adds computedCreatedAt.
 *
 * setCourseData, however, updates the original
 * Course[] state. This also matches the types used
 * by ModalEditCourse and ModalDeleteCourse.
 */
interface CustomisedCourseTablesProps {
  courseData: ComputedCourse[];

  setCourseData: Dispatch<
    SetStateAction<Course[]>
  >;
}

export default function CustomisedCourseTables({
  courseData,
  setCourseData,
}: CustomisedCourseTablesProps) {
  const [show, setShow] =
    useState<boolean>(false);

  const [viewWarning, setViewWarning] =
    useState<boolean>(false);

  /*
   * TypeScript:
   * Before a user selects a course there is no
   * single course, so the state must allow null.
   */
  const [singleCourse, setSingleCourse] =
    useState<Course | null>(null);

  // Pagination states.
  // TypeScript can infer these as number,
  // but explicitly typing them makes the intent clear.
  const [page, setPage] =
    useState<number>(0);

  const [rowsPerPage, setRowsPerPage] =
    useState<number>(10);

  /*
   * TypeScript:
   * The selected item comes from courseData.
   *
   * ComputedCourse extends Course, so it can safely
   * be stored as Course here.
   */
  const handleEditClick = (
    course: ComputedCourse
  ): void => {
    setShow(true);
    setSingleCourse(course);
  };

  /*
   * MUI TablePagination can send either a mouse
   * event or null when changing page.
   */
  const handleChangePage = (
    _event:
      | MouseEvent<HTMLButtonElement>
      | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  /*
   * MUI's rows-per-page select sends a change
   * event from an input/textarea element.
   */
  const handleChangeRowsPerPage = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    setRowsPerPage(
      parseInt(event.target.value, 10)
    );

    // Return to the first page after changing
    // how many rows are displayed.
    setPage(0);
  };

  // Calculate the rows displayed on the current page.
  const paginatedData =
    courseData.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );

  /*
   * TypeScript:
   * createdAt/updatedAt are optional in our shared
   * Course type, so this function accepts undefined.
   */
  const formatDate = (
    dateString?: string
  ): string => {
    if (!dateString) {
      return "N/A";
    }

    const date =
      new Date(dateString);

    return date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Table */}
      {courseData.length > 0 ? (
        <Paper>
          {/*
           * tableContainerStyles is our shared MUI
           * style object, so it is passed directly
           * into the sx prop.
           */}
          <TableContainer
            sx={tableContainerStyles}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    Action
                  </StyledTableCell>

                  <StyledTableCell>
                    ID
                  </StyledTableCell>

                  <StyledTableCell>
                    Name
                  </StyledTableCell>

                  <StyledTableCell>
                    Fee
                  </StyledTableCell>

                  <StyledTableCell>
                    Type
                  </StyledTableCell>

                  <StyledTableCell>
                    Availability
                  </StyledTableCell>

                  <StyledTableCell>
                    Total Hours
                  </StyledTableCell>

                  <StyledTableCell>
                    Daily Session Hours
                  </StyledTableCell>

                  <StyledTableCell>
                    No. of Days
                  </StyledTableCell>

                  <StyledTableCell>
                    Created Date
                  </StyledTableCell>

                  <StyledTableCell>
                    Updated Date
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map(
                  (course) => (
                    <StyledTableRow
                      key={course._id}
                    >
                      <StyledTableCell>
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-evenly",
                          }}
                        >
                          <FaEdit
                            className="text-success fs-6"
                            style={{
                              cursor:
                                "pointer",
                            }}
                            onClick={() =>
                              handleEditClick(
                                course
                              )
                            }
                          />

                          <MdDelete
                            className="text-danger fs-6"
                            style={{
                              cursor:
                                "pointer",
                            }}
                            onClick={() => {
                              setViewWarning(
                                true
                              );

                              setSingleCourse(
                                course
                              );
                            }}
                          />
                        </div>
                      </StyledTableCell>

                      <StyledTableCell>
                        {course._id}
                      </StyledTableCell>

                      <StyledTableCell>
                        {
                          course.courseName
                        }
                      </StyledTableCell>

                      <StyledTableCell>
                        {course.courseFee}
                      </StyledTableCell>

                      <StyledTableCell>
                        {
                          course.courseType
                        }
                      </StyledTableCell>

                      <StyledTableCell>
                        {
                          course.courseAvailability
                        }
                      </StyledTableCell>

                      <StyledTableCell>
                        {
                          course.courseDuration
                        }
                      </StyledTableCell>

                      <StyledTableCell>
                        {
                          course.dailySessionHrs
                        }
                      </StyledTableCell>

                      <StyledTableCell>
                        {course.noOfDays}
                      </StyledTableCell>

                      <StyledTableCell>
                        {formatDate(
                          course.createdAt
                        )}
                      </StyledTableCell>

                      <StyledTableCell>
                        {formatDate(
                          course.updatedAt
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[
              5, 10, 25, 50,
            ]}
            component="div"
            count={courseData.length}
            rowsPerPage={
              rowsPerPage
            }
            page={page}
            onPageChange={
              handleChangePage
            }
            onRowsPerPageChange={
              handleChangeRowsPerPage
            }
            sx={{
              borderTop:
                "1px solid rgba(0,0,0,0.08)",

              "& .MuiTablePagination-toolbar":
                {
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  flexWrap: "wrap",
                  gap: 0,
                  py: 0,
                  px: 1,
                  minHeight:
                    "unset",
                },

              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  m: 0,
                  whiteSpace:
                    "nowrap",
                },

              "& .MuiTablePagination-actions":
                {
                  m: 0,
                  display: "flex",
                  alignItems:
                    "center",
                },

              "& .MuiInputBase-root":
                {
                  mt: 0,
                },
            }}
          />
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            mt: 2,
            borderRadius:
              "10px",
            border:
              "1px solid #bfdbfe",
            backgroundColor:
              "#eff6ff",
          }}
        >
          No courses found
        </Alert>
      )}

      {/*
       * TypeScript:
       * Checking singleCourse here narrows
       * Course | null to Course.
       *
       * That means the modal never receives null
       * while it is actually being displayed.
       */}
      {show && singleCourse && (
        <ModalEditCourse
          show={show}
          key={singleCourse._id}
          setShow={setShow}
          singleCourse={
            singleCourse
          }
          setCourseData={
            setCourseData
          }
        />
      )}

      {/*
       * Same null-safety check for the delete modal.
       */}
      {viewWarning &&
        singleCourse && (
          <ModalDeleteCourse
            viewWarning={
              viewWarning
            }
            singleCourse={
              singleCourse
            }
            setCourseData={
              setCourseData
            }
            setSingleCourse={
              setSingleCourse
            }
            setViewWarning={
              setViewWarning
            }
          />
        )}
    </Box>
  );
}