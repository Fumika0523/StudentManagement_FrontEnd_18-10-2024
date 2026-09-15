import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Modal,
  Form,
  Button,
} from "react-bootstrap";

import axios from "axios";

import {
  useFormik,
} from "formik";

import * as Yup from "yup";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../../utils/constant";

import type {
  Student,
} from "../../../types/student";


// ========================================
// COMPONENT PROPS
// ========================================

interface SelectCourseModalProps {
  show: boolean;

  setShow: Dispatch<
    SetStateAction<boolean>
  >;
}


// ========================================
// FORM VALUES
// ========================================

interface CoursePreferenceFormValues {
  /*
   * The checkbox values are course names.
   *
   * Example:
   * ["HTML", "JavaScript", "Node JS"]
   */
  preferredCourses: string[];
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface StudentResponse {
  StudentData?: Student;
}

interface ApiErrorResponse {
  message?: string;
}


// ========================================
// AVAILABLE COURSES
// ========================================

/*
 * Keep the same course options from the
 * original JavaScript component.
 */
const COURSES: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "Redux",
  "Node JS",
  "MongoDB",
  "SQL",
  "Bootstrap",
];


// ========================================
// VALIDATION SCHEMA
// ========================================

const coursePreferenceSchema =
  Yup.object({
    preferredCourses:
      Yup.array()
        .of(
          Yup.string()
        )
        .required(),
  });


// ========================================
// COMPONENT
// ========================================

const SelectCourseModal = ({
  show,
  setShow,
}: SelectCourseModalProps) => {
  // ========================================
  // CURRENT STUDENT
  // ========================================

  /*
   * TypeScript:
   * Before the API request finishes there is
   * no Student, so null is a valid state.
   */
  const [
    currentStudent,
    setCurrentStudent,
  ] =
    useState<Student | null>(
      null
    );


  // ========================================
  // LOCAL STORAGE
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );

  const studentId =
    localStorage.getItem(
      "studentId"
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  /*
   * Memoizing the config keeps it stable so
   * useEffect does not run again unnecessarily.
   */
  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [token]
    );


  // ========================================
  // FETCH CURRENT STUDENT
  // ========================================

  useEffect(() => {
    /*
     * Only fetch when the modal opens and
     * we have a Student ID.
     */
    if (
      !show ||
      !studentId
    ) {
      return;
    }


    const fetchStudent =
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<StudentResponse>(
              `${url}/student/${studentId}`,
              config
            );


          setCurrentStudent(
            response.data.StudentData ??
              null
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript:
           * catch values are unknown, so narrow
           * Axios errors before accessing response.
           */
          if (
            axios.isAxiosError<ApiErrorResponse>(
              error
            )
          ) {
            console.error(
              "Error fetching student:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching student:",
            error
          );
        }
      };


    void fetchStudent();
  }, [
    show,
    studentId,
    config,
  ]);


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<CoursePreferenceFormValues>({
      initialValues: {
        /*
         * preferredCourses is optional on the shared
         * Student type, so fall back to an empty array.
         */
        preferredCourses:
          currentStudent
            ?.preferredCourses ??
          [],
      },

      enableReinitialize:
        true,

      validationSchema:
        coursePreferenceSchema,

      onSubmit: async (
        values
      ): Promise<void> => {
        if (!studentId) {
          /*
           * The old component already attempted to
           * show this toast but forgot to import toast.
           */
          toast.error(
            "Unable to get student data. Please contact Admin."
          );

          return;
        }


        try {
          await axios.put(
            `${url}/updatestudent/${studentId}`,
            values,
            config
          );


          setShow(
            false
          );
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError<ApiErrorResponse>(
              error
            )
          ) {
            console.error(
              "Error updating preferred courses:",
              error.response?.data ??
                error.message
            );


            toast.error(
              error.response
                ?.data
                ?.message ??
                "Failed to update preferred courses."
            );

            return;
          }


          console.error(
            "Error updating preferred courses:",
            error
          );


          toast.error(
            "Failed to update preferred courses."
          );
        }
      },
    });


  // ========================================
  // CHECKBOX CHANGE
  // ========================================

  const handleCourseChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    const {
      value,
      checked,
    } =
      event.target;


    const current =
      formik.values
        .preferredCourses;


    const updated =
      checked
        ? [
            ...current,
            value,
          ]
        : current.filter(
            (
              course
            ) =>
              course !==
              value
          );


    /*
     * Formik setFieldValue returns a Promise.
     * We intentionally do not need to await it here.
     */
    void formik.setFieldValue(
      "preferredCourses",
      updated
    );
  };


  // ========================================
  // SKIP COURSES
  // ========================================

  const handleSkip =
    async (): Promise<void> => {
      if (!studentId) {
        toast.error(
          "Unable to get student data. Please contact Admin."
        );

        return;
      }


      try {
        /*
         * Preserve the original backend behaviour:
         * selecting Skip stores ["Skip"].
         */
        await axios.put(
          `${url}/updatestudent/${studentId}`,
          {
            preferredCourses: [
              "Skip",
            ],
          },
          config
        );


        setShow(
          false
        );
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          console.error(
            "Error skipping courses:",
            error.response?.data ??
              error.message
          );


          toast.error(
            error.response
              ?.data
              ?.message ??
              "Failed to skip course selection."
          );

          return;
        }


        console.error(
          "Error skipping courses:",
          error
        );


        toast.error(
          "Failed to skip course selection."
        );
      }
    };


  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose =
    (): void => {
      setShow(
        false
      );
    };


  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      onHide={
        handleClose
      }
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <Modal.Header
        closeButton
      >
        <Modal.Title>
          Preferred Courses
        </Modal.Title>
      </Modal.Header>


      {/* ========================================
          FORM
      ======================================== */}

      <Form
        onSubmit={
          formik.handleSubmit
        }
        className="px-4"
      >
        <Modal.Body>
          {COURSES.map(
            (
              course
            ) => (
              <Form.Check
                key={
                  course
                }
                type="checkbox"
                name="preferredCourses"
                label={
                  course
                }
                value={
                  course
                }
                checked={
                  formik.values.preferredCourses.includes(
                    course
                  )
                }
                onChange={
                  handleCourseChange
                }
              />
            )
          )}
        </Modal.Body>


        {/* ========================================
            FOOTER
        ======================================== */}

        <Modal.Footer className="d-flex justify-content-between">
          {formik.values
            .preferredCourses
            .length === 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                void handleSkip()
              }
            >
              Skip
            </Button>
          )}


          <Button
            type="submit"
            disabled={
              formik.isSubmitting
            }
            style={{
              backgroundColor:
                "#4e73df",
            }}
          >
            {formik.isSubmitting
              ? "Saving..."
              : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SelectCourseModal;