import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FcReading,
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
// STUDENT SIGN-IN API TYPES
// ========================================

interface SignedInStudent {
  _id?: string;
  firstName?: string;
  role: string;
}


interface StudentSignInResponse {
  token: string;
  student: SignedInStudent;
  message?: string;
}


interface ApiErrorResponse {
  message?: string;
}


// ========================================
// STUDENT SIGN-IN PAGE
// ========================================

function StudentSignIn() {
  const navigate =
    useNavigate();


  // ========================================
  // OPTIONAL REDIRECT PARAMETERS
  // ========================================

  /*
   * URLSearchParams.get() returns string | null,
   * so both values are correctly inferred as
   * string | null.
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
  // STUDENT LOGIN
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
          await axios.post<StudentSignInResponse>(
            `${url}/signin-student`,
            payload
          );


        // ========================================
        // STORE LOGIN DATA
        // ========================================

        localStorage.setItem(
          "token",
          data.token
        );


        localStorage.setItem(
          "role",
          data.student.role
        );


        /*
         * If firstName is missing, preserve the
         * existing fallback of using the email
         * address before the @ symbol.
         */
        localStorage.setItem(
          "firstName",
          data.student.firstName ??
            payload.email.split("@")[0]
        );


        localStorage.setItem(
          "studentId",
          data.student._id ??
            ""
        );


        toast.success(
          data.message ??
            "Signed in successfully!"
        );


        // ========================================
        // NAVIGATE AFTER LOGIN
        // ========================================

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
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript catch values are unknown.
         * Narrow Axios errors before accessing
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
          "Student sign-in failed:",
          error
        );


        toast.error(
          "Something went wrong. Please try again."
        );
      }
    };


  // ========================================
  // GOOGLE SIGN-IN
  // ========================================

  const handleGoogleSignIn =
    (): void => {
      window.location.href =
        "http://localhost:8001/auth/google?role=student";
    };


  // ========================================
  // UI
  // ========================================

  return (
    <SignInForm
      title="Student Sign In"
      icon={
        <FcReading
          style={{
            fontSize:
              48,
          }}
        />
      }
      onSubmit={
        handleSubmit
      }
      signupPath="/student-signup"
      showGoogle
      onGoogleSignIn={
        handleGoogleSignIn
      }
    />
  );
}

export default StudentSignIn;