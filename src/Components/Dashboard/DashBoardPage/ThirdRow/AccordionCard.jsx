import React from 'react';
import { Accordion, Table, Modal, Button } from "react-bootstrap";
import { useState } from "react";

const AccordionCard = ({ title, items, themeColor, selectedYear }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);

  const openModal = (type, location, rows) => {
    setModalTitle(`${type} • ${location}`);
    setModalRows(rows || []);
    setShowModal(true);
  };

  return (
    <div className="mb-4 shadow-sm border rounded mx-3 p-2"
      style={{ borderTop: `4px solid ${themeColor}` }} >
      <h5 style={{ color: themeColor }} className="mb-3">{title}</h5>
      <Accordion >
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                <span style={{ fontWeight: '500' }}>{item.label}</span>
              </div>
            </Accordion.Header>
            <Accordion.Body className=""
              style={{
                maxHeight: "60vh",  //  limit height relative to screen
                overflowY: "auto",  //  scroll inside
              }}>
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: 8,
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="text-center border-0"
                  style={{
                    minWidth: 950,
                    tableLayout: "auto",
                  }}
                >
                  <thead className="table-light"
                    style={{ position: "sticky", top: 0, zIndex: 5 }} >
                    <tr>
                      <th
                        className="text-start"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 3,
                          background: "#f8f9fa",
                          minWidth: 140,
                        }}
                      >
                        #
                      </th>
                      {
                        item.columnLabel?.map((element, index) => (
                          <th>{element}</th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows && item.rows.length > 0 ? (
                      item.rows.map((row, rIndex) => (
                        <tr key={rIndex}>
                          {/* Row header: Location */}
                          <td
                            className="text-start fw-bold text-muted"
                            style={{
                              position: "sticky",
                              left: 0,
                              zIndex: 2,
                              background: "#fff",
                              minWidth: 140,
                            }}
                          >
                            {row.label}</td>
                          {/* Student Enrolled */}
                          <td>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={() => openModal("Student Enrolled", row.label, row.studentEnrolledList)}
                            >
                              {row.studentEnrolled || 0}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={() => openModal("De-assigned", row.label, row.deAssignedList)}
                            >
                              {row.deAssigned || 0}
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={() => openModal("Assigned", row.label, row.assignedList)}
                            >
                              {row.assigned || 0}
                            </button>
                          </td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={() => openModal("Total Batches", row.label, row.batchList)}
                            >
                              {row.totalBatches || 0}
                            </button>
                          </td>
                          <td>0</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="13" className="text-muted py-3">
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccordionCard;