import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { url } from "../../utils/constant";
import EarningCardDisplay from "./FirstRow/EarningCardDisplay";
import SelectCourseModal from "../../Dashboard/StudentData/Modals/SelectCourseModal";
import AccordionDisplay from "./ThirdRow/AccordionDisplay";

function DashboardCard() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(new Date().toLocaleString("en", { month: "long" }));
  const [year, setYear] = useState(new Date().getFullYear());
  const [earnings, setEarnings] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [batchData, setBatchData] = useState([]);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }, }), [token]);

const getEarnings = async () => {
  const res = await axios.get(`${url}/earnings?month=${month}&year=${year}`, config);
  setEarnings(res.data);
};

const getAllBatch = async () => {
  const res = await axios.get(`${url}/allbatch`, config);
  console.log("Batch API raw:", res.data.batchData);
  setBatchData(res.data.batchData);
};

const getAllStudent = async () => {
  const res = await axios.get(`${url}/allstudent`, config);
  console.log("getAllStudent",res.data.studentData)
  setStudentData(res.data.studentData);
};

const getAllAdmission = async () => {
  const res = await axios.get(`${url}/alladmission`, config);
  console.log("getAllAdmissions",res.data.admissionData)
  setAdmissionData(res.data.admissionData);
};

useEffect(() => {
  const initializeDashboard = async () => {
    try {
      setLoading(true);

      if (role === "student") {
        const res = await axios.get(`${url}/allstudent`, config);
        const student = res.data?.studentData?.find(
          s => s.username === username
        );

        if (!student?.preferredCourses?.length) {
          setShowModal(true);
        }
        return;
      }

      await Promise.all([
        getEarnings(),
        getAllAdmission(),
        getAllStudent(),
        getAllBatch()
      ]);

    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  initializeDashboard();
}, [role, month, year, config, username]);

  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;

  return (
    <div className="container-fluid">
      {role !== "student" && (
        <>
          <EarningCardDisplay
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            earnings={earnings}
            setEarnings={setEarnings}
          />
          <AccordionDisplay 
            admissionData={admissionData} 
            studentData={studentData}
            batchData={batchData}
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
          />
        </>
      )}

      {showModal && (
        <SelectCourseModal show={showModal} setShow={setShowModal} />
      )}
    </div>
  );
}

export default DashboardCard;