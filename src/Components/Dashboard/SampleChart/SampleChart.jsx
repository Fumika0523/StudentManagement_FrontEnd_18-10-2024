"use client";

import React from "react";
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
  BarController,
  PieController,
  DoughnutController,
  BubbleController,
  PolarAreaController,
  RadarController,
  ScatterController,
} from "chart.js";

import { Line, Bar, Pie, Doughnut, Bubble, PolarArea, Radar, Scatter } from "react-chartjs-2";

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
  BarController,
  PieController,
  DoughnutController,
  BubbleController,
  PolarAreaController,
  RadarController,
  ScatterController
);

const data = {
 labels: [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running'
  ],
     datasets: [{
    label: 'My First Dataset',
    data: [5, 59, 30, 81, 56, 55, 40,
         // Scatter
         { x: 10, y: 20, r: 8 },
              { x: 15, y: 10, r: 12 },
              { x: 7,  y: 25, r: 6  },
              { x: 20, y: 5,  r: 10 }
    ],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  },  {
    label: 'My Second Dataset',
    data: [8, 48, 40, 19, 96, 27, 100,
      // Scatter
      {
      x: -10,
      y: 0
    }, {
      x: 0,
      y: 10
    }, {
      x: 10,
      y: 5
    }, {
      x: 0.5,
      y: 5.5
    }
    ],
    fill: true,
    backgroundColor: 'rgba(55, 217, 23, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};

const chartTitle = ["Line Chart", "Bar Chart","Pie Chart", "Doughnut Chart", "Bubble Chart", "PolarArea Chart", "Radar Chart", "Scatter Chart"]

//options is an array of objects.
const options = chartTitle.map(title => ({
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: title },
  },
}));
console.log("options",options)


const SampleChart = () => {
  return (
    <div style={{ width: "50%", margin: "0 auto",  }}>
      <Line data={data} options={options[0]} />
      <Bar data={data}  options={options[1]} />
      <Pie data={data} options={options[2]} />
      <Doughnut data={data} options={options[3]} />
      {/* Bubble datasets must be arrays of objects with x, y, r, not numbers. */}
        <Bubble
          data={{
            datasets: [
              {
                label: 'Bubble Dataset 1',
                data: [
                  { x: 10, y: 20, r: 8 },
                  { x: 15, y: 10, r: 12 },
                  { x: 7,  y: 25, r: 6 },
                  { x: 20, y: 5,  r: 10 }
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
              },
            ],
          }}
          options={options[4]}
        />
      <PolarArea data={data} options={options[5]} />
      <Radar data={data} options={options[6]} />
      <Scatter data={{ ...data, datasets: [{ ...data.datasets[0], data: [{ x: 1, y: 12 }, { x: 2, y: 19 }, { x: 3, y: 3 }, { x: 4, y: 5 }] }] }} options={options[7]} />
    </div>


//animation in bar chart for Admission
// create a data
// X: Jan - Dec (2025) >> All its already
// Y: Admission
// fetch Get request >> Admission Data 
// filter, find method, - same method as admission total get into Array
// to Data set and use Map
// Admission is Array ? if so >> put data set 
// create a array - Push to this empty array

// View by task, View by Adimission,
//  1 Graph and 1 data, 2 Charts (LINE Chart, Pie Chart - Sourcing/referral,)

  );
};

export default SampleChart;
