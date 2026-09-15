import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
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

import {
  MdOutlineRateReview,
  MdDelete,
} from "react-icons/md";

import {
  IoIosInformationCircle,
} from "react-icons/io";

import {
  PiCertificateFill,
} from "react-icons/pi";

import {
  FaCircleCheck,
} from "react-icons/fa6";

import {
  FaUsers,
  FaEdit,
  FaLock,
} from "react-icons/fa";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ModalEditBatch from "./EditBatch/ModalEditBatch";
import ModalDeleteWarning from "./DeleteBatch/ModalDeleteWaning";
import {
  ModalShowStudentsList,
} from "./ModalShowStudentsList";

import type {
  BatchStudent,
} from "./ModalShowStudentsList";
import ModalCertificate from "./Certificate/ModalCertificate";

import {
  StyledTableCell,
  StyledTableRow,
  tableContainerStyles,
  url,
} from "../utils/constant";

// TypeScript:
// Reuse our shared Batch and Course types.
import type {
  Batch,
  BatchStatus,
} from "../../types/batch";

import type {
  Course,
} from "../../types/course";


// ========================================
// TEMPORARY STUDENT / ADMISSION TYPES
// ========================================

/*
 * ViewBatch currently passes Student and Admission data
 * as unknown[].
 *
 * Instead of creating duplicate full interfaces here,
 * we describe only the properties this table actually uses.
 *
 * Later, when the Student/Admission modules are fully
 * migrated, these can be replaced by their shared types.
 */

interface BatchAdmission {
  batchNumber: string;
  studentName: string;
}


// ========================================
// TYPE GUARDS
// ========================================

/*
 * TypeScript:
 * Because studentData/admissionData currently arrive
 * as unknown[], we must prove the objects have the
 * properties we need before accessing them.
 */
const isRecord = (
  value: unknown
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null
  );
};


const isBatchStudent = (
  value: unknown
): value is BatchStudent => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.studentName ===
    "string"
  );
};


const isBatchAdmission = (
  value: unknown
): value is BatchAdmission => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.batchNumber ===
      "string" &&
    typeof value.studentName ===
      "string"
  );
};


// ========================================
// COMPONENT PROPS
// ========================================

interface CustomisedBatchTablesProps {
  batchData: Batch[];

  setBatchData: Dispatch<
    SetStateAction<Batch[]>
  >;

  courseData: Course[];

  /*
   * These two arrays are still unknown[] in ViewBatch.
   * We safely narrow them with the type guards above.
   */
  admissionData: unknown[];

  studentData: unknown[];

  /*
   * These setters are currently passed by ViewBatch even
   * though this table does not use them directly.
   *
   * Keeping them optional here prevents us from having to
   * modify ViewBatch again during this file migration.
   */
  setAdmissionData?: Dispatch<
    SetStateAction<unknown[]>
  >;

  setStudentData?: Dispatch<
    SetStateAction<unknown[]>
  >;

  setCourseData?: Dispatch<
    SetStateAction<Course[]>
  >;
}


// ========================================
// BLINKING APPROVAL DOT CSS
// ========================================

const dotStyle = `
.live-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  background-color: red;
  border-radius: 50%;
  margin-right: 3px;
  box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
  }

  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
`;


// ========================================
// COMPUTE BATCH STATUS
// ========================================

/*
 * TypeScript:
 * course is optional because Array.find() may not
 * find a matching Course.
 *
 * Returning BatchStatus guarantees this function cannot
 * accidentally return an unsupported status string.
 */
const computeStatus = (
  batch: Batch,
  course?: Course
): BatchStatus => {
  if (
    batch.status ===
    "Batch Completed"
  ) {
    return "Batch Completed";
  }

  const numberOfDays =
    Number(course?.noOfDays);

  if (
    !batch.startDate ||
    !course ||
    !Number.isFinite(numberOfDays) ||
    numberOfDays <= 0
  ) {
    return (
      batch.status ||
      "Not Started"
    );
  }

  const startDate =
    new Date(batch.startDate);

  const endDate =
    new Date(
      startDate.getTime() +
        numberOfDays *
          24 *
          60 *
          60 *
          1000
    );

  const today =
    new Date();

  if (today < startDate) {
    return "Not Started";
  }

  if (
    today >= startDate &&
    today < endDate
  ) {
    return "In Progress";
  }

  return "Training Completed";
};


