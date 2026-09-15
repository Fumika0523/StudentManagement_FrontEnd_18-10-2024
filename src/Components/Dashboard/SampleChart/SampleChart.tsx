import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  LineController,
  LinearScale,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  ScatterController,
  Title,
  Tooltip,
} from "chart.js";

import type {
  BubbleDataPoint,
  ChartData,
  ChartOptions,
  ChartType,
  ScatterDataPoint,
} from "chart.js";

import {
  Bar,
  Bubble,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
} from "react-chartjs-2";


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
  LineController,
  BarController,
  PieController,
  DoughnutController,
  BubbleController,
  PolarAreaController,
  RadarController,
  ScatterController
);


// ========================================
// SHARED LABELS
// ========================================

const labels: string[] = [
  "Eating",
  "Drinking",
  "Sleeping",
  "Designing",
  "Coding",
  "Cycling",
  "Running",
];


// ========================================
// SHARED NUMERIC DATA
// ========================================

/*
 * The original JSX mixed normal numeric chart
 * values with Scatter/Bubble objects.
 *
 * TypeScript correctly rejects that because a
 * Line/Pie/Bar chart expects numeric values,
 * while Bubble and Scatter require objects.
 *
 * Therefore we keep the original numeric values
 * here and create separate Bubble/Scatter data
 * further below.
 */
const firstDatasetValues: number[] = [
  5,
  59,
  30,
  81,
  56,
  55,
  40,
];

const secondDatasetValues: number[] = [
  8,
  48,
  40,
  19,
  96,
  27,
  100,
];


// ========================================
// LINE DATA
// ========================================

const lineData:
  ChartData<
    "line",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      fill:
        true,

      backgroundColor:
        "rgba(255, 99, 132, 0.2)",

      borderColor:
        "rgb(255, 99, 132)",

      pointBackgroundColor:
        "rgb(255, 99, 132)",

      pointBorderColor:
        "#fff",

      pointHoverBackgroundColor:
        "#fff",

      pointHoverBorderColor:
        "rgb(255, 99, 132)",
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      fill:
        true,

      backgroundColor:
        "rgba(55, 217, 23, 0.2)",

      borderColor:
        "rgb(54, 162, 235)",

      pointBackgroundColor:
        "rgb(54, 162, 235)",

      pointBorderColor:
        "#fff",

      pointHoverBackgroundColor:
        "#fff",

      pointHoverBorderColor:
        "rgb(54, 162, 235)",
    },
  ],
};


// ========================================
// BAR DATA
// ========================================

const barData:
  ChartData<
    "bar",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      backgroundColor:
        "rgba(255, 99, 132, 0.2)",

      borderColor:
        "rgb(255, 99, 132)",

      borderWidth:
        1,
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      backgroundColor:
        "rgba(55, 217, 23, 0.2)",

      borderColor:
        "rgb(54, 162, 235)",

      borderWidth:
        1,
    },
  ],
};


// ========================================
// PIE DATA
// ========================================

const pieData:
  ChartData<
    "pie",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      backgroundColor:
        "rgba(255, 99, 132, 0.4)",

      borderColor:
        "rgb(255, 99, 132)",
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      backgroundColor:
        "rgba(55, 217, 23, 0.4)",

      borderColor:
        "rgb(54, 162, 235)",
    },
  ],
};


// ========================================
// DOUGHNUT DATA
// ========================================

const doughnutData:
  ChartData<
    "doughnut",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      backgroundColor:
        "rgba(255, 99, 132, 0.4)",
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      backgroundColor:
        "rgba(55, 217, 23, 0.4)",
    },
  ],
};


// ========================================
// POLAR AREA DATA
// ========================================

const polarAreaData:
  ChartData<
    "polarArea",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      backgroundColor:
        "rgba(255, 99, 132, 0.4)",
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      backgroundColor:
        "rgba(55, 217, 23, 0.4)",
    },
  ],
};


// ========================================
// RADAR DATA
// ========================================

const radarData:
  ChartData<
    "radar",
    number[],
    string
  > = {
  labels,

  datasets: [
    {
      label:
        "My First Dataset",

      data:
        firstDatasetValues,

      fill:
        true,

      backgroundColor:
        "rgba(255, 99, 132, 0.2)",

      borderColor:
        "rgb(255, 99, 132)",
    },

    {
      label:
        "My Second Dataset",

      data:
        secondDatasetValues,

      fill:
        true,

      backgroundColor:
        "rgba(55, 217, 23, 0.2)",

      borderColor:
        "rgb(54, 162, 235)",
    },
  ],
};


