import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import PersonIcon      from "@mui/icons-material/Person";
import CakeIcon        from "@mui/icons-material/Cake";
import EmailIcon       from "@mui/icons-material/Email";
import PhoneIcon       from "@mui/icons-material/Phone";
import WcIcon          from "@mui/icons-material/Wc";
import LockIcon        from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PublicOutlined  from "@mui/icons-material/PublicOutlined";
import ProfileSections from "./Sections/ProfileSections";

// Defined outside component — object reference stays stable across renders
const icons = { PersonIcon, CakeIcon, EmailIcon, PhoneIcon, WcIcon, LockIcon, PhotoCameraIcon, PublicOutlined };

export default  function ViewProfile() {
  const navigate  = useNavigate();
  const [singleUserData, setSingleUserData] = useState(null);
  const [singleStudentData, setSingleSudentData] = useState(null)
  const [loading, setLoading]   = useState(true);
  const role   = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");
  // const studentId = localStorage.getItem("studentId");
  const token  = localStorage.getItem("token");
  const config = { 
    headers: { Authorization: `Bearer ${token}`
   } };

const getUserData = async () => { 
  try {
  setLoading(true); 
  const res = await axios.get(`${url}/users/profile`,config);
 //console.log("getUserData:",res.data.singleUserData)
  setSingleUserData(res.data.singleUserData)
} catch (e) { 
 // console.error("getUserData error:", e); 
  toast.error("Error in getting User profile") 
} finally {
   setLoading(false);
   } }; 

const getStudentData = async()=>{ 
 try{ 
    setLoading(true) 
    const res = await axios.get(`${url}/student/${studentId}`,config) 
    console.log("getSingleStudent:",res.data.singleStudentData) 
  setSingleSudentData(res.data.singleStudentData) 
  }catch(e){ 
    console.error("getStudentData error:",e) 
    toast.error("Error in getting Student profile")
   } finally { 
    setLoading(false);
   } 
  } 
 useEffect(() => {
  if (role === "student") {
    getStudentData();
  } else {
    getUserData();
  }
}, [role]);

  return (
    <Box sx={{
      minHeight: "90vh",
      display: "flex",
      justifyContent: "center",
      alignItems: { xs: "flex-start", md: "center" },
      py: { xs: 2, md: 0 },
      px: { xs: 1.5, sm: 3 },
      boxSizing: "border-box",
    }}>
      <ProfileSections
        navigate={navigate}
        loading={loading}
        singleUserData={singleUserData}
        setSingleUserData={setSingleUserData}
        singleStudentData={singleStudentData}
        setSingleSudentData={setSingleSudentData}
        icons={icons}
      />
    </Box>
  );
}

