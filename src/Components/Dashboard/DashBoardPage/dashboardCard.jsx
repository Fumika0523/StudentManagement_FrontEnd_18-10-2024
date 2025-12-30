// import EarningCardDisplay from "./FirstRow/EarningCardDisplay";
// import ChartCard from "./SecondRow/ChartCard";
// import { useEffect, useState } from "react";
// import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";
// import axios from "axios";
// import { url } from "../utils/constant";
// import ChartDisplay from "./SecondRow/ChartDisplay";

// function DashboardCard() {
//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const [loading, setLoading] = useState(true);
//   // student preferred course modal
//   const [showModal, setShowModal] = useState(false);

//   const [month, setMonth] = useState(
//     new Date().toLocaleString("en", { month: "long" })
//   );
//   const [year, setYear] = useState(new Date().getFullYear());

//   const [earnings, setEarnings] = useState([]);
//   const [admissionData, setAdmissionData] = useState([]);

//   const config = {
//     headers: { Authorization: `Bearer ${token}` },
//   };

//   //  Hook #1 — ALWAYS runs
//   useEffect(() => {
//     const checkPreferredCourses = async () => {
//       try {
//         if (role !== "student") return;

//         const res = await axios.get(`${url}/allstudent`, config);
//         const student = res.data.studentData.find(
//           (s) => s.username === username
//         );

//         if (!student?.preferredCourses?.length) {
//           setShowModal(true);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkPreferredCourses();
//   }, []);

//   //  Hook #2 — ALWAYS runs
//   useEffect(() => {
//     if (role === "student") return;

//     const fetchData = async () => {
//       try {
//         const earningsRes = await axios.get(
//           `${url}/earnings?month=${month}&year=${year}`,
//           config
//         );

//         const admissionRes = await axios.get(
//           `${url}/alladmission`,
//           config
//         );

//         setEarnings(earningsRes.data);
//         setAdmissionData(admissionRes.data.admissionData);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     fetchData();
//   }, [month, year]);

//   // SAFE conditional rendering AFTER hooks
//   if (loading) return null;

//   return (
//     <>
//       {role !== "student" && (
//         <>
//           <EarningCardDisplay
//             month={month}
//             year={year}
//             setMonth={setMonth}
//             setYear={setYear}
//             earnings={earnings}
//             setEarnings={setEarnings}
//           />
//           {/* <ChartDisplay admissionData={admissionData}    month={month}
//             year={year}
//             setMonth={setMonth}
//             setYear={setYear}
//             earnings={earnings} /> */}
//         </>
//       )}

//       {showModal && (
//         <SelectCourseModal show={showModal} setShow={setShowModal} />
//       )}
//     </>
//   );
// }
// export default DashboardCard

// import EarningCardDisplay from "./FirstRow/EarningCardDisplay";
// import { useEffect, useState } from "react";
// import SelectCourseModal from "../StudentData/SelectCourseModal";
// import axios from "axios";
// import { url } from "../../utils/constant";
// import AccordionDisplay from "./ThirdRow/AccordionDisplay";

// function DashboardCard() {
//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   const [month, setMonth] = useState(
//     new Date().toLocaleString("en", { month: "long" })
//   );
//   const [year, setYear] = useState(new Date().getFullYear());

//   const [earnings, setEarnings] = useState([]);
//   const [admissionData, setAdmissionData] = useState([]);
//   const [studentData,setStudentData] = useState([])
//   const [batchData,setBatchData] = useState([])

//     const getStudentData = async()=>{
//     let res = await axios.get(`${url}/allstudent`,config)
//     // console.log("StudentData",res.data.studentData)
//    setStudentData(res.data.studentData)
//     }
//      const getBatchData = async()=>{
//         let res = await axios.get(`${url}/allbatch`,config)
//        // console.log("BatchData",res.data.batchData)
//         setBatchData(res.data.batchData)
//     }

//     // Main admission Data
//     // const getAdmissionData = async()=>{
//     //     // console.log("Admission data is called....")
//     //     let res = await axios.get(`${url}/alladmission`,config)
//     //     // console.log("AdmissionData",res.data.admissionData)
//     //     setAdmissionData(res.data.admissionData)
//     // }
//     useEffect(()=>{
//         // getAdmissionData()
//         getStudentData()
//         getBatchData()
//     },[])
//   const config = {
//     headers: { Authorization: `Bearer ${token}` },
//   };

//   // Hook #1 — Check preferred courses for students
//   useEffect(() => {
//     const checkPreferredCourses = async () => {
//       try {
//         if (role !== "student") return;

//         const res = await axios.get(`${url}/allstudent`, config);
//         const student = res.data.studentData?.find(
//           (s) => s.username === username
//         );

//         if (!student?.preferredCourses?.length) {
//           setShowModal(true);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkPreferredCourses();
//   }, []);

//   // Hook #2 — Fetch earnings and admission data for non-students
//   useEffect(() => {
//     if (role === "student") 
//       return;

//     const fetchData = async () => {
//       try {
//         const earningsRes = await axios.get(
//           `${url}/earnings?month=${month}&year=${year}`,
//           config
//         );

//         const admissionRes = await axios.get(
//           `${url}/alladmission`,
//           config
//         );

//         setEarnings(earningsRes.data);
//         setAdmissionData(admissionRes.data.admissionData);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     fetchData();
//   }, [month, year]);

//   // Safe conditional rendering after hooks
//   if (loading) return null;

//   return (
//     <>
//       {role !== "student" && (
//         <>
//           <EarningCardDisplay
//             month={month}
//             year={year}
//             setMonth={setMonth}
//             setYear={setYear}
//             earnings={earnings}
//             setEarnings={setEarnings}
//           />
//         </>
//       )}

//       {/* {showModal && (
//         <SelectCourseModal show={showModal} setShow={setShowModal} />
//       )} */}

//       <AccordionDisplay 
//       admissionData={admissionData} setAdmissionData={setAdmissionData}/>
//     </>
//   );
// }

// export default DashboardCard;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { url } from "../../utils/constant";

// Components
import EarningCardDisplay from "./FirstRow/EarningCardDisplay";
import SelectCourseModal from "../StudentData/SelectCourseModal";
import AccordionDisplay from "./ThirdRow/AccordionDisplay";

function DashboardCard() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(new Date().toLocaleString("en", { month: "long" }));
  const [year, setYear] = useState(new Date().getFullYear());

  // Data States
  const [earnings, setEarnings] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [batchData, setBatchData] = useState([]);

  // Memoize config to prevent unnecessary re-renders or effect triggers
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);

        if (role === "student") {
          // Student specific logic
          const res = await axios.get(`${url}/allstudent`, config);
          const student = res.data.studentData?.find(s => s.username === username);
          if (!student?.preferredCourses?.length) setShowModal(true);
        } else {
          // Admin/Staff specific logic - Fetch all necessary data in parallel
          const [earningsRes, admissionRes, studentRes, batchRes] = await Promise.all([
            axios.get(`${url}/earnings?month=${month}&year=${year}`, config),
            axios.get(`${url}/alladmission`, config),
            axios.get(`${url}/allstudent`, config),
            axios.get(`${url}/allbatch`, config)
          ]);

          setEarnings(earningsRes.data);
          setAdmissionData(admissionRes.data.admissionData);
          setStudentData(studentRes.data.studentData);
          setBatchData(batchRes.data.batchData);
        }
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
    <div className="dashboard-container">
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