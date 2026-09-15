import {
  useMemo,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Modal,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Paper,
  TableContainer,
  Typography,
  Box,
} from "@mui/material";

import { saveAs } from "file-saver";
import { FaUsers } from "react-icons/fa6";


// ========================================
// BATCH STUDENT TYPE
// ========================================

/*
 * TypeScript:
 * This modal does not need the entire Student object.
 *
 * It only displays these fields, so we define the
 * minimum shape required by this Batch feature.
 *
 * We export it so CustomisedBatchTables.tsx can reuse
 * exactly the same type instead of defining it again.
 */
export interface BatchStudent {
  _id?: string;

  studentName: string;

  email?: string;

  phoneNumber?: string | number;

  gender?: string;
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalShowStudentsListProps {
  // Controls whether the MUI modal is open.
  show: boolean;

  // React state setter from CustomisedBatchTables.
  setShow: Dispatch<
    SetStateAction<boolean>
  >;

  // Students assigned to the currently selected batch.
  selectedBatchStudents: BatchStudent[];
}


export const ModalShowStudentsList = ({
  show,
  setShow,
  selectedBatchStudents,
}: ModalShowStudentsListProps) => {
  // Search text entered by the user.
  const [search, setSearch] =
    useState<string>("");


  // ========================================
  // FILTER STUDENTS
  // ========================================

  /*
   * TypeScript:
   * Because selectedBatchStudents is BatchStudent[],
   * student is automatically known to be BatchStudent.
   *
   * We no longer need lodash here — native Array.filter()
   * is fully typed and simpler.
   */
  const filteredStudents =
    useMemo<BatchStudent[]>(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      /*
       * If there is no search text,
       * simply return the full list.
       */
      if (!normalizedSearch) {
        return selectedBatchStudents;
      }

      return selectedBatchStudents.filter(
        (student) => {
          const nameMatch =
            student.studentName
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const emailMatch =
            student.email
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ?? false;

          /*
           * phoneNumber may be either a string or number,
           * so convert it safely before searching.
           */
          const phoneMatch =
            student.phoneNumber
              ?.toString()
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ?? false;

          return (
            nameMatch ||
            emailMatch ||
            phoneMatch
          );
        }
      );
    }, [
      search,
      selectedBatchStudents,
    ]);


  // ========================================
  // DOWNLOAD CSV
  // ========================================

  const handleDownload =
    (): void => {
      const csvHeader = [
        "Student Name",
        "Email",
        "Phone Number",
        "Gender",
      ];

      /*
       * TypeScript:
       * Convert optional values to empty strings so the
       * generated CSV does not contain "undefined".
       */
      const csvRows =
        filteredStudents.map(
          (student) => [
            student.studentName,
            student.email ?? "",
            student.phoneNumber
              ?.toString() ?? "",
            student.gender ?? "",
          ]
        );

      const csvContent = [
        csvHeader,
        ...csvRows,
      ]
        .map((row) =>
          row.join(",")
        )
        .join("\n");

      const blob =
        new Blob(
          [csvContent],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      saveAs(
        blob,
        "students.csv"
      );
    };


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setShow(false);
    };


  return (
    <Modal
      open={show}
      onClose={handleClose}
    >
      <Box
        sx={{
          background: "white",
          padding: 3,
          maxWidth: 700,
          width: "90%",
          maxHeight: "80vh",
          margin: "5% auto",
          borderRadius: 2,
          boxShadow: 6,
          display: "flex",
          flexDirection:
            "column",
        }}
      >
        {/* ========================================
            HEADER + SEARCH + DOWNLOAD
        ======================================== */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >
            <FaUsers
              size={24}
              color="#1976d2"
            />

            Assigned Students
          </Typography>


          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              placeholder="Search students..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            <Button
              variant="contained"
              color="primary"
              onClick={
                handleDownload
              }
            >
              Download CSV
            </Button>
          </Box>
        </Box>


        {/* ========================================
            STUDENTS TABLE
        ======================================== */}

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
            mb: 2,
          }}
        >
          <Table
            stickyHeader
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>

                <TableCell>
                  Email
                </TableCell>

                <TableCell>
                  Phone
                </TableCell>

                <TableCell>
                  Gender
                </TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {filteredStudents.length >
              0 ? (
                filteredStudents.map(
                  (
                    student,
                    index
                  ) => (
                    <TableRow
                      /*
                       * MongoDB _id should normally exist.
                       * The fallback prevents TypeScript/
                       * React problems with older data.
                       */
                      key={
                        student._id ??
                        `${student.studentName}-${index}`
                      }
                      hover
                    >
                      <TableCell>
                        {
                          student.studentName
                        }
                      </TableCell>

                      <TableCell>
                        {student.email ??
                          "-"}
                      </TableCell>

                      <TableCell>
                        {student.phoneNumber ??
                          "-"}
                      </TableCell>

                      <TableCell>
                        {student.gender ??
                          "-"}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>


        {/* ========================================
            FOOTER
        ======================================== */}

        <Box
          sx={{
            textAlign:
              "right",
          }}
        >
          <Button
            variant="outlined"
            onClick={
              handleClose
            }
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};