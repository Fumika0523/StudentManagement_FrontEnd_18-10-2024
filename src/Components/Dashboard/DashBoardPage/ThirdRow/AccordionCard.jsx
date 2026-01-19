import React from 'react';
import { Accordion, Table, Badge } from 'react-bootstrap';

const AccordionCard = ({ title, items, themeColor, selectedYear }) => {
  const monthHeaders = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//console.log("selected year",selectedYear)

  return (
    <div className="mb-4 shadow-sm border rounded p-3" style={{ borderTop: `4px solid ${themeColor}` }}>
      <h5 style={{ color: themeColor }} className="mb-3">{title}</h5>
      <Accordion>
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                <span style={{ fontWeight: '500' }}>{item.label}</span>
                {/* Total Count Badge */}
                <Badge bg="light" text="dark" className="border">{item.value}</Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              
              <Table striped bordered hover size="sm" responsive className="mb-0 text-center border-0">
                <thead className="table-light">
                  <tr>
                    {/* Changed Header from 'Metric' to '#' */}
                    <th className="text-start" style={{width: '100px'}}>#
                    </th>
                    {/* {monthHeaders.map(month => (
                        <th key={month} style={{fontSize: '0.85rem'}}>{month}</th>
                    ))} */}
                    {/* Table Header : 1. Student Enrollment(),2 Dropout,3 Total Assigned(), 4Certificate generated, number of batch counts, deassigned,  */}
                    <th>Student Enrolled</th>
                    <th>De-Assigned</th>
                    <th>Assigned</th>
                    <th>Drop out</th>
                    <th>Certificate Generated</th>
                    <th>Total Batches</th>
                    <th>Revenue Collected</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through the generated rows (Locations or Total) */}
                  {item.rows && item.rows.length > 0 ? (
                    item.rows.map((row, rIndex) => (
                      <tr key={rIndex}>
                        {/* The Label (e.g., 'Tokyo' or 'Total') */}
                        <td className="text-start fw-bold text-muted">{row.label}</td>
                        
                        {/* The 12 monthly counts */}
                        {/* {row?.monthlyCounts?.map((count, cIndex) => (
                          <td key={cIndex}>
                             {count > 0 ? (
                               <span style={{ fontWeight: 'bold', color: themeColor }}>{count}</span>
                             ) : (
                               <span className="text-muted small">-</span>
                             )}
                          </td>
                        ))} */}
                      </tr>
                    ))
                  ) : (
                    /* Fallback if no data exists for this category */
                    <tr>
                      <td colSpan="13" className="text-muted py-3">No records found for {selectedYear}</td>
                    </tr>
                  )}
                </tbody>
              </Table>

            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default AccordionCard;