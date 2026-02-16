import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Box, Paper, Typography, Divider, Stack } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ProfileRow from "./Edit/ProfileRow";
import ProfileCard from "./Edit/ProfileCard";
import ProfileEditDialog from "./Edit/ProfileEditDialog";
import ProfileSections from "./Sections/ProfileSections";



function ProfileForm() {
const navigate = useNavigate();
const [openBirthModal, setOpenBirthModal] = useState(false);
const [openPhoneModal, setOpenPhoneModal] = useState(false);

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    username = "-",
    email = "-",
    phoneNumber = "-",
    gender = "-",
    birthdate,
    role="-"
  } = userData || {};

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //API : get user data
  const getUserData = async () => {
    console.log("Api call from getuserdata")
    try {
      setLoading(true);
      const res = await axios.get(`${url}/users/profile`, config);
      console.log("response Get user data from profile form:",res.data.userData)
      setUserData(res.data.userData || {});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  //birthdate formika
  const birthFormik = useFormik({
  initialValues: {
    birthdate: birthdate
      ? new Date(birthdate).toISOString().split("T")[0]
      : "",
  },
  enableReinitialize: true,
  validationSchema: Yup.object({
    birthdate: Yup.date().required("Required"),
  }),
  onSubmit: async (values) => {
    await axios.put(`${url}/users/profile`, values, config);
    setOpenBirthModal(false);
    getUserData(); // refresh profile without reload
  },
});

//phonenumber
const phoneFormik = useFormik({
  initialValues: {
    phoneNumber: phoneNumber || "",
  },
  enableReinitialize: true,
  validationSchema: Yup.object({
    phoneNumber: Yup.number().required("Required"),
  }),
  onSubmit: async (values) => {
    await axios.put(`${url}/users/profile`, values, config);
    setOpenPhoneModal(false);
    getUserData(); // refresh profile
  },
});


  const initials = (username)
    .toString()
    .trim()
    .slice(0, 2)
    .toUpperCase();

 return (
  <Box
    sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    px: { xs: 1.5, sm: 3 },
    alignItems: { xs: "flex-start", md: "center" },
    py: { xs: 2, md: 0 },
    // overflowY: { xs: "auto", md: "visible" },
  }}
>
    <Box sx={{ width: "100%", maxWidth: 980 }}>
      <ProfileSections
        navigate={navigate}
        loading={loading}
        username={username}
        email={email}
        role={role}
        phoneNumber={phoneNumber}
        gender={gender}
        birthdateFormatted={formatDate(birthdate)}
        initials={initials}
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
        }}
      />

      <ProfileEditDialog
        open={openBirthModal}
        onClose={() => setOpenBirthModal(false)}
        title="Update Birthday"
        description="Your birthday may be used for account security and personalization."
        formik={birthFormik}
        fieldName="birthdate"
        type="date"
      />

      <ProfileEditDialog
        open={openPhoneModal}
        onClose={() => setOpenPhoneModal(false)}
        title="Update Phone Number"
        description="Your phone number helps us keep your account secure."
        formik={phoneFormik}
        fieldName="phoneNumber"
        label="Phone Number"
      />
    </Box>
  </Box>
);

}

export default ProfileForm;