function CustomisedBatchTables({
  batchData,
  setBatchData,
  courseData,
  admissionData,
  studentData,
}: CustomisedBatchTablesProps) {
  // ========================================
  // MODAL STATES
  // ========================================

  const [show, setShow] =
    useState<boolean>(false);

    /*
 * TypeScript:
 * Keep track of which batch opened the Certificate modal.
 *
 * Initially there is no selected batch, so null is allowed.
 */
const [
  certificateBatch,
  setCertificateBatch,
] = useState<Batch | null>(null);
  /*
   * No batch is selected initially,
   * so the state must allow null.
   */
  const [
    singleBatch,
    setSingleBatch,
  ] = useState<Batch | null>(
    null
  );

  const [
    viewWarning,
    setViewWarning,
  ] = useState<boolean>(false);

  const [
    showStudentsModal,
    setShowStudentsModal,
  ] = useState<boolean>(false);

  const [
    selectedBatchStudents,
    setSelectedBatchStudents,
  ] = useState<
    BatchStudent[]
  >([]);

  const [
    openCertificate,
    setOpenCertificate,
  ] = useState<boolean>(false);


  // ========================================
  // PAGINATION
  // ========================================

  const [page, setPage] =
    useState<number>(0);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState<number>(15);


  // ========================================
  // COMPUTED STATUS MAP
  // ========================================

  /*
   * Example:
   *
   * {
   *   "mongoBatchId1": "In Progress",
   *   "mongoBatchId2": "Training Completed"
   * }
   */
  const [
    statusMap,
    setStatusMap,
  ] = useState<
    Record<string, BatchStatus>
  >({});


  // ========================================
  // AUTH
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );

  const role =
    localStorage.getItem(
      "role"
    );

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };


  // ========================================
  // PAGINATION HANDLERS
  // ========================================

  const handleChangePage = (
    _event:
      | MouseEvent<HTMLButtonElement>
      | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (
    event: ChangeEvent<
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

    setPage(0);
  };


  // ========================================
  // EDIT
  // ========================================

  const handleEditClick = (
    batch: Batch
  ): void => {
    setSingleBatch(batch);
    setShow(true);
  };


  // ========================================
  // DELETE
  // ========================================

  const handleDelete = (
    batch: Batch
  ): void => {
    if (role === "admin") {
      setSingleBatch(batch);
      setViewWarning(true);

      return;
    }

    toast.error(
      "To delete this information, please contact Super-Admin",
      {
        autoClose: 2000,
      }
    );
  };


  // ========================================
  // VIEW STUDENTS
  // ========================================

  const handleViewStudents = (
    batch: Batch
  ): void => {
    /*
     * TypeScript:
     * admissionData is unknown[], so first narrow each
     * item to BatchAdmission.
     */
    const studentsInBatchNames =
      admissionData
        .filter(
          isBatchAdmission
        )
        .filter(
          (admission) =>
            admission.batchNumber ===
            batch.batchNumber
        )
        .map(
          (admission) =>
            admission.studentName
        );

    /*
     * Narrow Student records before accessing studentName.
     */
    const studentsInBatch =
      studentData
        .filter(
          isBatchStudent
        )
        .filter(
          (student) =>
            studentsInBatchNames.includes(
              student.studentName
            )
        );

    setSelectedBatchStudents(
      studentsInBatch
    );

    setShowStudentsModal(
      true
    );
  };


  // ========================================
  // CERTIFICATE
  // ========================================

/*
 * TypeScript:
 * The Certificate modal requires the selected Batch.
 * Store it before opening the modal.
 */
const handleOpenCertificate = (
  batch: Batch
): void => {
  setCertificateBatch(batch);
  setOpenCertificate(true);
};

  // ========================================
  // ADMIN REVIEW
  // ========================================

  const handleAdminReviewClick = (
    batch: Batch
  ): void => {
    if (
      batch.approvalStatus ===
        "pending" &&
      batch.requestedBy
    ) {
      window.location.href =
        `/approve?batchId=${batch._id}`;
    }
  };


  // ========================================
  // SEND APPROVAL REQUEST
  // ========================================

  const handleSendApproval =
    async (
      batch: Batch
    ): Promise<void> => {
      try {
        await axios.post(
          `${url}/batch/send-approval-request`,
          {
            batchId:
              batch._id,

            username:
              localStorage.getItem(
                "username"
              ),
          },
          config
        );

        toast.success(
          "Approval request sent to Admin"
        );

        /*
         * TypeScript:
         * "pending" is one of the allowed
         * BatchApprovalStatus values.
         */
        setBatchData(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                batch._id
                  ? {
                      ...item,
                      approvalStatus:
                        "pending" as const,
                    }
                  : item
            )
        );
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "ERROR:",
            error.response?.data ||
              error.message
          );
        } else {
          console.error(
            "ERROR:",
            error
          );
        }

        toast.error(
          "Failed to send approval request"
        );
      }
    };


  // ========================================
  // BUILD STATUS MAP
  // ========================================

  useEffect(() => {
    if (
      batchData.length === 0
    ) {
      return;
    }

    setStatusMap(
      (previous) => {
        const updated:
          Record<
            string,
            BatchStatus
          > = {
          ...previous,
        };

        batchData.forEach(
          (batch) => {
            const course =
              courseData.find(
                (item) =>
                  item.courseName ===
                  batch.courseName
              );

            const newStatus =
              computeStatus(
                batch,
                course
              );

            updated[
              batch._id
            ] = newStatus;
          }
        );

        return updated;
      }
    );
  }, [
    batchData,
    courseData,
  ]);


  // ========================================
  // SYNC COMPUTED STATUS TO BACKEND
  // ========================================

  useEffect(() => {
    if (
      batchData.length === 0 ||
      !token
    ) {
      return;
    }

    const syncStatuses =
      async (): Promise<void> => {
        try {
          const updates =
            batchData.map(
              async (
                batch
              ): Promise<void> => {
                const localStatus =
                  statusMap[
                    batch._id
                  ];

                /*
                 * No backend update is required when
                 * the computed status is unchanged.
                 */
                if (
                  !localStatus ||
                  localStatus ===
                    batch.status
                ) {
                  return;
                }

                try {
                  await axios.put(
                    `${url}/updatebatch/${batch._id}`,
                    {
                      status:
                        localStatus,
                    },
                    config
                  );

                  setBatchData(
                    (previous) =>
                      previous.map(
                        (item) =>
                          item._id ===
                          batch._id
                            ? {
                                ...item,
                                status:
                                  localStatus,
                              }
                            : item
                      )
                  );
                } catch (
                  error: unknown
                ) {
                  console.error(
                    "Failed to sync status for batch",
                    batch._id,
                    error
                  );
                }
              }
            );

          await Promise.all(
            updates
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Error syncing batch statuses",
            error
          );
        }
      };

    void syncStatuses();

    // Existing behaviour intentionally triggers when
    // the computed status map changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusMap]);


  // ========================================
  // DATE FORMATTER
  // ========================================

  const formatDateTime = (
    date:
      | string
      | Date
      | null
      | undefined
  ): string => {
    if (!date) {
      return "-";
    }

    /*
     * TypeScript:
     * Date objects and API date strings are both supported.
     */
    const formattedDate =
      date instanceof Date
        ? date
        : new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "-";
    }

    return formattedDate
      .toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour12: true,
        }
      )
      .replace(
        "at",
        ""
      );
  };


  // ========================================
  // CHECK 7-DAY EDIT LOCK
  // ========================================

  const isOlderThan7Days = (
    dateString: string
  ): boolean => {
    const startDate =
      new Date(dateString);

    const today =
      new Date();

    const diffInDays =
      (
        today.getTime() -
        startDate.getTime()
      ) /
      (
        1000 *
        60 *
        60 *
        24
      );

    return diffInDays > 7;
  };


  // ========================================
  // ACTION ICONS
  // ========================================

  const renderActionIcons = (
    batch: Batch,
    status: BatchStatus
  ): ReactNode => {
    const approval =
      batch.approvalStatus ??
      "none";

    const isAdmin =
      role === "admin";

    const isStaff =
      role === "staff";

    const isOld =
      isOlderThan7Days(
        batch.startDate
      );


    const ViewUsersIcon = (
      <FaUsers
        className="text-secondary"
        style={{
          fontSize: "19px",
          cursor: "pointer",
        }}
        title="View batch users"
        onClick={() =>
          handleViewStudents(
            batch
          )
        }
      />
    );


    const CertificateIcon = (
      <PiCertificateFill
        className="text-primary fs-5"
        title="Certificate"
        style={{
          cursor: "pointer",
        }}
       onClick={() =>
  handleOpenCertificate(batch)
}
      />
    );


    const EditIcon = (
      <FaEdit
        className="text-success fs-5"
        style={{
          cursor: "pointer",
        }}
        title="Edit batch"
        onClick={() =>
          handleEditClick(
            batch
          )
        }
      />
    );


    /*
     * TypeScript:
     * LockIcon requires a string message.
     */
    const LockIcon = (
      message: string
    ): ReactNode => (
      <FaLock
        className="text-muted fs-5"
        style={{
          cursor: "pointer",
          opacity: 0.7,
        }}
        title={message}
        onClick={() =>
          toast.error(
            message,
            {
              autoClose:
                2000,
            }
          )
        }
      />
    );


    const ReviewIcon = (
      <MdOutlineRateReview
        className="text-primary"
        style={{
          fontSize: "20px",
          cursor: "pointer",
        }}
        title="Review approval request"
        onClick={() =>
          handleAdminReviewClick(
            batch
          )
        }
      />
    );


    const SendApprovalIcon = (
      <IoIosInformationCircle
        className="text-primary fs-5"
        style={{
          cursor: "pointer",
        }}
        title="Send approval request to Admin"
        onClick={() =>
          void handleSendApproval(
            batch
          )
        }
      />
    );


    const ApprovedDot = (
      <span
        className="live-dot"
        title="Approved - can edit"
      />
    );


    // ========================================
    // BATCH COMPLETED
    // ========================================

    if (
      status ===
      "Batch Completed"
    ) {
      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}

          <FaCircleCheck
            className="text-success fs-5"
            style={{
              cursor:
                "default",
            }}
            title="Batch fully completed"
          />

          {CertificateIcon}
        </div>
      );
    }


    // ========================================
    // NOT STARTED / IN PROGRESS
    // ========================================

    if (
      status ===
        "Not Started" ||
      status ===
        "In Progress"
    ) {
      if (
        isStaff &&
        isOld
      ) {
        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}

            {LockIcon(
              "This batch is locked (over 7 days old). Contact Admin."
            )}
          </div>
        );
      }

      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
          {EditIcon}
        </div>
      );
    }


    // ========================================
    // TRAINING COMPLETED
    // ========================================

    if (
      status ===
      "Training Completed"
    ) {
      if (isStaff) {
        if (
          approval ===
          "approved"
        ) {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              {ApprovedDot}
              {EditIcon}
            </div>
          );
        }


        if (
          approval ===
          "pending"
        ) {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}

              <FaLock
                className="text-muted"
                style={{
                  opacity: 0.7,
                  fontSize:
                    "16px",
                }}
                title="Pending"
              />

              <IoIosInformationCircle
                className="text-secondary fs-5"
                style={{
                  opacity: 0.4,
                  cursor:
                    "pointer",
                }}
                title="Admin approval is pending"
                onClick={() =>
                  toast.info(
                    "Waiting for admin approval…",
                    {
                      autoClose:
                        2000,
                    }
                  )
                }
              />
            </div>
          );
        }


        if (
          approval ===
          "declined"
        ) {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}

              {LockIcon(
                "Approval request was declined by Admin."
              )}
            </div>
          );
        }


        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}

            {LockIcon(
              "Training completed. Request approval from Admin to edit."
            )}

            {SendApprovalIcon}
          </div>
        );
      }


      if (isAdmin) {
        if (
          approval ===
          "pending"
        ) {
          return (
            <div className="d-flex align-items-center gap-2">
              {ViewUsersIcon}
              {ReviewIcon}
            </div>
          );
        }

        return (
          <div className="d-flex align-items-center gap-2">
            {ViewUsersIcon}

            <FaLock
              className="text-muted fs-5"
              style={{
                opacity: 0.7,
              }}
              title="Training completed. Editing is locked."
            />
          </div>
        );
      }


      return (
        <div className="d-flex align-items-center gap-2">
          {ViewUsersIcon}
        </div>
      );
    }


    return (
      <div className="d-flex align-items-center gap-2">
        {ViewUsersIcon}
      </div>
    );
  };


  // ========================================
  // PAGINATED DATA
  // ========================================

  const paginatedData =
    batchData.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );


  return (
    <>
      <style>
        {dotStyle}
      </style>

      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* ========================================
            TABLE
        ======================================== */}

        {batchData.length > 0 ? (
          <Paper
            sx={
              tableContainerStyles
            }
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      No.
                    </StyledTableCell>

                    <StyledTableCell>
                      Action
                    </StyledTableCell>

                    <StyledTableCell>
                      Batch No.
                    </StyledTableCell>

                    <StyledTableCell>
                      Status
                    </StyledTableCell>

                    <StyledTableCell>
                      Start Date
                    </StyledTableCell>

                    <StyledTableCell>
                      End Date
                    </StyledTableCell>

                    <StyledTableCell>
                      Class Type
                    </StyledTableCell>

                    <StyledTableCell>
                      Course
                    </StyledTableCell>

                    <StyledTableCell>
                      Session Day
                    </StyledTableCell>

                    <StyledTableCell>
                      Class Size
                    </StyledTableCell>

                    <StyledTableCell>
                      Location
                    </StyledTableCell>

                    <StyledTableCell>
                      Session Time
                    </StyledTableCell>

                    <StyledTableCell>
                      Fees
                    </StyledTableCell>

                    <StyledTableCell>
                      Assigned
                    </StyledTableCell>

                    <StyledTableCell>
                      Created
                    </StyledTableCell>

                    <StyledTableCell>
                      Updated
                    </StyledTableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {paginatedData.map(
                    (
                      batch,
                      index
                    ) => {
                      const course =
                        courseData.find(
                          (item) =>
                            item.courseName ===
                            batch.courseName
                        );

                      const status =
                        statusMap[
                          batch._id
                        ] ||
                        computeStatus(
                          batch,
                          course
                        );


                      /*
                       * TypeScript:
                       * Narrow unknown Admission values before
                       * reading batchNumber.
                       */
                      const actualAssignedCount =
                        admissionData
                          .filter(
                            isBatchAdmission
                          )
                          .filter(
                            (
                              admission
                            ) =>
                              admission.batchNumber ===
                              batch.batchNumber
                          ).length;


                      const startDate =
                        new Date(
                          batch.startDate
                        );


                      const numberOfDays =
                        Number(
                          course?.noOfDays
                        );


                      const endDate =
                        course &&
                        Number.isFinite(
                          numberOfDays
                        ) &&
                        numberOfDays >
                          0
                          ? new Date(
                              startDate.getTime() +
                                numberOfDays *
                                  24 *
                                  60 *
                                  60 *
                                  1000
                            )
                          : null;


                      /*
                       * Batch.targetStudent is currently stored
                       * as String by the backend schema.
                       *
                       * Convert it explicitly before doing a
                       * numeric comparison.
                       */
                      const targetStudentCount =
                        Number(
                          batch.targetStudent
                        );


                      const capacityReached =
                        Number.isFinite(
                          targetStudentCount
                        ) &&
                        actualAssignedCount >=
                          targetStudentCount;


                      return (
                        <StyledTableRow
                          key={
                            batch._id
                          }
                        >
                          <StyledTableCell>
                            {page *
                              rowsPerPage +
                              index +
                              1}
                          </StyledTableCell>


                          {/* Action icons */}
                          <StyledTableCell>
                            <div
                              style={{
                                display:
                                  "flex",

                                justifyContent:
                                  "space-between",

                                alignItems:
                                  "center",

                                gap:
                                  "8px",
                              }}
                            >
                              {renderActionIcons(
                                batch,
                                status
                              )}

                              <MdDelete
                                className={
                                  role ===
                                  "admin"
                                    ? "text-danger fs-5"
                                    : "fs-5 text-muted"
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
                                  handleDelete(
                                    batch
                                  )
                                }
                              />
                            </div>
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.batchNumber
                            }
                          </StyledTableCell>


                          {/* Status badge */}
                          <StyledTableCell>
                            <span
                              style={{
                                backgroundColor:
                                  status ===
                                  "Not Started"
                                    ? "#fdecea"
                                    : status ===
                                      "In Progress"
                                    ? "#faf3cdff"
                                    : status ===
                                      "Training Completed"
                                    ? "#e6f4ea"
                                    : "#a1c5feff",

                                color:
                                  status ===
                                  "Not Started"
                                    ? "#d32f2f"
                                    : status ===
                                      "In Progress"
                                    ? "#e18b08ff"
                                    : status ===
                                      "Training Completed"
                                    ? "#2e7d32"
                                    : "#042378ff",

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
                              {status}
                            </span>
                          </StyledTableCell>


                          <StyledTableCell>
                            {formatDateTime(
                              startDate
                            )}
                          </StyledTableCell>


                          <StyledTableCell>
                            {endDate
                              ? formatDateTime(
                                  endDate
                                )
                              : "-"}
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.sessionType
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.courseName
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.sessionDay
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.targetStudent
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {batch.location ??
                              "-"}
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.sessionTime
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {
                              batch.fees
                            }
                          </StyledTableCell>


                          <StyledTableCell
                            style={{
                              color:
                                capacityReached
                                  ? "red"
                                  : "inherit",
                            }}
                          >
                            {
                              actualAssignedCount
                            }{" "}
                            /{" "}
                            {
                              batch.targetStudent
                            }
                          </StyledTableCell>


                          <StyledTableCell>
                            {formatDateTime(
                              batch.createdAt
                            )}
                          </StyledTableCell>


                          <StyledTableCell>
                            {formatDateTime(
                              batch.updatedAt
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
              rowsPerPageOptions={[
                15,
                30,
                50,
                100,
              ]}
              component="div"
              count={
                batchData.length
              }
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

                    display:
                      "flex",

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
            No batches found
          </Alert>
        )}


        {/* ========================================
            EDIT MODAL
        ======================================== */}

        {show &&
          singleBatch && (
            <ModalEditBatch
              key={
                singleBatch._id
              }
              show={show}
              setShow={setShow}
              singleBatch={
                singleBatch
              }
              setSingleBatch={
                setSingleBatch
              }
              setBatchData={
                setBatchData
              }
              courseData={
                courseData
              }
            />
          )}


        {/* ========================================
            DELETE MODAL
        ======================================== */}

        {viewWarning &&
          singleBatch && (
            <ModalDeleteWarning
              viewWarning={
                viewWarning
              }
              singleBatch={
                singleBatch
              }
              setBatchData={
                setBatchData
              }
              setViewWarning={
                setViewWarning
              }
            />
          )}


        {/* ========================================
            STUDENTS LIST MODAL
        ======================================== */}

        {showStudentsModal && (
  <ModalShowStudentsList
    show={showStudentsModal}
    setShow={setShowStudentsModal}
    selectedBatchStudents={
      selectedBatchStudents
    }
  />
)}

        {/* ========================================
            CERTIFICATE MODAL
        ======================================== */}

      {certificateBatch && (
  <ModalCertificate
    open={openCertificate}
    setOpen={setOpenCertificate}
    batch={certificateBatch}
  />
)}
      </Box>
    </>
  );
}

export default CustomisedBatchTables;