import {
  useMemo,
} from "react";

import {
  ArcElement,
  Chart,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

import type {
  ChartData,
  ChartOptions,
} from "chart.js";

import {
  Doughnut,
} from "react-chartjs-2";

import Card from "react-bootstrap/Card";

import type {
  Admission,
} from "../../../../types/admission";


// ========================================
// REGISTER CHART.JS COMPONENTS
// ========================================

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);


// ========================================
// ADMISSION SOURCE TYPE
// ========================================

/*
 * These are the three Admission sources
 * currently displayed in the doughnut chart.
 *
 * We keep this local instead of changing the
 * global Admission type because the backend
 * admissionSource field can still be a string.
 */
type TrackedAdmissionSource =
  | "Social"
  | "Referral"
  | "Direct";


// ========================================
// SOURCE COUNTS TYPE
// ========================================

type AdmissionSourceCounts =
  Record<
    TrackedAdmissionSource,
    number
  >;


// ========================================
// COMPONENT PROPS
// ========================================

interface DonutCardProps {
  /*
   * Keep the default [] behaviour from
   * the original JSX component.
   */
  admissionData?: Admission[];

  /*
   * Full month name such as:
   * "January"
   */
  month?: string;

  /*
   * Selected dashboard year.
   */
  year?: number;
}


// ========================================
// TYPE GUARD
// ========================================

const isTrackedAdmissionSource = (
  source: string
): source is TrackedAdmissionSource => {
  return (
    source === "Social" ||
    source === "Referral" ||
    source === "Direct"
  );
};


// ========================================
// COMPONENT
// ========================================

function DonutCard({
  admissionData = [],
  month,
  year,
}: DonutCardProps) {
  // ========================================
  // CHART DATA
  // ========================================

  const data =
    useMemo<
      ChartData<
        "doughnut",
        number[],
        string
      >
    >(
      () => {
        /*
         * If no year is supplied, preserve the
         * original fallback to the current year.
         */
        const selectedYear =
          year ??
          new Date().getFullYear();


        /*
         * Convert the selected month name into
         * JavaScript's 0-11 month index.
         *
         * null means use the full year.
         */
        const monthIndex =
          month
            ? new Date(
                `${month} 1, ${selectedYear}`
              ).getMonth()
            : null;


        // ========================================
        // FILTER ADMISSIONS
        // ========================================

        const inScope =
          admissionData.filter(
            (
              admission
            ) => {
              if (
                !admission.admissionDate
              ) {
                return false;
              }


              const admissionDate =
                new Date(
                  admission.admissionDate
                );


              /*
               * TypeScript-friendly invalid-date
               * check.
               *
               * The old code used isNaN(date),
               * which relies on implicit coercion.
               */
              if (
                Number.isNaN(
                  admissionDate.getTime()
                )
              ) {
                return false;
              }


              if (
                admissionDate.getFullYear() !==
                selectedYear
              ) {
                return false;
              }


              /*
               * No month selected:
               * include the whole selected year.
               */
              if (
                monthIndex ===
                null
              ) {
                return true;
              }


              return (
                admissionDate.getMonth() ===
                monthIndex
              );
            }
          );


        // ========================================
        // COUNT ADMISSION SOURCES
        // ========================================

        const counts:
          AdmissionSourceCounts = {
          Social:
            0,

          Referral:
            0,

          Direct:
            0,
        };


        inScope.forEach(
          (
            admission
          ) => {
            const source =
              admission.admissionSource;


            /*
             * Type guard narrows the string to one
             * of the keys supported by `counts`.
             */
            if (
              isTrackedAdmissionSource(
                source
              )
            ) {
              counts[
                source
              ] += 1;
            }
          }
        );


        return {
          labels: [
            "Social",
            "Referral",
            "Direct",
          ],

          datasets: [
            {
              data:
                [
                  counts.Social,
                  counts.Referral,
                  counts.Direct,
                ],

              backgroundColor:
                [
                  "#4e73df",
                  "#1cc88a",
                  "#36b9cc",
                ],

              borderWidth:
                2,
            },
          ],
        };
      },
      [
        admissionData,
        month,
        year,
      ]
    );


  // ========================================
  // TOTAL ADMISSIONS
  // ========================================

  const total =
    data.datasets[0]?.data.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    ) ??
    0;


  // ========================================
  // PERIOD LABEL
  // ========================================

  const periodLabel =
    year &&
    month
      ? `${month} ${year}`
      : year
        ? `${year}`
        : "this year";


  // ========================================
  // CHART OPTIONS
  // ========================================

  const options:
    ChartOptions<"doughnut"> = {
    cutout:
      "80%",

    responsive:
      true,

    maintainAspectRatio:
      false,

    plugins: {
      legend: {
        position:
          "bottom",

        labels: {
          usePointStyle:
            true,

          padding:
            20,
        },
      },
    },
  };


  return (
    <Card className="d-flex shadow justify-content-center">
      {/* ========================================
          CARD HEADER
      ======================================== */}

      <Card.Header
        className="d-flex py-2 m-0 flex-row justify-content-between align-items-center"
        as="h5"
        style={{
          color:
            "#4e73df",
        }}
      >
        Admission Source
      </Card.Header>


      {/* ========================================
          CHART / EMPTY STATE
      ======================================== */}

      <Card.Body
        style={{
          height:
            "350px",
        }}
      >
        {total ===
        0 ? (
          <div
            style={{
              height:
                "100%",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexDirection:
                "column",

              gap:
                6,

              color:
                "#6c757d",

              fontWeight:
                600,
            }}
          >
            <div className="fs-3">
              No data for{" "}
              {periodLabel}
            </div>
          </div>
        ) : (
          <Doughnut
            data={
              data
            }
            options={
              options
            }
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default DonutCard;