import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import axios from "axios";

import type {
  AxiosRequestConfig,
} from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type {
  SelectChangeEvent,
} from "@mui/material/Select";

import {
  AccountCircle,
  AttachFile,
  Build,
  CardMembership,
  Close,
  Email,
  EventAvailable,
  MenuBook,
  Message,
  MoreHoriz,
  Payment,
  Send,
  Subject,
} from "@mui/icons-material";

import {
  toast,
} from "react-toastify";

import {
  url,
} from "../utils/constant";


// ========================================
// QUERY TYPES
// ========================================

/*
 * Only these categories are currently
 * offered by the Inquiry form.
 */
type QueryCategory =
  | ""
  | "Attendance"
  | "Payment"
  | "Course"
  | "Certificate"
  | "Account"
  | "Technical"
  | "Other";


/*
 * The current UI always submits Normal.
 *
 * Keeping this as a type means we can easily
 * add Low / High later if the UI is expanded.
 */
type QueryPriority =
  "Normal";


// ========================================
// PROFILE DATA
// ========================================

interface QueryUserData {
  username?: string;

  email?: string;
}


interface ProfileResponse {
  userData?: QueryUserData;
}


// ========================================
// API RESPONSE TYPES
// ========================================

interface CreateQueryResponse {
  message?: string;
}


interface ApiErrorResponse {
  message?: string;
}


// ========================================
// COMPONENT
// ========================================

