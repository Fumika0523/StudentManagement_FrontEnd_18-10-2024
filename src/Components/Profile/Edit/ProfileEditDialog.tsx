import type {
  HTMLInputTypeAttribute,
} from "react";

import type {
  FormikProps,
} from "formik";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";


// ========================================
// COMPONENT PROPS
// ========================================

/*
 * T represents the shape of the Formik form.
 *
 * Example:
 *
 * {
 *   username: string;
 * }
 *
 * or:
 *
 * {
 *   phoneNumber: string;
 * }
 *
 * The dialog is reusable, so we make it generic
 * rather than hard-coding one particular form.
 */
interface ProfileEditDialogProps<
  T extends Record<string, string>
> {
  open: boolean;

  onClose: () => void;

  title: string;

  description: string;

  /*
   * FormikProps<T> gives us proper typing for:
   *
   * formik.values
   * formik.errors
   * formik.touched
   * formik.handleSubmit
   * formik.handleChange
   */
  formik: FormikProps<T>;

  /*
   * fieldName must be one of the real keys
   * that exists inside the Formik values object.
   */
  fieldName: keyof T & string;

  /*
   * Uses React's built-in valid HTML input types:
   *
   * text
   * password
   * email
   * tel
   * etc.
   */
  type?: HTMLInputTypeAttribute;

  label: string;
}


// ========================================
// COMPONENT
// ========================================

export default function ProfileEditDialog<
  T extends Record<string, string>
>({
  open,
  onClose,
  title,
  description,
  formik,
  fieldName,
  type = "text",
  label,
}: ProfileEditDialogProps<T>) {
  // ========================================
  // CURRENT FIELD STATE
  // ========================================

  /*
   * Because fieldName is keyof T, TypeScript knows
   * we are only accessing a valid Formik field.
   */
  const fieldValue =
    formik.values[fieldName];


  const fieldTouched =
    Boolean(
      formik.touched[
        fieldName
      ]
    );


  const fieldError =
    formik.errors[
      fieldName
    ];


  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      fullWidth
      maxWidth="sm"
    >
      {/* ========================================
          TITLE
      ======================================== */}

      <DialogTitle
        sx={{
          fontWeight:
            700,
        }}
      >
        {title}
      </DialogTitle>


      {/* ========================================
          FORM
      ======================================== */}

      <form
        onSubmit={
          formik.handleSubmit
        }
      >
        <DialogContent>
          <Typography
            sx={{
              mb:
                2,

              fontSize:
                14,

              color:
                "#6b7280",
            }}
          >
            {description}
          </Typography>


          <TextField
            fullWidth
            type={
              type
            }
            label={
              label
            }
            name={
              fieldName
            }
            value={
              fieldValue
            }
            onChange={
              formik.handleChange
            }
            onBlur={
              formik.handleBlur
            }
            error={
              fieldTouched &&
              Boolean(
                fieldError
              )
            }
            helperText={
              fieldTouched
                ? fieldError
                : undefined
            }
            size="small"
          />
        </DialogContent>


        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <DialogActions
          sx={{
            px:
              3,

            pb:
              2,
          }}
        >
          <Button
            type="button"
            variant="text"
            onClick={
              onClose
            }
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{
              borderRadius:
                "16px",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}