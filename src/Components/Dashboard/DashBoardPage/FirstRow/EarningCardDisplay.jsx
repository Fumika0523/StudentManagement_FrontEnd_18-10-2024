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
  <div className="container-fluid px-2 px-md-4">
    {/* Sticky top controls */}
    <div
      className="position-sticky top-0 z-3 "    >
      <div className="d-flex justify-content-end align-items-center gap-3 py-2">
        <Form.Select
          size="sm"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            getEarningData(e.target.value, year);
          }}
          style={{ width: "180px", fontWeight: 500 }}
        >
          <option disabled value="">
            Select Month
          </option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          size="sm"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            getEarningData(month, e.target.value);
          }}
          style={{ width: "120px", fontWeight: 500 }}
        >
          <option value="" disabled>
            Year
          </option>
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </Form.Select>

        <Button
          className="d-flex align-items-center gap-1 text-white"
          style={{ backgroundColor: "#4e73df", fontSize: "14px" }}
        >
          <FaDownload className="text-white-50" />
          <span className="d-sm-none d-md-block">Generate Report</span>
        </Button>
      </div>
    </div>

    {/* Content */}
    <div className="mt-2">
      <div className="fs-4 mb-2">MTD</div>

      {/* Cards grid */}
      <div className="row g-3">
        {earnings?.map((element, index) => (
          <React.Fragment key={index}>
            <div className="col-12 col-sm-6 col-lg-3">
              <EarningCard {...element} title={element.title.toUpperCase()} />
            </div>

            {index === 3 && (
              <div className="col-12">
                <div className="fs-4 mt-2">YTD</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3">
        <ChartDisplay
          earnings={earnings}
          setEarnings={setEarnings}
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
      </div>
    </div>
  </div>
);

}

export default EarningCardDisplay;
