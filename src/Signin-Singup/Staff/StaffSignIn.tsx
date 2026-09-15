import {
  useCallback,
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FcVoicePresentation,
} from "react-icons/fc";

import {
  toast,
} from "react-toastify";

import axios from "axios";

import SignInForm from "../SigninForm";

import type {
  SignInValues,
} from "../SigninForm";

import {
  url,
} from "../../Components/utils/constant";


// ========================================
// SIGN-IN API TYPES
// ========================================

interface StaffUser {
  _id?: string;
  firstName?: string;
  email?: string;
}


interface StaffSignInResponse {
  token: string;
  role: string;
  message?: string;
  user?: StaffUser;
}


interface ApiErrorResponse {
  message?: string;
}


// ========================================
// STAFF SIGN-IN
// ========================================

function StaffSignIn() {
  const navigate =
    useNavigate();


  // ========================================
  // OPTIONAL REDIRECT PARAMETERS
  // ========================================

  /*
   * These parameters are used when the user
   * arrives from a batch approval link.
   *
   * URLSearchParams.get() returns string | null.
   */
  const {
    redirect,
    batchId,
  } =
    useMemo(() => {
      const searchParams =
        new URLSearchParams(
          window.location.search
        );


      return {
        redirect:
          searchParams.get(
            "redirect"
          ),

        batchId:
          searchParams.get(
            "batchId"
          ),
      };
    }, []);


  // ========================================
  // NAVIGATION AFTER LOGIN
  // ========================================

  const goAfterLogin =
    useCallback((): void => {
      if (
        redirect &&
        batchId
      ) {
        window.location.href =
          `${redirect}?batchId=${batchId}`;

        return;
      }


      navigate(
        "/dashboard"
      );
    }, [
      redirect,
      batchId,
      navigate,
    ]);


  // ========================================
  // AUTO REDIRECT
  // ========================================

  useEffect(() => {
    const token =
      sessionStorage.getItem(
        "token"
      );


    const role =
      sessionStorage.getItem(
        "role"
      );


    if (
      token &&
      (
        role === "admin" ||
        role === "staff"
      )
    ) {
      goAfterLogin();
    }
  }, [
    goAfterLogin,
  ]);


  // ========================================
  // STAFF SIGN-IN REQUEST
  // ========================================

  const handleSubmit =
    async (
      values: SignInValues
    ): Promise<void> => {
      try {
        const payload = {
          email:
            values.email
              .trim()
              .toLowerCase(),

          password:
            values.password,
        };


        const {
          data,
        } =
          await axios.post<StaffSignInResponse>(
            `${url}/signin`,
            payload
          );


        // ========================================
        // STORE AUTHENTICATION DATA
        // ========================================

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "role",
          data.role
        );


        sessionStorage.setItem(
          "token",
          data.token
        );

        sessionStorage.setItem(
          "role",
          data.role
        );


        /*
         * sessionStorage requires strings.
         * Use empty-string fallbacks when optional
         * user information is missing.
         */
        sessionStorage.setItem(
          "firstName",
          data.user?.firstName ??
            ""
        );

        sessionStorage.setItem(
          "userId",
          data.user?._id ??
            ""
        );

        sessionStorage.setItem(
          "email",
          data.user?.email ??
            ""
        );


        toast.success(
          data.message ??
            "Signed in!"
        );


        goAfterLogin();
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript treats caught errors as unknown,
         * so narrow Axios errors before reading
         * response.data.
         */
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          toast.error(
            error.response
              ?.data
              ?.message ??
              "Something went wrong. Please try again."
          );

          return;
        }


        console.error(
          "Staff sign-in failed:",
          error
        );


        toast.error(
          "Something went wrong. Please try again."
        );
      }
    };


  // ========================================
  // UI
  // ========================================

  return (
    <SignInForm
      title="Staff Sign In"
      icon={
        <FcVoicePresentation
          style={{
            fontSize:
              48,
          }}
        />
      }
      onSubmit={
        handleSubmit
      }
      signupPath="/staff-signup"
    />
  );
}

export default StaffSignIn;