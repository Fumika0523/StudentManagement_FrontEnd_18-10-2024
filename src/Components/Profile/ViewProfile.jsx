import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PublicOutlined from "@mui/icons-material/PublicOutlined";

import ProfileSections from "./Sections/ProfileSections";

function ViewProfile() {
  const navigate = useNavigate();
  const [openBirthModal, setOpenBirthModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const getUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/users/profile`, config);
      console.log("getUserData:",res.data.userData)
      setUserData(res?.data?.userData || {});
    } catch (e) {
      console.error("getUserData error:", e);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Box
      sx={{
     minHeight: "90vh",
      display: "flex",
      justifyContent: "center", //  horizontal center
      alignItems: { xs: "flex-start", md: "center" }, //  center on desktop
      py: { xs: 2, md: 0 }, 
      px: { xs: 1.5, sm: 3 },      
      boxSizing: "border-box",
      }}
    >
      <ProfileSections
        navigate={navigate}
        loading={loading}
        userData={userData}
        setOpenBirthModal={setOpenBirthModal}
        setOpenPhoneModal={setOpenPhoneModal}
        icons={{
          PersonIcon,
          CakeIcon,
          EmailIcon,
          PhoneIcon,
          WcIcon,
          LockIcon,
          PhotoCameraIcon,
          PublicOutlined,
        }}
      />

      {/* Your birth/phone dialogs are currently not wired because those fields don't exist in userData.
          If you add birthdate/phoneNumber later, we can re-enable those modals. */}
    </Box>
  );
}

export default ViewProfile;