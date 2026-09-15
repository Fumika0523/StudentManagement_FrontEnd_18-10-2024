import {
  useEffect,
  useState,
} from "react";

import type {
  CSSProperties,
} from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  FiClipboard,
  FiBook,
  FiCalendar,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";

import ModalHeaderBlock from "../../Common/ModalHeaderBlock";

import type {
  Batch,
} from "../../../types/batch";


// ========================================
// TASK TABLE ROW TYPE
// ========================================

/*
 * This represents one flattened task row shown
 * inside CustomisedTaskTables.
 *
 * We export it because CustomisedTaskTables.tsx
 * will use the exact same structure next.
 */
export interface TaskTableRow {
  courseName: string;

  taskId: string;

  taskQuestion: string;

  batchNumbers: string[];

  /*
   * allocatedDay can come from the backend as
   * either a number/string, while "-" is used
   * by the existing UI when no value exists.
   */
  allocatedDay:
    | string
    | number;
}


// ========================================
// ASSIGNABLE BATCH TYPE
// ========================================

/*
 * Batch already has batchNumber.
 *
 * The existing UI also checks older alternative
 * properties batchNo and batchName, so we preserve
 * them as optional fields during the migration.
 */
interface AssignableBatch
  extends Batch {
  batchNo?: string;

  batchName?: string;
}


// ========================================
// ASSIGN PAYLOAD
// ========================================

/*
 * This is the object sent back to
 * CustomisedTaskTables when the user confirms
 * the batch assignment.
 */
export interface AssignTaskPayload {
  taskDetailId: string;

  courseName: string;

  allocatedDay:
    | string
    | number;

  batchId: string;

