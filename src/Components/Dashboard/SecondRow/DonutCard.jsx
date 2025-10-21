import React from 'react';
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { HiDotsVertical } from "react-icons/hi";




function DonutCard({admissionData, setAdmissionData}) {

  // const sourceTitle = admissionData?.map((element)=>(element.admissionSource))
  // console.log("SourceTitle",sourceTitle)
const now = new Date();
const currentYr = now.getFullYear();
const startOfMonth = new Date(currentYr, now.getMonth(), 1);
const startOfNextMonth = new Date(currentYr, now.getMonth() + 1, 1);

const getAdmissionMonth = admissionData?.filter(item => {
  const date = new Date(item.admissionDate);
  return date >= startOfMonth && date < startOfNextMonth;
});

const monthlySource = { Social: 0, Referral: 0, Direct: 0 };

getAdmissionMonth.forEach(item => {
  if (item.admissionSource in monthlySource) {
    monthlySource[item.admissionSource]++;
  }
});

const data = {
  labels: ["Social","Referral","Direct"],
  datasets: [{
    data: Object.values(monthlySource),
    backgroundColor: ['#4e73df','#1cc88a','#36b9cc'],
    borderWidth: 2
  }]
};

const options = {
  cutout: '80%',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
};

  return (
  <>
    <Card className=' d-flex shadow justify-content-center mb-3' >
      <Card.Header className="d-flex py-2 m-0 flex-row justify-content-between align-items-center" as="h5" style={{color:"#4e73df"}}> Admission Source
      </Card.Header>
      <Card.Body>
      <Doughnut data={data} options={options} className='d-flex flex-row'
      style={{display:"block",height:"330px"}}/>     
      </Card.Body>
    </Card>
  </>
  );
}

export default DonutCard;