import React from 'react';
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { HiDotsVertical } from "react-icons/hi";


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

function DonutCard() {
  return (
  <>
      <div className='col-lg-5 mx-auto col-11'>
        <Card className=' d-flex shadow justify-content-center mb-3' >
      <Card.Header className="d-flex py-2 m-0 flex-row justify-content-between align-items-center" as="h5" style={{color:"#4e73df"}}>Revenue Sources
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
      <Card.Body>
      <Doughnut data={data} options={options} className='d-flex flex-row'
      style={{display:"block",height:"340px"}}/>     
      </Card.Body>
    </Card>
    </div>
   </>
  );
}

export default DonutCard;