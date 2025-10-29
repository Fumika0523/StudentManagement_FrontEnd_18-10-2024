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
    // Create a Date object for the ith month (0 = Jan, 11 = Dec) of a dummy year 2020 and dummy day 1
    //Intl.DateTimeFormat(locale, { month: style }) >>  formats the Date object to a localized month string
    // locale is to show in "en-US"
    // .format(...) converts the Date object into a month name like "Jan", "Feb", etc., according to the locale
    //month.push(...) > adds that month string into the month array
    months.push(new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2020, i, 1))); // create a JavaScript Date object. Year - 2020(Dummy year), Month - i (i coomes from a loop(0 -> 11)), Day - 1(Dummy Day)
  }
  return months;
};

export const ChartCard = ({ earnings, setEarnings, admissionData, setAdmissionData }) => {
  // Localized month names
  const months = getMonth();
  console.log("admissionData",admissionData)
  // Calculate total admissionFee per month
  const monthlyTotals = admissionData?.reduce((acc, cv) => {
     //reduce() is an array method that lets you accumulate a single result from an array
  //(acc, cv) => { ... } >> acc -> accumulator, stores the running total for each month >> cv -> current value, the current admission object in the loop >>>> this is to sum up admission fees for each month
    const monthIndex = new Date(cv.admissionDate).getMonth();
    console.log("monthIndex",monthIndex)
      //const monthIndex = new Date(cv.admissionDate).getMonth()
  // creates a JavaScript Date object from cv.admissionDate
  //.getMonth() returns the month index 0-11(0=Jan, 11=Dec)
  // monthIndex tells us which month this admisssion belongs to
    acc[monthIndex] = (acc[monthIndex] || 0) + (cv.admissionFee || 0);
    console.log("acc[monyhIndex]",acc[monthIndex])
    console.log("cv.admissionFee ",cv.admissionFee )
      //acc[monthIndex] = (acc[monthIndex] || 0) + (cv.admissionFee || 0)
  //acc[monthIndex] >> the current total for that month
  //(acc[monthIndex] || 0) >> if nothing exists yet, then show 0
  //(cv[monthIndex] || 0) >> if admissionFee is missing, show 0
  //this is adds the current admission fee to the month' total
    return acc;
    //after processing cv, return the acc so the next iteration can continue adding
  }, Array(12).fill(0));
  // initial value for the accumulator acc, create array of 12 zeros - [0,0,0,0..] one for each month, this ensures everymonth is showing even tho there are no admissions for that month.


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
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,       // Enable responsive behavior
    maintainAspectRatio: false, // Allow height to adjust
    plugins: {
      title: { display: false },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: true },
        beginAtZero: true,
        ticks: { stepSize: 5000 },
      },
    },
  };

  return (
    <>

      <Card className=" d-flex justify-content-center  shadow">
        <Card.Header className="d-flex py-2 flex-row justify-content-between align-items-center" as="h5" style={{ color: "#4e73df" }}>
          Admission Overview
        </Card.Header>
        <Card.Body style={{ height: "350px" }}> {/* Set container height */}
          <Line data={data} options={options} />
        </Card.Body>
      </Card>
    </>
  );
};
