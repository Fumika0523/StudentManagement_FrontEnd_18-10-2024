import { Line } from "react-chartjs-2";
import { lineData } from "./ChartData";
import Chart from 'chart.js/auto'; 
import Card from 'react-bootstrap/Card';
import styled from "styled-components";

export const ChartDisplay =()=>{
    // const data ={
    //     labels:lineData.map((element)=>element.month),
    //     datasets:[
    //         {
    // label: "Earnings",
    //   data: lineData.map((element) => element.earning),
    //   fill: true,
    //   backgroundColor: "#f4f6fd",
    //   borderColor: "#4e73df",
    //   tension:0.4
    //         }
    //     ]
    // };    // };

    // const options = {
    //   // Np title
    //     plugins:{
    //     title:{display:false},
    //     legend:{display:false},
    //     scales: {
    //       // No grid 
    //         x:{grid:{display:false}},
    //         y:{
    //             grid:{display:false},
    //             // Start from 0
    //             beginAtZero:true,
    //             // Step sizes
    //             ticks:{stepSize:10000}
    //         },
    //     },
    //   }


    const data = {
      labels: lineData.map((element) => element.month),
      datasets: [
        {
          label: "Earnings",
          data: lineData.map((element) => element.earning),
          fill: true,
          backgroundColor: "#f4f6fd",
          borderColor: "#4e73df",
          tension: 0.4 // Add this line to create smooth edges
        },
      ],
  };



  // check the design

  const options = {
    plugins: {
      title: { display: false },
      legend: { display: false }
    },
    scales: {
         x: {
        grid: { display: false,
         },
      },
      y: {
        grid: { display: true,
         },
        beginAtZero: true,
        ticks: {
          stepSize: 10000
        }
      
      }
    }
};
    return(

      <Card style={{ width: '65%',height:"440px"}}>
      <Card.Body>
        <Card.Title style={{color:"#4e73df"}} className="pb-3 border-bottom">Earnings Overview</Card.Title>
        <div  >
        <Line data={data} options={options} style={{paddingBottom:"5%",width:"100%"}} />
        </div>
     </Card.Body>
    </Card>   
    );
};

//Create a pie chart
//design the line chart 