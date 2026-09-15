import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  tableCellClasses,
} from "@mui/material/TableCell";

import {
  styled,
} from "@mui/material/styles";

import type {
  Batch,
} from "../../../types/batch";


// ========================================
// CERTIFICATE ROW TYPE
// ========================================

interface CertificateRow {
  studentName: string;

  completionDate: string;

  score: string;

  attendance: string;
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalCertificateProps {
  open: boolean;

  setOpen: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * The current UI does not yet read Batch data,
   * but we keep the prop typed because it is
   * intended for the future certificate logic.
   */
  batch?: Batch | null;
}


// ========================================
// STYLED TABLE
// ========================================

const StyledTableCell =
  styled(TableCell)(
    ({ theme }) => ({
      [`&.${tableCellClasses.head}`]:
        {
          backgroundColor:
            "#f3f4f6",

          color:
            "#5a5c69",

          fontWeight:
            700,

          textAlign:
            "center",

          fontSize:
            "14px",

          padding:
            "10px 12px",

          whiteSpace:
            "nowrap",
        },

      [`&.${tableCellClasses.body}`]:
        {
          fontSize:
            "13px",

          textAlign:
            "center",

          padding:
            "10px 12px",

          whiteSpace:
            "nowrap",
        },
    })
  );


const StyledTableRow =
  styled(TableRow)(
    ({ theme }) => ({
      "&:nth-of-type(odd)":
        {
          backgroundColor:
            theme.palette.action.hover,
        },

      "&:hover":
        {
          backgroundColor:
            "#b3e5fc",
        },
    })
  );


// ========================================
// COMPONENT
// ========================================

const ModalCertificate = ({
  open,
  setOpen,
  batch,
}: ModalCertificateProps) => {
  const handleClose =
    (): void => {
      setOpen(
        false
      );
    };


  /*
   * Placeholder data.
   *
   * Later this can be replaced with real Student
   * completion data using the selected Batch.
   */
  const rows:
    CertificateRow[] = [
    {
      studentName:
        "student01",

      completionDate:
        "12/01/2026",

      score:
        "80%",

      attendance:
        "90%",
    },
  ];


  /*
   * Keep the Batch prop available for the future
   * implementation without changing behaviour now.
   */
  void batch;


  return (
    <Dialog
      open={
        open
      }
      onClose={
        handleClose
      }
      maxWidth="md"
      fullWidth
    >
      <DialogContent
        sx={{
          pt:
            2,
        }}
      >
        <TableContainer
          component={
            Paper
          }
          sx={{
            maxHeight:
              360,

            boxShadow:
              0,
          }}
        >
          <Table
            stickyHeader
            size="small"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Student Name
                </StyledTableCell>

                <StyledTableCell>
                  Completion Date
                </StyledTableCell>

                <StyledTableCell>
                  Score
                </StyledTableCell>

                <StyledTableCell>
                  Attendance
                </StyledTableCell>

                <StyledTableCell>
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {rows.map(
                (
                  row
                ) => (
                  <StyledTableRow
                    key={
                      row.studentName
                    }
                  >
                    <StyledTableCell>
                      {row.studentName}
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.completionDate}
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.score}
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.attendance}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                      >
                        Generate
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>


      <DialogActions
        sx={{
          px:
            3,

          pb:
            2,
        }}
      >
        <Button
          type="button"
          onClick={
            handleClose
          }
          color="inherit"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCertificate;