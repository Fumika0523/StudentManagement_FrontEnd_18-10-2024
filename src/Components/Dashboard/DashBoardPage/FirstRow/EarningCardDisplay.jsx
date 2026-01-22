import React, { useEffect, useState } from "react";
import EarningCard from "./EarningCard";
import { url } from "../../../utils/constant";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import ChartDisplay from "../SecondRow/ChartDisplay";

function EarningCardDisplay({month,setMonth,year,setYear,earnings, setEarnings}){
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
 
console.log(setEarnings)
const getEarningData = async (selectedMonth = month, selectedYear = year) => {
  try {
    const res = await axios.get(
      `${url}/earnings?month=${selectedMonth}&year=${selectedYear}`,
      config
    );
      console.log("earningData",res.data)
    setEarnings(res.data);
  } catch (error) {
    console.error("Error fetching earnings:", error);
  }
};

  useEffect(() => {
    getEarningData();
  }, []);

  //  Generate month list dynamically
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en", { month: "long" })
  );
  console.log("months from earningCardDisplay",months)
  return (
    <div className="d-flex justify-content-center align-items-center mx-1 row my-2 ">
      {/* Top controls */}
      <div 
      className="d-flex justify-content-end align-items-center gap-3 w-100 py-2" 
      style={{
        position: "sticky",
        top: "0px",           // Distance from the top of the viewport
        zIndex: 1020,       // Higher than other elements (Bootstrap default for sticky is 1020)
       backgroundColor: "#f8f9fc", // Match your dashboard background so it's not transparent
      //  borderBottom: "1px solid #e3e6f0" // Optional: adds a nice separation when scrolling
      }}
    >
     <Form.Select
          size="sm"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            getEarningData(e.target.value, year);
          }}
          style={{ width: "180px", fontWeight: 500,  }}
        >
          <option disabled value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
      </Form.Select>

      <Form.Select
        size="sm"
        value={year}
        onChange={(e) => { 
          setYear(e.target.value);
          getEarningData(month, e.target.value);
        }}
        style={{ width: "120px", fontWeight: 500 }}  >
        <option value="" disabled>Year</option>
        {Array.from({ length: 5 }, (_, i) => {
          const y = new Date().getFullYear() - i;
          return (
            <option key={y} value={y}>
              {y}
            </option>
          );
        })}
      </Form.Select>

        {/* Report Button */}
        <Button
          className="d-flex align-items-center gap-1 text-white"
          style={{ backgroundColor: "#4e73df", fontSize: "14px" }} >
          <FaDownload className="text-white-50" />
          <span className="d-sm-none d-md-block">Generate Report</span>
        </Button>
      </div>

      <div className="fs-4">MTD</div>
        {earnings?.map((element, index) => (
          <React.Fragment key={index}>
            <EarningCard {...element}title={element.title.toUpperCase()} />
            {index === 3 && (
              <div className="fs-4">YTD</div>
            )}
          </React.Fragment>
        ))}
    
    
    <ChartDisplay earnings={earnings} setEarnings={setEarnings} year={year} month={month} setYear={setYear} setMonth={setMonth} />
    </div>

  );
}

export default EarningCardDisplay;
