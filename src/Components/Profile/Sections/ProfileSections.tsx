import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  NavigateFunction,
} from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import {
  MdBadge,
} from "react-icons/md";

import {
  FcLeft,
} from "react-icons/fc";


// ========================================
// PROFILE DATA TYPE
// ========================================

/*
 * This component can receive either:
 *
 * - Student profile data
 * - General User profile data
 *
 * Rather than forcing either backend model,
 * define the fields this UI actually reads.
 */
export interface ProfileData {
  _id?: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

  gender?: string;

  country?: string;

  birthdate?: string | null;

  birthday?: string | null;

  role?: string;

  isActive?: boolean;
}


// ========================================
// EDITABLE FIELD TYPE
// ========================================

interface ProfileField {
  key: string;

  label: string;

  icon: ReactNode;

  value: string;

  disabled: boolean;
}


// ========================================
// HELPERS
// ========================================

/*
 * Safely convert unknown backend values
 * into displayable strings.
 */
const safeText = (
  value: unknown,
  fallback = "-"
): string => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  const stringValue =
    String(
      value
    ).trim();

  return stringValue.length
    ? stringValue
    : fallback;
};


// ========================================
// CREATE INITIALS
// ========================================

const makeInitials = (
  userData: ProfileData
): string => {
  const firstName =
    safeText(
      userData.firstName,
      ""
    ).trim();

  const lastName =
    safeText(
      userData.lastName,
      ""
    ).trim();

  const fullName =
    safeText(
      userData.name,
      ""
    ).trim();

  const fromFirstAndLast =
    (
      firstName
        ? firstName[0]
        : ""
    ) +
    (
      lastName
        ? lastName[0]
        : ""
    );

  if (
    fromFirstAndLast.trim().length
  ) {
    return fromFirstAndLast.toUpperCase();
  }

  if (
    fullName.length >= 2
  ) {
    return fullName
      .slice(
        0,
        2
      )
      .toUpperCase();
  }

  if (
    fullName.length === 1
  ) {
    return fullName.toUpperCase();
  }

  return "U";
};


// ========================================
// EDIT MODAL PROPS
// ========================================

interface EditModalProps {
  open: boolean;

  onClose: () => void;

  field: ProfileField | null;
}


// ========================================
// EDIT MODAL
// ========================================

