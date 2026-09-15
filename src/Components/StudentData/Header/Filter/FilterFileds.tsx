import type {
  Dispatch,
  SetStateAction,
} from "react";

import Grid from "@mui/material/Grid";

import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import type {
  SelectChangeEvent,
  SxProps,
  Theme,
} from "@mui/material";

import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

import {
  AdapterDayjs,
} from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import {
  CalendarMonth,
  Groups,
  Person,
  School,
  Search,
  Wifi,
  WifiOff,
} from "@mui/icons-material";

import type {
  CourseOption,
  DateRange,
} from "../../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface FilterFieldsProps {
  /*
   * Course dropdown options are produced by
   * buildCourseOptions() in filterUtils.
   */
  uniqueCourses: CourseOption[];

  selectedCourse: CourseOption | null;

  setSelectedCourse: Dispatch<
    SetStateAction<CourseOption | null>
  >;

  /*
   * freeSolo Autocomplete text is stored separately
   * from the selected CourseOption.
   */
  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;


  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


// ========================================
// BATCH STATUS COLOURS
// ========================================

interface StatusColour {
  bg: string;

  text: string;
}


const BATCH_STATUS_COLOURS:
  Record<
    string,
    StatusColour
  > = {
  "In Progress": {
    bg: "#dbeafe",
    text: "#1e40af",
  },

  "Training Completed": {
    bg: "#d1fae5",
    text: "#065f46",
  },

  "Batch Completed": {
    bg: "#e0e7ff",
    text: "#4338ca",
  },

  "Not Started": {
    bg: "#fee2e2",
    text: "#991b1b",
  },
};


// ========================================
// SHARED STYLES
// ========================================

/*
 * TypeScript:
 * Explicit SxProps<Theme> types make these objects
 * safe to pass into MUI's sx prop.
 */
const labelSx:
  SxProps<Theme> = {
  fontSize: 12,

  fontWeight: 600,

  mb: 0.1,

  color: "#475569",

  letterSpacing:
    "0.025em",

  display: "flex",

  alignItems: "center",

  gap: 0.5,
};


const inputSx:
  SxProps<Theme> = {
  "& .MuiOutlinedInput-root":
    {
      borderRadius:
        "8px",

      backgroundColor:
        "#ffffff",

      fontSize:
        "14px",

      transition:
        "all 0.2s ease",

      "&:hover": {
        backgroundColor:
          "#f8fafc",

        "& .MuiOutlinedInput-notchedOutline":
          {
            borderColor:
              "#3b82f6",
          },
      },

      "&.Mui-focused": {
        backgroundColor:
          "#ffffff",

        "& .MuiOutlinedInput-notchedOutline":
          {
            borderColor:
              "#3b82f6",

            borderWidth:
              "2px",
          },
      },
    },

  "& .MuiOutlinedInput-notchedOutline":
    {
      borderColor:
        "#e2e8f0",
    },
};


const selectSx:
  SxProps<Theme> = {
  borderRadius:
    "8px",

  backgroundColor:
    "#ffffff",

  fontSize:
    "14px",

  transition:
    "all 0.2s ease",

  "&:hover": {
    backgroundColor:
      "#f8fafc",

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "#3b82f6",
      },
  },

  "&.Mui-focused": {
    backgroundColor:
      "#ffffff",

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "#3b82f6",

        borderWidth:
          "2px",
      },
  },

  "& .MuiOutlinedInput-notchedOutline":
    {
      borderColor:
        "#e2e8f0",
    },
};


// ========================================
// STATUS COLOUR HELPER
// ========================================

const getBatchStatusColor = (
  status: string
): StatusColour => {
  return (
    BATCH_STATUS_COLOURS[
      status
    ] ?? {
      bg: "#f1f5f9",

      text: "#475569",
    }
  );
};


// ========================================
// COMPONENT
// ========================================

const FilterFields = ({
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  batchStatus,
  setBatchStatus,
  studentName,
  setStudentName,
  genderFilter,
  setGenderFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
  sessionType,
  setSessionType,
}: FilterFieldsProps) => {
  // ========================================
  // DATE FILTER
  // ========================================

  const safeDateRange:
    DateRange =
    dateRange ?? {
      from: null,

      to: null,
    };


  const isCustom =
    datePreset ===
    "custom";


  const handleDatePresetChange = (
    value: string
  ): void => {
    setDatePreset(
      value
    );


    /*
     * If the user switches away from Custom Range,
     * clear any previously selected dates.
     */
    if (
      value !==
      "custom"
    ) {
      setDateRange({
        from: null,

        to: null,
      });
    }
  };


  // ========================================
  // SELECT CHANGE HANDLERS
  // ========================================

  const handleBatchStatusChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    setBatchStatus(
      event.target.value
    );
  };


  const handleGenderChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    setGenderFilter(
      event.target.value
    );
  };


  const handleSessionTypeChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    setSessionType(
      event.target.value
    );
  };


  const handlePresetSelectChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    handleDatePresetChange(
      event.target.value
    );
  };


  return (
    <Box>
      <Grid
        container
        spacing={1.5}
      >
        {/* ========================================
            STUDENT NAME
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <Person
              sx={{
                fontSize:
                  16,
              }}
            />

            Student Name
          </Typography>


          <TextField
            size="small"
            value={
              studentName
            }
            onChange={(
              event
            ) =>
              setStudentName(
                event.target.value
              )
            }
            placeholder="Search by name..."
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
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
              },
            }}
          />
        </Grid>


        {/* ========================================
            COURSE NAME
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <School
              sx={{
                fontSize:
                  16,
              }}
            />

            Course Name
          </Typography>


          <Autocomplete
            freeSolo
            options={
              uniqueCourses
            }
            getOptionLabel={(
              option
            ) =>
              typeof option ===
              "string"
                ? option
                : option.label
            }
            value={
              selectedCourse
            }
            inputValue={
              courseInput
            }
            onInputChange={(
              _event,
              value
            ) => {
              setCourseInput(
                value
              );
            }}
            onChange={(
              _event,
              value
            ) => {
              /*
               * freeSolo can return either a typed
               * string or a CourseOption object.
               *
               * We keep typed text in courseInput and
               * only store real options in selectedCourse.
               */
              if (
                typeof value ===
                "string"
              ) {
                setSelectedCourse(
                  null
                );

                setCourseInput(
                  value
                );

                return;
              }


              setSelectedCourse(
                value
              );
            }}
            renderInput={(
              params
            ) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select course..."
                fullWidth
                sx={inputSx}
              />
            )}
            sx={{
              "& .MuiAutocomplete-popupIndicator":
                {
                  color:
                    "#94a3b8",
                },
            }}
          />
        </Grid>


        {/* ========================================
            BATCH STATUS
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <Groups
              sx={{
                fontSize:
                  16,
              }}
            />

            Batch Status
          </Typography>


          <FormControl
            size="small"
            fullWidth
          >
            <Select<string>
              value={
                batchStatus
              }
              onChange={
                handleBatchStatusChange
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
                  All Statuses
                </em>
              </MenuItem>


              {[
                "In Progress",
                "Training Completed",
                "Batch Completed",
                "Not Started",
              ].map(
                (
                  status
                ) => {
                  const colours =
                    getBatchStatusColor(
                      status
                    );


                  return (
                    <MenuItem
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      <Chip
                        label={
                          status
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            colours.bg,

                          color:
                            colours.text,

                          fontWeight:
                            600,

                          fontSize:
                            "11px",

                          height:
                            "22px",
                        }}
                      />
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            GENDER
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <Person
              sx={{
                fontSize:
                  16,
              }}
            />

            Gender
          </Typography>


          <FormControl
            size="small"
            fullWidth
          >
            <Select<string>
              value={
                genderFilter
              }
              onChange={
                handleGenderChange
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
                  All Genders
                </em>
              </MenuItem>

              <MenuItem value="Female">
                Female
              </MenuItem>

              <MenuItem value="Male">
                Male
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
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <Wifi
              sx={{
                fontSize:
                  16,
              }}
            />

            Session Type
          </Typography>


          <FormControl
            size="small"
            fullWidth
          >
            <Select<string>
              value={
                sessionType
              }
              onChange={
                handleSessionTypeChange
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

                    gap:
                      1,
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


              <MenuItem value="Offline">
                <Box
                  sx={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      1,
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

                  Offline
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            CREATED DATE PRESET
        ======================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <CalendarMonth
              sx={{
                fontSize:
                  16,
              }}
            />

            Created Date
          </Typography>


          <FormControl
            size="small"
            fullWidth
          >
            <Select<string>
              value={
                datePreset
              }
              onChange={
                handlePresetSelectChange
              }
              sx={selectSx}
              displayEmpty
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
                  All Dates
                </em>
              </MenuItem>

              <MenuItem value="today">
                📅 Today
              </MenuItem>

              <MenuItem value="7d">
                📊 Last 7 days
              </MenuItem>

              <MenuItem value="30d">
                📈 Last 30 days
              </MenuItem>

              <MenuItem value="month">
                🗓️ This month
              </MenuItem>

              <MenuItem value="year">
                📆 This year
              </MenuItem>

              <MenuItem value="custom">
                🎯 Custom range
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            CUSTOM DATE - FROM
        ======================================== */}

        {isCustom && (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 2.4,
            }}
          >
            <Typography
              sx={
                labelSx
              }
            >
              <CalendarMonth
                sx={{
                  fontSize:
                    16,
                }}
              />

              From Date
            </Typography>


            <LocalizationProvider
              dateAdapter={
                AdapterDayjs
              }
            >
              <DatePicker
                value={
                  safeDateRange.from
                    ? dayjs(
                        safeDateRange.from
                      )
                    : null
                }
                onChange={(
                  value
                ) => {
                  setDateRange(
                    (
                      previous
                    ) => ({
                      ...previous,

                      from:
                        value
                          ? value.toDate()
                          : null,
                    })
                  );
                }}
                slotProps={{
                  textField:
                    {
                      size:
                        "small",

                      fullWidth:
                        true,

                      sx:
                        inputSx,

                      placeholder:
                        "Start date",
                    },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}


        {/* ========================================
            CUSTOM DATE - TO
        ======================================== */}

        {isCustom && (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 2.4,
            }}
          >
            <Typography
              sx={
                labelSx
              }
            >
              <CalendarMonth
                sx={{
                  fontSize:
                    16,
                }}
              />

              To Date
            </Typography>


            <LocalizationProvider
              dateAdapter={
                AdapterDayjs
              }
            >
              <DatePicker
                value={
                  safeDateRange.to
                    ? dayjs(
                        safeDateRange.to
                      )
                    : null
                }
                onChange={(
                  value
                ) => {
                  setDateRange(
                    (
                      previous
                    ) => ({
                      ...previous,

                      to:
                        value
                          ? value.toDate()
                          : null,
                    })
                  );
                }}
                slotProps={{
                  textField:
                    {
                      size:
                        "small",

                      fullWidth:
                        true,

                      sx:
                        inputSx,

                      placeholder:
                        "End date",
                    },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FilterFields;