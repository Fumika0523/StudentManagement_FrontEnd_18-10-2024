import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  tableCellClasses,
} from "@mui/material/TableCell";

import {
  styled,
} from "@mui/material/styles";

// TypeScript:
// Reuse our shared Batch type because the parent
// passes the selected batch into this modal.
import type {
  Batch,
} from "../../../types/batch";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalCertificateProps {
  // Controls whether the certificate dialog is visible.
  open: boolean;

  // React state setter from CustomisedBatchTables.
  setOpen: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * TypeScript:
   * The selected Batch is passed in by
   * CustomisedBatchTables.
   *
   * It is not yet used by the sample certificate table,
   * but keeping it here means the modal is ready for the
   * real Batch certificate data later.
   */
  batch: Batch;
}


// ========================================
// CERTIFICATE ROW TYPE
// ========================================

/*
 * The certificate feature currently contains sample data.
 *
 * Defining its structure now means TypeScript will protect
 * us when this is later replaced with real API data.
 */
interface CertificateRow {
  studentName: string;
  completionDate: string;
  score: string;
  attendance: string;
}


// ========================================
// STYLED TABLE COMPONENTS
// ========================================

const StyledTableCell =
  styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]:
      {
        backgroundColor:
          "#f3f4f6",

        color:
          "#5a5c69",

        fontWeight: 700,

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
  }));


const StyledTableRow =
  styled(TableRow)(
    ({ theme }) => ({
      "&:nth-of-type(odd)":
        {
          backgroundColor:
            theme.palette
              .action.hover,
        },

      "&:hover": {
        backgroundColor:
          "#b3e5fc",
      },
    })
  );


// ========================================
// COMPONENT
// ========================================

const ModalCertificate = (
  props: ModalCertificateProps
) => {
  /*
   * TypeScript:
   * We only destructure the props currently used by
   * the UI.
   *
   * props.batch remains available for the future
   * certificate implementation without creating an
   * unused-variable warning.
   */
  const {
    open,
    setOpen,
  } = props;


  // ========================================
  // CLOSE DIALOG
  // ========================================

  const handleClose =
    (): void => {
      setOpen(false);
    };


  // ========================================
  // SAMPLE CERTIFICATE DATA
  // ========================================

  /*
   * This is still temporary/sample data from the
   * original JSX implementation.
   *
   * Later we can replace this with data derived from:
   *
   * props.batch
   *
   * and the students assigned to that batch.
   */
  const rows: CertificateRow[] = [
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


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent
        sx={{
          pt: 2,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 360,
            boxShadow: 0,
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
                  row,
                  index
                ) => (
                  <StyledTableRow
                    key={index}
                  >
                    <StyledTableCell>
                      {
                        row.studentName
                      }
                    </StyledTableCell>

                    <StyledTableCell>
                      {
                        row.completionDate
                      }
                    </StyledTableCell>

                    <StyledTableCell>
                      {
                        row.score
                      }
                    </StyledTableCell>

                    <StyledTableCell>
                      {
                        row.attendance
                      }
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
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
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
        >
          Close
        </Button>

        {/*
          Future functionality:

          <Button
            variant="contained"
            onClick={() => window.print()}
          >
            Print / Download
          </Button>
        */}
      </DialogActions>
    </Dialog>
  );
};

export default ModalCertificate;