const EditModal = ({
  open,
  onClose,
  field,
}: EditModalProps) => {
  const [
    isEditing,
    setIsEditing,
  ] =
    useState<boolean>(
      false
    );

  const [
    value,
    setValue,
  ] =
    useState<string>(
      ""
    );


  // ========================================
  // RESET MODAL STATE
  // ========================================

  useEffect(() => {
    if (
      open
    ) {
      setIsEditing(
        false
      );

      setValue(
        field?.value ??
          ""
      );
    }
  }, [
    open,
    field?.key,
    field?.value,
  ]);


  // ========================================
  // SAVE
  // ========================================

  const handleSave = (): void => {
    /*
     * Preserve the current application behaviour.
     *
     * The existing JavaScript file only logs the
     * intended PUT request here; it does not yet
     * send the update to the backend.
     */
    console.log(
      `PUT /users/profile → { ${field?.key}: "${value}" }`
    );

    setIsEditing(
      false
    );

    onClose();
  };


  // ========================================
  // CLOSE
  // ========================================

  const handleClose = (): void => {
    setIsEditing(
      false
    );

    onClose();
  };


  return (
    <Modal
      open={
        open
      }
      onClose={
        handleClose
      }
      sx={{
        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        p:
          2,
      }}
    >
      <Box
        sx={{
          background:
            "#fff",

          borderRadius:
            "16px",

          boxShadow:
            "0 32px 80px rgba(15,23,42,0.2)",

          width:
            "100%",

          maxWidth:
            400,

          overflow:
            "hidden",

          outline:
            "none",
        }}
      >
        {/* ========================================
            MODAL HEADER
        ======================================== */}

        <Box
          sx={{
            px:
              3,

            py:
              2.5,

            background:
              "linear-gradient(135deg, #1a3bbd 0%, #0d1f8a 100%)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                1.5,
            }}
          >
            <Box
              sx={{
                width:
                  30,

                height:
                  30,

                borderRadius:
                  "8px",

                background:
                  "rgba(255,255,255,0.15)",

                display:
                  "grid",

                placeItems:
                  "center",
              }}
            >
              {field?.icon && (
                <Box
                  sx={{
                    color:
                      "#fff",

                    display:
                      "flex",

                    "& .MuiSvgIcon-root": {
                      fontSize:
                        17,
                    },
                  }}
                >
                  {field.icon}
                </Box>
              )}
            </Box>

            <Typography
              sx={{
                fontSize:
                  15,

                fontWeight:
                  700,

                color:
                  "#fff",
              }}
            >
              {field?.label}
            </Typography>
          </Box>


          <IconButton
            onClick={
              handleClose
            }
            size="small"
            sx={{
              color:
                "rgba(255,255,255,0.7)",

              "&:hover": {
                color:
                  "#fff",

                background:
                  "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>


        {/* ========================================
            MODAL CONTENT
        ======================================== */}

        <Box
          sx={{
            px:
              3,

            py:
              2.5,
          }}
        >
          {/* CURRENT VALUE */}

          <Box
            sx={{
              background:
                "#f8fafc",

              border:
                "1px solid #e2e8f0",

              borderRadius:
                "10px",

              px:
                2,

              py:
                1.5,

              mb:
                2.5,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize:
                    10,

                  color:
                    "#94a3b8",

                  fontWeight:
                    700,

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "0.07em",
                }}
              >
                Current value
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    14,

                  color:
                    "#334155",

                  fontWeight:
                    600,

                  mt:
                    0.3,
                }}
              >
                {field?.value ||
                  "—"}
              </Typography>
            </Box>


            {!field?.disabled && (
              <IconButton
                size="small"
                onClick={() =>
                  setIsEditing(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                sx={{
                  background:
                    isEditing
                      ? "#eff6ff"
                      : "transparent",

                  color:
                    isEditing
                      ? "#2563eb"
                      : "#94a3b8",

                  border:
                    "1px solid",

                  borderColor:
                    isEditing
                      ? "#bfdbfe"
                      : "#e2e8f0",

                  "&:hover": {
                    background:
                      "#eff6ff",

                    color:
                      "#2563eb",

                    borderColor:
                      "#bfdbfe",
                  },
                }}
              >
                <EditIcon
                  sx={{
                    fontSize:
                      16,
                  }}
                />
              </IconButton>
            )}
          </Box>


          {/* ========================================
              NEW VALUE FIELD
          ======================================== */}

          {isEditing &&
            !field?.disabled && (
              <Box
                sx={{
                  mb:
                    2,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      11,

                    fontWeight:
                      700,

                    color:
                      "#475569",

                    mb:
                      1,

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      "0.06em",
                  }}
                >
                  New value
                </Typography>


                <TextField
                  fullWidth
                  autoFocus
                  value={
                    value
                  }
                  onChange={(
                    event
                  ) =>
                    setValue(
                      event.target.value
                    )
                  }
                  placeholder={
                    `Enter new ${
                      field?.label.toLowerCase() ??
                      "value"
                    }…`
                  }
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={
                            handleSave
                          }
                          sx={{
                            color:
                              "#16a34a",
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),

                    sx: {
                      borderRadius:
                        "8px",

                      fontSize:
                        14,

                      background:
                        "#fff",

                      "& .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#cbd5e1",
                        },

                      "&:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#94a3b8",
                        },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            "#2563eb",
                        },
                    },
                  }}
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      handleSave();
                    }

                    if (
                      event.key ===
                      "Escape"
                    ) {
                      setIsEditing(
                        false
                      );
                    }
                  }}
                />


                <Typography
                  sx={{
                    fontSize:
                      11,

                    color:
                      "#94a3b8",

                    mt:
                      0.8,
                  }}
                >
                  Press Enter to save · Escape to cancel
                </Typography>
              </Box>
            )}


          {/* ========================================
              DISABLED FIELD MESSAGE
          ======================================== */}

          {field?.disabled && (
            <Box
              sx={{
                background:
                  "#fff7ed",

                border:
                  "1px solid #fed7aa",

                borderRadius:
                  "10px",

                px:
                  2,

                py:
                  1.5,

                mb:
                  2,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    12,

                  color:
                    "#c2410c",

                  fontWeight:
                    600,
                }}
              >
                ⚠️ This field cannot be changed directly. Please contact support.
              </Typography>
            </Box>
          )}


          {/* ========================================
              MODAL ACTIONS
          ======================================== */}

          <Box
            sx={{
              display:
                "flex",

              gap:
                1.5,

              justifyContent:
                "flex-end",

              mt:
                1,
            }}
          >
            <Button
              onClick={
                handleClose
              }
              sx={{
                fontSize:
                  13,

                fontWeight:
                  700,

                px:
                  2.5,

                py:
                  1,

                borderRadius:
                  "8px",

                color:
                  "#64748b",

                background:
                  "#f1f5f9",

                "&:hover": {
                  background:
                    "#e2e8f0",
                },

                textTransform:
                  "none",
              }}
            >
              Cancel
            </Button>


            {isEditing &&
              !field?.disabled && (
                <Button
                  onClick={
                    handleSave
                  }
                  variant="contained"
                  sx={{
                    fontSize:
                      13,

                    fontWeight:
                      700,

                    px:
                      2.5,

                    py:
                      1,

                    borderRadius:
                      "8px",

                    background:
                      "linear-gradient(135deg, #1a3bbd, #0d1f8a)",

                    boxShadow:
                      "0 4px 12px rgba(26,59,189,0.35)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1d4ed8, #1a3bbd)",
                    },

                    textTransform:
                      "none",
                  }}
                >
                  Save changes
                </Button>
              )}
          </Box>
        </Box>


        {/* ========================================
            API PREVIEW
        ======================================== */}

        <Box
          sx={{
            px:
              3,

            py:
              1.2,

            background:
              "#f8fafc",

            borderTop:
              "1px solid #f1f5f9",
          }}
        >
          <Typography
            sx={{
              fontSize:
                10,

              color:
                "#cbd5e1",

              fontFamily:
                "monospace",
            }}
          >
            PUT /users/profile → &#123; {field?.key}: value &#125;
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};


