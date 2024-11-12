import React from 'react';
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';

const data = {
  labels: [
    'Direct',
    'Social',
    'Referral'
  ],
  datasets: [{
    data: [55,30,15],
    backgroundColor: [
      '#4e73df',
      '#1cc88a',
      '#36b9cc'
    ],
     borderWidth: 2,
    // radius: '100%',
    
  }]
};

const options = {
  cutout:'80%',
  response:true,
  maintainAspectRatio:false,
    // Np title
  plugins: {
      legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true, // Makes legend labels circular
        padding: 20,         // Adds spacing between labels
      },},
  },  
  }

function DonutDisplay() {
  return (
    <Card style={{ width: '30rem',margin:"1.6%"}}>
    <Card.Body>
      <Card.Title style={{color:"#4e73df"}} className="pb-3 border-bottom">Revenue Sources</Card.Title>
      <div style={{position:"relative",height:"300px"}}>
      <Doughnut data={data} options={options} />
      </div>
   </Card.Body>
  </Card>   
  );
}

export default DonutDisplay;