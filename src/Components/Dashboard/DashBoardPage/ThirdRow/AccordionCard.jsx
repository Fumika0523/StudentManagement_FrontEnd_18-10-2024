import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

const AccordionSet = ({ title, items, themeColor }) => {
  return (
    <div className="mb-4">
      <h4 style={{ color: themeColor }}>{title}</h4>
      <Accordion defaultActiveKey="0">
        {items.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
               <span style={{ fontWeight: 'bold' }}>{item.label}</span>
            </Accordion.Header>
            <Accordion.Body>
              {/* You can customize what shows inside here */}
              <p>Count: {item.value}</p> 
              {item.content && <div>{item.content}</div>}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default AccordionSet;