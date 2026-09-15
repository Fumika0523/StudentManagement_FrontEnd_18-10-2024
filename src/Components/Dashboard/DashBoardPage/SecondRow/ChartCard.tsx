import Card from "react-bootstrap/Card";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import type {
  ChartData,
  ChartOptions,
} from "chart.js";

import {
  Line,
} from "react-chartjs-2";

import type {
  Admission,
} from "../../../../types/admission";


// ========================================
// REGISTER CHART.JS COMPONENTS
// ========================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController
);


// ========================================
// COMPONENT PROPS
// ========================================

interface ChartCardProps {
  /*
   * Admission records are used to calculate
   * the total admission fee for each month.
   */
  admissionData: Admission[];

  /*
   * Example:
   * "January"
   */
  month: string;

  /*
   * Keep year consistently numeric.
   */
  year: number;
}


// ========================================
// MONTH LABELS
// ========================================

const getMonths =
  (): string[] => {
    return Array.from(
      {
        length:
          12,
      },

      (
        _value,
        index
      ) =>
        new Intl.DateTimeFormat(
          "en-US",
          {
            month:
              "short",
          }
        ).format(
          new Date(
            2020,
            index,
            1
          )
        )
    );
  };


// ========================================
// COMPONENT
// ========================================

export const ChartCard = ({
  admissionData,
  month,
  year,
}: ChartCardProps) => {
  const months =
    getMonths();


  // ========================================
  // SELECTED MONTH
  // ========================================

  /*
   * Convert the selected month name into the
   * JavaScript month index 0-11.
   *
   * If no month is selected, highlight the
   * current month instead.
   */
  const selectedMonthIndex =
    month
      ? new Date(
          `${month} 1, ${year}`
        ).getMonth()
      : new Date().getMonth();


  // ========================================
  // FILTER BY YEAR
  // ========================================

  const filteredAdmissionData =
    admissionData.filter(
      (
        admission
      ) => {
        const admissionDate =
          new Date(
            admission.admissionDate
          );


        /*
         * Ignore invalid dates instead of allowing
         * them to affect chart calculations.
         */
        if (
          Number.isNaN(
            admissionDate.getTime()
          )
        ) {
          return false;
        }


        return (
          admissionDate.getFullYear() ===
          year
        );
      }
    );


  // ========================================
  // MONTHLY TOTALS
  // ========================================

  /*
   * Start with 12 zeros:
   *
   * [Jan, Feb, Mar, ... Dec]
   */
  const monthlyTotals =
    filteredAdmissionData.reduce<number[]>(
      (
        totals,
        admission
      ) => {
        const admissionDate =
          new Date(
            admission.admissionDate
          );


        const monthIndex =
          admissionDate.getMonth();


        totals[
          monthIndex
        ] =
          (
            totals[
              monthIndex
            ] ??
            0
          ) +
          (
            admission.admissionFee ??
            0
          );


        return totals;
      },
      Array<number>(
        12
      ).fill(
        0
      )
    );


  // ========================================
  // SELECTED-MONTH POINT STYLES
  // ========================================

  const pointBackgroundColors =
    months.map(
      (
        _monthName,
        index
      ) =>
        index ===
        selectedMonthIndex
          ? "#ff6384"
          : "#4e73df"
    );


  const pointRadiuses =
    months.map(
      (
        _monthName,
        index
      ) =>
        index ===
        selectedMonthIndex
          ? 6
          : 3
    );


  // ========================================
  // CHART DATA
  // ========================================

  /*
   * ChartData<"line", number[], string>
   * gives Chart.js explicit typing for:
   *
   * - chart type: line
   * - values: number[]
   * - labels: string
   */
  const data:
    ChartData<
      "line",
      number[],
      string
    > = {
    labels:
      months,

    datasets: [
      {
        label:
          "Admission Fee",

        data:
          monthlyTotals,

        fill:
          true,

        backgroundColor:
          "#f4f6fd",

        borderColor:
          "#4e73df",

        tension:
          0.4,

        pointBackgroundColor:
          pointBackgroundColors,

        pointBorderColor:
          pointBackgroundColors,

        pointRadius:
          pointRadiuses,

        pointHoverRadius:
          8,

        /*
         * Highlight the line segment around
         * the currently selected month.
         *
         * The callback type is inferred directly
         * from ChartData's line dataset type.
         */
        segment: {
          backgroundColor: (
            context
          ) => {
            const index =
              context.p0DataIndex;


            return (
              index ===
                selectedMonthIndex ||
              index ===
                selectedMonthIndex -
                  1
            )
              ? "rgba(78, 115, 223, 0.3)"
              : "#f4f6fd";
          },
        },
      },
    ],
  };


  // ========================================
  // CHART OPTIONS
  // ========================================

  const options:
    ChartOptions<"line"> = {
    responsive:
      true,

    maintainAspectRatio:
      false,


    plugins: {
      title: {
        display:
          false,
      },

      legend: {
        display:
          false,
      },

      tooltip: {
        callbacks: {
          label: (
            context
          ) => {
            let label =
              context.dataset.label ??
              "";


            if (
              label
            ) {
              label +=
                ": ";
            }


            const value =
              context.parsed.y;


            if (
              value !==
              null
            ) {
              /*
               * Preserve the existing currency
               * display used by the chart tooltip.
               */
              label +=
                new Intl.NumberFormat(
                  "en-US",
                  {
                    style:
                      "currency",

                    currency:
                      "USD",
                  }
                ).format(
                  value
                );
            }


            return label;
          },
        },
      },
    },


    scales: {
      x: {
        grid: {
          display:
            false,
        },

        ticks: {
          /*
           * Highlight the currently selected
           * month label on the x-axis.
           */
          color: (
            context
          ) =>
            context.index ===
            selectedMonthIndex
              ? "#ff6384"
              : "#666",

          font: (
            context
          ) =>
            context.index ===
            selectedMonthIndex
              ? {
                  weight:
                    "bold",

                  size:
                    14,
                }
              : {
                  weight:
                    "normal",

                  size:
                    12,
                },
        },
      },


      y: {
        grid: {
          display:
            true,
        },

        beginAtZero:
          true,

        ticks: {
          stepSize:
            5000,

          callback: (
            value
          ) =>
            `$${Number(
              value
            ).toLocaleString()}`,
        },
      },
    },
  };


  return (
    <Card className="d-flex justify-content-center shadow">
      {/* ========================================
          CHART HEADER
      ======================================== */}

      <Card.Header
        className="d-flex py-2 flex-row justify-content-between align-items-center"
        as="h5"
        style={{
          color:
            "#4e73df",
        }}
      >
        Admission Overview - {year}
      </Card.Header>


      {/* ========================================
          LINE CHART
      ======================================== */}

      <Card.Body
        style={{
          height:
            "350px",
        }}
      >
        <Line
          data={
            data
          }
          options={
            options
          }
        />
      </Card.Body>
    </Card>
  );
};

export default ChartCard;