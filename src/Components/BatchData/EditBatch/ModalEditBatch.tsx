import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  Col,
  Row,
} from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { url } from "../../utils/constant";
import { calcEndDate } from "../calcEndDate";

import {
  Edit,
  School,
  CalendarMonth,
  AccessTime,
  People,
  AttachMoney,
  Tag,
  Event,
  Wifi,
  CheckBox,
} from "@mui/icons-material";

// TypeScript:
// Reuse the shared Batch and Course types instead of
// redefining the API objects inside this modal.
import type {
  Batch,
  BatchStatus,
} from "../../../types/batch";

import type {
  Course,
} from "../../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalEditBatchProps {
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;

  /*
   * The parent only opens this modal after a Batch
   * has been selected, so singleBatch is a Batch here
   * rather than Batch | null.
   */
  singleBatch: Batch;

  setBatchData: Dispatch<
    SetStateAction<Batch[]>
  >;

  courseData: Course[];

  /*
   * TypeScript:
   * CustomisedBatchTables currently passes this prop.
   *
   * ModalEditBatch does not actually use it, but declaring
   * it keeps the existing parent/child API compatible while
   * we migrate the Batch module file by file.
   */
  setSingleBatch?: Dispatch<
    SetStateAction<Batch | null>
  >;
}


// ========================================
// FORM VALUES
// ========================================

/*
 * Edit-form values are slightly different from the final
 * Batch API object.
 *
 * HTML form controls may temporarily hold empty strings,
 * so numeric/database fields cannot always be typed only
 * as number while the user is editing.
 */
interface BatchEditFormValues {
  batchNumber: string;
  courseName: string;
  sessionType: string;
  sessionDay: string;
  targetStudent: string;
  sessionTime: string;
  fees: number | string;
  startDate: string;
  status: BatchStatus | "";
}


// ========================================
// API RESPONSE
// ========================================

interface BatchListResponse {
  batchData: Batch[];
}


// ========================================
// COMPLETION CHECKBOXES
// ========================================

interface CompletionCheckboxes {
  assign: boolean;
  deassign: boolean;
  dropout: boolean;
  certificate: boolean;
}

type CompletionCheckboxKey =
  keyof CompletionCheckboxes;


/*
 * TypeScript:
 * Giving these names the CompletionCheckboxKey type
 * means checkboxes[item.name] is type-safe later.
 */
const completionChecklistItems: Array<{
  name: CompletionCheckboxKey;
  label: string;
}> = [
  {
    name: "assign",
    label: "Assign",
  },
  {
    name: "deassign",
    label: "Deassign",
  },
  {
    name: "dropout",
    label: "Drop-out",
  },
  {
    name: "certificate",
    label: "Certificate Generated",
  },
];


