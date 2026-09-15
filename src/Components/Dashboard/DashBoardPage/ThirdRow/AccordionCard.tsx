import {
  useState,
} from "react";

import {
  Accordion,
  Button,
  Dropdown,
  Modal,
  Table,
} from "react-bootstrap";

import {
  MdFileDownload,
} from "react-icons/md";

import {
  toast,
} from "react-toastify";

import * as XLSX from "xlsx";


// ========================================
// TABLE COLUMN TYPE
// ========================================

/*
 * These are the column labels currently supported
 * by renderCellByLabel() and the export functions.
 */
export type AccordionColumnLabel =
  | "Student Enrolled"
  | "De-Assigned"
  | "Assigned"
  | "Drop out"
  | "Certificate Generated"
  | "Total Batches"
  | "Revenue Collected";


// ========================================
// MODAL ROW TYPE
// ========================================

/*
 * The modal can receive either:
 *
 * - Admission records
 * - Batch records
 *
 * Therefore the fields used by the modal are
 * optional rather than forcing one backend model.
 */
export interface DashboardModalRow {
  _id?: string;

  studentName?: string;

  status?: string;

  batchNumber?: string;

  courseName?: string;

  createdAt?: string;
}


// ========================================
// ACCORDION TABLE ROW
// ========================================

export interface AccordionTableRow {
  /*
   * Usually the Batch location:
   * London, Norwich, Online, etc.
   */
  label: string;


  // ========================================
  // COUNTS
  // ========================================

  studentEnrolled?: number;

  deAssigned?: number;

  assigned?: number;

  dropOutCount?: number;

  certificateCounts?: number;

  totalBatches?: number;

  revenueCollectedCount?: number;


  // ========================================
  // DETAIL LISTS FOR MODALS
  // ========================================

  studentEnrolledList?: DashboardModalRow[];

  deAssignedList?: DashboardModalRow[];

  assignedList?: DashboardModalRow[];

  batchList?: DashboardModalRow[];
}


// ========================================
// ACCORDION ITEM
// ========================================

export interface AccordionItemData {
  label: string;

  columnLabel: AccordionColumnLabel[];

  rows: AccordionTableRow[];
}


// ========================================
// COMPONENT PROPS
// ========================================

interface AccordionCardProps {
  title: string;

  items: AccordionItemData[];

  themeColor: string;

  selectedYear: number;

  /*
   * Month is optional because the Dashboard
   * also supports a complete yearly report.
   */
  month?: string;
}


// ========================================
// COMPONENT
// ========================================

