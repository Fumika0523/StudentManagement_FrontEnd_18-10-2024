import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  ChartCard,
} from "./ChartCard";

import DonutCard from "./DonutCard";

import {
  url,
} from "../../../utils/constant";

import type {
  Admission,
} from "../../../../types/admission";

import type {
  EarningCardProps,
} from "../FirstRow/EarningCard";


// ========================================
// API RESPONSE TYPES
// ========================================

interface AdmissionListResponse {
  admissionData: Admission[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface ChartDisplayProps {
  /*
   * Keep the complete existing prop contract
   * because EarningCardDisplay currently passes
   * all of these values.
   */
  earnings: EarningCardProps[];

  setEarnings: Dispatch<
    SetStateAction<EarningCardProps[]>
  >;

  year: number;

  setYear: Dispatch<
    SetStateAction<number>
  >;

  month: string;

  setMonth: Dispatch<
    SetStateAction<string>
  >;
}


// ========================================
// COMPONENT
// ========================================

const ChartDisplay = ({
  earnings,
  setEarnings,
  year,
  setYear,
  month,
  setMonth,
}: ChartDisplayProps) => {
  // ========================================
  // ADMISSION DATA
  // ========================================

  const [
    admissionData,
    setAdmissionData,
  ] =
    useState<Admission[]>(
      []
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


  /*
   * Memoizing the config keeps it stable between
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
  // FETCH ADMISSIONS
  // ========================================

  const getAdmissionData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<AdmissionListResponse>(
              `${url}/alladmission`,
              config
            );


          setAdmissionData(
            response.data.admissionData
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
              "Error fetching admission data:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching admission data:",
            error
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // FETCH EARNINGS
  // ========================================

  const getEarningData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<EarningCardProps[]>(
              `${url}/earnings?month=${month}&year=${year}`,
              config
            );


          setEarnings(
            response.data
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript catch values are unknown,
           * so narrow Axios errors first.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            if (
              error.response
            ) {
              console.error(
                "Response error:",
                error.response.status,
                error.response.data
              );
            } else if (
              error.request
            ) {
              console.error(
                "No response:",
                error.request
              );
            } else {
              console.error(
                "Error setting up request:",
                error.message
              );
            }

            return;
          }


          console.error(
            "Unexpected earnings error:",
            error
          );
        }
      },
      [
        config,
        month,
        year,
        setEarnings,
      ]
    );


  // ========================================
  // REFRESH CHART DATA
  // ========================================

  useEffect(() => {
    /*
     * Preserve the existing behaviour:
     * refresh the chart data whenever the
     * selected month or year changes.
     */
    void getAdmissionData();

    void getEarningData();
  }, [
    getAdmissionData,
    getEarningData,
  ]);


  /*
   * These props are still part of the parent's
   * existing ChartDisplay contract.
   *
   * ChartCard and DonutCard no longer need them
   * after their TypeScript migrations.
   */
  void earnings;
  void setYear;
  void setMonth;


  return (
    <div className="row mx-auto justify-content-center">
      {/* ========================================
          ADMISSION FEE LINE CHART
      ======================================== */}

      <div className="col-12 col-lg-7 border-4 mb-md-3">
        <ChartCard
          month={
            month
          }
          year={
            year
          }
          admissionData={
            admissionData
          }
        />
      </div>


      {/* ========================================
          ADMISSION SOURCE DOUGHNUT CHART
      ======================================== */}

      <div className="col-12 col-lg-5 border-2">
        <DonutCard
          month={
            month
          }
          year={
            year
          }
          admissionData={
            admissionData
          }
        />
      </div>
    </div>
  );
};

export default ChartDisplay;