import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  url,
} from "../../utils/constant";

import EarningCardDisplay from "./FirstRow/EarningCardDisplay";

import type {
  EarningCardProps,
} from "./FirstRow/EarningCard";

import SelectCourseModal from "../../StudentData/Modals/SelectCourseModal";

import AccordionDisplay from "./ThirdRow/AccordionDisplay";

import type {
  Admission,
} from "../../../types/admission";

import type {
  Batch,
} from "../../../types/batch";

import type {
  Student,
} from "../../../types/student";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * The earnings endpoint returns the array
 * directly rather than wrapping it in an object.
 */
type EarningsResponse =
  EarningCardProps[];


/*
 * The remaining dashboard endpoints wrap their
 * arrays inside named response properties.
 */
interface BatchListResponse {
  batchData?: Batch[];
}


interface StudentListResponse {
  studentData?: Student[];
}


interface AdmissionListResponse {
  admissionData?: Admission[];
}


// ========================================
// COMPONENT
// ========================================

function DashboardCard() {
  // ========================================
  // LOCAL STORAGE
  // ========================================

  /*
   * localStorage.getItem() returns:
   *
   * string | null
   *
   * TypeScript keeps us aware that these values
   * may not exist.
   */
  const role =
    localStorage.getItem(
      "role"
    );

  const token =
    localStorage.getItem(
      "token"
    );

  const username =
    localStorage.getItem(
      "username"
    );


  // ========================================
  // UI STATE
  // ========================================

  const [
    loading,
    setLoading,
  ] = useState<boolean>(
    true
  );


  const [
    showModal,
    setShowModal,
  ] = useState<boolean>(
    false
  );


  // ========================================
  // DATE FILTER STATE
  // ========================================

  const [
    month,
    setMonth,
  ] = useState<string>(
    new Date().toLocaleString(
      "en",
      {
        month:
          "long",
      }
    )
  );


  const [
    year,
    setYear,
  ] = useState<number>(
    new Date().getFullYear()
  );


  // ========================================
  // DASHBOARD DATA
  // ========================================

  const [
    earnings,
    setEarnings,
  ] =
    useState<EarningCardProps[]>(
      []
    );


  const [
    admissionData,
    setAdmissionData,
  ] =
    useState<Admission[]>(
      []
    );


  const [
    studentData,
    setStudentData,
  ] =
    useState<Student[]>(
      []
    );


  const [
    batchData,
    setBatchData,
  ] =
    useState<Batch[]>(
      []
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  /*
   * Explicit AxiosRequestConfig typing gives
   * the shared request config a proper type.
   *
   * useMemo also keeps this object stable between
   * renders unless the token changes.
   */
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
  // LOAD DASHBOARD DATA
  // ========================================

  useEffect(() => {
    const initializeDashboard =
      async (): Promise<void> => {
        try {
          setLoading(
            true
          );


          // ========================================
          // STUDENT DASHBOARD
          // ========================================

          if (
            role ===
            "student"
          ) {
            const response =
              await axios.get<StudentListResponse>(
                `${url}/all-student`,
                config
              );


            /*
             * Find the logged-in Student by the
             * username stored in localStorage.
             */
            const student =
              (
                response.data.studentData ??
                []
              ).find(
                (
                  item
                ) =>
                  item.username ===
                  username
              );


            /*
             * If the Student has not selected any
             * preferred courses yet, show the modal.
             */
            if (
              !student
                ?.preferredCourses
                ?.length
            ) {
              setShowModal(
                true
              );
            }


            return;
          }


          // ========================================
          // ADMIN / STAFF DASHBOARD
          // ========================================

          /*
           * Load the four dashboard data sources
           * together rather than waiting for each
           * request one by one.
           */
          const [
            earningsResponse,
            admissionResponse,
            studentResponse,
            batchResponse,
          ] =
            await Promise.all([
              axios.get<EarningsResponse>(
                `${url}/earnings?month=${month}&year=${year}`,
                config
              ),

              axios.get<AdmissionListResponse>(
                `${url}/alladmission`,
                config
              ),

              axios.get<StudentListResponse>(
                `${url}/all-student`,
                config
              ),

              axios.get<BatchListResponse>(
                `${url}/allbatch`,
                config
              ),
            ]);


          // ========================================
          // UPDATE STATE
          // ========================================

          setEarnings(
            earningsResponse.data
          );


          setAdmissionData(
            admissionResponse
              .data
              .admissionData ??
              []
          );


          setStudentData(
            studentResponse
              .data
              .studentData ??
              []
          );


          setBatchData(
            batchResponse
              .data
              .batchData ??
              []
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript treats catch values as
           * unknown, so narrow Axios errors before
           * accessing Axios-specific properties.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Dashboard Data Fetch Error:",
              error.response?.data ??
                error.message
            );
          } else {
            console.error(
              "Dashboard Data Fetch Error:",
              error
            );
          }
        } finally {
          setLoading(
            false
          );
        }
      };


    void initializeDashboard();
  }, [
    role,
    month,
    year,
    config,
    username,
  ]);


  // ========================================
  // LOADING STATE
  // ========================================

  if (
    loading
  ) {
    return (
      <div className="text-center mt-5">
        Loading Dashboard...
      </div>
    );
  }


  // ========================================
  // UI
  // ========================================

  return (
    <div className="container-fluid">
      {/* ========================================
          ADMIN / STAFF DASHBOARD
      ======================================== */}

      {role !==
        "student" && (
        <>
          <EarningCardDisplay
            month={
              month
            }
            year={
              year
            }
            setMonth={
              setMonth
            }
            setYear={
              setYear
            }
            earnings={
              earnings
            }
            setEarnings={
              setEarnings
            }
          />


          <AccordionDisplay
            admissionData={
              admissionData
            }
            studentData={
              studentData
            }
            batchData={
              batchData
            }
            month={
              month
            }
            year={
              year
            }
          />
        </>
      )}


      {/* ========================================
          STUDENT COURSE SELECTION
      ======================================== */}

      {showModal && (
        <SelectCourseModal
          show={
            showModal
          }
          setShow={
            setShowModal
          }
        />
      )}
    </div>
  );
}

export default DashboardCard;