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
} from "@mui/material";

import {
  Form,
} from "react-bootstrap";

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
  phoneNumber?: string;
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

interface PhoneNumberFormValues {
  /*
   * Keep phone numbers as strings.
   *
   * Phone numbers may contain:
   * +, spaces, brackets, or leading zeros,
   * so they should not be stored as numbers.
   */
  phoneNumber: string;
}


// ========================================
// VALIDATION SCHEMA
// ========================================

const formSchema =
  Yup.object({
    phoneNumber:
      Yup.string()
        .trim()
        .matches(
          /^[0-9+() \-]*$/,
          "Invalid phone number"
        )
        .required(
          "Phone number is required"
        ),
  });


// ========================================
// COMPONENT
// ========================================

function PhoneNumberForm() {
  const navigate =
    useNavigate();


  // ========================================
  // USER DATA
  // ========================================

  /*
   * The original JavaScript code used:
   *
   * useState([])
   *
   * but later accessed userData.phoneNumber.
   *
   * The correct data shape is an object.
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
          PhoneNumberFormValues
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
              "Failed to update phone number:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to update phone number:",
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
    useFormik<PhoneNumberFormValues>({
      initialValues: {
        /*
         * When profile data arrives,
         * enableReinitialize updates Formik.
         */
        phoneNumber:
          userData.phoneNumber ??
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
        Update the phone number associated with your profile.
      </div>


      {/* ========================================
          PHONE NUMBER FORM
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
        <Form.Group className="mt-3">
          <Form.Label className="m-0">
            Phone No.
          </Form.Label>


          <Form.Control
            /*
             * "phoneNumber" is not a valid HTML
             * input type. "tel" is the correct type.
             */
            type="tel"
            name="phoneNumber"
            value={
              formik.values.phoneNumber
            }
            onChange={
              formik.handleChange
            }
            onBlur={
              formik.handleBlur
            }
          />


          {formik.errors.phoneNumber &&
          formik.touched.phoneNumber ? (
            <div>
              {formik.errors.phoneNumber}
            </div>
          ) : null}
        </Form.Group>


        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <div className="mt-3 text-end">
          <button
            /*
             * Explicit type prevents Cancel from
             * submitting the surrounding form.
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

export default PhoneNumberForm;