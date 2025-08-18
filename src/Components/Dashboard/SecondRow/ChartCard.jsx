import { Line } from "react-chartjs-2";
import { lineData } from "./ChartData";
import Chart from 'chart.js/auto'; 
import Card from 'react-bootstrap/Card';
import styled from "styled-components";
import Dropdown from 'react-bootstrap/Dropdown';
import { HiDotsVertical } from "react-icons/hi";

export const ChartCard=()=>{
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
      <>
     <div className="col-lg-7 col-11">
      <Card className=" mx-auto d-flex justify-content-center mb-3  shadow" style={{ }}>
        <Card.Header className="d-flex py-2 flex-row justify-content-between align-items-center" as="h5" style={{color:"#4e73df"}}>
          Earnings Overview
           <Dropdown>
      <Dropdown.Toggle variant="" id="dropdown-basic" className=''>
        <HiDotsVertical className='text-secondary'/>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
           </Dropdown>
        </Card.Header>
      <Card.Body >
        <Line data={data} options={options} 
        className="mx-auto w-100"
      style={{display:"block",height:"380px"}}/>

     </Card.Body>
      </Card> 
      </div>
    </>
    );
};

