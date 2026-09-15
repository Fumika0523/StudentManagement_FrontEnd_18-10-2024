import {
  useMemo,
} from "react";

import AccordionCard from "./AccordionCard";

import type {
  AccordionColumnLabel,
  AccordionItemData,
  AccordionTableRow,
} from "./AccordionCard";

import type {
  Admission,
} from "../../../../types/admission";

import type {
  Batch,
  BatchStatus,
} from "../../../../types/batch";

import type {
  Student,
} from "../../../../types/student";


// ========================================
// DASHBOARD BATCH STATUS
// ========================================

/*
 * The Dashboard currently creates accordion
 * sections for these three Batch statuses.
 */
type DashboardBatchStatus =
  Extract<
    BatchStatus,
    | "In Progress"
    | "Training Completed"
    | "Batch Completed"
  >;


// ========================================
// COMPONENT PROPS
// ========================================

interface AccordionDisplayProps {
  admissionData: Admission[];

  batchData: Batch[];

  /*
   * The existing parent still passes Student data.
   *
   * It is not currently used by the statistics
   * calculations, but we keep it in the prop
   * contract until DashboardCard is migrated.
   */
  studentData: Student[];

  year: number;

  /*
   * Empty string means:
   * show the whole selected year.
   */
  month: string;
}


// ========================================
// ACCORDION GROUPS
// ========================================

interface AccordionGroups {
  batchCompleted: AccordionItemData[];

  trainingCompleted: AccordionItemData[];

  inProgress: AccordionItemData[];
}


// ========================================
// COMPONENT
// ========================================

