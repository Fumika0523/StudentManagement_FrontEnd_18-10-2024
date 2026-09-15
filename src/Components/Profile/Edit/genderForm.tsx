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

import Form from "react-bootstrap/Form";

import {
  useNavigate,
} from "react-router-dom";

import {
  url,
} from "../../utils/constant";


// ========================================
// GENDER TYPE
// ========================================

/*
 * These values match the gender values already
 * used by the Student model/forms.
 *
 * Empty string is included because profile data
 * may not have been selected yet.
 */
type GenderValue =
  | ""
  | "male"
  | "female"
  | "Rather not say";


// ========================================
// PROFILE DATA TYPE
// ========================================

interface ProfileUserData {
  gender?: GenderValue;
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

interface GenderFormValues {
  gender: GenderValue;
}


// ========================================
// VALIDATION SCHEMA
// ========================================

const formSchema =
  Yup.object({
    gender:
      Yup.string().oneOf([
        "",
        "male",
        "female",
        "Rather not say",
      ]),
  });


// ========================================
// COMPONENT
// ========================================

function GenderForm() {
  const navigate =
    useNavigate();


  // ========================================
  // USER DATA
  // ========================================

  /*
   * The JavaScript version used useState([]),
   * but userData is accessed as an object.
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
          GenderFormValues
      ): Promise<void> => {
        try {
          await axios.put(
            `${url}/users/profile`,
            updatedProfile,
            config
          );


          /*
           * Preserve the existing behaviour:
           * return to the Profile page after
           * successful update.
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
              "Failed to update gender:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to update gender:",
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
    useFormik<GenderFormValues>({
      initialValues: {
        /*
         * enableReinitialize updates Formik after
         * the profile data has been fetched.
         */
        gender:
          userData.gender ??
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
    <Form
      className="border border-secondary-subtle rounded m-5 p-3"
      onSubmit={
        formik.handleSubmit
      }
    >
      <div>
        Gender
      </div>


      {/* ========================================
          MALE
      ======================================== */}

      <div className="form-check form-check-inline">
        <Form.Check
          type="radio"
          name="gender"
          label="Male"
          value="male"
          onChange={
            formik.handleChange
          }
          onBlur={
            formik.handleBlur
          }
          checked={
            formik.values.gender ===
            "male"
          }
        />
      </div>


      {/* ========================================
          FEMALE
      ======================================== */}

      <div className="form-check form-check-inline">
        <Form.Check
          type="radio"
          name="gender"
          label="Female"
          value="female"
          onChange={
            formik.handleChange
          }
          onBlur={
            formik.handleBlur
          }
          checked={
            formik.values.gender ===
            "female"
          }
        />
      </div>


      {/* ========================================
          VALIDATION ERROR
      ======================================== */}

      {formik.errors.gender &&
      formik.touched.gender ? (
        <div>
          {formik.errors.gender}
        </div>
      ) : null}


      {/* ========================================
          ACTION BUTTONS
      ======================================== */}

      <div className="mt-3 text-end">
        <button
          /*
           * Cancel must not submit the form.
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
    </Form>
  );
}

export default GenderForm;