// ========================================
// BUBBLE DATA
// ========================================

/*
 * Bubble charts require:
 *
 * { x, y, r }
 *
 * instead of normal numbers.
 */
const bubbleData:
  ChartData<
    "bubble",
    BubbleDataPoint[]
  > = {
  datasets: [
    {
      label:
        "Bubble Dataset 1",

      data: [
        {
          x: 10,
          y: 20,
          r: 8,
        },

        {
          x: 15,
          y: 10,
          r: 12,
        },

        {
          x: 7,
          y: 25,
          r: 6,
        },

        {
          x: 20,
          y: 5,
          r: 10,
        },
      ],

      backgroundColor:
        "rgba(54, 162, 235, 0.6)",
    },
  ],
};


// ========================================
// SCATTER DATA
// ========================================

/*
 * Scatter charts require:
 *
 * { x, y }
 */
const scatterData:
  ChartData<
    "scatter",
    ScatterDataPoint[]
  > = {
  datasets: [
    {
      label:
        "Scatter Dataset",

      data: [
        {
          x: 1,
          y: 12,
        },

        {
          x: 2,
          y: 19,
        },

        {
          x: 3,
          y: 3,
        },

        {
          x: 4,
          y: 5,
        },
      ],

      backgroundColor:
        "rgba(255, 99, 132, 0.6)",

      borderColor:
        "rgb(255, 99, 132)",
    },
  ],
};


// ========================================
// OPTIONS HELPER
// ========================================

/*
 * All sample charts use the same basic options.
 *
 * The generic TChart keeps each options object
 * compatible with its specific Chart.js type.
 */
const createOptions = <
  TChart extends ChartType
>(
  title: string
): ChartOptions<TChart> => ({
  responsive:
    true,

  plugins: {
    legend: {
      position:
        "top",
    },

    title: {
      display:
        true,

      text:
        title,
    },
  },
});


// ========================================
// CHART OPTIONS
// ========================================

const lineOptions =
  createOptions<"line">(
    "Line Chart"
  );

const barOptions =
  createOptions<"bar">(
    "Bar Chart"
  );

const pieOptions =
  createOptions<"pie">(
    "Pie Chart"
  );

const doughnutOptions =
  createOptions<"doughnut">(
    "Doughnut Chart"
  );

const bubbleOptions =
  createOptions<"bubble">(
    "Bubble Chart"
  );

const polarAreaOptions =
  createOptions<"polarArea">(
    "PolarArea Chart"
  );

const radarOptions =
  createOptions<"radar">(
    "Radar Chart"
  );

const scatterOptions =
  createOptions<"scatter">(
    "Scatter Chart"
  );


// ========================================
// COMPONENT
// ========================================

const SampleChart = () => {
  return (
    <div
      style={{
        width:
          "50%",

        margin:
          "0 auto",
      }}
    >
      {/* ========================================
          LINE
      ======================================== */}

      <Line
        data={
          lineData
        }
        options={
          lineOptions
        }
      />


      {/* ========================================
          BAR
      ======================================== */}

      <Bar
        data={
          barData
        }
        options={
          barOptions
        }
      />


      {/* ========================================
          PIE
      ======================================== */}

      <Pie
        data={
          pieData
        }
        options={
          pieOptions
        }
      />


      {/* ========================================
          DOUGHNUT
      ======================================== */}

      <Doughnut
        data={
          doughnutData
        }
        options={
          doughnutOptions
        }
      />


      {/* ========================================
          BUBBLE
      ======================================== */}

      <Bubble
        data={
          bubbleData
        }
        options={
          bubbleOptions
        }
      />


      {/* ========================================
          POLAR AREA
      ======================================== */}

      <PolarArea
        data={
          polarAreaData
        }
        options={
          polarAreaOptions
        }
      />


      {/* ========================================
          RADAR
      ======================================== */}

      <Radar
        data={
          radarData
        }
        options={
          radarOptions
        }
      />


      {/* ========================================
          SCATTER
      ======================================== */}

      <Scatter
        data={
          scatterData
        }
        options={
          scatterOptions
        }
      />
    </div>
  );
};

export default SampleChart;