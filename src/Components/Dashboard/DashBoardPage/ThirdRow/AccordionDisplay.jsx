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

  // Refined Helper to generate rows based on year
 const getTableRows = (dataSource, dateField, filterPredicate, groupByField = null) => {
  // 1. Filter the data first
  const filtered = dataSource?.filter(item => {
    const yearMatch = isYearMatch(item[dateField]);
    const statusMatch = filterPredicate(item);
    return yearMatch && statusMatch;
  }) || [];
 // console.log(`Filtering for ${selectedYear}: Found ${filtered.length} items`);
      const groupedCounts = {};
    //  console.log("groupedCounts",groupedCounts)

      filtered.forEach(item => {
    // 2. Locate the group key (Location)
    // Check item.location, if it's missing, default to "Unknown Location"
    let groupKey = "Total";
    if (groupByField) {
      groupKey = item[groupByField] || item.location || "Unknown Location";
    }

    if (!groupedCounts[groupKey]) {
      groupedCounts[groupKey] = Array(12).fill(0);
    }
    
    const dateValue = new Date(item[dateField]);
    if (!isNaN(dateValue)) {
      const monthIndex = dateValue.getMonth();
      groupedCounts[groupKey][monthIndex]++;
    }
  });

  return Object.keys(groupedCounts).map(key => ({
    label: key,
    monthlyCounts: groupedCounts[key]
  }));
};

//console.log("Batch years:",  batchData.map(b => new Date(b.createdAt).getFullYear()));
//console.log("Sample batch object:", batchData?.[0]);

const bData =  batchData?.filter(b => isYearMatch(b.createdAt) && b.status === 'Batch Completed')
console.log("batchNumber",bData)
const completedBatchNumbers = batchData
  ?.filter(b => isYearMatch(b.createdAt) && b.status === 'Batch Completed')
  .map(b => b.batchNumber);
  console.log("completedBatchNumbers",completedBatchNumbers)
const k = admissionData?.filter(a => a.batchNumber  )
console.log("k",k)
console.log(k?.map(a =>a.studentName))
const studentName = k?.map(a =>a.studentName)

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
        value: batchData?.filter(b => isYearMatch(b.createdAt) && b.status === 'Batch Completed').length,
        rows: getTableRows(batchData, 'createdAt', b => b.status === 'Batch Completed', 'location')
      },
      // {
      //   label: "Training Completed",
      //   value: batchData?.filter(b => isYearMatch(b.createdAt) && b.status === 'Training Completed').length,
      //   rows: getTableRows(batchData, 'createdAt', b => b.status === 'Training Completed', 'location')
      // },
      // {
      //   label: "In-training Batch",
      //   value: batchData?.filter(b => isYearMatch(b.createdAt) && b.status === 'In Progress').length,
      //   rows: getTableRows(batchData, 'createdAt', b => b.status === 'In Progress', 'location')
      // }
    ];

    // --- STUDENT DATA ---
    const sItems = [
      // {
      //   label: "Batch Completed",
      //   value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === 'Batch Completed').length || 0,
      //   rows: getTableRows(batchData, 'createdAt', b => b.status === 'Training Completed', 'batchNumber')
      // },
      {
        label: "Training Completed",
        value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === 'Training Completed').length || 0,
        rows: getTableRows(batchData, 'createdAt', b => b.status === 'Training Completed', 'location')
      },
      // {
      //   label: "In-training Batch",
      //   value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === 'In Progress').length || 0,
      //   rows: getTableRows(studentData, 'createdAt', s => s.status === 'In Progress', null)
      // }
    ];

    // --- ADMISSION DATA ---
    const pItems = [
      // { 
      //   label: "Fully Paid", 
      //   value: admissionData?.filter(a => isYearMatch(a.admissionDate) && a.status === 'paid').length || 0,
      //   rows: getTableRows(admissionData, 'admissionDate', a => a.status === 'paid', null)
      // },
      //     { 
      //   label: "Under Due", 
      //   value: admissionData?.filter(a => isYearMatch(a.admissionDate) && a.status === 'paid').length || 0,
      //   rows: getTableRows(admissionData, 'admissionDate', a => a.status === 'paid', null)
      // }
         {
        label: "In-training Batch",
        value: studentData?.filter(s => isYearMatch(s.createdAt) && s.status === 'In Progress').length || 0,
        rows: getTableRows(studentData, 'createdAt', s => s.status === 'In Progress', location)
      }
    ];

    return { batchItems: bItems, studentItems: sItems, paymentItems: pItems };

  }, [year, batchData, studentData, admissionData]); // Re-run whenever year or data updates

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