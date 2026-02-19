import React, { useEffect, useState } from "react";
import CustomisedTaskTables from "./Table/CustomisedTaskTables";
import { HTML_TASKS_STATIC } from "./Question/HTMLQuestion";
import Header from './Header/Header'

export default function ViewTask(){
const [taskData, setTaskData] = useState([]);
const [showTable, setShowTable] = useState(false)
const token = localStorage.getItem('token')
let config = {
    headers:{
        Authorizaton:`Bearer ${token}`
    }
}
  useEffect(() => {
    setTaskData(HTML_TASKS_STATIC);
  }, []);

  return (
<>
       <div className="py-2 border-4 border-danger row mx-auto w-100">
            <Header
              config={config}
            />
            
            {/* {showTable && ( */}
              <CustomisedTaskTables 
              taskData={taskData}
              setTaskData={setTaskData}
              />
            {/* )} */}
          </div>
</>
  )}
