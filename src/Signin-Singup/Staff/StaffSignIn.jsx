import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FcVoicePresentation } from "react-icons/fc";
import { toast } from "react-toastify";
import axios from "axios";

import SignInForm from "../SigninForm";
import { url } from "../../Components/utils/constant";

function StaffSignIn() {
  const navigate = useNavigate();

  const { redirect, batchId } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return { redirect: sp.get("redirect"), batchId: sp.get("batchId") };
  }, []);

  const goAfterLogin = () => {
    if (redirect && batchId) {
      window.location.href = `${redirect}?batchId=${batchId}`;
    } else {
      navigate("/dashboard");
    }
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && (role === "admin" || role === "staff")) goAfterLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = { email: values.email.trim().toLowerCase(), password: values.password };
      const { data } = await axios.post(`${url}/signin`, payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("firstName", data.user?.firstName || payload.email.split("@")[0]);
      localStorage.setItem("userId", data.user?._id || "");
      localStorage.setItem("email", data.user?.email || payload.email);

      toast.success(data.message || "Signed in!");
      goAfterLogin();
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <SignInForm
      title="Staff Sign In"
      icon={<FcVoicePresentation style={{ fontSize: 48 }} />}
      onSubmit={handleSubmit}
      signupPath="/staff-signup"
    />
  );
}

export default StaffSignIn;