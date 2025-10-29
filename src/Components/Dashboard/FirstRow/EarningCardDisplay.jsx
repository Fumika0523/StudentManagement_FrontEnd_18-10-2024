import React, { useEffect, useState } from "react";
import EarningCard from "./EarningCard";
import { url } from "../../utils/constant";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

function EarningCardDisplay() {
  const token = localStorage.getItem("token");
  const [earnings, setEarnings] = useState([]);
  const [month, setMonth] = useState(
    new Date().toLocaleString("en", { month: "long" })
  );
const [year, setYear] = useState(new Date().getFullYear());

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

const getEarningData = async (selectedMonth = month, selectedYear = year) => {
  try {
    const res = await axios.get(
      `${url}/earnings?month=${selectedMonth}&year=${selectedYear}`,
      config
    );
    setEarnings(res.data);
  } catch (error) {
    console.error("Error fetching earnings:", error);
  }
};


  useEffect(() => {
    getEarningData();
  }, []);

  // ✅ Generate month list dynamically
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en", { month: "long" })
  );

  return (
    <div className="d-flex justify-content-center align-items-center mx-auto row w-100">
      {/* Top controls */}
      <div className="d-flex justify-content-end align-items-center gap-3 w-100 "
      // style={{border:"2px solid red"}}
      >
     <Form.Select
  size="sm"
  value={month}
  onChange={(e) => {
    setMonth(e.target.value);
    getEarningData(e.target.value, year);
  }}
  style={{ width: "180px", fontWeight: 500 }}
>
  <option value="">-- Select Month --</option>
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
  <option value="">-- Year --</option>
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
          style={{ backgroundColor: "#4e73df", fontSize: "14px" }}
        >
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
      </div>

  );
}

export default EarningCardDisplay;
