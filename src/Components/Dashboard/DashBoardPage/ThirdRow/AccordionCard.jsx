import React from 'react';
import { Accordion, Table, Badge } from 'react-bootstrap';

const AccordionCard = ({ title, items, themeColor, selectedYear }) => {
  return (
    <div className="mb-4 shadow-sm border rounded p-2" 
          style={{ borderTop: `4px solid ${themeColor}` }}>
      <h5 style={{ color: themeColor }} className="mb-3">{title}</h5>
      <Accordion>
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                <span style={{ fontWeight: '500' }}>{item.label}</span>
             
              </div>
            </Accordion.Header>
            <Accordion.Body className="">
              <Table striped bordered hover size="sm" responsive className="mb-0 text-center border-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-start" >#</th>
                    {
                      item.columnLabel?.map((element,index)=>(
                      <th>{element}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
     {item.rows && item.rows.length > 0 ? (
          item.rows.map((row, rIndex) => (
      <tr key={rIndex}>
        {/* The Location Label */}
        <td className="text-start fw-bold text-muted">{row.label}</td>

        {/* 1. Student Enrolled */}
        <td>
            <span style={{ fontWeight: 'bold', color: themeColor }}>
                {row.studentEnrolled || 0}
            </span>
        </td>

        {/* 2. Placeholder columns (De-assigned, Assigned, etc.) */}
        <td>-</td> 
        <td>-</td>
        <td>-</td>
 
        {/* 3. Total Batches */}
        <td>{row.totalBatches || 0}</td>

        {/* 4. Revenue Collected (Placeholder) */}
        <td>0</td>
                      </tr>
                    ))
                  ) : (
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