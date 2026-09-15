import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AxiosRequestConfig,
} from "axios";

import axios from "axios";

import {
  Box,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../utils/constant";

import ProfileSections from "./Sections/ProfileSections";

import type {
  ProfileData,
} from "./Sections/ProfileSections";

import type {
  Student,
} from "../../types/student";


// ========================================
// USER PROFILE RESPONSE
// ========================================

interface UserProfileResponse {
  singleUserData: ProfileData;
}


// ========================================
// STUDENT PROFILE RESPONSE
// ========================================

interface StudentProfileResponse {
  singleStudentData: Student;
}


// ========================================
// COMPONENT
// ========================================

export default function ViewProfile() {
  const navigate =
    useNavigate();


  // ========================================
  // PROFILE STATE
  // ========================================

  /*
   * Normal account profile data uses the local
   * ProfileData interface exported by
   * ProfileSections.
   */
  const [
    singleUserData,
    setSingleUserData,
  ] =
    useState<ProfileData | null>(
      null
    );


  /*
   * Student profile data can use our existing
   * shared Student interface.
   */
  const [
    singleStudentData,
    setSingleStudentData,
  ] =
    useState<Student | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      true
    );


  // ========================================
  // LOCAL STORAGE DATA
  // ========================================

  const role =
    localStorage.getItem(
      "role"
    );

  const studentId =
    localStorage.getItem(
      "studentId"
    );

  const token =
    localStorage.getItem(
      "token"
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }),
      [
        token,
      ]
    );


  // ========================================
  // GET USER PROFILE
  // ========================================

  const getUserData =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(
            true
          );


          const response =
            await axios.get<UserProfileResponse>(
              `${url}/users/profile`,
              config
            );


          setSingleUserData(
            response.data.singleUserData
          );
        } catch (
          error: unknown
        ) {
          /*
           * Narrow Axios errors instead of treating
           * caught values as implicit any.
           */
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "getUserData error:",
              error.response?.data ??
                error.message
            );
          } else {
            console.error(
              "getUserData error:",
              error
            );
          }


          toast.error(
            "Error in getting User profile"
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // GET STUDENT PROFILE
  // ========================================

  const getStudentData =
    useCallback(
      async (): Promise<void> => {
        /*
         * studentId is nullable because values read
         * from localStorage have type string | null.
         */
        if (
          !studentId
        ) {
          toast.error(
            "Student ID was not found"
          );

          setLoading(
            false
          );

          return;
        }


        try {
          setLoading(
            true
          );


          const response =
            await axios.get<StudentProfileResponse>(
              `${url}/student/${studentId}`,
              config
            );


          setSingleStudentData(
            response.data.singleStudentData
          );
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "getStudentData error:",
              error.response?.data ??
                error.message
            );
          } else {
            console.error(
              "getStudentData error:",
              error
            );
          }


          toast.error(
            "Error in getting Student profile"
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        config,
        studentId,
      ]
    );


  // ========================================
  // LOAD THE CORRECT PROFILE
  // ========================================

  useEffect(() => {
    /*
     * Students use the Student endpoint.
     * Other roles use the general User profile.
     */
    if (
      role ===
      "student"
    ) {
      void getStudentData();

      return;
    }


    void getUserData();
  }, [
    role,
    getStudentData,
    getUserData,
  ]);


  return (
    <Box
      sx={{
        minHeight:
          "90vh",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems: {
          xs:
            "flex-start",

          md:
            "center",
        },

        py: {
          xs:
            2,

          md:
            0,
        },

        px: {
          xs:
            1.5,

          sm:
            3,
        },

        boxSizing:
          "border-box",
      }}
    >
      <ProfileSections
        navigate={
          navigate
        }
        loading={
          loading
        }
        singleUserData={
          singleUserData
        }
        singleStudentData={
          singleStudentData
        }
      />
    </Box>
  );
}