const RaiseQuery = () => {
  // ========================================
  // FORM STATE
  // ========================================

  const [
    category,
    setCategory,
  ] =
    useState<QueryCategory>(
      ""
    );


  const [
    priority,
    setPriority,
  ] =
    useState<QueryPriority>(
      "Normal"
    );


  const [
    subject,
    setSubject,
  ] =
    useState<string>(
      ""
    );


  const [
    message,
    setMessage,
  ] =
    useState<string>(
      ""
    );


  /*
   * Browser file inputs return File objects.
   *
   * Before a file is selected, the value is null.
   */
  const [
    attachment,
    setAttachment,
  ] =
    useState<File | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      false
    );


  const [
    userData,
    setUserData,
  ] =
    useState<QueryUserData>(
      {}
    );


  /*
   * Supply fallback display values while profile
   * data is unavailable.
   */
  const {
    username = "-",
    email = "-",
  } = userData;


  // ========================================
  // LOCAL STORAGE
  // ========================================

  const studentId =
    localStorage.getItem(
      "studentId"
    ) ?? "";


  const token =
    localStorage.getItem(
      "token"
    );


  // ========================================
  // AXIOS CONFIG
  // ========================================

  const config =
    useMemo<AxiosRequestConfig>(
      () => ({
        headers: {
          Authorization:
            `Bearer ${token}`,

          /*
           * Preserve the existing multipart
           * request behaviour for file uploads.
           */
          "Content-Type":
            "multipart/form-data",
        },
      }),
      [
        token,
      ]
    );


  // ========================================
  // RESET FORM
  // ========================================

  const resetForm =
    (): void => {
      setCategory(
        ""
      );

      setPriority(
        "Normal"
      );

      setSubject(
        ""
      );

      setMessage(
        ""
      );

      setAttachment(
        null
      );
    };


  // ========================================
  // VALIDATION
  // ========================================

  /*
   * null means the form is valid.
   * A string contains the validation message.
   */
  const validate =
    (): string | null => {
      if (!category) {
        return "Please choose a category.";
      }


      if (
        !subject.trim()
      ) {
        return "Subject is required.";
      }


      if (
        subject.trim().length <
        4
      ) {
        return "Subject is too short (min 4 chars).";
      }


      if (
        !message.trim()
      ) {
        return "Message is required.";
      }


      if (
        message.trim().length <
        10
      ) {
        return "Message is too short (min 10 chars).";
      }


      return null;
    };


  // ========================================
  // SUBMIT INQUIRY
  // ========================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ): Promise<void> => {
      event.preventDefault();


      const validationError =
        validate();


      if (
        validationError
      ) {
        toast.error(
          validationError
        );

        return;
      }


      try {
        setLoading(
          true
        );


        /*
         * FormData is required because the request
         * may contain an uploaded File.
         */
        const formData =
          new FormData();


        formData.append(
          "category",
          category
        );

        formData.append(
          "priority",
          priority
        );

        formData.append(
          "subject",
          subject.trim()
        );

        formData.append(
          "message",
          message.trim()
        );

        formData.append(
          "username",
          username
        );

        formData.append(
          "email",
          email
        );

        formData.append(
          "studentId",
          studentId
        );


        if (
          attachment
        ) {
          formData.append(
            "attachment",
            attachment
          );
        }


        const response =
          await axios.post<CreateQueryResponse>(
            `${url}/queries`,
            formData,
            config
          );


        toast.success(
          response.data.message ??
            "Your inquiry has been sent to staff!"
        );


        resetForm();
      } catch (
        error: unknown
      ) {
        /*
         * Catch values are unknown in TypeScript.
         * Narrow Axios errors before accessing
         * response.data.
         */
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          console.error(
            "Failed to send inquiry:",
            error.response?.data ??
              error.message
          );


          toast.error(
            error.response
              ?.data
              ?.message ??
              "Failed to send inquiry. Try again."
          );

          return;
        }


        console.error(
          "Failed to send inquiry:",
          error
        );


        toast.error(
          "Failed to send inquiry. Try again."
        );
      } finally {
        setLoading(
          false
        );
      }
    };


  // ========================================
  // LOAD CURRENT USER
  // ========================================

  const getUserData =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(
            true
          );


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
            axios.isAxiosError<ApiErrorResponse>(
              error
            )
          ) {
            console.error(
              "Failed to load inquiry user profile:",
              error.response?.data ??
                error.message
            );

            return;
          }


          console.error(
            "Failed to load inquiry user profile:",
            error
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
  // INITIAL PROFILE LOAD
  // ========================================

  useEffect(() => {
    void getUserData();
  }, [
    getUserData,
  ]);


  // ========================================
  // CATEGORY CHANGE
  // ========================================

  const handleCategoryChange = (
    event:
      SelectChangeEvent<QueryCategory>
  ): void => {
    setCategory(
      event.target.value as QueryCategory
    );
  };


  // ========================================
  // FILE CHANGE
  // ========================================

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    setAttachment(
      event.target.files?.[0] ??
        null
    );
  };


  // ========================================
  // UI
  // ========================================

  return (
    <Box
      sx={{
        p: {
          xs:
            1.5,

          md:
            3,
        },

        mx:
          "auto",

        height:
          "100vh",
      }}
    >
      {!token && (
        <Alert
          severity="warning"
          sx={{
            mb:
              3,

            borderRadius:
              2,
          }}
        >
          You are not logged in (token missing). Please log in again.
        </Alert>
      )}


      <Card
        elevation={
          0
        }
        sx={{
          borderRadius:
            3,

          overflow:
            "hidden",

          border:
            "1px solid #e2e8f0",

          background:
            "#ffffff",

          maxWidth:
            900,

          mx:
            "auto",
        }}
      >
        {/* ========================================
            CARD HEADER
        ======================================== */}

        <Box
          sx={{
            p: {
              xs:
                2,

              md:
                2.5,
            },

            background:
              "linear-gradient(180deg, #1f3fbf 0%, #1b2f7a 100%)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={
              1.5
            }
          >
            <Message
              sx={{
                fontSize:
                  24,

                color:
                  "white",
              }}
            />


            <Box>
              <Typography
                fontWeight={
                  700
                }
                sx={{
                  color:
                    "white",

                  lineHeight:
                    1.1,

                  fontSize:
                    22,
                }}
              >
                Raise an Inquiry
              </Typography>


              <Typography
                variant="body2"
                sx={{
                  color:
                    "#afbed3",

                  mt:
                    0.3,

                  fontSize:
                    12,
                }}
              >
                Send a question or issue to staff/admin
              </Typography>
            </Box>
          </Stack>
        </Box>


        <Divider />


        {/* ========================================
            INQUIRY FORM
        ======================================== */}

        <Box
          component="form"
          onSubmit={
            handleSubmit
          }
          sx={{
            p: {
              xs:
                2,

              md:
                2.5,
            },
          }}
        >
          <Grid
            container
            spacing={
              2
            }
            alignItems="stretch"
          >
            {/* ========================================
                USERNAME
            ======================================== */}

            <Grid
              size={{
                xs:
                  6,

                md:
                  6,
              }}
            >
              <TextField
                disabled
                label="Username *"
                value={
                  username
                }
                fullWidth
                placeholder="e.g. Attendance marked absent by mistake"
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius:
                        1.5,

                      fontSize:
                        13,

                      "& fieldset":
                        {
                          borderColor:
                            "#e2e8f0",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#3b82f6",
                        },
                    },

                  "& .MuiInputLabel-root":
                    {
                      fontSize:
                        13,
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle
                          sx={{
                            color:
                              "#3b82f6",

                            fontSize:
                              18,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>


            {/* ========================================
                EMAIL
            ======================================== */}

            <Grid
              size={{
                xs:
                  6,

                md:
                  6,
              }}
            >
              <TextField
                disabled
                fullWidth
                label="Email *"
                value={
                  email
                }
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius:
                        1.5,

                      fontSize:
                        13,

                      "& fieldset":
                        {
                          borderColor:
                            "#e2e8f0",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#3b82f6",
                        },
                    },

                  "& .MuiInputLabel-root":
                    {
                      fontSize:
                        13,
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email
                          sx={{
                            color:
                              "#3b82f6",

                            fontSize:
                              18,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>


            {/* ========================================
                CATEGORY
            ======================================== */}

            <Grid
              size={{
                xs:
                  6,

                md:
                  6,
              }}
            >
              <FormControl
                fullWidth
              >
                <InputLabel
                  sx={{
                    fontSize:
                      13,
                  }}
                >
                  Category *
                </InputLabel>


                <Select<QueryCategory>
                  label="Category *"
                  value={
                    category
                  }
                  onChange={
                    handleCategoryChange
                  }
                  sx={{
                    borderRadius:
                      1.5,

                    fontSize:
                      13,

                    "& .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor:
                          "#e2e8f0",
                      },

                    "&:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor:
                          "#3b82f6",
                      },
                  }}
                >
                  <MenuItem value="Attendance">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <EventAvailable
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#3b82f6",
                        }}
                      />

                      <span>
                        Attendance
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Payment">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <Payment
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#10b981",
                        }}
                      />

                      <span>
                        Payment
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Course">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <MenuBook
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#8b5cf6",
                        }}
                      />

                      <span>
                        Course / Batch
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Certificate">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <CardMembership
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#f59e0b",
                        }}
                      />

                      <span>
                        Certificate
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Account">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <AccountCircle
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#06b6d4",
                        }}
                      />

                      <span>
                        Account / Profile
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Technical">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <Build
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#ef4444",
                        }}
                      />

                      <span>
                        Technical Issue
                      </span>
                    </Stack>
                  </MenuItem>


                  <MenuItem value="Other">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={
                        1.5
                      }
                    >
                      <MoreHoriz
                        sx={{
                          fontSize:
                            18,

                          color:
                            "#64748b",
                        }}
                      />

                      <span>
                        Other
                      </span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>


            {/* ========================================
                SUBJECT
            ======================================== */}

            <Grid
              size={{
                xs:
                  6,

                md:
                  6,
              }}
            >
              <TextField
                label="Subject *"
                value={
                  subject
                }
                onChange={(
                  event
                ) =>
                  setSubject(
                    event.target.value
                  )
                }
                fullWidth
                placeholder="e.g. Attendance marked absent by mistake"
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius:
                        1.5,

                      fontSize:
                        13,

                      "& fieldset":
                        {
                          borderColor:
                            "#e2e8f0",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#3b82f6",
                        },
                    },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Subject
                          sx={{
                            color:
                              "#3b82f6",

                            fontSize:
                              18,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>


            {/* ========================================
                MESSAGE
            ======================================== */}

            <Grid
              size={{
                xs:
                  12,
              }}
            >
              <TextField
                label="Message *"
                value={
                  message
                }
                onChange={(
                  event
                ) =>
                  setMessage(
                    event.target.value
                  )
                }
                fullWidth
                multiline
                minRows={
                  6
                }
                placeholder="Explain what happened, date, course/batch, and what you want staff to do."
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius:
                        2,

                      "& fieldset":
                        {
                          borderColor:
                            "#e2e8f0",
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#3b82f6",
                        },
                    },
                }}
              />
            </Grid>


            {/* ========================================
                ATTACHMENT
            ======================================== */}

            <Grid
              size={{
                xs:
                  12,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={
                  1
                }
                sx={{
                  mb:
                    2,
                }}
              >
                <AttachFile
                  sx={{
                    fontSize:
                      18,

                    color:
                      "#3b82f6",
                  }}
                />

                <Typography
                  variant="subtitle1"
                  fontWeight={
                    700
                  }
                  sx={{
                    color:
                      "#0f172a",
                  }}
                >
                  Attachment (Optional)
                </Typography>
              </Stack>


              <Box
                sx={{
                  border:
                    "2px dashed",

                  borderColor:
                    attachment
                      ? "#3b82f6"
                      : "#cbd5e1",

                  borderRadius:
                    2,

                  p:
                    1,

                  textAlign:
                    "center",

                  background:
                    attachment
                      ? "#eff6ff"
                      : "#f8fafc",

                  transition:
                    "all 0.2s",

                  "&:hover":
                    {
                      borderColor:
                        "#3b82f6",

                      background:
                        "#f0f9ff",
                    },
                }}
              >
                {attachment ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={
                      2
                    }
                  >
                    <Chip
                      label={
                        attachment.name
                      }
                      onDelete={() =>
                        setAttachment(
                          null
                        )
                      }
                      deleteIcon={
                        <Close />
                      }
                      sx={{
                        maxWidth:
                          360,

                        bgcolor:
                          "#3b82f6",

                        color:
                          "white",

                        fontWeight:
                          600,

                        "& .MuiChip-deleteIcon":
                          {
                            color:
                              "white",
                          },
                      }}
                    />
                  </Stack>
                ) : (
                  <Stack
                    spacing={
                      1.5
                    }
                    alignItems="center"
                  >
                    <AttachFile
                      sx={{
                        fontSize:
                          40,

                        color:
                          "#3b82f6",

                        opacity:
                          0.5,
                      }}
                    />


                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        borderRadius:
                          2,

                        borderColor:
                          "#3b82f6",

                        color:
                          "#3b82f6",

                        textTransform:
                          "none",

                        fontWeight:
                          700,

                        "&:hover":
                          {
                            borderColor:
                              "#2563eb",

                            background:
                              "#eff6ff",
                          },
                      }}
                    >
                      Choose File

                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={
                          handleFileChange
                        }
                      />
                    </Button>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Supported formats: PDF, JPG, PNG (Max 10MB)
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Grid>


            {/* ========================================
                ACTION BUTTONS
            ======================================== */}

            <Grid
              size={{
                xs:
                  12,
              }}
            >
              <Divider
                sx={{
                  my:
                    2,
                }}
              />


              <Stack
                direction={{
                  xs:
                    "column",

                  sm:
                    "row",
                }}
                spacing={
                  2
                }
                justifyContent="flex-end"
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={
                    resetForm
                  }
                  disabled={
                    loading
                  }
                  sx={{
                    borderRadius:
                      2,

                    px:
                      4,

                    py:
                      1.4,

                    textTransform:
                      "none",

                    fontSize:
                      15,

                    fontWeight:
                      700,

                    borderColor:
                      "#cbd5e1",

                    color:
                      "#64748b",

                    "&:hover":
                      {
                        borderColor:
                          "#94a3b8",

                        background:
                          "#f8fafc",
                      },
                  }}
                >
                  Reset Form
                </Button>


                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    loading ||
                    !token
                  }
                  startIcon={
                    <Send />
                  }
                  sx={{
                    borderRadius:
                      2,

                    px:
                      4,

                    py:
                      1.4,

                    textTransform:
                      "none",

                    fontSize:
                      15,

                    fontWeight:
                      700,

                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",

                    boxShadow:
                      "0 6px 18px rgba(37, 99, 235, 0.25)",

                    "&:hover":
                      {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",

                        boxShadow:
                          "0 10px 22px rgba(37, 99, 235, 0.32)",
                      },

                    "&:disabled":
                      {
                        background:
                          "#cbd5e1",

                        color:
                          "#94a3b8",
                      },
                  }}
                >
                  {loading
                    ? "Sending..."
                    : "Submit"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default RaiseQuery;