import React, { useMemo } from 'react';
import AccordionCard from './AccordionCard';

const AccordionDisplay = ({ admissionData, batchData, studentData, year }) => {
  //console.log("batchData",batchData)
  //console.log("studentData",studentData)
  // 1. Ensure year is a number for consistent comparison
  const selectedYear = Number(year);
  // 2. Wrap calculations in useMemo so they recalculate when 'year' or 'data' changes
  const { batchItems, studentItems, paymentItems } = useMemo(() => {
   // Helper to check if a record belongs to the selected year
  const isYearMatch = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        return !isNaN(d) && d.getFullYear() === selectedYear;
  };

const getTableRows = (dataSource, dateField, filterPredicate, groupByField = null) => {
    // 1. Filter batches/records by Year and Status
    const filteredSource = dataSource?.filter(item => {
        return isYearMatch(item[dateField]) && filterPredicate(item);
    }) || [];

    const groupedData = {};

    filteredSource.forEach(item => {
        let groupKey = item[groupByField] || item.location || "Total";

        if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
                label: groupKey,
                // We will store the counts for each column here
                studentEnrolled: 0, 
                totalBatches: 0,
                // Add other counts as needed...
            };
        }
        // Increment Batch Count
        groupedData[groupKey].totalBatches += 1;

        // Calculate Students for this specific batch
        // We look into admissionData to find how many students are in this item's batchNumber
        const studentsInThisBatch = admissionData?.filter(
            adm => adm.batchNumber === item.batchNumber
        ).length || 0;

        groupedData[groupKey].studentEnrolled += studentsInThisBatch;
    });

    return Object.values(groupedData);
};

const bData =  batchData?.filter(b => isYearMatch(b.createdAt) && b.status === 'Batch Completed')
console.log("batchNumber",bData)
const completedBatchNumbers = batchData
  ?.filter(b => isYearMatch(b.createdAt) && b.status === 'Batch Completed')
  .map(b => b.batchNumber);
  console.log("completedBatchNumbers",completedBatchNumbers)
const k = admissionData?.filter(a => a.batchNumber  )
console.log("k",k)
console.log(k?.map(a =>a.studentName))
const completedBatchStudents = studentData?.filter(
  s =>
    isYearMatch(s.createdAt) &&
    completedBatchNumbers?.includes(s.batchNumber)
);
console.log(completedBatchStudents)

    // --- BATCH DATA ---
    const bItems = [
        {
        label: "Batch Completed",
        columnLabel: ["Student Enrolled", "Total Batches", "Revenue Collected"],
        rows: getTableRows(batchData, "startDate", b => b.status === "Batch Completed", "location"),
      },
    ];

    // --- STUDENT DATA ---
    const sItems = [
  {
    label: "Training Completed",
     columnLabel:[
          "Student Enrolled","De-Assigned", "Assigned","Drop out", "Certificate Generated", "Total Batches", "Revenue Collected"
        ],
    value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === "Training Completed").length || 0,
    rows: getTableRows(batchData, "startDate", s => s.status === "Training Completed", "location"),
  },
    ];

    // --- ADMISSION DATA ---
    const pItems = [
      {
        label: "In-training Batch",
          columnLabel:[
          "Student Enrolled","De-Assigned", "Assigned","Drop out", "Total Batches", "Revenue Collected"
        ],
        value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === 'In Progress').length || 0,
        rows: getTableRows(batchData, 'startDate', s => s.status === 'In Progress',"location")
      }
    ];
    return { batchItems: bItems, studentItems: sItems, paymentItems: pItems };
  }, [year, batchData, studentData, admissionData]); 

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-secondary border-bottom pb-2">Statistics for {selectedYear}</h3>
      <AccordionCard title="" items={batchItems} themeColor="#2c3e50" selectedYear={selectedYear} />
      <AccordionCard title="" items={studentItems} themeColor="#27ae60"  selectedYear={selectedYear}/>
      <AccordionCard title="" items={paymentItems} themeColor="#e67e22" selectedYear={selectedYear} />
    </div>
  );
};

export default AccordionDisplay;