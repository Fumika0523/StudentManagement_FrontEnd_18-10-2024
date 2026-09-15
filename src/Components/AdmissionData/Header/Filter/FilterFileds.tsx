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
  Chip,
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
  Search,
  School,
  Groups,
  Person,
  CalendarMonth,
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
  // ========================================
  // COURSE FILTER
  // ========================================

  uniqueCourses: CourseOption[];

  selectedCourse:
    | CourseOption
    | null;

  setSelectedCourse: Dispatch<
    SetStateAction<
      CourseOption | null
    >
  >;

  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // BATCH STATUS
  // ========================================

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // STUDENT NAME
  // ========================================

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // GENDER
  // ========================================

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // ========================================
  // DATE FILTER
  // ========================================

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // ========================================
  // SESSION TYPE
  // ========================================

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


// ========================================
// BATCH STATUS COLOUR TYPE
// ========================================

interface StatusColor {
  bg: string;
  text: string;
}


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
  /*
   * TypeScript:
   * dateRange is already required by the props,
   * but keeping a fallback makes this component
   * tolerant of older callers while we migrate.
   */
  const safeDateRange: DateRange =
    dateRange ?? {
      from: null,
      to: null,
    };


  const isCustom =
    datePreset === "custom";


  // ========================================
  // DATE PRESET CHANGE
  // ========================================

  const handleDatePresetChange = (
    value: string
  ): void => {
    setDatePreset(value);

    /*
     * If the user leaves Custom Range,
     * clear any manually selected dates.
     */
    if (value !== "custom") {
      setDateRange({
        from: null,
        to: null,
      });
    }
  };


  // ========================================
  // COMPACT STYLES
  // ========================================

  const labelSx = {
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


  const inputSx = {
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


  const selectSx = {
    borderRadius: "8px",

    backgroundColor:
      "#ffffff",

    fontSize: "14px",

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
  // BATCH STATUS COLOURS
  // ========================================

  const getBatchStatusColor = (
    status: string
  ): StatusColor => {
    /*
     * TypeScript:
     * Record<string, StatusColor> tells TS that
     * every object value contains bg + text.
     */
    const colors:
      Record<
        string,
        StatusColor
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


    return (
      colors[status] ?? {
        bg: "#f1f5f9",
        text: "#475569",
      }
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

        {/*
         * MUI v7:
         * Use the `size` prop for responsive Grid sizes.
         *
         * The original JSX used `xs={{...}}` here,
         * which was inconsistent with the other Grid
         * components and would cause a TS error.
         */}
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 6,
            lg: 2.4,
          }}
        >
          <Typography
            sx={labelSx}
          >
            <Person
              sx={{
                fontSize: 16,
              }}
            />

            Student Name
          </Typography>

          <TextField
            size="small"
            value={studentName}
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
                fontSize: 16,
              }}
            />

            Course Name
          </Typography>


          {/*
           * TypeScript:
           *
           * Because freeSolo is enabled, MUI may return:
           *
           *   CourseOption
           *   string
           *   null
           *
           * Our selectedCourse state intentionally stores only
           * CourseOption | null.
           *
           * If the user types free text, we store that text in
           * courseInput instead.
           */}
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
              if (
                typeof value ===
                "string"
              ) {
                /*
                 * A free-typed course is handled by
                 * courseInput rather than selectedCourse.
                 */
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
                fontSize: 16,
              }}
            />

            Batch Status
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={
                batchStatus
              }
              onChange={(
                event
              ) =>
                setBatchStatus(
                  event.target
                    .value
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
                  All Statuses
                </em>
              </MenuItem>


              <MenuItem value="In Progress">
                <Chip
                  label="In Progress"
                  size="small"
                  sx={{
                    backgroundColor:
                      getBatchStatusColor(
                        "In Progress"
                      ).bg,

                    color:
                      getBatchStatusColor(
                        "In Progress"
                      ).text,

                    fontWeight:
                      600,

                    fontSize:
                      "11px",

                    height:
                      "22px",
                  }}
                />
              </MenuItem>


              <MenuItem value="Training Completed">
                <Chip
                  label="Training Completed"
                  size="small"
                  sx={{
                    backgroundColor:
                      getBatchStatusColor(
                        "Training Completed"
                      ).bg,

                    color:
                      getBatchStatusColor(
                        "Training Completed"
                      ).text,

                    fontWeight:
                      600,

                    fontSize:
                      "11px",

                    height:
                      "22px",
                  }}
                />
              </MenuItem>


              <MenuItem value="Batch Completed">
                <Chip
                  label="Batch Completed"
                  size="small"
                  sx={{
                    backgroundColor:
                      getBatchStatusColor(
                        "Batch Completed"
                      ).bg,

                    color:
                      getBatchStatusColor(
                        "Batch Completed"
                      ).text,

                    fontWeight:
                      600,

                    fontSize:
                      "11px",

                    height:
                      "22px",
                  }}
                />
              </MenuItem>


              <MenuItem value="Not Started">
                <Chip
                  label="Not Started"
                  size="small"
                  sx={{
                    backgroundColor:
                      getBatchStatusColor(
                        "Not Started"
                      ).bg,

                    color:
                      getBatchStatusColor(
                        "Not Started"
                      ).text,

                    fontWeight:
                      600,

                    fontSize:
                      "11px",

                    height:
                      "22px",
                  }}
                />
              </MenuItem>
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
                fontSize: 16,
              }}
            />

            Gender
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={
                genderFilter
              }
              onChange={(
                event
              ) =>
                setGenderFilter(
                  event.target
                    .value
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
              onChange={(
                event
              ) =>
                setSessionType(
                  event.target
                    .value
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


              <MenuItem value="Offline">
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
                fontSize: 16,
              }}
            />

            Created Date
          </Typography>

          <FormControl
            size="small"
            fullWidth
          >
            <Select
              value={
                datePreset
              }
              onChange={(
                event
              ) =>
                handleDatePresetChange(
                  event.target
                    .value
                )
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
            CUSTOM DATE RANGE - FROM
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
              sx={labelSx}
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

                      /*
                       * filterUtils.DateRange accepts Date,
                       * string, null, or undefined.
                       *
                       * DatePicker gives us Dayjs, so convert
                       * it into a normal JavaScript Date.
                       */
                      from:
                        value
                          ? value.toDate()
                          : null,
                    })
                  );
                }}
                slotProps={{
                  textField: {
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
            CUSTOM DATE RANGE - TO
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
              sx={labelSx}
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
                  textField: {
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