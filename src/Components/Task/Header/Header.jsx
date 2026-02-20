import AddTaskButton from './ActionButton/AddTaskButton'
import React, { useState } from "react";
import { Box } from "@mui/material";


const Header = () => {
    const [showAdd, setShowAdd] = useState(false);
  

  return (
   <>
    <Box sx={{ mb: 2 }}>

        <AddTaskButton 
        setShowAdd={setShowAdd}
        showAdd={setShowAdd}/>

       </Box>
   </>
  )
}

export default Header