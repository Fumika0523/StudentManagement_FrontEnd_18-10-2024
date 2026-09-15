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
  Checkbox,
  TextField,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  url,
} from "../../utils/constant";


// ========================================
// PROFILE DATA TYPE
// ========================================

interface ProfileUserData {
  /*
   * The existing Profile API may return a
   * password property, so keep it optional.
   *
   * Ideally a production API should never
   * return the stored password to the frontend.
   */
  password?: string;
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

interface PasswordFormValues {
  password: string;
}


// ========================================
// VALIDATION SCHEMA
// ========================================

const formSchema =
  Yup.object({
    password:
      Yup.string().required(
        "Password is required"
      ),
  });


// ========================================
// COMPONENT
// ========================================

function PasswordForm() {
  const navigate =
    useNavigate();


  // ========================================
  // PASSWORD VISIBILITY
  // ========================================

  const [
    passwordShow,
    setPasswordShow,
  ] =
    useState<boolean>(
      false
    );


  // ========================================
  // USER DATA
  // ========================================

  /*
   * The old JavaScript file used useState([]),
   * although userData is accessed as an object.
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
          PasswordFormValues
      ): Promise<void> => {
        try {
          await axios.put(
            `${url}/users/profile`,
            updatedProfile,
            config
          );


          /*
           * Preserve the existing behaviour:
           * navigate back after a successful update.
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
              "Failed to update password:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to update password:",
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
    useFormik<PasswordFormValues>({
      initialValues: {
        /*
         * enableReinitialize lets Formik update
         * after the profile request completes.
         */
        password:
          userData.password ??
          "",
      },

      validationSchema:
        formSchema,

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


          setUserData(
            response.data.userData ??
              {}
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
    <div
      className="m-5 p-3 border border-secondary-subtle rounded"
      style={{
        width:
          "80%",
      }}
    >
      <div
        style={{
          fontSize:
            "90%",
        }}
      >
        Update the password associated with your account.
      </div>


      {/* ========================================
          PASSWORD FORM
      ======================================== */}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="p-4"
        onSubmit={
          formik.handleSubmit
        }
      >
        <TextField
          /*
           * Switch between password and plain text
           * based on the checkbox state.
           */
          type={
            passwordShow
              ? "text"
              : "password"
          }
          required
          label="Password"
          name="password"
          id="password"
          onChange={
            formik.handleChange
          }
          onBlur={
            formik.handleBlur
          }
          value={
            formik.values.password
          }
          error={
            formik.touched.password &&
            Boolean(
              formik.errors.password
            )
          }
          helperText={
            formik.touched.password
              ? formik.errors.password
              : undefined
          }
        />


        {/* ========================================
            SHOW PASSWORD
        ======================================== */}

        <div
          className="mt-2"
          style={{
            fontSize:
              "80%",
          }}
        >
          <Checkbox
            className="p-0"
            checked={
              passwordShow
            }
            onChange={(
              event
            ) => {
              /*
               * event.target.checked is already
               * typed by MUI as a boolean.
               */
              setPasswordShow(
                event.target.checked
              );
            }}
            inputProps={{
              "aria-label":
                "Show password",
            }}
          />

          Show Password
        </div>


        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <div className="mt-3 text-end">
          <button
            /*
             * Cancel is inside the form, so it
             * must explicitly not submit.
             */
            type="button"
            className="btn text-primary"
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
          </button>


          <button
            type="submit"
            className="btn btn-secondary px-3"
            style={{
              fontSize:
                "90%",

              borderRadius:
                "16px",
            }}
          >
            Save
          </button>
        </div>
      </Box>
    </div>
  );
}

export default PasswordForm;