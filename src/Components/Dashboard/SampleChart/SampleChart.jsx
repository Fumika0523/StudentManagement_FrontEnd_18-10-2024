import React from 'react'
import {Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Legend,
  Tooltip} from 'chart.js';

import { Bar, Line } from 'react-chartjs-2';
Chart.register([
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Legend,
  Tooltip
]);


const data =  {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'red',
        backgroundColor:['blue','pink','orange']
      }]
    }


const options = {
  responsive:true,
  animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }},
  plugins:{
    legend:{position:"top", },
    labels: {color: 'rgb(255, 99, 132)'},
    title:{display:true,text:"ChartJs Bar Chart"},
  },
}

const SampleChart = () => {
  return (
    <>
    <div style={{width:"30%"}}>
        <Line data={data} options={options} />
        <Bar data={data} options={options} />
    </div>
     </>
  )
}

export default SampleChart


//1. import, 2. Register, 3/set data