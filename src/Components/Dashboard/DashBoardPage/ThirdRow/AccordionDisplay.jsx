import React, { useMemo } from "react";
import AccordionCard from "./AccordionCard";

const AccordionDisplay = ({ admissionData, batchData, studentData, year, month }) => {
  const selectedYear = Number(year); //Number(year) ensures numeric comparios works, It also converts "" (empty) → 0 (so your if (!selectedYear) check can treat it as “not selected”)
  console.log("selectedYear",selectedYear) // "2026" -> 2026

  const getColumnLabel = (targetBatchStatus)=>{
   if(targetBatchStatus === "In Progress"){
    return[
      "Student Enrolled",
      "De-Assigned",
      "Assigned",
      "Drop out",
      "Total Batches",
      "Revenue Collected",
    ]
   }
   // Other statuses : include certificate in the middle
     return [
    "Student Enrolled",
    "De-Assigned",
    "Assigned",
    "Drop out",
    "Certificate Generated",
    "Total Batches",
    "Revenue Collected",
  ];
};

//
  const itemsByStatus = useMemo(() => {
    // 1) Helper: year/month filter
    const inSelectedPeriod = (dateString) => {
      if (!dateString || !selectedYear) return false;

      const d = new Date(dateString);
      if (isNaN(d)) return false;

      const y = d.getFullYear();
      if (y !== selectedYear) return false;

      // month is optional. If month not selected => year total
      if (!month) return true;

      const m = d.toLocaleString("en", { month: "long" }); // "January"
      return m === month;
    };

    // -------------------------------------------------------
    // 2) Build a quick lookup: batchNumber -> batch object
    // -------------------------------------------------------
    const batchByNumber = {};
    (batchData || []).forEach((b) => {
      if (b?.batchNumber) batchByNumber[b.batchNumber] = b;
    });

    // -------------------------------------------------------
    // 3) This builds ONE table for ONE batch status
    //    (ex: "In Progress", "Training Completed", "Batch Completed")
    // -------------------------------------------------------
    const buildRowsForBatchStatus = (targetBatchStatus) => {
      const rowsByLocation = {};

      const ensureRow = (loc) => {
        const key = loc || "Unknown";
        if (!rowsByLocation[key]) {
          rowsByLocation[key] = {
            label: key,

            // counts
            studentEnrolled: 0,
            assigned: 0,
            deAssigned: 0,
            totalBatches: 0,

            // lists for modal
            studentEnrolledList: [],
            assignedList: [],
            deAssignedList: [],
            batchList: [],
          };
        }
        return rowsByLocation[key];
      };

      // 1) Filter batches in the selected period AND in this batch status
      const batchesInScope = (batchData || []).filter((b) => {
        if (!inSelectedPeriod(b.createdAt)) return false;
        return b.status === targetBatchStatus;
      });

      // 2) batchNumber -> batch (only for this status + time period)
      const batchByNumberInScope = {};
      batchesInScope.forEach((b) => {
        batchByNumberInScope[b.batchNumber] = b;

        // Total batches per location + list for modal
        const row = ensureRow(b.location);
        row.totalBatches += 1;
        row.batchList.push(b);
      });

      // 3) Filter admissions in selected period (Student Enrolled based on admission.createdAt)
      const admissionsInScope = (admissionData || []).filter((a) => {
        return inSelectedPeriod(a.createdAt);
      });

      // 4) Count admissions per location BUT only if the admission's batch belongs to this accordion status
      admissionsInScope.forEach((a) => {
        const batch = batchByNumberInScope[a.batchNumber];
        if (!batch) return; // admission not in a batch that matches this accordion status

        const row = ensureRow(batch.location);

        // Student Enrolled = admissions created in period
        row.studentEnrolled += 1;
        row.studentEnrolledList.push(a); // store admission object for modal

        // Assigned / De-assigned based on admission.status
        if (a.status === "Assigned") {
          row.assigned += 1;
          row.assignedList.push(a);
        } else if (a.status === "De-assigned") {
          row.deAssigned += 1;
          row.deAssignedList.push(a);
        }
      });

      return Object.values(rowsByLocation);
    };

    return {
      batchCompleted: [
        {
          label: "Batch Completed",
          columnLabel:getColumnLabel("Batch Completed"),
          rows: buildRowsForBatchStatus("Batch Completed"),
        },
      ],
      trainingCompleted: [
        {
          label: "Training Completed",
          columnLabel:getColumnLabel("Training Completed"),
          rows: buildRowsForBatchStatus("Training Completed"),
        },
      ],
      inProgress: [
        {
          label: "In-training Batch",
          columnLabel:getColumnLabel("In Progress"),
          rows: buildRowsForBatchStatus("In Progress"),
        },
      ],
    };
  }, [batchData, studentData,  admissionData, selectedYear, month]);

  console.log(getColumnLabel("Training Completed"))

  return (
    <div className="container-fluid mt-4 border border-4 border-warning">
      <h3 className="mb-4 text-secondary pb-2">
        Statistics for {selectedYear} {month ? `(${month})` : "(Year Total)"}
      </h3>
      <AccordionCard title=""   month={month}   items={itemsByStatus.batchCompleted} themeColor="#2c3e50" selectedYear={selectedYear} />
      <AccordionCard title=""   month={month}   items={itemsByStatus.trainingCompleted} themeColor="#27ae60" selectedYear={selectedYear} />
      <AccordionCard   month={month}    title="" items={itemsByStatus.inProgress} themeColor="#e67e22" selectedYear={selectedYear} />
    </div>
  );
};

export default AccordionDisplay;