const AccordionDisplay = ({
  admissionData,
  batchData,
  studentData,
  year,
  month,
}: AccordionDisplayProps) => {
  // ========================================
  // SELECTED YEAR
  // ========================================

  /*
   * Year is already kept as a number after our
   * earlier TypeScript migrations.
   */
  const selectedYear =
    year;


  // ========================================
  // COLUMN LABELS
  // ========================================

  const getColumnLabel = (
    targetBatchStatus:
      DashboardBatchStatus
  ): AccordionColumnLabel[] => {
    /*
     * In-progress batches do not currently
     * display the Certificate Generated column.
     */
    if (
      targetBatchStatus ===
      "In Progress"
    ) {
      return [
        "Student Enrolled",
        "De-Assigned",
        "Assigned",
        "Drop out",
        "Total Batches",
        "Revenue Collected",
      ];
    }


    /*
     * Completed statuses include certificate
     * information.
     */
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


  // ========================================
  // BUILD DASHBOARD STATISTICS
  // ========================================

  const itemsByStatus =
    useMemo<AccordionGroups>(
      () => {
        // ========================================
        // DATE FILTER
        // ========================================

        /*
         * Check whether a backend date belongs to
         * the currently selected year/month.
         */
        const inSelectedPeriod = (
          dateString:
            string | null | undefined
        ): boolean => {
          if (
            !dateString ||
            !selectedYear
          ) {
            return false;
          }


          const date =
            new Date(
              dateString
            );


          /*
           * Safer than the old:
           *
           * isNaN(date)
           *
           * because it avoids implicit coercion.
           */
          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return false;
          }


          if (
            date.getFullYear() !==
            selectedYear
          ) {
            return false;
          }


          /*
           * No month selected:
           * include the whole selected year.
           */
          if (
            !month
          ) {
            return true;
          }


          const dateMonth =
            date.toLocaleString(
              "en",
              {
                month:
                  "long",
              }
            );


          return (
            dateMonth ===
            month
          );
        };


        // ========================================
        // BUILD ONE STATUS TABLE
        // ========================================

        const buildRowsForBatchStatus = (
          targetBatchStatus:
            DashboardBatchStatus
        ): AccordionTableRow[] => {
          /*
           * Dynamic lookup:
           *
           * location -> statistics row
           */
          const rowsByLocation:
            Record<
              string,
              AccordionTableRow
            > = {};


          // ========================================
          // ENSURE LOCATION ROW
          // ========================================

          const ensureRow = (
            location:
              string | undefined
          ): AccordionTableRow => {
            const key =
              location ||
              "Unknown";


            if (
              !rowsByLocation[
                key
              ]
            ) {
              rowsByLocation[
                key
              ] = {
                label:
                  key,

                // Counts
                studentEnrolled:
                  0,

                assigned:
                  0,

                deAssigned:
                  0,

                totalBatches:
                  0,

                /*
                 * These values are displayed by
                 * AccordionCard even though the
                 * existing Dashboard calculation
                 * has not implemented them yet.
                 */
                dropOutCount:
                  0,

                certificateCounts:
                  0,

                revenueCollectedCount:
                  0,

                // Lists used by detail modals
                studentEnrolledList:
                  [],

                assignedList:
                  [],

                deAssignedList:
                  [],

                batchList:
                  [],
              };
            }


            return rowsByLocation[
              key
            ];
          };


          // ========================================
          // FILTER BATCHES
          // ========================================

          /*
           * Keep only Batches that:
           *
           * 1. were created in the selected period
           * 2. have the requested Batch status
           */
          const batchesInScope =
            batchData.filter(
              (
                batch
              ) => {
                if (
                  !inSelectedPeriod(
                    batch.createdAt
                  )
                ) {
                  return false;
                }


                return (
                  batch.status ===
                  targetBatchStatus
                );
              }
            );


          // ========================================
          // LOOKUP BATCH BY NUMBER
          // ========================================

          const batchByNumberInScope:
            Record<
              string,
              Batch
            > = {};


          batchesInScope.forEach(
            (
              batch
            ) => {
              batchByNumberInScope[
                batch.batchNumber
              ] =
                batch;


              /*
               * Count Batches per location and
               * keep each Batch for the modal.
               */
              const row =
                ensureRow(
                  batch.location
                );


              row.totalBatches =
                (
                  row.totalBatches ??
                  0
                ) +
                1;


              row.batchList?.push(
                batch
              );
            }
          );


          // ========================================
          // FILTER ADMISSIONS
          // ========================================

          /*
           * Student Enrolled is currently based on
           * Admission.createdAt in the source logic.
           */
          const admissionsInScope =
            admissionData.filter(
              (
                admission
              ) =>
                inSelectedPeriod(
                  admission.createdAt
                )
            );


          // ========================================
          // COUNT ADMISSIONS PER LOCATION
          // ========================================

          admissionsInScope.forEach(
            (
              admission
            ) => {
              /*
               * Admission.batchNumber is optional
               * in the shared Admission type.
               */
              if (
                !admission.batchNumber
              ) {
                return;
              }


              const batch =
                batchByNumberInScope[
                  admission.batchNumber
                ];


              /*
               * Ignore Admissions whose Batch does
               * not belong to the current accordion
               * status/time period.
               */
              if (
                !batch
              ) {
                return;
              }


              const row =
                ensureRow(
                  batch.location
                );


              // ========================================
              // STUDENT ENROLLED
              // ========================================

              row.studentEnrolled =
                (
                  row.studentEnrolled ??
                  0
                ) +
                1;


              row.studentEnrolledList?.push(
                admission
              );


              // ========================================
              // ASSIGNED / DE-ASSIGNED
              // ========================================

              if (
                admission.status ===
                "Assigned"
              ) {
                row.assigned =
                  (
                    row.assigned ??
                    0
                  ) +
                  1;


                row.assignedList?.push(
                  admission
                );
              } else if (
                admission.status ===
                "De-assigned"
              ) {
                row.deAssigned =
                  (
                    row.deAssigned ??
                    0
                  ) +
                  1;


                row.deAssignedList?.push(
                  admission
                );
              }
            }
          );


          return Object.values(
            rowsByLocation
          );
        };


        // ========================================
        // RETURN ALL STATUS GROUPS
        // ========================================

        return {
          batchCompleted: [
            {
              label:
                "Batch Completed",

              columnLabel:
                getColumnLabel(
                  "Batch Completed"
                ),

              rows:
                buildRowsForBatchStatus(
                  "Batch Completed"
                ),
            },
          ],


          trainingCompleted: [
            {
              label:
                "Training Completed",

              columnLabel:
                getColumnLabel(
                  "Training Completed"
                ),

              rows:
                buildRowsForBatchStatus(
                  "Training Completed"
                ),
            },
          ],


          inProgress: [
            {
              label:
                "In-training Batch",

              columnLabel:
                getColumnLabel(
                  "In Progress"
                ),

              rows:
                buildRowsForBatchStatus(
                  "In Progress"
                ),
            },
          ],
        };
      },
      [
        admissionData,
        batchData,
        selectedYear,
        month,
      ]
    );


  /*
   * Student data is part of the current component
   * contract but is not yet used in these
   * Dashboard calculations.
   */
  void studentData;


  return (
    <div className="container-fluid mt-4">
      {/* ========================================
          DASHBOARD PERIOD TITLE
      ======================================== */}

      <h3 className="mb-2 text-secondary">
        Statistics for{" "}
        {selectedYear}{" "}
        {month
          ? `(${month})`
          : "(Year Total)"}
      </h3>


      {/* ========================================
          BATCH COMPLETED
      ======================================== */}

      <AccordionCard
        title=""
        month={
          month
        }
        items={
          itemsByStatus.batchCompleted
        }
        themeColor="#2c3e50"
        selectedYear={
          selectedYear
        }
      />


      {/* ========================================
          TRAINING COMPLETED
      ======================================== */}

      <AccordionCard
        title=""
        month={
          month
        }
        items={
          itemsByStatus.trainingCompleted
        }
        themeColor="#27ae60"
        selectedYear={
          selectedYear
        }
      />


      {/* ========================================
          IN PROGRESS
      ======================================== */}

      <AccordionCard
        title=""
        month={
          month
        }
        items={
          itemsByStatus.inProgress
        }
        themeColor="#e67e22"
        selectedYear={
          selectedYear
        }
      />
    </div>
  );
};

export default AccordionDisplay;