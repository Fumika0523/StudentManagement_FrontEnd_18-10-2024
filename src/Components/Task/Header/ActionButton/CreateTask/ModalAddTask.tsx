import type {
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

import {
  useMemo,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  useFormik,
} from "formik";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  Col,
  Row,
} from "react-bootstrap";

import {
  toast,
} from "react-toastify";

import {
  FiBook,
  FiCalendar,
  FiClipboard,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import {
  url,
} from "../../../../utils/constant";

import ModalHeaderBlock from "../../../../Common/ModalHeaderBlock";

import {
  emptyDetail,
  taskInitialValues,
  TaskSchema,
} from "./TaskSchema";

import type {
  TaskFormValues,
} from "./TaskSchema";

import type {
  Course,
} from "../../../../../types/course";

import type {
  Batch,
} from "../../../../../types/batch";


// ========================================
// TASK API TYPES
// ========================================

/*
 * These interfaces describe task data returned
 * by the backend.
 *
 * They also cover the fields currently read by
 * ViewTask and CustomisedTaskTables.
 */
export interface TaskDetailRecord {
  _id?: string;

  taskQuestion?: string;

  batchNumber?: string[];

  allocatedDay?: string | number;

  batchId?: string | null;
}


export interface TaskRecord {
  _id?: string;

  taskCourseName?: string;

  courseId?: string;

  courseName?: string;

  batchNumber?: string | string[];

  taskDetail?: TaskDetailRecord[];

  createdAt?: string;

  updatedAt?: string;
}


interface TaskListResponse {
  taskData?: TaskRecord[];
}


interface ApiErrorResponse {
  message?: string;
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ModalAddTaskProps {
  show: boolean;

  setShow:
    Dispatch<
      SetStateAction<boolean>
    >;

  setTaskData:
    Dispatch<
      SetStateAction<TaskRecord[]>
    >;

  courseData: Course[];

  /*
   * The current ModalAddTask receives batchData
   * from its parent even though it does not use
   * it yet. Keep it typed so we preserve the
   * existing component API.
   */
  batchData?: Batch[];
}


// ========================================
// DETAIL ERROR FIELDS
// ========================================

type DetailErrorField =
  | "taskQuestion"
  | "allocatedDay";


// ========================================
// COMPONENT
// ========================================

const ModalAddTask = ({
  show,
  setShow,
  setTaskData,
  courseData,
  batchData,
}: ModalAddTaskProps) => {
  // Keep the existing prop contract until the
  // parent Task components are migrated.
  void batchData;


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [
        token,
      ]
    );


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<TaskFormValues>({
      initialValues:
        taskInitialValues,

      validationSchema:
        TaskSchema,

      enableReinitialize:
        true,

      onSubmit: async (
        values
      ): Promise<void> => {
        try {
          const response =
            await axios.post(
              `${url}/addtask`,
              values,
              config
            );


          if (
            response.status ===
            200
          ) {
            toast.success(
              "Task successfully added!",
              {
                style: {
                  color:
                    "black",
                },
              }
            );


            /*
             * Refresh the task list after the
             * new task has been created.
             */
            const list =
              await axios.get<TaskListResponse>(
                `${url}/alltask`,
                config
              );


            setTaskData(
              list.data.taskData ??
                []
            );


            formik.resetForm();

            setShow(
              false
            );
          }
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError<ApiErrorResponse>(
              error
            )
          ) {
            console.error(
              "Error adding task:",
              error.response?.data ??
                error.message
            );


            toast.error(
              error.response?.data?.message ??
                "Failed to add task."
            );

            return;
          }


          console.error(
            "Error adding task:",
            error
          );


          toast.error(
            "Failed to add task."
          );
        }
      },
    });


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose = (): void => {
    formik.resetForm();

    setShow(
      false
    );
  };


  // ========================================
  // ADD DETAIL ROW
  // ========================================

  const addDetailRow = (): void => {
    /*
     * Copy emptyDetail so every row receives
     * its own object rather than sharing the
     * same object reference.
     */
    void formik.setFieldValue(
      "taskDetail",
      [
        ...formik.values.taskDetail,

        {
          ...emptyDetail,

          /*
           * Also create a fresh batch array because
           * emptyDetail contains an array property.
           */
          batchNumber: [
            ...emptyDetail.batchNumber,
          ],
        },
      ]
    );
  };


  // ========================================
  // REMOVE DETAIL ROW
  // ========================================

  const removeDetailRow = (
    index: number
  ): void => {
    const updated =
      formik.values.taskDetail.filter(
        (
          _detail,
          detailIndex
        ) =>
          detailIndex !==
          index
      );


    void formik.setFieldValue(
      "taskDetail",
      updated
    );
  };


  // ========================================
  // GET NESTED FORMIK ERROR
  // ========================================

  const getDetailError = (
    index: number,
    field:
      DetailErrorField
  ): string | undefined => {
    const touchedRow =
      formik.touched.taskDetail?.[
        index
      ];


    if (
      !touchedRow?.[
        field
      ]
    ) {
      return undefined;
    }


    const detailErrors =
      formik.errors.taskDetail;


    /*
     * taskDetail errors may also be a single
     * string when Yup's array-level validation
     * fails, so narrow it before indexing.
     */
    if (
      !Array.isArray(
        detailErrors
      )
    ) {
      return undefined;
    }


    const rowError =
      detailErrors[
        index
      ];


    if (
      !rowError ||
      typeof rowError ===
        "string"
    ) {
      return undefined;
    }


    const fieldError =
      rowError[
        field
      ];


    return typeof fieldError ===
      "string"
      ? fieldError
      : undefined;
  };


  // ========================================
  // SHARED STYLES
  // ========================================

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
      "6px",
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
      "#fff",

    color:
      "#1e293b",

    width:
      "100%",
  };


  const inputStyle:
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
      "#fff",

    color:
      "#1e293b",

    width:
      "100%",

    outline:
      "none",
  };


  const taskCardStyle:
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
  };


  const isSubmitDisabled =
    formik.isSubmitting;


  return (
    <Modal
      show={
        show
      }
      onHide={
        handleClose
      }
      size="lg"
      centered
      style={
        {
          /*
           * Bootstrap exposes this as a custom
           * CSS variable, so TypeScript needs
           * a CSSProperties assertion here.
           */
          "--bs-modal-border-radius":
            "16px",
        } as CSSProperties
      }
    >
      <ModalHeaderBlock
        title="Add Task"
        icon={
          <FiClipboard />
        }
      />


      <Form
        onSubmit={
          formik.handleSubmit
        }
      >
        <Modal.Body
          style={{
            padding:
              "20px 24px",

            backgroundColor:
              "#f9fafb",
          }}
        >
          {/* ========================================
              COURSE NAME
          ======================================== */}

          <div
            style={
              infoCardStyle
            }
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "12px",

                marginBottom:
                  "10px",
              }}
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


              <div
                style={
                  labelStyle
                }
              >
                Course Name
              </div>
            </div>


            <Form.Select
              name="taskCourseName"
              value={
                formik.values.taskCourseName
              }
              onChange={(
                event
              ) => {
                void formik.setFieldValue(
                  "taskCourseName",
                  event.target.value,
                  true
                );

                void formik.setFieldTouched(
                  "taskCourseName",
                  false,
                  false
                );
              }}
              onBlur={
                formik.handleBlur
              }
              style={
                selectStyle
              }
            >
              <option value="">
                Select Course
              </option>


              {courseData.map(
                (
                  course
                ) => (
                  <option
                    key={
                      course._id
                    }
                    value={
                      course.courseName
                    }
                  >
                    {
                      course.courseName
                    }
                  </option>
                )
              )}
            </Form.Select>


            {formik.touched.taskCourseName &&
              formik.errors.taskCourseName && (
                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#ef4444",

                    marginTop:
                      "4px",
                  }}
                >
                  {
                    formik.errors.taskCourseName
                  }
                </div>
              )}
          </div>


          {/* ========================================
              TASK DETAILS HEADER
          ======================================== */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              margin:
                "16px 0 10px",
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "8px",
              }}
            >
              <div
                style={
                  iconWrapStyle(
                    "#f5f3ff"
                  )
                }
              >
                <FiClipboard
                  size={
                    15
                  }
                  color="#8b5cf6"
                />
              </div>


              <span
                style={{
                  fontSize:
                    "13px",

                  fontWeight:
                    700,

                  color:
                    "#475569",

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "0.05em",
                }}
              >
                Task Details
              </span>
            </div>


            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              onClick={
                addDetailRow
              }
              style={{
                fontSize:
                  "12px",

                fontWeight:
                  600,

                borderRadius:
                  "8px",

                padding:
                  "5px 12px",

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "5px",
              }}
            >
              <FiPlus
                size={
                  13
                }
              />

              Add Row
            </Button>
          </div>


          {/* ========================================
              TASK DETAIL ROWS
          ======================================== */}

          {formik.values.taskDetail.map(
            (
              detail,
              index
            ) => {
              const questionError =
                getDetailError(
                  index,
                  "taskQuestion"
                );


              const allocatedDayError =
                getDetailError(
                  index,
                  "allocatedDay"
                );


              return (
                <div
                  key={
                    index
                  }
                  style={
                    taskCardStyle
                  }
                >
                  {/* TASK ROW HEADER */}

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "12px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "8px",
                      }}
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
                            14
                          }
                          color="#3b82f6"
                        />
                      </div>


                      <span
                        style={{
                          fontSize:
                            "12px",

                          fontWeight:
                            700,

                          color:
                            "#64748b",

                          textTransform:
                            "uppercase",

                          letterSpacing:
                            "0.04em",
                        }}
                      >
                        Task #{index + 1}
                      </span>
                    </div>


                    {formik.values.taskDetail.length >
                      1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        type="button"
                        onClick={() =>
                          removeDetailRow(
                            index
                          )
                        }
                        style={{
                          fontSize:
                            "12px",

                          borderRadius:
                            "8px",

                          padding:
                            "4px 10px",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "4px",
                        }}
                      >
                        <FiTrash2
                          size={
                            13
                          }
                        />
                      </Button>
                    )}
                  </div>


                  <Row>
                    {/* ========================================
                        TASK QUESTION
                    ======================================== */}

                    <Col
                      xs={
                        12
                      }
                      md={
                        8
                      }
                    >
                      <div
                        style={{
                          marginBottom:
                            "8px",
                        }}
                      >
                        <div
                          style={
                            labelStyle
                          }
                        >
                          Task Question
                        </div>


                        <textarea
                          rows={
                            2
                          }
                          name={
                            `taskDetail[${index}].taskQuestion`
                          }
                          value={
                            detail.taskQuestion
                          }
                          onChange={
                            formik.handleChange
                          }
                          onBlur={
                            formik.handleBlur
                          }
                          placeholder="Enter task question..."
                          style={{
                            ...inputStyle,

                            resize:
                              "vertical",

                            fontFamily:
                              "inherit",
                          }}
                        />


                        {questionError && (
                          <div
                            style={{
                              fontSize:
                                "12px",

                              color:
                                "#ef4444",

                              marginTop:
                                "3px",
                            }}
                          >
                            {
                              questionError
                            }
                          </div>
                        )}
                      </div>
                    </Col>


                    {/* ========================================
                        ALLOCATED DAY
                    ======================================== */}

                    <Col
                      xs={
                        12
                      }
                      md={
                        4
                      }
                    >
                      <div
                        style={{
                          marginBottom:
                            "8px",
                        }}
                      >
                        <div
                          style={
                            labelStyle
                          }
                        >
                          Allocated Day
                        </div>


                        <input
                          type="number"
                          min={
                            1
                          }
                          name={
                            `taskDetail[${index}].allocatedDay`
                          }
                          value={
                            detail.allocatedDay
                          }
                          onChange={
                            formik.handleChange
                          }
                          onBlur={
                            formik.handleBlur
                          }
                          placeholder="e.g. 3"
                          style={
                            inputStyle
                          }
                        />


                        {allocatedDayError && (
                          <div
                            style={{
                              fontSize:
                                "12px",

                              color:
                                "#ef4444",

                              marginTop:
                                "3px",
                            }}
                          >
                            {
                              allocatedDayError
                            }
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            }
          )}


          {/* ========================================
              ARRAY-LEVEL ERROR
          ======================================== */}

          {typeof formik.errors.taskDetail ===
            "string" && (
            <div
              style={{
                fontSize:
                  "12px",

                color:
                  "#ef4444",

                marginTop:
                  "4px",
              }}
            >
              {
                formik.errors.taskDetail
              }
            </div>
          )}
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

            gap:
              "8px",
          }}
        >
          <Button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              isSubmitDisabled
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
            type="submit"
            disabled={
              isSubmitDisabled
            }
            style={{
              background:
                isSubmitDisabled
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
                isSubmitDisabled
                  ? "#94a3b8"
                  : "#fff",

              boxShadow:
                isSubmitDisabled
                  ? "none"
                  : "0 2px 8px rgba(31,63,191,0.3)",

              cursor:
                isSubmitDisabled
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
            {formik.isSubmitting
              ? "Loading..."
              : "Submit"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;