function ModalEditBatch({
  show,
  setShow,
  singleBatch,
  setBatchData,
  courseData,
}: ModalEditBatchProps) {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const isStaff =
    role === "staff";

  /*
   * approvalStatus is optional on Batch because older
   * batches may never have entered the approval workflow.
   */
  const approval =
    singleBatch.approvalStatus ??
    null;


  // ========================================
  // LOCAL STATE
  // ========================================

  const [checkboxes, setCheckboxes] =
    useState<CompletionCheckboxes>({
      assign: false,
      deassign: false,
      dropout: false,
      certificate: false,
    });

  const allChecked =
    Object.values(
      checkboxes
    ).every(Boolean);


  /*
   * TypeScript:
   * Batch status normally uses BatchStatus, but the form
   * can temporarily contain an empty value.
   */
  const [
    batchStatus,
    setBatchStatus,
  ] = useState<
    BatchStatus | ""
  >(
    singleBatch.status || ""
  );


  /*
   * Auto-calculated from startDate + Course.noOfDays.
   */
  const [endDate, setEndDate] =
    useState<string>("");


  /*
   * The original JSX created isLocked as false and never
   * changed it.
   *
   * Keeping it as a constant preserves that behaviour
   * without maintaining an unused state setter.
   */
  const isLocked = false;


  // ========================================
  // AUTH
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose = (): void => {
    setShow(false);

    navigate("/batchdata");
  };


  // ========================================
  // PERMISSION / STATUS RULES
  // ========================================

  const isTrainingCompleted =
    batchStatus ===
    "Training Completed";

  const canSelectBatchCompleted =
    isTrainingCompleted &&
    allChecked &&
    isStaff &&
    approval === "approved";

  const canEditWhenTrainingCompleted =
    isStaff &&
    approval === "approved";

  const canEditFields =
    !isTrainingCompleted ||
    canEditWhenTrainingCompleted;


  // ========================================
  // VALIDATION
  // ========================================

  const formSchema = Yup
    .object()
    .shape({
      batchNumber:
        Yup.string().required(
          "Mandatory Field !"
        ),

      courseName:
        Yup.string().required(
          "Mandatory Field !"
        ),

      sessionDay:
        Yup.string().required(
          "Mandatory Field !"
        ),

      targetStudent:
        Yup.string().required(
          "Mandatory Field !"
        ),

      sessionTime:
        Yup.string().required(
          "Mandatory Field !"
        ),

      fees:
        Yup.number().required(
          "Mandatory Field !"
        ),

      status:
        Yup.string(),
    });


  // ========================================
  // FORMIK
  // ========================================

  /*
   * TypeScript:
   * <BatchEditFormValues> tells Formik the exact
   * structure of formik.values.
   */
  const formik =
    useFormik<BatchEditFormValues>({
      enableReinitialize: true,

      initialValues: {
        batchNumber:
          singleBatch.batchNumber ||
          "",

        courseName:
          singleBatch.courseName ||
          "",

        sessionType:
          singleBatch.sessionType ||
          "",

        sessionDay:
          singleBatch.sessionDay ||
          "",

        targetStudent:
          singleBatch.targetStudent ||
          "",

        sessionTime:
          singleBatch.sessionTime ||
          "",

        fees:
          singleBatch.fees ??
          "",

        startDate:
          singleBatch.startDate
            ? new Date(
                singleBatch.startDate
              )
                .toISOString()
                .split("T")[0]
            : "",

        status:
          singleBatch.status ||
          "",
      },

      validationSchema:
        formSchema,

      onSubmit: (values) => {
        void updateBatch(
          values
        );
      },
    });


  // ========================================
  // RECALCULATE END DATE
  // ========================================

  useEffect(() => {
    /*
     * TypeScript:
     * Array.find() returns Course | undefined.
     */
    const course =
      courseData.find(
        (item) =>
          item.courseName
            ?.trim()
            .toLowerCase() ===
          formik.values.courseName
            ?.trim()
            .toLowerCase()
      );

    const calculated =
      calcEndDate(
        formik.values.startDate,
        course?.noOfDays
      );

    setEndDate(calculated);
  }, [
    formik.values.startDate,
    formik.values.courseName,
    courseData,
  ]);


  // ========================================
  // AUTOMATIC BATCH STATUS
  // ========================================

  useEffect(() => {
    if (
      !singleBatch.startDate
    ) {
      return;
    }

    const course =
      courseData.find(
        (item) =>
          item.courseName
            ?.trim()
            .toLowerCase() ===
          singleBatch.courseName
            ?.trim()
            .toLowerCase()
      );

    const days =
      Number(
        course?.noOfDays
      );

    /*
     * If Course.noOfDays is missing or invalid,
     * retain the status currently stored in the DB.
     */
    if (
      !Number.isFinite(days) ||
      days <= 0
    ) {
      setBatchStatus(
        singleBatch.status
      );

      void formik.setFieldValue(
        "status",
        singleBatch.status
      );

      return;
    }

    const calculatedEndDate =
      calcEndDate(
        singleBatch.startDate,
        course?.noOfDays
      );

    const end =
      new Date(
        calculatedEndDate
      );

    const today =
      new Date();

    const start =
      new Date(
        singleBatch.startDate
      );

    let newStatus:
      BatchStatus =
      singleBatch.status;


    /*
     * Once fully completed, do not automatically
     * move a batch backwards into another status.
     */
    if (
      singleBatch.status ===
      "Batch Completed"
    ) {
      newStatus =
        "Batch Completed";
    } else if (
      today < start
    ) {
      newStatus =
        "Not Started";
    } else if (
      today >= start &&
      today < end
    ) {
      newStatus =
        "In Progress";
    } else {
      newStatus =
        "Training Completed";
    }

    setBatchStatus(
      newStatus
    );

    void formik.setFieldValue(
      "status",
      newStatus
    );

    // Existing behaviour intentionally depends on
    // the selected batch and Course data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    singleBatch,
    courseData,
  ]);


  // ========================================
  // UPDATE BATCH
  // ========================================

  const updateBatch = async (
    updatedBatch:
      BatchEditFormValues
  ): Promise<void> => {
    try {
      /*
       * The API payload also includes the calculated
       * status and end date.
       */
      const payload = {
        ...updatedBatch,
        status: batchStatus,
        endDate,
      };

      await axios.put(
        `${url}/updatebatch/${singleBatch._id}`,
        payload,
        config
      );

      /*
       * Refetch the complete Batch collection after
       * a successful update.
       */
      const refreshed =
        await axios.get<BatchListResponse>(
          `${url}/allbatch`,
          config
        );

      setBatchData(
        refreshed.data.batchData
      );

      toast.success(
        "Batch updated successfully!",
        {
          autoClose: 2000,
        }
      );

      handleClose();
    } catch (error: unknown) {
      console.error(
        "Error Editing Batch:",
        error
      );
    }
  };


  // ========================================
  // CHECKBOX CHANGE
  // ========================================

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    /*
     * These names come only from completionChecklistItems,
     * whose values are restricted to CompletionCheckboxKey.
     */
    const name =
      event.target
        .name as CompletionCheckboxKey;

    const checked =
      event.target.checked;

    setCheckboxes(
      (previous) => ({
        ...previous,
        [name]: checked,
      })
    );
  };


  // ========================================
  // SYNC AUTO STATUS WITH BACKEND
  // ========================================

  useEffect(() => {
    if (
      !singleBatch._id ||
      !batchStatus ||
      batchStatus ===
        singleBatch.status
    ) {
      return;
    }

    const updateStatusOnly =
      async (): Promise<void> => {
        try {
          await axios.put(
            `${url}/updatebatch/${singleBatch._id}`,
            {
              status:
                batchStatus,
            },
            config
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Error updating batch status only:",
            error
          );
        }
      };

    void updateStatusOnly();

    // Existing behaviour only synchronises when
    // batchStatus changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchStatus]);


  // ========================================
  // SAVE PERMISSION
  // ========================================

  /*
   * This preserves the current JSX logic.
   *
   * isLocked is currently always false, so Save is
   * normally enabled unless Formik itself is submitting.
   */
  const canSave =
    !isLocked ||
    (
      batchStatus ===
        "Batch Completed" &&
      allChecked
    );


  // ========================================
  // STYLES
  // ========================================

  const labelStyle:
    CSSProperties = {
    fontWeight: 600,
    fontSize: "12px",
    color: "#475569",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const inputStyle:
    CSSProperties = {
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    border:
      "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#1e293b",
  };

  const disabledInputStyle:
    CSSProperties = {
    ...inputStyle,
    backgroundColor:
      "#f8fafc",
    color: "#94a3b8",
    cursor: "not-allowed",
    border:
      "1px solid #f1f5f9",
  };

  const errorStyle:
    CSSProperties = {
    fontSize: "11px",
    marginTop: "4px",
    color: "#ef4444",
  };


  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{
        // TypeScript:
        // React does not normally know Bootstrap custom
        // CSS variables, so cast only this custom property.
        ...({
          "--bs-modal-border-radius":
            "16px",
        } as CSSProperties),
      }}
    >
      <Modal.Header
        closeButton
        style={{
          background:
            "linear-gradient(180deg, #1f3fbf 0%, #1b2f7a 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius:
            "16px 16px 0 0",
          padding:
            "20px 24px",
        }}
      >
        <Modal.Title
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          <Edit
            sx={{
              fontSize: "28px",
            }}
          />

          Edit Batch
        </Modal.Title>
      </Modal.Header>


      <Form
        onSubmit={
          formik.handleSubmit
        }
      >
        <Modal.Body
          style={{
            padding: "24px",
            backgroundColor:
              "#f9fafb",
          }}
        >
          {/* ========================================
              COMPLETION CHECKLIST
          ======================================== */}

          {isTrainingCompleted && (
            <div
              style={{
                marginBottom:
                  "16px",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "10px",
                padding:
                  "14px 16px",
                backgroundColor:
                  "#fff",
              }}
            >
              <p
                style={{
                  fontSize:
                    "12px",
                  fontWeight: 700,
                  color:
                    "#475569",
                  marginBottom:
                    "10px",
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.05em",
                }}
              >
                <CheckBox
                  sx={{
                    fontSize: 14,
                    mr: 0.5,
                  }}
                />

                Completion Checklist
              </p>

              <Row>
                {completionChecklistItems.map(
                  (item) => (
                    <Col
                      key={
                        item.name
                      }
                      lg={3}
                      md={3}
                      sm={6}
                    >
                      <Form.Check
                        type="checkbox"
                        label={
                          item.label
                        }
                        name={
                          item.name
                        }
                        checked={
                          checkboxes[
                            item.name
                          ]
                        }
                        onChange={
                          handleCheckboxChange
                        }
                        style={{
                          fontSize:
                            "13px",
                          whiteSpace:
                            "nowrap",
                        }}
                      />
                    </Col>
                  )
                )}
              </Row>
            </div>
          )}


          {/* ========================================
              ROW 1
          ======================================== */}

          <Row className="g-3 mb-3">
            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <Tag
                  sx={{
                    fontSize: 14,
                  }}
                />

                Batch Number
              </Form.Label>

              <Form.Control
                type="text"
                name="batchNumber"
                value={
                  formik.values
                    .batchNumber
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              />

              {formik.errors
                .batchNumber &&
                formik.touched
                  .batchNumber && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .batchNumber
                    }
                  </div>
                )}
            </Col>


            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                Status
              </Form.Label>

              {canSelectBatchCompleted ? (
                <Form.Select
                  name="status"
                  value={
                    batchStatus
                  }
                  style={
                    inputStyle
                  }
                  onChange={(
                    event
                  ) => {
                    const newStatus =
                      event
                        .target
                        .value as
                        | BatchStatus
                        | "";

                    setBatchStatus(
                      newStatus
                    );

                    void formik.setFieldValue(
                      "status",
                      newStatus
                    );
                  }}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Batch Completed">
                    Batch Completed
                  </option>
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  value={
                    batchStatus
                  }
                  disabled
                  style={
                    disabledInputStyle
                  }
                />
              )}
            </Col>


            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <School
                  sx={{
                    fontSize: 14,
                  }}
                />

                Course Name
              </Form.Label>

              <Form.Control
                type="text"
                name="courseName"
                value={
                  formik.values
                    .courseName
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              />

              {formik.errors
                .courseName &&
                formik.touched
                  .courseName && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .courseName
                    }
                  </div>
                )}
            </Col>
          </Row>


          {/* ========================================
              ROW 2
          ======================================== */}

          <Row className="g-3 mb-3">
            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <CalendarMonth
                  sx={{
                    fontSize: 14,
                  }}
                />

                Start Date
              </Form.Label>

              <Form.Control
                type="date"
                name="startDate"
                value={
                  formik.values
                    .startDate
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              />
            </Col>


            {/* Automatically calculated end date */}
            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <CalendarMonth
                  sx={{
                    fontSize: 14,
                  }}
                />

                End Date (auto)
              </Form.Label>

              <Form.Control
                type="date"
                value={endDate}
                disabled
                style={
                  disabledInputStyle
                }
              />
            </Col>


            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <Wifi
                  sx={{
                    fontSize: 14,
                  }}
                />

                Session Type
              </Form.Label>

              <Form.Select
                name="sessionType"
                value={
                  formik.values
                    .sessionType
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              >
                <option value="">
                  Select Type
                </option>

                <option value="Online">
                  🌐 Online
                </option>

                <option value="At School">
                  🏫 At School
                </option>
              </Form.Select>
            </Col>
          </Row>


          {/* ========================================
              ROW 3
          ======================================== */}

          <Row className="g-3 mb-3">
            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <Event
                  sx={{
                    fontSize: 14,
                  }}
                />

                Session Day
              </Form.Label>

              <Form.Select
                name="sessionDay"
                value={
                  formik.values
                    .sessionDay
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              >
                <option value="">
                  Select Day
                </option>

                <option value="Weekday">
                  📅 Weekday
                </option>

                <option value="Weekend">
                  🎉 Weekend
                </option>
              </Form.Select>

              {formik.errors
                .sessionDay &&
                formik.touched
                  .sessionDay && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .sessionDay
                    }
                  </div>
                )}
            </Col>


            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <AccessTime
                  sx={{
                    fontSize: 14,
                  }}
                />

                Session Time
              </Form.Label>

              <Form.Select
                name="sessionTime"
                value={
                  formik.values
                    .sessionTime
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              >
                <option value="">
                  Select Time
                </option>

                <option value="Morning">
                  🌅 Morning
                </option>

                <option value="Afternoon">
                  ☀️ Afternoon
                </option>

                <option value="Evening">
                  🌆 Evening
                </option>
              </Form.Select>

              {formik.errors
                .sessionTime &&
                formik.touched
                  .sessionTime && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .sessionTime
                    }
                  </div>
                )}
            </Col>


            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <People
                  sx={{
                    fontSize: 14,
                  }}
                />

                Target Students
              </Form.Label>

              <Form.Control
                type="number"
                name="targetStudent"
                value={
                  formik.values
                    .targetStudent
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                min={1}
                placeholder="e.g. 20"
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              />

              {formik.errors
                .targetStudent &&
                formik.touched
                  .targetStudent && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .targetStudent
                    }
                  </div>
                )}
            </Col>
          </Row>


          {/* ========================================
              ROW 4
          ======================================== */}

          <Row className="g-3">
            <Col
              xs={12}
              md={4}
            >
              <Form.Label
                style={labelStyle}
              >
                <AttachMoney
                  sx={{
                    fontSize: 14,
                  }}
                />

                Fees
              </Form.Label>

              <Form.Control
                type="number"
                name="fees"
                value={
                  formik.values
                    .fees
                }
                onChange={
                  formik.handleChange
                }
                disabled={
                  !canEditFields
                }
                style={
                  !canEditFields
                    ? disabledInputStyle
                    : inputStyle
                }
              />

              {formik.errors
                .fees &&
                formik.touched
                  .fees && (
                  <div
                    style={
                      errorStyle
                    }
                  >
                    {
                      formik.errors
                        .fees
                    }
                  </div>
                )}
            </Col>
          </Row>
        </Modal.Body>


        {/* ========================================
            MODAL FOOTER
        ======================================== */}

        <Modal.Footer
          style={{
            borderTop:
              "1px solid #e5e7eb",
            padding:
              "14px 24px",
            backgroundColor:
              "#ffffff",
            borderRadius:
              "0 0 16px 16px",
            gap: "8px",
          }}
        >
          <Button
            onClick={handleClose}
            style={{
              backgroundColor:
                "transparent",
              border:
                "1px solid #d1d5db",
              color:
                "#6b7280",
              fontWeight: 600,
              fontSize:
                "13px",
              padding:
                "7px 18px",
              borderRadius:
                "8px",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              !canSave ||
              formik.isSubmitting
            }
            style={{
              background:
                canSave
                  ? "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)"
                  : "#e2e8f0",

              border: "none",
              fontWeight: 700,
              fontSize:
                "13px",
              padding:
                "7px 22px",
              borderRadius:
                "8px",

              color:
                canSave
                  ? "#fff"
                  : "#94a3b8",

              boxShadow:
                canSave
                  ? "0 2px 8px rgba(31,63,191,0.3)"
                  : "none",

              cursor:
                canSave
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {formik.isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalEditBatch;