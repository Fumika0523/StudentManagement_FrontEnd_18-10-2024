import { useMemo } from "react";
import type {
  Dispatch,
  SetStateAction,
} from "react";

import Grid from "@mui/material/Grid";

import {
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";

import {
  Search,
  School,
  LocationOn,
  Wifi,
  WifiOff,
  Tag,
  CheckCircle,
  Person,
  Today,
} from "@mui/icons-material";

// TypeScript:
// Reuse our shared Batch and Course types so this component
// knows exactly which properties are available.
import type { Batch } from "../../../../types/batch";
import type { Course } from "../../../../types/course";


// ========================================
// COMPONENT PROPS
// ========================================

interface BatchFilterFieldsProps {
  batchNumber: string;
  setBatchNumber: Dispatch<
    SetStateAction<string>
  >;

  courseName: string;
  setCourseName: Dispatch<
    SetStateAction<string>
  >;

  location: string;
  setLocation: Dispatch<
    SetStateAction<string>
  >;

  createdBy: string;
  setCreatedBy: Dispatch<
    SetStateAction<string>
  >;

  status: string;
  setStatus: Dispatch<
    SetStateAction<string>
  >;

  sessionType: string;
  setSessionType: Dispatch<
    SetStateAction<string>
  >;

  sessionDay: string;
  setSessionDay: Dispatch<
    SetStateAction<string>
  >;

  // Data used to build autocomplete options.
  batchData: Batch[];
  courseData: Course[];
}


// ========================================
// TYPE GUARD
// ========================================

/*
 * TypeScript:
 * filter(Boolean) works in JavaScript, but TypeScript
 * does not always narrow:
 *
 * (string | undefined)[]
 *
 * into:
 *
 * string[]
 *
 * This custom type guard tells TypeScript that after
 * filtering, the remaining values are definitely strings.
 */
const isNonEmptyString = (
  value: string | undefined | null
): value is string => {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
};


const BatchFilterFields = ({
  // Filter values
  batchNumber,
  setBatchNumber,

  courseName,
  setCourseName,

  location,
  setLocation,

  createdBy,
  setCreatedBy,

  status,
  setStatus,

  sessionType,
  setSessionType,

  sessionDay,
  setSessionDay,

  // Data for dropdowns
  batchData,
  courseData,
}: BatchFilterFieldsProps) => {
  // ========================================
  // UNIQUE AUTOCOMPLETE OPTIONS
  // ========================================

  /*
   * TypeScript:
   * useMemo<string[]> makes it clear that these options
   * must always be an array of strings.
   */
  const uniqueCourseNames =
    useMemo<string[]>(() => {
      return [
        ...new Set(
          courseData
            .map(
              (course) =>
                course.courseName
            )
            .filter(isNonEmptyString)
        ),
      ].sort((a, b) =>
        a.localeCompare(b)
      );
    }, [courseData]);


  const uniqueLocations =
    useMemo<string[]>(() => {
      return [
        ...new Set(
          batchData
            .map(
              (batch) =>
                batch.location
            )
            .filter(isNonEmptyString)
        ),
      ].sort((a, b) =>
        a.localeCompare(b)
      );
    }, [batchData]);


  const uniqueBatchNumbers =
    useMemo<string[]>(() => {
      return [
        ...new Set(
          batchData
            .map(
              (batch) =>
                batch.batchNumber
            )
            .filter(isNonEmptyString)
        ),
      ].sort((a, b) =>
        a.localeCompare(b)
      );
    }, [batchData]);


  // ========================================
  // SHARED STYLES
  // ========================================

  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.5,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",

      "&:hover .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "#3b82f6",
        },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "#3b82f6",
          borderWidth: "2px",
        },
    },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "#e2e8f0",
      },
  };

  const selectSx = {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "14px",

    "&:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "#3b82f6",
      },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "#e2e8f0",
      },
  };


  return (
    <Box>
      <Grid
        container
        spacing={1.5}
      >
        {/* ========================================
            BATCH NUMBER
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <Tag sx={{ fontSize: 16 }} />
            Batch Number
          </Typography>

          {/*
           * TypeScript:
           * Because options is string[],
           * MUI can infer newValue as string | null.
           *
           * freeSolo also allows the user to type
           * a value that is not already in the options.
           */}
          <Autocomplete
            freeSolo
            options={
              uniqueBatchNumbers
            }
            value={batchNumber}
            onChange={(
              _event,
              newValue
            ) =>
              setBatchNumber(
                newValue || ""
              )
            }
            onInputChange={(
              _event,
              newInputValue
            ) =>
              setBatchNumber(
                newInputValue
              )
            }
            renderInput={(
              params
            ) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search batch number..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,

                  startAdornment:
                    (
                      <>
                        <InputAdornment position="start">
                          <Search
                            sx={{
                              color:
                                "#94a3b8",
                              fontSize:
                                18,
                            }}
                          />
                        </InputAdornment>

                        {
                          params
                            .InputProps
                            .startAdornment
                        }
                      </>
                    ),
                }}
              />
            )}
          />
        </Grid>


        {/* ========================================
            COURSE NAME
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <School
              sx={{
                fontSize: 16,
              }}
            />
            Course Name
          </Typography>

          <Autocomplete
            freeSolo
            options={
              uniqueCourseNames
            }
            value={courseName}
            onChange={(
              _event,
              newValue
            ) =>
              setCourseName(
                newValue || ""
              )
            }
            onInputChange={(
              _event,
              newInputValue
            ) =>
              setCourseName(
                newInputValue
              )
            }
            renderInput={(
              params
            ) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select or type course..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,

                  startAdornment:
                    (
                      <>
                        <InputAdornment position="start">
                          <Search
                            sx={{
                              color:
                                "#94a3b8",
                              fontSize:
                                18,
                            }}
                          />
                        </InputAdornment>

                        {
                          params
                            .InputProps
                            .startAdornment
                        }
                      </>
                    ),
                }}
              />
            )}
          />
        </Grid>


        {/* ========================================
            LOCATION
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <LocationOn
              sx={{
                fontSize: 16,
              }}
            />
            Location
          </Typography>

          <Autocomplete
            freeSolo
            options={
              uniqueLocations
            }
            value={location}
            onChange={(
              _event,
              newValue
            ) =>
              setLocation(
                newValue || ""
              )
            }
            onInputChange={(
              _event,
              newInputValue
            ) =>
              setLocation(
                newInputValue
              )
            }
            renderInput={(
              params
            ) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search location..."
                fullWidth
                sx={inputSx}
                InputProps={{
                  ...params.InputProps,

                  startAdornment:
                    (
                      <>
                        <InputAdornment position="start">
                          <Search
                            sx={{
                              color:
                                "#94a3b8",
                              fontSize:
                                18,
                            }}
                          />
                        </InputAdornment>

                        {
                          params
                            .InputProps
                            .startAdornment
                        }
                      </>
                    ),
                }}
              />
            )}
          />
        </Grid>


        {/* ========================================
            CREATED BY
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <Person
              sx={{
                fontSize: 16,
              }}
            />
            Created By
          </Typography>

          <TextField
            size="small"
            fullWidth
            value={createdBy}
            /*
             * TypeScript:
             * MUI infers this as the correct
             * input change event, so e.target.value
             * is safely typed as string.
             */
            onChange={(event) =>
              setCreatedBy(
                event.target.value
              )
            }
            placeholder="Enter creator name..."
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color:
                        "#94a3b8",
                      fontSize:
                        18,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>


        {/* ========================================
            STATUS
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <CheckCircle
              sx={{
                fontSize: 16,
              }}
            />
            Status
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "14px",
                  }}
                >
                  All Status
                </em>
              </MenuItem>

              <MenuItem value="Not Started">
                Not Started
              </MenuItem>

              <MenuItem value="In Progress">
                In Progress
              </MenuItem>

              <MenuItem value="Training Completed">
                Training Completed
              </MenuItem>

              <MenuItem value="Batch Completed">
                Batch Completed
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            SESSION TYPE
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <Wifi
              sx={{
                fontSize: 16,
              }}
            />
            Session Type
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={
                sessionType
              }
              onChange={(event) =>
                setSessionType(
                  event.target.value
                )
              }
              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "14px",
                  }}
                >
                  All Types
                </em>
              </MenuItem>

              <MenuItem value="Online">
                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >
                  <Wifi
                    sx={{
                      fontSize:
                        16,
                      color:
                        "#059669",
                    }}
                  />

                  Online
                </Box>
              </MenuItem>

              <MenuItem value="At School">
                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1,
                  }}
                >
                  <WifiOff
                    sx={{
                      fontSize:
                        16,
                      color:
                        "#dc2626",
                    }}
                  />

                  At School
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            SESSION DAY
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Typography sx={labelSx}>
            <Today
              sx={{
                fontSize: 16,
              }}
            />
            Session Day
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={sessionDay}
              onChange={(event) =>
                setSessionDay(
                  event.target.value
                )
              }
              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "14px",
                  }}
                >
                  All Days
                </em>
              </MenuItem>

              <MenuItem value="Weekday">
                📅 Weekday
              </MenuItem>

              <MenuItem value="Weekend">
                🎉 Weekend
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BatchFilterFields;