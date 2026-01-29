import React, { useState } from "react";
import { Accordion, Table, Modal, Button } from "react-bootstrap";
import { MdFileDownload } from "react-icons/md";

const AccordionCard = ({ title, items, themeColor, selectedYear }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);

  const openModal = (type, location, rows) => {
    setModalTitle(`${type} • ${location}`);
    setModalRows(rows || []);
    setShowModal(true);
  };

  const handleDownload = () => {
    // NOTE: your current handleDownload has errors (item/rows not defined here)
    // We can fix this later. For now, leave it.
  };

  //  ADD THIS FUNCTION HERE (inside component, before return)
  const renderCellByLabel = (label, row) => {
    switch (label) {
      case "Student Enrolled":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              openModal("Student Enrolled", row.label, row.studentEnrolledList)
            }
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
           return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Drop out", row.label, row.assignedList)}
          >
            {row.dropOutCount || 0}
          </button>
        );

      case "Certificate Generated":
        return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Certificate Generated", row.label, row.assignedList)}
          >
            {row.certificateCounts || 0}
          </button>
        );

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
       return (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => openModal("Revenue Collected", row.label, row.batchList)}
          >
            {row.revenueCollectedCount || 0}
          </button>
        );

      default:
        return "-";
    }
  };


  return (
    <div
      className="mb-3 shadow-sm border rounded mx-3 p-2"
      style={{ borderTop: `4px solid ${themeColor}` }}
    >
      <h5 style={{ color: themeColor }} className="mb-1">
        {title}
      </h5>

      <Accordion>
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                <span style={{ fontWeight: "500" }}>{item.label}</span>

                <MdFileDownload
                  title="Download"
                  className="fs-4"
                  style={{ color: "#3466fb" }}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDownload();
                  }}
                />
              </div>
            </Accordion.Header>

            <Accordion.Body
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  width: "100%",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: 8,
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="text-center"
                  style={{
                    minWidth: 950,
                    tableLayout: "auto",
                  }}
                >
                  <thead
                    className="table-light"
                    style={{ position: "sticky", top: 0, zIndex: 5 }}
                  >
                    <tr>
                      <th
                        className="text-start"
                        style={{
                          left: 0,
                          zIndex: 3,
                          background: "#f8f9fa",
                          minWidth: 140,
                        }}
                      >
                        #
                      </th>

                      {item.columnLabel?.map((element, i) => (
                        <th key={i}>{element}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {item.rows && item.rows.length > 0 ? (
                      item.rows.map((row, rIndex) => (
                        <tr key={rIndex}>
                          <td
                            className="text-start fw-bold text-muted"
                            style={{
                              left: 0,
                              zIndex: 2,
                              background: "#fff",
                              minWidth: 140,
                            }}
                          >
                            {row.label}
                          </td>

                          {/* dynamic cells based on columnLabel */}
                          {item.columnLabel?.map((col, i) => (
                            <td key={i}>{renderCellByLabel(col, row)}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={(item.columnLabel?.length || 0) + 1}
                          className="text-muted py-3"
                        >
                          No records found for {selectedYear}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccordionCard;