// ========================================
// SECTION HEADING
// ========================================

interface SectionHeadingProps {
  children: ReactNode;
}


const SectionHeading = ({
  children,
}: SectionHeadingProps) => (
  <Typography
    sx={{
      fontSize:
        11,

      fontWeight:
        800,

      color:
        "#94a3b8",

      textTransform:
        "uppercase",

      letterSpacing:
        "0.12em",

      mb:
        1.5,

      display:
        "flex",

      alignItems:
        "center",

      gap:
        1,

      "&::after": {
        content:
          '""',

        flex:
          1,

        height:
          "1px",

        background:
          "linear-gradient(to right, #f1f5f9, transparent)",
      },
    }}
  >
    {children}
  </Typography>
);


// ========================================
// FIELD ROW PROPS
// ========================================

interface FieldRowProps {
  label: string;

  value: ReactNode;

  disabled?: boolean;

  onClick?: () => void;

  icon: ReactNode;
}


// ========================================
// FIELD ROW
// ========================================

const FieldRow = ({
  label,
  value,
  disabled = false,
  onClick,
  icon,
}: FieldRowProps) => (
  <Box
    onClick={
      !disabled
        ? onClick
        : undefined
    }
    sx={{
      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      px:
        1.5,

      py:
        1.6,

      cursor:
        disabled
          ? "default"
          : "pointer",

      borderRadius:
        "10px",

      transition:
        "background 0.12s",

      "&:hover":
        !disabled
          ? {
              background:
                "#f8fafc",
            }
          : {},
    }}
  >
    <Box
      sx={{
        display:
          "flex",

        alignItems:
          "center",

        gap:
          1.5,

        minWidth:
          0,
      }}
    >
      <Box
        sx={{
          width:
            32,

          height:
            32,

          borderRadius:
            "9px",

          background:
            disabled
              ? "#f8fafc"
              : "#f1f5f9",

          display:
            "grid",

          placeItems:
            "center",

          flexShrink:
            0,

          color:
            disabled
              ? "#cbd5e1"
              : "#64748b",

          "& svg": {
            fontSize:
              17,
          },
        }}
      >
        {icon}
      </Box>


      <Box
        sx={{
          minWidth:
            0,
        }}
      >
        <Typography
          sx={{
            fontSize:
              10.5,

            color:
              "#94a3b8",

            fontWeight:
              700,

            textTransform:
              "uppercase",

            letterSpacing:
              "0.06em",
          }}
        >
          {label}
        </Typography>


        <Typography
          sx={{
            fontSize:
              13.5,

            fontWeight:
              500,

            mt:
              0.15,

            color:
              disabled
                ? "#cbd5e1"
                : "#1e293b",

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>


    {!disabled ? (
      <Box
        sx={{
          flexShrink:
            0,

          ml:
            1,

          width:
            28,

          height:
            28,

          borderRadius:
            "8px",

          border:
            "1px solid #e9eef4",

          display:
            "grid",

          placeItems:
            "center",

          color:
            "#94a3b8",

          transition:
            "all 0.12s",

          ".MuiBox-root:hover > &":
            {
              borderColor:
                "#bfdbfe",

              color:
                "#2563eb",

              background:
                "#eff6ff",
            },
        }}
      >
        <EditIcon
          sx={{
            fontSize:
              14,
          }}
        />
      </Box>
    ) : (
      <Box
        sx={{
          width:
            28,

          flexShrink:
            0,
        }}
      />
    )}
  </Box>
);


// ========================================
// MAIN COMPONENT PROPS
// ========================================

interface ProfileSectionsProps {
  navigate: NavigateFunction;

  loading: boolean;

  singleStudentData?: ProfileData | null;

  singleUserData?: ProfileData | null;
}


// ========================================
// MAIN COMPONENT
// ========================================

export default function ProfileSections({
  navigate,
  loading,
  singleStudentData,
  singleUserData,
}: ProfileSectionsProps) {
  // ========================================
  // MODAL STATE
  // ========================================

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState<boolean>(
      false
    );

  const [
    activeField,
    setActiveField,
  ] =
    useState<ProfileField | null>(
      null
    );


  // ========================================
  // OPEN / CLOSE MODAL
  // ========================================

  const openModal = (
    field: ProfileField
  ): void => {
    setActiveField(
      field
    );

    setModalOpen(
      true
    );
  };


  const closeModal = (): void => {
    setModalOpen(
      false
    );

    setActiveField(
      null
    );
  };


  // ========================================
  // CHOOSE PROFILE DATA
  // ========================================

  /*
   * Student data takes priority when available.
   * Otherwise use the normal User profile.
   */
  const userData:
    ProfileData =
    singleStudentData ??
    singleUserData ??
    {};


  /*
   * Some account fields may not exist in the
   * Student object, so fall back to User data.
   */
  const role =
    safeText(
      singleUserData?.role ??
        singleStudentData?.role
    );


  const isActive =
    Boolean(
      singleUserData?.isActive ??
        singleStudentData?.isActive
    );


  const isStudent =
    role ===
    "student";


  // ========================================
  // DISPLAY VALUES
  // ========================================

  const initials =
    makeInitials(
      userData
    );


  const email =
    safeText(
      userData.email ??
        singleUserData?.email
    );


  const firstName =
    safeText(
      userData.firstName
    );


  const lastName =
    safeText(
      userData.lastName
    );


  const accountId =
    safeText(
      userData._id
    );


  const gender =
    safeText(
      userData.gender
    );


  const country =
    safeText(
      userData.country
    );


  const phoneNumber =
    safeText(
      userData.phoneNumber ??
        singleUserData?.phoneNumber
    );


  const birthdate =
    safeText(
      userData.birthdate ??
        userData.birthday
    );


  // ========================================
  // HELPER: CAPITALIZE DISPLAY VALUE
  // ========================================

  const capitalize = (
    value: string
  ): string =>
    value.charAt(
      0
    ).toUpperCase() +
    value.slice(
      1
    );


  // ========================================
  // BASIC PROFILE FIELDS
  // ========================================

  const basicFields:
    ProfileField[] = [
    {
      key:
        "firstName",

      label:
        "First Name",

      icon:
        <PersonIcon />,

      value:
        capitalize(
          firstName
        ),

      disabled:
        false,
    },

    {
      key:
        "lastName",

      label:
        "Last Name",

      icon:
        <PersonIcon />,

      value:
        capitalize(
          lastName
        ),

      disabled:
        false,
    },

    {
      key:
        "Account ID",

      label:
        "ID",

      icon:
        <MdBadge />,

      value:
        accountId,

      disabled:
        true,
    },

    {
      key:
        "gender",

      label:
        "Gender",

      icon:
        <WcIcon />,

      value:
        capitalize(
          gender
        ),

      disabled:
        false,
    },

    {
      key:
        "country",

      label:
        "Country",

      icon:
        <PublicOutlined />,

      value:
        capitalize(
          country
        ),

      disabled:
        false,
    },

    ...(isStudent
      ? [
          {
            key:
              "birthday",

            label:
              "Birthday",

            icon:
              <CakeIcon />,

            value:
              birthdate,

            disabled:
              false,
          },
        ]
      : []),
  ];


  // ========================================
  // CONTACT FIELDS
  // ========================================

  const contactFields:
    ProfileField[] = [
    {
      key:
        "email",

      label:
        "Email",

      icon:
        <EmailIcon />,

      value:
        email,

      disabled:
        false,
    },

    {
      key:
        "phoneNumber",

      label:
        "Phone Number",

      icon:
        <PhoneIcon />,

      value:
        phoneNumber,

      disabled:
        false,
    },
  ];


  return (
    <Box
      sx={{
        width:
          "100%",

        maxWidth:
          680,

        mx:
          "auto",

        px: {
          xs:
            2,

          sm:
            3,
        },

        py: {
          xs:
            2,
        },
      }}
    >
      {/* ========================================
          EDIT MODAL
      ======================================== */}

      <EditModal
        open={
          modalOpen
        }
        onClose={
          closeModal
        }
        field={
          activeField
        }
      />


      {/* ========================================
          BACK BUTTON
      ======================================== */}

      <Box
        sx={{
          mb:
            2.5,
        }}
      >
        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          style={{
            background:
              "#fff",

            border:
              "1px solid #e2e8f0",

            borderRadius:
              "10px",

            padding:
              "6px 14px",

            fontSize:
              13,

            fontWeight:
              700,

            color:
              "#475569",

            cursor:
              "pointer",
          }}
          onMouseEnter={(
            event
          ) => {
            event.currentTarget.style.background =
              "#f8fafc";
          }}
          onMouseLeave={(
            event
          ) => {
            event.currentTarget.style.background =
              "#fff";
          }}
        >
          <FcLeft className="fs-6" /> Back to Dashboard
        </button>
      </Box>


      {/* ========================================
          PROFILE CARD
      ======================================== */}

      <Box
        sx={{
          background:
            "#fff",

          borderRadius:
            "18px",

          border:
            "1px solid #e9eef4",

          boxShadow:
            "0 4px 24px rgba(15,23,42,0.07)",

          overflow:
            "hidden",
        }}
      >
        {/* ========================================
            PROFILE HEADER
        ======================================== */}

        <Box
          sx={{
            position:
              "relative",

            background:
              "#fff",

            px: {
              xs:
                2.5,

              sm:
                3,
            },

            pt:
              3,

            pb:
              2.5,

            borderBottom:
              "1px solid #f1f5f9",
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "flex-start",

              gap:
                2.5,

              flexWrap:
                "wrap",
            }}
          >
            {/* PROFILE INITIALS */}

            <Box
              sx={{
                position:
                  "relative",

                flexShrink:
                  0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs:
                      64,

                    sm:
                      76,
                  },

                  height: {
                    xs:
                      64,

                    sm:
                      76,
                  },

                  borderRadius:
                    "50%",

                  background:
                    "linear-gradient(135deg, #60a5fa, #2563eb)",

                  display:
                    "grid",

                  placeItems:
                    "center",

                  color:
                    "#fff",

                  fontWeight:
                    900,

                  fontSize: {
                    xs:
                      22,

                    sm:
                      26,
                  },

                  boxShadow:
                    "0 0 0 3px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                {loading
                  ? "…"
                  : initials}
              </Box>


              <Tooltip
                title="Change photo"
                placement="bottom"
              >
                <Box
                  sx={{
                    position:
                      "absolute",

                    bottom:
                      0,

                    right:
                      0,

                    width:
                      26,

                    height:
                      26,

                    borderRadius:
                      "50%",

                    background:
                      "#fff",

                    display:
                      "grid",

                    placeItems:
                      "center",

                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.2)",

                    cursor:
                      "pointer",

                    transition:
                      "transform 0.15s, box-shadow 0.15s",

                    "&:hover": {
                      transform:
                        "scale(1.1)",

                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  <PhotoCameraIcon
                    sx={{
                      fontSize:
                        13,

                      color:
                        "#1a3bbd",
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>


            {/* PROFILE NAME */}

            <Box
              sx={{
                flex:
                  1,

                minWidth:
                  0,
              }}
            >
              <Typography
                sx={{
                  fontWeight:
                    800,

                  fontSize: {
                    xs:
                      16,

                    sm:
                      18,
                  },

                  color:
                    "#0f172a",

                  letterSpacing:
                    "-0.02em",

                  lineHeight:
                    1.25,

                  mb:
                    0.3,
                }}
              >
                {loading
                  ? "Loading…"
                  : `${capitalize(
                      firstName
                    )} ${capitalize(
                      lastName
                    )}`}
              </Typography>


              <Typography
                sx={{
                  fontSize:
                    13,

                  color:
                    "#94a3b8",

                  mb:
                    1,

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {email}
              </Typography>


              <Stack
                direction="row"
                spacing={
                  0.8
                }
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  size="small"
                  label={
                    isActive
                      ? "Active"
                      : "Inactive"
                  }
                  sx={{
                    fontSize:
                      10.5,

                    fontWeight:
                      700,

                    height:
                      20,

                    borderRadius:
                      "5px",

                    bgcolor:
                      isActive
                        ? "#f0fdf4"
                        : "#fef2f2",

                    color:
                      isActive
                        ? "#16a34a"
                        : "#dc2626",

                    border:
                      isActive
                        ? "1px solid #bbf7d0"
                        : "1px solid #fecaca",
                  }}
                />


                <Chip
                  size="small"
                  label={
                    role
                  }
                  sx={{
                    fontSize:
                      10.5,

                    fontWeight:
                      700,

                    height:
                      20,

                    borderRadius:
                      "5px",

                    bgcolor:
                      "#eff6ff",

                    color:
                      "#1a3bbd",

                    border:
                      "1px solid #bfdbfe",
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>


        {/* ========================================
            PROFILE DETAILS
        ======================================== */}

        <Box
          sx={{
            mx: {
              xs:
                2,

              sm:
                3,
            },

            mt:
              0,

            mb:
              0,

            background:
              "#fff",

            borderRadius:
              "14px",

            overflow:
              "hidden",
          }}
        >
          {/* PERSONAL INFORMATION */}

          <Box
            sx={{
              px:
                2.5,

              pt:
                2.5,

              pb:
                1,
            }}
          >
            <SectionHeading>
              Personal Information
            </SectionHeading>


            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "1fr 1fr",
                },

                gap:
                  0,
              }}
            >
              {basicFields.map(
                (
                  field,
                  index
                ) => (
                  <Box
                    key={
                      field.key
                    }
                  >
                    <FieldRow
                      label={
                        field.label
                      }
                      icon={
                        field.icon
                      }
                      value={
                        loading
                          ? "Loading..."
                          : field.value
                      }
                      disabled={
                        field.disabled
                      }
                      onClick={() =>
                        openModal({
                          ...field,

                          value:
                            loading
                              ? ""
                              : field.value,
                        })
                      }
                    />


                    {index <
                      basicFields.length -
                        1 && (
                      <Divider
                        sx={{
                          borderColor:
                            "#f8fafc",

                          display: {
                            xs:
                              "block",

                            sm:
                              "none",
                          },
                        }}
                      />
                    )}
                  </Box>
                )
              )}
            </Box>
          </Box>


          <Divider
            sx={{
              borderColor:
                "#f1f5f9",

              mx:
                2.5,
            }}
          />


          {/* CONTACT */}

          <Box
            sx={{
              px:
                2.5,

              pt:
                2,

              pb:
                1,
            }}
          >
            <SectionHeading>
              Contact
            </SectionHeading>


            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "1fr 1fr",
                },

                gap:
                  0,
              }}
            >
              {contactFields.map(
                (
                  field
                ) => (
                  <FieldRow
                    key={
                      field.key
                    }
                    label={
                      field.label
                    }
                    icon={
                      field.icon
                    }
                    value={
                      loading
                        ? "Loading..."
                        : field.value
                    }
                    disabled={
                      field.disabled
                    }
                    onClick={() =>
                      openModal({
                        ...field,

                        value:
                          loading
                            ? ""
                            : field.value,
                      })
                    }
                  />
                )
              )}
            </Box>
          </Box>


          <Divider
            sx={{
              borderColor:
                "#f1f5f9",

              mx:
                2.5,
            }}
          />


          {/* SECURITY */}

          <Box
            sx={{
              px:
                2.5,

              pt:
                2,

              pb:
                2,
            }}
          >
            <SectionHeading>
              Security
            </SectionHeading>


            <FieldRow
              label="Password"
              icon={
                <LockIcon />
              }
              value="••••••••••••"
              disabled={
                false
              }
              onClick={() =>
                navigate(
                  "/passwordform"
                )
              }
            />
          </Box>
        </Box>


        {/* ========================================
            SAVE BUTTON
        ======================================== */}

        <Box
          sx={{
            px: {
              xs:
                2,

              sm:
                3,
            },

            py:
              2.5,

            display:
              "flex",

            justifyContent:
              "flex-end",
          }}
        >
          <Button
            variant="contained"
            sx={{
              fontSize:
                13.5,

              fontWeight:
                700,

              px: {
                xs:
                  3,

                sm:
                  4,
              },

              py:
                1.3,

              borderRadius:
                "10px",

              background:
                "linear-gradient(135deg, #1a3bbd, #0d1f8a)",

              boxShadow:
                "0 4px 14px rgba(26,59,189,0.3)",

              textTransform:
                "none",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8, #1a3bbd)",

                boxShadow:
                  "0 6px 20px rgba(26,59,189,0.4)",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}