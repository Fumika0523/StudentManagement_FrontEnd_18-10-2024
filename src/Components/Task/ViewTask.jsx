import React, { useEffect, useState } from "react";
import CustomisedTaskTables from "./Table/CustomisedTaskTables";
import Header from "./Header/Header";
import axios from "axios";
import { url } from "../utils/constant";

export default function ViewTask() {
  const [taskData, setTaskData] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,     },
  };

  const getTaskData = async () => {
    try {
      console.log("getTaskData is calling..");
      const res = await axios.get(`${url}/alltask`, config);
      console.log("API taskData:", res.data.taskData);
        console.log("API taskDetail:", res.data.taskData[0].taskDetail);
      setTaskData(res.data.taskData );

    } catch (err) {
      console.error("Fetch tasks failed:", err?.response?.data || err.message);
      setTaskData([]);
    }
  };

  useEffect(() => {
    getTaskData();
  }, []);

  return (
    <div className="py-2 border-4 border-danger row mx-auto w-100">
      <Header config={config} />
      <CustomisedTaskTables taskData={taskData} setTaskData={setTaskData} />
    </div>
  );
}