const AccordionCard = ({
  title,
  items,
  themeColor,
  selectedYear,
  month,
}: AccordionCardProps) => {
  // ========================================
  // MODAL STATE
  // ========================================

  const [
    showModal,
    setShowModal,
  ] =
    useState<boolean>(
      false
    );


  const [
    modalTitle,
    setModalTitle,
  ] =
    useState<string>(
      ""
    );


  const [
    modalRows,
    setModalRows,
  ] =
    useState<DashboardModalRow[]>(
      []
    );


  // ========================================
  // OPEN DETAIL MODAL
  // ========================================

  const openModal = (
    type: string,
    location: string,
    rows:
      DashboardModalRow[] | undefined
  ): void => {
    setModalTitle(
      `${type} • ${location}`
    );


    setModalRows(
      rows ??
        []
    );


    setShowModal(
      true
    );
  };


  // ========================================
  // BUILD EXPORT ROWS
  // ========================================

  /*
   * CSV and Excel use the same underlying
   * table values, so create them in one place.
   */
  const buildDataRows = (
    item: AccordionItemData
  ): Array<
    Array<string | number>
  > => {
    return item.rows.map(
      (
        row
      ) => {
        const values =
          item.columnLabel.map(
            (
              column
            ): string | number => {
              switch (
                column
              ) {
                case "Student Enrolled":
                  return (
                    row.studentEnrolled ??
                    0
                  );

                case "De-Assigned":
                  return (
                    row.deAssigned ??
                    0
                  );

                case "Assigned":
                  return (
                    row.assigned ??
                    0
                  );

                case "Drop out":
                  return (
                    row.dropOutCount ??
                    0
                  );

                case "Certificate Generated":
                  return (
                    row.certificateCounts ??
                    0
                  );

                case "Total Batches":
                  return (
                    row.totalBatches ??
                    0
                  );

                case "Revenue Collected":
                  return (
                    row.revenueCollectedCount ??
                    0
                  );

                default:
                  /*
                   * Exhaustive fallback.
                   *
                   * This should never be reached while
                   * AccordionColumnLabel stays aligned
                   * with the supported columns above.
                   */
                  return "";
              }
            }
          );


        return [
          row.label,
          ...values,
        ];
      }
    );
  };


  // ========================================
  // CSV DOWNLOAD
  // ========================================

  const handleDownloadCSV = (
    item: AccordionItemData
  ): void => {
    try {
      if (
        !item.rows.length
      ) {
        toast.info(
          "No data to download"
        );

        return;
      }


      const safeStatus =
        (
          item.label ||
          "report"
        ).replace(
          /[^\w]+/g,
          "_"
        );


      const safeMonth =
        month
          ? month.replace(
              /\s+/g,
              "_"
            )
          : "Year_Total";


      const titleRow1 =
        `Batch status - ${item.label || "-"}`;


      const titleRow2 =
        `${selectedYear}${
          month
            ? `, ${month}`
            : ""
        }`;


      const headers:
        Array<string> = [
        "Location",
        ...item.columnLabel,
      ];


      const dataRows =
        buildDataRows(
          item
        );


      /*
       * Accept unknown here because CSV values
       * can safely be converted to strings.
       */
      const escapeCSV = (
        value: unknown
      ): string => {
        const stringValue =
          String(
            value ??
              ""
          );


        if (
          /[",\n]/.test(
            stringValue
          )
        ) {
          return `"${stringValue.replace(
            /"/g,
            '""'
          )}"`;
        }


        return stringValue;
      };


      const csv =
        [
          [
            titleRow1,
          ],

          [
            titleRow2,
          ],

          [],

          headers,

          ...dataRows,
        ]
          .map(
            (
              row
            ) =>
              row
                .map(
                  escapeCSV
                )
                .join(
                  ","
                )
          )
          .join(
            "\n"
          );


      const blob =
        new Blob(
          [
            csv,
          ],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );


      const downloadUrl =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        downloadUrl;


      link.download =
        `${safeStatus}_${selectedYear}_${safeMonth}.csv`;


      link.click();


      URL.revokeObjectURL(
        downloadUrl
      );
    } catch (
      error: unknown
    ) {
      console.error(
        error
      );


      toast.error(
        "Some internal error, please contact super-admin"
      );
    }
  };


  // ========================================
  // EXCEL DOWNLOAD
  // ========================================

  const handleDownloadExcel = (
    item: AccordionItemData
  ): void => {
    try {
      if (
        !item.rows.length
      ) {
        toast.info(
          "No data to download"
        );

        return;
      }


      const safeStatus =
        (
          item.label ||
          "report"
        ).replace(
          /[^\w]+/g,
          "_"
        );


      const safeMonth =
        month
          ? month.replace(
              /\s+/g,
              "_"
            )
          : "Year_Total";


      const titleRow1 =
        `Batch status - ${item.label || "-"}`;


      const titleRow2 =
        `${selectedYear}${
          month
            ? `, ${month}`
            : ""
        }`;


      const headers:
        Array<string> = [
        "Location",
        ...item.columnLabel,
      ];


      const dataRows =
        buildDataRows(
          item
        );


      /*
       * XLSX aoa_to_sheet accepts an
       * array-of-arrays structure.
       */
      const sheetData:
        Array<
          Array<string | number>
        > = [
        [
          titleRow1,
        ],

        [
          titleRow2,
        ],

        [],

        headers,

        ...dataRows,
      ];


      const worksheet =
        XLSX.utils.aoa_to_sheet(
          sheetData
        );


      const workbook =
        XLSX.utils.book_new();


      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Report"
      );


      XLSX.writeFile(
        workbook,
        `${safeStatus}_${selectedYear}_${safeMonth}.xlsx`
      );
    } catch (
      error: unknown
    ) {
      console.error(
        error
      );


      toast.error(
        "Some internal error, please contact super-admin"
      );
    }
  };


  // ========================================
  // DYNAMIC CELL RENDERING
  // ========================================

  const renderCellByLabel = (
    label: AccordionColumnLabel,
    row: AccordionTableRow
  ) => {
    switch (
      label
    ) {
      case "Student Enrolled":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              openModal(
                "Student Enrolled",
                row.label,
                row.studentEnrolledList
              )
            }
          >
            {row.studentEnrolled ??
              0}
          </button>
        );


      case "De-Assigned":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              openModal(
                "De-assigned",
                row.label,
                row.deAssignedList
              )
            }
          >
            {row.deAssigned ??
              0}
          </button>
        );


      case "Assigned":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              openModal(
                "Assigned",
                row.label,
                row.assignedList
              )
            }
          >
            {row.assigned ??
              0}
          </button>
        );


      case "Drop out":
        return (
          row.dropOutCount ??
          0
        );


      case "Certificate Generated":
        return (
          row.certificateCounts ??
          0
        );


      case "Total Batches":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              openModal(
                "Total Batches",
                row.label,
                row.batchList
              )
            }
          >
            {row.totalBatches ??
              0}
          </button>
        );


      case "Revenue Collected":
        return (
          row.revenueCollectedCount ??
          0
        );


      default:
        return "-";
    }
  };


  return (
    <div
      className="mb-3 shadow-sm border rounded mx-3 p-2"
      style={{
        borderTop:
          `4px solid ${themeColor}`,
      }}
    >
      {/* ========================================
          SECTION TITLE
      ======================================== */}

      <h5
        style={{
          color:
            themeColor,
        }}
        className="mb-1"
      >
        {title}
      </h5>


      {/* ========================================
          ACCORDION
      ======================================== */}

      <Accordion>
        {items.map(
          (
            item,
            index
          ) => (
            <Accordion.Item
              eventKey={
                index.toString()
              }
              key={
                `${item.label}-${index}`
              }
            >
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                  <span
                    style={{
                      fontWeight:
                        500,
                    }}
                  >
                    {item.label}
                  </span>


                  {/* ========================================
                      DOWNLOAD MENU
                  ======================================== */}

                  <div
                    onClick={(
                      event
                    ) =>
                      event.stopPropagation()
                    }
                    onMouseDown={(
                      event
                    ) =>
                      event.stopPropagation()
                    }
                    onPointerDown={(
                      event
                    ) =>
                      event.stopPropagation()
                    }
                  >
                    <Dropdown
                      drop="up"
                      align="end"
                    >
                      <Dropdown.Toggle
                        id={`download-${index}`}
                        variant="link"
                        className="p-0 border-0 shadow-none"
                      >
                        <MdFileDownload
                          className="fs-4"
                          style={{
                            color:
                              "#3466fb",
                          }}
                        />
                      </Dropdown.Toggle>


                      <Dropdown.Menu
                        style={{
                          zIndex:
                            9999,
                        }}
                      >
                        <Dropdown.Item
                          onClick={() =>
                            handleDownloadCSV(
                              item
                            )
                          }
                        >
                          Download as CSV
                        </Dropdown.Item>


                        <Dropdown.Divider />


                        <Dropdown.Item
                          onClick={() =>
                            handleDownloadExcel(
                              item
                            )
                          }
                        >
                          Download as Excel
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Accordion.Header>


              {/* ========================================
                  TABLE
              ======================================== */}

              <Accordion.Body
                style={{
                  maxHeight:
                    "60vh",

                  overflowY:
                    "auto",
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="text-center"
                  style={{
                    minWidth:
                      950,

                    tableLayout:
                      "auto",
                  }}
                >
                  <thead
                    className="table-light"
                    style={{
                      position:
                        "sticky",

                      top:
                        0,

                      zIndex:
                        5,
                    }}
                  >
                    <tr>
                      <th
                        className="text-start"
                        style={{
                          background:
                            "#f8f9fa",

                          minWidth:
                            140,
                        }}
                      >
                        #
                      </th>


                      {item.columnLabel.map(
                        (
                          column
                        ) => (
                          <th
                            key={
                              column
                            }
                          >
                            {column}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>


                  <tbody>
                    {item.rows.length >
                    0 ? (
                      item.rows.map(
                        (
                          row
                        ) => (
                          <tr
                            key={
                              row.label
                            }
                          >
                            <td
                              className="text-start fw-bold text-muted"
                              style={{
                                background:
                                  "#fff",

                                minWidth:
                                  140,
                              }}
                            >
                              {row.label}
                            </td>


                            {item.columnLabel.map(
                              (
                                column
                              ) => (
                                <td
                                  key={
                                    column
                                  }
                                >
                                  {renderCellByLabel(
                                    column,
                                    row
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            item.columnLabel.length +
                            1
                          }
                          className="text-muted py-3"
                        >
                          No records found for{" "}
                          {selectedYear}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          )
        )}
      </Accordion>


      {/* ========================================
          DETAIL MODAL
      ======================================== */}

      <Modal
        show={
          showModal
        }
        onHide={() =>
          setShowModal(
            false
          )
        }
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
        >
          <Modal.Title>
            {modalTitle}
          </Modal.Title>
        </Modal.Header>


        <Modal.Body>
          {modalRows.length ===
          0 ? (
            <div className="text-muted">
              No data
            </div>
          ) : (
            <Table
              striped
              bordered
              hover
              size="sm"
              responsive
            >
              <thead>
                <tr>
                  <th>
                    #
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Batch No.
                  </th>

                  <th>
                    Course Name
                  </th>

                  <th>
                    Date
                  </th>
                </tr>
              </thead>


              <tbody>
                {modalRows.map(
                  (
                    row,
                    index
                  ) => (
                    <tr
                      key={
                        row._id ??
                        index
                      }
                    >
                      <td>
                        {index +
                          1}
                      </td>

                      <td>
                        {row.studentName ??
                          "-"}
                      </td>

                      <td>
                        {row.status ??
                          "-"}
                      </td>

                      <td>
                        {row.batchNumber ??
                          "-"}
                      </td>

                      <td>
                        {row.courseName ??
                          "-"}
                      </td>

                      <td>
                        {row.createdAt
                          ? new Date(
                              row.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>


        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setShowModal(
                false
              )
            }
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccordionCard;