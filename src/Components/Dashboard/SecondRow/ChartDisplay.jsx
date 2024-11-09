import { Line } from "react-chartjs-2";
import { lineData } from "./ChartData";
import Chart from 'chart.js/auto'; 

export const ChartDisplay =()=>{
    const data ={
        labels:lineData.map((element)=>element.month),
        datasets:[
            {
    label: "Earnings",
      data: lineData.map((element) => element.earning),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      tension:0.4
            }
        ]
    };

    const options = {
      // Np title
        plugins:{
            title:{display:false},
        legend:{display:false},
        scales: {
          // No grid 
            x:{grid:{display:false}},
            y:{
                grid:{display:false},
                // Start from 0
                beginAtZero:true,
                // Step sizes
                ticks:{stepSize:10000}
            },
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          enabled: true,
          mode: "x",
          sensitivity: 0.5,
        },
      }};

    return(
      <div>
        <Line data={data} options={options}/>
      </div>
    );
};

//Create a pie chart