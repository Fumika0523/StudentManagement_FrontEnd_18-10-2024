import type {
  ChangeEventHandler,
  ComponentType,
  CSSProperties,
  ElementType,
  FocusEventHandler,
  ReactNode,
} from "react";

import Form from "react-bootstrap/Form";


// ========================================
// FORM VALUE TYPE
// ========================================

/*
 * React Bootstrap Form.Control accepts these
 * common controlled-input value types.
 */
type FormFieldValue =
  | string
  | number
  | readonly string[]
  | undefined;


// ========================================
// SIMPLE FORMIK-LIKE TYPE
// ========================================

/*
 * This component does not need the entire Formik
 * object. It only uses:
 *
 * values
 * touched
 * errors
 * handleChange
 * handleBlur
 *
 * Keeping this interface small makes the component
 * reusable with different forms.
 */
interface FormikFieldState {
  values: Record<
    string,
    FormFieldValue
  >;

  touched: Record<
    string,
    boolean | undefined
  >;

  /*
   * ReactNode allows normal Formik string errors
   * while also safely supporting no error.
   */
  errors: Record<
    string,
    ReactNode
  >;

  handleChange:
    ChangeEventHandler<
      HTMLInputElement |
      HTMLTextAreaElement
    >;

  handleBlur:
    FocusEventHandler<
      HTMLInputElement |
      HTMLTextAreaElement
    >;
}


// ========================================
// ICON TYPE
// ========================================

/*
 * Existing callers can pass MUI-style icons.
 *
 * Example:
 * Icon={Email}
 *
 * The component only adds an sx fontSize.
 */
interface FieldIconProps {
  sx?: {
    fontSize?: number;
  };
}

type FieldIcon =
  ComponentType<FieldIconProps>;


// ========================================
// COMPONENT PROPS
// ========================================

interface FormikFieldProps {
  formik:
    FormikFieldState;

  /*
   * Name is used to access:
   *
   * formik.values[name]
   * formik.touched[name]
   * formik.errors[name]
   */
  name: string;

  label: string;

  Icon?:
    FieldIcon;

  type?: string;

  placeholder?: string;

  /*
   * Allows:
   *
   * as="textarea"
   *
   * or another valid React component/element type.
   */
  as?: ElementType;

  disabled?: boolean;
}


// ========================================
// LABEL STYLE
// ========================================

const labelStyle:
  CSSProperties = {
  fontWeight:
    600,

  fontSize:
    "12px",

  color:
    "#475569",

  marginBottom:
    "6px",

  display:
    "flex",

  alignItems:
    "center",

  gap:
    "4px",
};


// ========================================
// INPUT STYLE
// ========================================

const inputStyle:
  CSSProperties = {
  borderRadius:
    "6px",

  padding:
    "8px 12px",

  fontSize:
    "13px",

  border:
    "1px solid #e2e8f0",
};


// ========================================
// DISABLED INPUT STYLE
// ========================================

const disabledInputStyle:
  CSSProperties = {
  ...inputStyle,

  backgroundColor:
    "#f3f4f6",

  color:
    "#6b7280",

  cursor:
    "not-allowed",
};


// ========================================
// COMPONENT
// ========================================

const FormikField = ({
  formik,
  name,
  label,
  Icon,
  type = "text",
  placeholder,
  as,
  disabled = false,
}: FormikFieldProps) => {
  // ========================================
  // VALIDATION ERROR
  // ========================================

  /*
   * TypeScript:
   * Convert the touched value into an explicit
   * boolean before deciding whether an error
   * should be displayed.
   */
  const showError =
    Boolean(
      formik.touched[name]
    ) &&
    Boolean(
      formik.errors[name]
    );


  return (
    <Form.Group>
      {/* ========================================
          LABEL
      ======================================== */}

      <Form.Label
        style={
          labelStyle
        }
      >
        {Icon ? (
          <Icon
            sx={{
              fontSize:
                14,
            }}
          />
        ) : null}

        {label}
      </Form.Label>


      {/* ========================================
          INPUT
      ======================================== */}

      <Form.Control
        as={as}
        type={type}
        placeholder={
          placeholder
        }
        name={name}
        value={
          formik.values[name]
        }
        onChange={
          formik.handleChange
        }
        onBlur={
          formik.handleBlur
        }
        disabled={
          disabled
        }
        style={
          disabled
            ? disabledInputStyle
            : inputStyle
        }
      />


      {/* ========================================
          ERROR MESSAGE
      ======================================== */}

      {showError ? (
        <div
          className="text-danger"
          style={{
            fontSize:
              "11px",

            marginTop:
              "2px",
          }}
        >
          {formik.errors[name]}
        </div>
      ) : null}
    </Form.Group>
  );
};

export default FormikField;