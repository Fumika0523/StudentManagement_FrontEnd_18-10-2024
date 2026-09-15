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
  useFormik,
} from "formik";

import * as Yup from "yup";

import {
  Box,
  Button,
  TextField,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  IoArrowBackOutline,
} from "react-icons/io5";

import NavBar from "../../../HomePage/NavBar/NavBar";

import {
  url,
} from "../../utils/constant";


// ========================================
// PROFILE DATA TYPE
// ========================================

interface ProfileUserData {
  /*
   * The backend may return a full ISO date such as:
   *
   * 2024-10-29T15:07:54.366Z
   *
   * After loading it, we convert it to YYYY-MM-DD
   * for the HTML date input.
   */
  birthdate?: string;
}


// ========================================
// API RESPONSE TYPE
// ========================================

interface ProfileResponse {
  userData: ProfileUserData;
}


// ========================================
// FORM VALUES
// ========================================

interface BirthdateFormValues {
  /*
   * HTML <input type="date"> values are strings
   * in YYYY-MM-DD format.
   */
  birthdate: string;
}


// ========================================
// VALIDATION SCHEMA
// ========================================

const formSchema =
  Yup.object({
    birthdate:
      Yup.string()
        .required(
          "Birthday is required"
        ),
  });


// ========================================
// COMPONENT
// ========================================

function BirthdateForm() {
  const navigate =
    useNavigate();


  // ========================================
  // USER DATA
  // ========================================

  /*
   * The old JavaScript version used useState([]),
   * but userData is an object with a birthdate.
   */
  const [
    userData,
    setUserData,
  ] =
    useState<ProfileUserData>(
      {}
    );


  // ========================================
  // AUTH CONFIG
  // ========================================

  const token =
    localStorage.getItem(
      "token"
    );


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
  // UPDATE PROFILE
  // ========================================

  const updateProfile =
    useCallback(
      async (
        updatedProfile:
          BirthdateFormValues
      ): Promise<void> => {
        try {
          await axios.put(
            `${url}/users/profile`,
            updatedProfile,
            config
          );


          /*
           * Return to the Profile page after
           * the update succeeds.
           */
          navigate(
            "/profile"
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
              "Failed to update birthday:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to update birthday:",
            error
          );
        }
      },
      [
        config,
        navigate,
      ]
    );


  // ========================================
  // FORMIK
  // ========================================

  const formik =
    useFormik<BirthdateFormValues>({
      initialValues: {
        birthdate:
          userData.birthdate ??
          "",
      },

      validationSchema:
        formSchema,

      /*
       * Re-populate the form after the profile
       * request finishes.
       */
      enableReinitialize:
        true,

      onSubmit: async (
        values
      ): Promise<void> => {
        await updateProfile(
          values
        );
      },
    });


  // ========================================
  // FETCH PROFILE
  // ========================================

  const getUserData =
    useCallback(
      async (): Promise<void> => {
        try {
          const response =
            await axios.get<ProfileResponse>(
              `${url}/users/profile`,
              config
            );


          const profile =
            response.data.userData;


          /*
           * A date input cannot display the full
           * backend ISO value.
           *
           * Convert:
           * 2024-10-29T15:07:54.366Z
           *
           * into:
           * 2024-10-29
           */
          const formattedDate =
            profile?.birthdate
              ? new Date(
                  profile.birthdate
                )
                  .toISOString()
                  .split("T")[0]
              : "";


          setUserData({
            ...profile,

            birthdate:
              formattedDate,
          });
        } catch (
          error: unknown
        ) {
          if (
            axios.isAxiosError(
              error
            )
          ) {
            console.error(
              "Failed to load profile:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to load profile:",
            error
          );
        }
      },
      [
        config,
      ]
    );


  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    void getUserData();
  }, [
    getUserData,
  ]);


  return (
    <>
      <NavBar />


      <div className="px-5 mt-5">
        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="d-flex flex-row align-items-center border-4 gap-2">
          <IoArrowBackOutline
            className="fs-2"
            style={{
              color:
                "gray",

              cursor:
                "pointer",
            }}
            onClick={() => {
              navigate(
                "/profile"
              );
            }}
          />


          <span className="fs-2">
            Update Birthday
          </span>
        </div>


        <div
          className="text-start my-4"
          style={{
            width:
              "75%",
          }}
        >
          Your birthday may be used for account security and personalization
          across Google services. If this Google Account is for a business or
          organization, use the birthday of the person who manages the account.
        </div>


        {/* ========================================
            BIRTHDAY FORM
        ======================================== */}

        <div className="p-3 border border-secondary-subtle rounded">
          <form
            onSubmit={
              formik.handleSubmit
            }
          >
            <Box className="border-secondary-subtle d-flex flex-column text-secondary py-3">
              <div className="mb-2 fs-5 text-black">
                Update birthday
              </div>


              <TextField
                fullWidth
                type="date"
                name="birthdate"
                value={
                  formik.values.birthdate
                }
                onChange={
                  formik.handleChange
                }
                onBlur={
                  formik.handleBlur
                }
                error={
                  formik.touched.birthdate &&
                  Boolean(
                    formik.errors.birthdate
                  )
                }
                helperText={
                  formik.touched.birthdate
                    ? formik.errors.birthdate
                    : undefined
                }
                variant="outlined"
                size="small"
              />
            </Box>


            {/* ========================================
                ACTION BUTTONS
            ======================================== */}

            <Box className="mt-3 text-end">
              <Button
                type="button"
                variant="text"
                color="primary"
                style={{
                  fontSize:
                    "90%",
                }}
                onClick={() => {
                  navigate(
                    "/profile"
                  );
                }}
              >
                Cancel
              </Button>


              <Button
                type="submit"
                variant="contained"
                color="secondary"
                style={{
                  fontSize:
                    "90%",

                  borderRadius:
                    "16px",
                }}
              >
                Save
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </>
  );
}

export default BirthdateForm;