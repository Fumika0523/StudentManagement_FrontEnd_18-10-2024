import React, { useMemo } from "react";
import AccordionCard from "./AccordionCard";

const AccordionDisplay = ({ admissionData, batchData, studentData, year, month }) => {
  const selectedYear = Number(year);

  const itemsByStatus = useMemo(() => {
    // -----------------------------
    // 1) Helper: year/month filter
    // -----------------------------
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

      // A) Count batches for this status in the selected period
      (batchData || []).forEach((b) => {
        // choose which date to use: createdAt or startDate
        // You said "total batch in selected month/year" -> createdAt is best
        if (!inSelectedPeriod(b.createdAt)) return;
        if (b.status !== targetBatchStatus) return;

        const loc = b.location || "Unknown";

        rowsByLocation[loc] ||= {
          label: loc,
          studentEnrolled: 0,
          assigned: 0,
          deAssigned: 0,
          totalBatches: 0,
        };

        rowsByLocation[loc].totalBatches += 1;
      });

      // B) Count students for this status in the selected period
      (studentData || []).forEach((s) => {
        // "Student Enrolled" = student created in selected month/year (your requirement)
        if (!inSelectedPeriod(s.createdAt)) return;

        // get the student's batch by batchNumber
        const batch = batchByNumber[s.batchNumber];
        if (!batch) return; // no batch => cannot map to location row

        // only count students whose batch status matches this accordion
        if (batch.status !== targetBatchStatus) return;

        const loc = batch.location || "Unknown";

        rowsByLocation[loc] ||= {
          label: loc,
          studentEnrolled: 0,
          assigned: 0,
          deAssigned: 0,
          totalBatches: 0,
        };

        // enrolled count
        rowsByLocation[loc].studentEnrolled += 1;

        // assigned/de-assigned counts (from student.status)
        if (s.status === "Assigned") rowsByLocation[loc].assigned += 1;
        if (s.status === "De-assigned") rowsByLocation[loc].deAssigned += 1;
      });
console.log("DEBUG In Progress rows:", rowsByLocation);

      return Object.values(rowsByLocation);
    };

    // --------------------------------------------
    // 4) Build the 3 accordion tables (keep them)
    // --------------------------------------------
    const columnLabel = [
      "Student Enrolled",
      "De-Assigned",
      "Assigned",
      "Drop out",
      "Certificate Generated",
      "Total Batches",
      "Revenue Collected",
    ];

    return {
      batchCompleted: [
        {
          label: "Batch Completed",
          columnLabel,
          rows: buildRowsForBatchStatus("Batch Completed"),
        },
      ],
      trainingCompleted: [
        {
          label: "Training Completed",
          columnLabel,
          rows: buildRowsForBatchStatus("Training Completed"),
        },
      ],
      inProgress: [
        {
          label: "In-training Batch",
          columnLabel,
          rows: buildRowsForBatchStatus("In Progress"),
        },
      ],
    };
  }, [batchData, studentData, selectedYear, month]);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-secondary border-bottom pb-2">
        Statistics for {selectedYear} {month ? `(${month})` : "(Year Total)"}
      </h3>

      <AccordionCard title="" items={itemsByStatus.batchCompleted} themeColor="#2c3e50" selectedYear={selectedYear} />
      <AccordionCard title="" items={itemsByStatus.trainingCompleted} themeColor="#27ae60" selectedYear={selectedYear} />
      <AccordionCard title="" items={itemsByStatus.inProgress} themeColor="#e67e22" selectedYear={selectedYear} />
    </div>
  );
};

export default AccordionDisplay;
