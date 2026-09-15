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
  username?: string;
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

interface UserNameFormValues {
  username: string;
}


// ========================================
// VALIDATION SCHEMA
// ========================================

const formSchema =
  Yup.object({
    username:
      Yup.string().required(),
  });


// ========================================
// COMPONENT
// ========================================

function UserNameForm() {
  const navigate =
    useNavigate();


  // ========================================
  // USER DATA
  // ========================================

  /*
   * The old JavaScript version started this as [],
   * even though the code treats it as an object.
   *
   * TypeScript lets us correct that shape.
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
          UserNameFormValues
      ): Promise<void> => {
        try {
          await axios.put(
            `${url}/users/profile`,
            updatedProfile,
            config
          );


          /*
           * Preserve the original behaviour:
           * return to the profile page after
           * a successful update.
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
              "Failed to update username:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to update username:",
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
    useFormik<UserNameFormValues>({
      initialValues: {
        /*
         * enableReinitialize below means Formik
         * updates this value after userData arrives.
         */
        username:
          userData.username ??
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
  // FETCH USER PROFILE
  // ========================================

  const getUserData =
    useCallback(
      async (): Promise<void> => {
        try {
          /*
           * Use Axios here as well so this request
           * shares the same typed auth config.
           */
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
        Changes to your name will be reflected across your Google Account.
        Your previous name may still be searchable or appear on old messages.
      </div>


      {/* ========================================
          USERNAME FORM
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
          required
          label="Username"
          name="username"
          id="username"
          onChange={
            formik.handleChange
          }
          onBlur={
            formik.handleBlur
          }
          value={
            formik.values.username
          }
        />


        {formik.errors.username &&
        formik.touched.username ? (
          <div>
            {formik.errors.username}
          </div>
        ) : null}


        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <div className="mt-3 text-end">
          <button
            /*
             * Important: this button is inside a
             * form, so explicitly prevent it from
             * submitting when Cancel is clicked.
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

export default UserNameForm;