  batchNumber: string;
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalAssignTaskProps {
  show: boolean;

  onClose: () => void;

  /*
   * No task is selected while the modal
   * is initially closed, therefore null
   * is allowed.
   */
  task:
    | TaskTableRow
    | null;

  batchData:
    AssignableBatch[];

  /*
   * The parent performs the Axios request.
   *
   * Promise<void> represents the current async
   * handler used by CustomisedTaskTables.
   */
  onConfirm: (
    payload: AssignTaskPayload
  ) => Promise<void>;
}


// ========================================
// COMPONENT
// ========================================

const ModalAssignTask = ({
  show,
  onClose,
  task,
  batchData,
  onConfirm,
}: ModalAssignTaskProps) => {
  // TypeScript can infer these types, but keeping
  // them explicit makes the migration clearer.
  const [
    loading,
    setLoading,
  ] = useState<boolean>(
    false
  );

  const [
    selectedBatchId,
    setSelectedBatchId,
  ] = useState<string>(
    ""
  );


  // ========================================
  // RESET MODAL STATE
  // ========================================

  useEffect(() => {
    if (!show) {
      setLoading(
        false
      );

      setSelectedBatchId(
        ""
      );
    }
  }, [
    show,
  ]);


  // ========================================
  // SELECTED TASK VALUES
  // ========================================

  const courseName =
    task?.courseName ??
    "";

  const allocatedDay =
    task?.allocatedDay ??
    "-";


  // ========================================
  // AVAILABLE BATCHES
  // ========================================

  /*
   * Only batches for this course which are
   * currently In Progress may receive the task.
   */
  const filteredBatches =
    batchData.filter(
      (
        batch
      ) =>
        batch.courseName ===
          courseName &&
        batch.status ===
          "In Progress"
    );


  const selectedBatch =
    filteredBatches.find(
      (
        batch
      ) =>
        batch._id ===
        selectedBatchId
    );


  /*
   * batchNumber is the current Batch model field.
   *
   * batchNo and batchName are retained as
   * fallbacks for older data.
   */
  const selectedBatchNumber =
    selectedBatch?.batchNumber ??
    selectedBatch?.batchNo ??
    selectedBatch?.batchName ??
    "";


  /*
   * Boolean() ensures this expression always
   * produces a boolean instead of string | boolean.
   */
  const noBatches =
    Boolean(
      courseName
    ) &&
    filteredBatches.length ===
      0;


  // ========================================
  // CONFIRM ASSIGNMENT
  // ========================================

  const handleConfirm =
    async (): Promise<void> => {
      if (
        loading ||
        !task ||
        !selectedBatchId
      ) {
        return;
      }


      try {
        setLoading(
          true
        );


        await onConfirm({
          taskDetailId:
            task.taskId,

          courseName,

          allocatedDay,

          batchId:
            selectedBatchId,

          batchNumber:
            selectedBatchNumber,
        });


        onClose();
      } finally {
        setLoading(
          false
        );
      }
    };


  // ========================================
  // SHARED STYLES
  // ========================================

  /*
   * React.CSSProperties checks that our inline
   * CSS uses valid property/value combinations.
   */
  const infoCardStyle:
    CSSProperties = {
    backgroundColor:
      "#fff",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "10px",

    padding:
      "16px 18px",

    marginBottom:
      "10px",

    display:
      "flex",

    alignItems:
      "flex-start",

    gap:
      "12px",
  };


  const iconWrapStyle = (
    color: string
  ): CSSProperties => ({
    width:
      "34px",

    height:
      "34px",

    borderRadius:
      "8px",

    backgroundColor:
      color,

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    flexShrink:
      0,
  });


  const labelStyle:
    CSSProperties = {
    fontSize:
      "11px",

    fontWeight:
      700,

    color:
      "#94a3b8",

    textTransform:
      "uppercase",

    letterSpacing:
      "0.05em",

    marginBottom:
      "2px",
  };


  const valueStyle:
    CSSProperties = {
    fontSize:
      "14px",

    fontWeight:
      600,

    color:
      "#1e293b",
  };


  const selectStyle:
    CSSProperties = {
    borderRadius:
      "8px",

    padding:
      "9px 12px",

    fontSize:
      "13px",

    border:
      "1px solid #e2e8f0",

    backgroundColor:
      noBatches
        ? "#f8fafc"
        : "#fff",

    color:
      noBatches
        ? "#94a3b8"
        : "#1e293b",

    cursor:
      noBatches
        ? "not-allowed"
        : "pointer",
  };


  return (
    <Modal
      show={
        show
      }
      onHide={
        onClose
      }
      centered
      size="md"
      style={
        {
          /*
           * Bootstrap custom CSS variables are not
           * normal CSSProperties keys, so TypeScript
           * needs this assertion.
           */
          "--bs-modal-border-radius":
            "16px",
        } as CSSProperties
      }
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <ModalHeaderBlock
        title="Assign Task to Batch"
        icon={
          <FiClipboard />
        }
      />


      <Modal.Body
        style={{
          padding:
            "20px 24px",

          backgroundColor:
            "#f9fafb",
        }}
      >
        {/* ========================================
            ALLOCATED DAY
        ======================================== */}

        <div
          style={
            infoCardStyle
          }
        >
          <div
            style={
              iconWrapStyle(
                "#eff6ff"
              )
            }
          >
            <FiCalendar
              size={
                16
              }
              color="#3b82f6"
            />
          </div>

          <div>
            <div
              style={
                labelStyle
              }
            >
              Allocated Day
            </div>

            <div
              style={
                valueStyle
              }
            >
              {allocatedDay ===
              "-"
                ? "—"
                : `Day ${allocatedDay}`}
            </div>
          </div>
        </div>


        {/* ========================================
            COURSE
        ======================================== */}

        <div
          style={
            infoCardStyle
          }
        >
          <div
            style={
              iconWrapStyle(
                "#f0fdf4"
              )
            }
          >
            <FiBook
              size={
                16
              }
              color="#22c55e"
            />
          </div>

          <div>
            <div
              style={
                labelStyle
              }
            >
              Course
            </div>

            <div
              style={
                valueStyle
              }
            >
              {courseName ||
                "—"}
            </div>
          </div>
        </div>


        {/* ========================================
            TASK QUESTION
        ======================================== */}

        <div
          style={
            infoCardStyle
          }
        >
          <div
            style={
              iconWrapStyle(
                "#fefce8"
              )
            }
          >
            <FiClipboard
              size={
                16
              }
              color="#eab308"
            />
          </div>

          <div
            style={{
              flex:
                1,
            }}
          >
            <div
              style={
                labelStyle
              }
            >
              Task Question
            </div>

            <div
              style={{
                fontSize:
                  "13px",

                color:
                  "#334155",

                lineHeight:
                  1.6,
              }}
            >
              {task?.taskQuestion ||
                "—"}
            </div>
          </div>
        </div>


        {/* ========================================
            SELECT BATCH
        ======================================== */}

        <div
          style={{
            ...infoCardStyle,

            flexDirection:
              "column",

            gap:
              "10px",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",
            }}
          >
            <div
              style={
                iconWrapStyle(
                  "#f5f3ff"
                )
              }
            >
              <FiLayers
                size={
                  16
                }
                color="#8b5cf6"
              />
            </div>

            <div
              style={
                labelStyle
              }
            >
              Select Batch
              (In Progress only)
            </div>
          </div>


          <Form.Select
            value={
              selectedBatchId
            }
            onChange={(
              event
            ) =>
              setSelectedBatchId(
                event.target.value
              )
            }
            disabled={
              !courseName ||
              noBatches
            }
            style={
              selectStyle
            }
          >
            <option value="">
              {noBatches
                ? "No 'In Progress' batch available for this course"
                : "Select a batch..."}
            </option>


            {filteredBatches.map(
              (
                batch
              ) => (
                <option
                  key={
                    batch._id
                  }
                  value={
                    batch._id
                  }
                >
                  {
                    batch.batchNumber ||
                    batch.batchNo ||
                    batch.batchName ||
                    batch._id
                  }
                </option>
              )
            )}
          </Form.Select>


          {/* ========================================
              ALREADY ASSIGNED BATCHES
          ======================================== */}

          {task?.batchNumbers &&
            task.batchNumbers.length >
              0 && (
              <div
                style={{
                  fontSize:
                    "12px",

                  color:
                    "#64748b",

                  backgroundColor:
                    "#f1f5f9",

                  borderRadius:
                    "6px",

                  padding:
                    "8px 10px",
                }}
              >
                <span
                  style={{
                    fontWeight:
                      600,
                  }}
                >
                  Already assigned:{" "}
                </span>

                {task.batchNumbers.join(
                  ", "
                )}
              </div>
            )}
        </div>


        {/* ========================================
            NO AVAILABLE BATCH WARNING
        ======================================== */}

        {noBatches && (
          <div
            style={{
              backgroundColor:
                "#fff7ed",

              border:
                "1px solid #fed7aa",

              borderRadius:
                "8px",

              padding:
                "10px 14px",

              fontSize:
                "13px",

              color:
                "#c2410c",

              marginTop:
                "4px",
            }}
          >
            ⚠️ No batch with
            status{" "}
            <strong>
              "In Progress"
            </strong>{" "}
            found for{" "}
            <strong>
              {courseName}
            </strong>
            .
          </div>
        )}
      </Modal.Body>


      {/* ========================================
          FOOTER
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

          gap:
            "8px",
        }}
      >
        <Button
          onClick={
            onClose
          }
          disabled={
            loading
          }
          style={{
            backgroundColor:
              "transparent",

            border:
              "1px solid #d1d5db",

            color:
              "#6b7280",

            fontWeight:
              600,

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
          onClick={
            handleConfirm
          }
          disabled={
            loading ||
            !selectedBatchId
          }
          style={{
            background:
              !selectedBatchId
                ? "#e2e8f0"
                : "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",

            border:
              "none",

            fontWeight:
              700,

            fontSize:
              "13px",

            padding:
              "7px 22px",

            borderRadius:
              "8px",

            color:
              !selectedBatchId
                ? "#94a3b8"
                : "#fff",

            boxShadow:
              !selectedBatchId
                ? "none"
                : "0 2px 8px rgba(31,63,191,0.3)",

            cursor:
              !selectedBatchId
                ? "not-allowed"
                : "pointer",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "6px",
          }}
        >
          <FiCheckCircle
            size={
              15
            }
          />

          {loading
            ? "Assigning..."
            : "Confirm Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignTask;