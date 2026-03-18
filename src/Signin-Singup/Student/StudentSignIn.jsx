import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FcReading } from "react-icons/fc";
import { toast } from "react-toastify";
import axios from "axios";

import SignInForm from "../SigninForm";
import { url } from "../../Components/utils/constant";

function StudentSignIn() {
  const navigate = useNavigate();

  const { redirect, batchId } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return { redirect: sp.get("redirect"), batchId: sp.get("batchId") };
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = { email: values.email.trim().toLowerCase(), password: values.password };
      const { data } = await axios.post(`${url}/signin-student`, payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.student.role);
      localStorage.setItem("firstName", data.student?.firstName || payload.email.split("@")[0]);
      localStorage.setItem("studentId", data.student?._id || "");

      toast.success(data.message || "Signed in successfully!");

      if (redirect && batchId) {
        window.location.href = `${redirect}?batchId=${batchId}`;
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8001/auth/google?role=student";
  };

  return (
    <SignInForm
      title="Student Sign In"
      icon={<FcReading style={{ fontSize: 48 }} />}
      onSubmit={handleSubmit}
      signupPath="/student-signup"
      showGoogle
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}

export default StudentSignIn;