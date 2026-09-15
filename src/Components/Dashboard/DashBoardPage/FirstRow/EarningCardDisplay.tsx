import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from "react";

import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  Button,
  Form,
} from "react-bootstrap";

import {
  FaDownload,
} from "react-icons/fa";

import EarningCard from "./EarningCard";

import type {
  EarningCardProps,
} from "./EarningCard";

import ChartDisplay from "../SecondRow/ChartDisplay";

import {
  url,
} from "../../../utils/constant";


// ========================================
// COMPONENT PROPS
// ========================================

interface EarningCardDisplayProps {
  month: string;

  setMonth: Dispatch<
    SetStateAction<string>
  >;

  /*
   * Keep year as a number.
   *
   * DashboardCard creates it using:
   * new Date().getFullYear()
   */
  year: number;

  setYear: Dispatch<
    SetStateAction<number>
  >;

  /*
   * The earnings API returns the same information
   * required by each EarningCard.
   */
  earnings: EarningCardProps[];

  setEarnings: Dispatch<
    SetStateAction<EarningCardProps[]>
  >;
}


// ========================================
// COMPONENT
// ========================================

function EarningCardDisplay({
  month,
  setMonth,
  year,
  setYear,
  earnings,
  setEarnings,
}: EarningCardDisplayProps) {
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
  // FETCH EARNINGS
  // ========================================

  const getEarningData =
    useCallback(
      async (
        selectedMonth:
          string = month,

        selectedYear:
          number = year
      ): Promise<void> => {
        try {
          /*
           * Axios generic tells TypeScript the
           * expected response is an array of
           * EarningCardProps.
           */
          const response =
            await axios.get<EarningCardProps[]>(
              `${url}/earnings?month=${selectedMonth}&year=${selectedYear}`,
              config
            );


          setEarnings(
            response.data
          );
        } catch (
          error: unknown
        ) {
          /*
           * TypeScript catch values are `unknown`.
           * Narrow Axios errors before accessing
           * Axios-specific properties.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Error fetching earnings:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Error fetching earnings:",
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
  // INITIAL EARNINGS LOAD
  // ========================================

  useEffect(() => {
    void getEarningData();
  }, [
    getEarningData,
  ]);


  // ========================================
  // MONTH LIST
  // ========================================

  /*
   * Generate the twelve full month names once.
   */
  const months =
    useMemo<string[]>(
      () =>
        Array.from(
          {
            length:
              12,
          },
          (
            _value,
            index
          ) =>
            new Date(
              0,
              index
            ).toLocaleString(
              "en",
              {
                month:
                  "long",
              }
            )
        ),
      []
    );


  // ========================================
  // YEAR LIST
  // ========================================

  const years =
    useMemo<number[]>(
      () => {
        const currentYear =
          new Date().getFullYear();


        return Array.from(
          {
            length:
              5,
          },
          (
            _value,
            index
          ) =>
            currentYear -
            index
        );
      },
      []
    );


  // ========================================
  // MONTH CHANGE
  // ========================================

  const handleMonthChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    const nextMonth =
      event.target.value;


    setMonth(
      nextMonth
    );


    /*
     * Preserve the existing behaviour:
     * immediately refresh earnings after changing
     * the month.
     */
    void getEarningData(
      nextMonth,
      year
    );
  };


  // ========================================
  // YEAR CHANGE
  // ========================================

  const handleYearChange = (
    event:
      ChangeEvent<HTMLSelectElement>
  ): void => {
    /*
     * HTML select values are always strings.
     * Convert the value back to a number so
     * `year` remains consistently typed.
     */
    const nextYear =
      Number(
        event.target.value
      );


    if (
      !Number.isFinite(
        nextYear
      )
    ) {
      return;
    }


    setYear(
      nextYear
    );


    void getEarningData(
      month,
      nextYear
    );
  };


  return (
    <div className="container-fluid px-2 px-md-4">
      {/* ========================================
          TOP CONTROLS
      ======================================== */}

      <div className="position-sticky top-0 z-3">
        <div className="d-flex justify-content-end align-items-center gap-3 py-2">
          {/* Month */}

          <Form.Select
            size="sm"
            value={
              month
            }
            onChange={
              handleMonthChange
            }
            style={{
              width:
                "180px",

              fontWeight:
                500,
            }}
          >
            <option
              disabled
              value=""
            >
              Select Month
            </option>


            {months.map(
              (
                monthName
              ) => (
                <option
                  key={
                    monthName
                  }
                  value={
                    monthName
                  }
                >
                  {monthName}
                </option>
              )
            )}
          </Form.Select>


          {/* Year */}

          <Form.Select
            size="sm"
            value={
              year
            }
            onChange={
              handleYearChange
            }
            style={{
              width:
                "120px",

              fontWeight:
                500,
            }}
          >
            {years.map(
              (
                yearOption
              ) => (
                <option
                  key={
                    yearOption
                  }
                  value={
                    yearOption
                  }
                >
                  {yearOption}
                </option>
              )
            )}
          </Form.Select>


          {/* Report button */}

          <Button
            type="button"
            className="d-flex align-items-center gap-1 text-white"
            style={{
              backgroundColor:
                "#4e73df",

              fontSize:
                "14px",
            }}
          >
            <FaDownload className="text-white-50" />

            <span className="d-sm-none d-md-block">
              Generate Report
            </span>
          </Button>
        </div>
      </div>


      {/* ========================================
          DASHBOARD CONTENT
      ======================================== */}

      <div>
        <div className="fs-4">
          MTD
        </div>


        {/* ========================================
            EARNING CARDS
        ======================================== */}

        <div className="row">
          {earnings.map(
            (
              element,
              index
            ) => (
              <Fragment
                key={`${element.title}-${index}`}
              >
                <div className="col-12 col-sm-6 col-lg-3">
                  <EarningCard
                    {...element}
                    title={
                      element.title.toUpperCase()
                    }
                  />
                </div>


                {index ===
                  3 && (
                  <div className="col-12">
                    <div className="fs-4">
                      YTD
                    </div>
                  </div>
                )}
              </Fragment>
            )
          )}
        </div>


        {/* ========================================
            CHART SECTION
        ======================================== */}

        <div className="mt-3">
          <ChartDisplay
            earnings={
              earnings
            }
            setEarnings={
              setEarnings
            }
            year={
              year
            }
            month={
              month
            }
            setYear={
              setYear
            }
            setMonth={
              setMonth
            }
          />
        </div>
      </div>
    </div>
  );
}

export default EarningCardDisplay;