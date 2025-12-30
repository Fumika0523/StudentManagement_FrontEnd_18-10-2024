import React from 'react';
import AccordionCard from './AccordionCard';

const AccordionDisplay = ({ admissionData, batchData, studentData }) => {
  
  // 1st Set: Batch Data Logic
  const batchItems = [
    { label: "Batch Completion", value: batchData?.completed || 0 },
    { label: "Training Completion", value: batchData?.trainingDone || 0 },
    { label: "In-training Batch", value: batchData?.inTraining || 0 },
  ];

  // 2nd Set: Student Status Logic
  const studentItems = [
    { label: "Batch Completed", value: studentData?.filter(s => s.status === 'completed').length || 0 },
    { label: "Training Completed", value: studentData?.filter(s => s.status === 'trained').length || 0 },
    { label: "In Progress", value: studentData?.filter(s => s.status === 'progress').length || 0 },
  ];

  // 3rd Set: Admission/Payment Logic
  const paymentItems = [
    { 
      label: "Fully Paid", 
      value: admissionData?.filter(a => a.status === 'paid').length || 0 
    },
    { 
      label: "Pending Payment", 
      value: admissionData?.filter(a => a.status === 'unpaid').length || 0 
    },
  ];

  return (
    <div className="container mt-4">
      <AccordionCard 
        title="Batch Overview (Full Year)" 
        items={batchItems} 
        themeColor="#2c3e50" 
      />
      
      <AccordionCard 
        title="Student Progress" 
        items={studentItems} 
        themeColor="#27ae60" 
      />

      <AccordionCard 
        title="Admission Fee Status" 
        items={paymentItems} 
        themeColor="#e67e22" 
      />
    </div>
  );
}

export default AccordionDisplay;