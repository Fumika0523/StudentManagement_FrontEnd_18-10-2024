// import Card from 'react-bootstrap/Card';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   LineController,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import React from "react";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   LineController,
// );

// const getMonth = (locale = "en-US", style = "short") => {
//   const months = [];
//   for (let i = 0; i < 12; i++) {
//     // Create a Date object for the ith month (0 = Jan, 11 = Dec) of a dummy year 2020 and dummy day 1
//     //Intl.DateTimeFormat(locale, { month: style }) >>  formats the Date object to a localized month string
//     // locale is to show in "en-US"
//     // .format(...) converts the Date object into a month name like "Jan", "Feb", etc., according to the locale
//     //month.push(...) > adds that month string into the month array
//     months.push(new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2020, i, 1))); // create a JavaScript Date object. Year - 2020(Dummy year), Month - i (i coomes from a loop(0 -> 11)), Day - 1(Dummy Day)
//   }
//   return months;
// };

// export const ChartCard = ({ earnings, setEarnings, admissionData, setAdmissionData, month, year,setYear }) => {
//   // when you select the month on UI.
//   console.log("CHART CARD MONTH",month)
//    console.log("CHART CARD YEar",year)
//   const months = getMonth();
//   console.log("admissionData",admissionData)
//   // Calculate total admissionFee per month
//   const monthlyTotals = admissionData?.reduce((acc, cv) => {
//      //reduce() is an array method that lets you accumulate a single result from an array
//   //(acc, cv) => { ... } >> acc -> accumulator, stores the running total for each month >> cv -> current value, the current admission object in the loop >>>> this is to sum up admission fees for each month
//     const monthIndex = new Date(cv.admissionDate).getMonth();
//     // console.log("monthIndex",monthIndex)
//       //const monthIndex = new Date(cv.admissionDate).getMonth()
//   // creates a JavaScript Date object from cv.admissionDate
//   //.getMonth() returns the month index 0-11(0=Jan, 11=Dec)
//   // monthIndex tells us which month this admisssion belongs to
//     acc[monthIndex] = (acc[monthIndex] || 0) + (cv.admissionFee || 0);
//     //console.log("acc[monyhIndex]",acc[monthIndex])
//     //console.log("cv.admissionFee ",cv.admissionFee )
//       //acc[monthIndex] = (acc[monthIndex] || 0) + (cv.admissionFee || 0)
//   //acc[monthIndex] >> the current total for that month
//   //(acc[monthIndex] || 0) >> if nothing exists yet, then show 0
//   //(cv[monthIndex] || 0) >> if admissionFee is missing, show 0
//   //this is adds the current admission fee to the month' total
//     return acc;
//     //after processing cv, return the acc so the next iteration can continue adding
//   }, Array(12).fill(0));
//   // initial value for the accumulator acc, create array of 12 zeros - [0,0,0,0..] one for each month, this ensures everymonth is showing even tho there are no admissions for that month.

//   // Chart.js data
//   const data = {
//     labels: months,
//     datasets: [
//       {
//         label: "Admission Fee",
//         data: monthlyTotals,
//         fill: true,
//         backgroundColor: "#f4f6fd",
//         borderColor: "#4e73df",
//         tension: 0.4,
//       },
//     ],
//   };
// console.log("monthlyTotals",monthlyTotals)

//   // Chart.js options
//   const options = {
//     responsive: true,       // Enable responsive behavior
//     maintainAspectRatio: false, // Allow height to adjust
//     plugins: {
//       title: { display: false },
//       legend: { display: false },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//       },
//       y: {
//         grid: { display: true },
//         beginAtZero: true,
//         ticks: { stepSize: 5000 },
//       },
//     },
//   };

//   return (
//     <>
//       <Card className=" d-flex justify-content-center  shadow">
//         <Card.Header className="d-flex py-2 flex-row justify-content-between align-items-center" as="h5" style={{ color: "#4e73df" }}>
//           Admission Overview
//         </Card.Header>
//         <Card.Body style={{ height: "350px" }}> {/* Set container height */}
//           <Line data={data} options={options} />
//         </Card.Body>
//       </Card>
//     </>
//   );
// };
// export default ChartCard
import Card from 'react-bootstrap/Card';
import {
  Chart as ChartJS,
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

// Register Chart.js components
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
);

const getMonth = (locale = "en-US", style = "short") => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2020, i, 1)));
  }
  return months;
};

export const ChartCard = ({ earnings, setEarnings, admissionData, setAdmissionData, month, year }) => {
  const months = getMonth();
  
  // Get the selected month index (0-11)
  const selectedMonthIndex = month ? new Date(`${month} 1, ${year}`).getMonth() : new Date().getMonth();
  
  console.log("Selected Year:", year);
  console.log("Selected Month:", month);
  console.log("Selected Month Index:", selectedMonthIndex);

  // Filter admissions by the selected year
  const filteredAdmissionData = admissionData?.filter(admission => {
    const admissionYear = new Date(admission.admissionDate).getFullYear();
    return admissionYear === parseInt(year);
  }) || [];

  console.log("Filtered Admission Data:", filteredAdmissionData);

  // Calculate total admissionFee per month for the selected year
  const monthlyTotals = filteredAdmissionData.reduce((acc, cv) => {
    const monthIndex = new Date(cv.admissionDate).getMonth();
    acc[monthIndex] = (acc[monthIndex] || 0) + (cv.admissionFee || 0);
    return acc;
  }, Array(12).fill(0));

  console.log("Monthly Totals for Year", year, ":", monthlyTotals);

  // Create background colors array - highlight selected month
  const backgroundColors = months.map((_, index) => 
    index === selectedMonthIndex ? "rgba(78, 115, 223, 0.3)" : "#f4f6fd"
  );

  // Create border colors array - make selected month border thicker/different
  const pointBackgroundColors = months.map((_, index) => 
    index === selectedMonthIndex ? "#ff6384" : "#4e73df"
  );

  const pointRadiuses = months.map((_, index) => 
    index === selectedMonthIndex ? 6 : 3
  );

  // Chart.js data
  const data = {
    labels: months,
    datasets: [
      {
        label: "Admission Fee",
        data: monthlyTotals,
        fill: true,
        backgroundColor: "#f4f6fd",
        borderColor: "#4e73df",
        tension: 0.4,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBackgroundColors,
        pointRadius: pointRadiuses,
        pointHoverRadius: 8,
        segment: {
          backgroundColor: (ctx) => {
            // Highlight the segment containing the selected month
            const index = ctx.p0DataIndex;
            return index === selectedMonthIndex || index === selectedMonthIndex - 1
              ? "rgba(78, 115, 223, 0.3)"
              : "#f4f6fd";
          }
        }
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: (context) => {
            // Highlight selected month label
            return context.index === selectedMonthIndex ? "#ff6384" : "#666";
          },
          font: (context) => {
            return context.index === selectedMonthIndex 
              ? { weight: 'bold', size: 14 } 
              : { weight: 'normal', size: 12 };
          }
        }
      },
      y: {
        grid: { display: true },
        beginAtZero: true,
        ticks: { 
          stepSize: 5000,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
  };

  return (
    <>
      <Card className="d-flex justify-content-center shadow">
        <Card.Header 
          className="d-flex py-2 flex-row justify-content-between align-items-center" 
          as="h5" 
          style={{ color: "#4e73df" }}
        >
          Admission Overview - {year}
        </Card.Header>
        <Card.Body style={{ height: "350px" }}>
          <Line data={data} options={options} />
        </Card.Body>
      </Card>
    </>
  );
};

export default ChartCard;