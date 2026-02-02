import React, { useState } from "react";
import { Accordion, Table, Modal, Button, Dropdown } from "react-bootstrap";
import { MdFileDownload } from "react-icons/md";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const AccordionCard = ({ title, items, themeColor, selectedYear, month }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);

  const openModal = (type, location, rows) => {
    setModalTitle(`${type} • ${location}`);
    setModalRows(rows || []);
    setShowModal(true);
  };

  //  build table rows for export
  const buildDataRows = (item) => {
    return (item.rows || []).map((row) => {
      const values = (item.columnLabel || []).map((col) => {
        switch (col) {
          case "Student Enrolled": return row.studentEnrolled || 0;
          case "De-Assigned": return row.deAssigned || 0;
          case "Assigned": return row.assigned || 0;
          case "Drop out": return row.dropOutCount || 0;
          case "Certificate Generated": return row.certificateCounts || 0;
          case "Total Batches": return row.totalBatches || 0;
          case "Revenue Collected": return row.revenueCollectedCount || 0;
          default: return "";
        }
      });

      return [row.label, ...values];
    });
  };

  const handleDownloadCSV = (item) => {
    try {
      if (!item?.rows?.length) return toast.info("No data to download");

      const safeStatus = (item.label || "report").replace(/[^\w]+/g, "_");
      const safeMonth = month ? month.replace(/\s+/g, "_") : "Year_Total";

      const titleRow1 = `Batch status - ${item.label || "-"}`;
      const titleRow2 = `${selectedYear}${month ? `, ${month}` : ""}`;

      const headers = ["Location", ...(item.columnLabel || [])];
      const dataRows = buildDataRows(item);

      const escapeCSV = (v) => {
        const s = String(v ?? "");
        if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
      };

      const csv = [[titleRow1], [titleRow2], [], headers, ...dataRows]
        .map((arr) => arr.map(escapeCSV).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeStatus}_${selectedYear}_${safeMonth}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error("Some internal error, please contact super-admin");
    }
  };

  const handleDownloadExcel = (item) => {
    try {
      if (!item?.rows?.length) return toast.info("No data to download");

      const safeStatus = (item.label || "report").replace(/[^\w]+/g, "_");
      const safeMonth = month ? month.replace(/\s+/g, "_") : "Year_Total";

      const titleRow1 = `Batch status - ${item.label || "-"}`;
      const titleRow2 = `${selectedYear}${month ? `, ${month}` : ""}`;

      const headers = ["Location", ...(item.columnLabel || [])];
      const dataRows = buildDataRows(item);

      const sheetData = [
        [titleRow1],
        [titleRow2],
        [],
        headers,
        ...dataRows,
      ];

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");

      XLSX.writeFile(wb, `${safeStatus}_${selectedYear}_${safeMonth}.xlsx`);
    } catch (e) {
      console.error(e);
      toast.error("Some internal error, please contact super-admin");
    }
  };

  // dynamic table cell rendering
  const renderCellByLabel = (label, row) => {
    switch (label) {
      case "Student Enrolled":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Student Enrolled", row.label, row.studentEnrolledList)}
          >
            {row.studentEnrolled || 0}
          </button>
        );
      case "De-Assigned":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("De-assigned", row.label, row.deAssignedList)}
          >
            {row.deAssigned || 0}
          </button>
        );
      case "Assigned":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Assigned", row.label, row.assignedList)}
          >
            {row.assigned || 0}
          </button>
        );
      case "Drop out":
        return row.dropOutCount || 0;
      case "Certificate Generated":
        return row.certificateCounts || 0;
      case "Total Batches":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Total Batches", row.label, row.batchList)}
          >
            {row.totalBatches || 0}
          </button>
        );
      case "Revenue Collected":
        return row.revenueCollectedCount || 0;
      default:
        return "-";
    }
  };

  return (
    <div className="mb-3 shadow-sm border rounded mx-3 p-2" style={{ borderTop: `4px solid ${themeColor}` }}>
      <h5 style={{ color: themeColor }} className="mb-1">{title}</h5>

      <Accordion>
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                <span style={{ fontWeight: "500" }}>{item.label}</span>

                <div
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Dropdown drop="up" align="end">
                    <Dropdown.Toggle
                      id={`download-${index}`}
                      variant="link"
                      className="p-0 border-0 shadow-none"
                    >
                      <MdFileDownload className="fs-4" style={{ color: "#3466fb" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ zIndex: 9999 }}>
                      <Dropdown.Item  onClick={() => handleDownloadCSV(item)}>
                        Download as CSV
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => handleDownloadExcel(item)}>
                        Download as Excel
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div>
            </Accordion.Header>

            <Accordion.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <Table striped bordered hover size="sm" className="text-center" style={{ minWidth: 950, tableLayout: "auto" }}>
                <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 5 }}>
                  <tr>
                    <th className="text-start" style={{ background: "#f8f9fa", minWidth: 140 }}>#</th>
                    {item.columnLabel?.map((element, i) => <th key={i}>{element}</th>)}
                  </tr>
                </thead>

                <tbody>
                  {item.rows && item.rows.length > 0 ? (
                    item.rows.map((row, rIndex) => (
                      <tr key={rIndex}>
                        <td className="text-start fw-bold text-muted" style={{ background: "#fff", minWidth: 140 }}>
                          {row.label}
                        </td>

                        {item.columnLabel?.map((col, i) => (
                          <td key={i}>{renderCellByLabel(col, row)}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={(item.columnLabel?.length || 0) + 1} className="text-muted py-3">
                        No records found for {selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* modal part unchanged */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalRows.length === 0 ? (
            <div className="text-muted">No data</div>
          ) : (
            <Table striped bordered hover size="sm" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Batch No.</th>
                  <th>Course Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {modalRows.map((x, idx) => (
                  <tr key={x._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{x.studentName || "-"}</td>
                    <td>{x.status || "-"}</td>
                    <td>{x.batchNumber || "-"}</td>
                    <td>{x.courseName || "-"}</td>
                    <td>{x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccordionCard;
