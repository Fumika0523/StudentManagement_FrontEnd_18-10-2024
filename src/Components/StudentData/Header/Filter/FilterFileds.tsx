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

/*
  SxProps and Theme are MUI types.

  We use them to tell TypeScript that our reusable style
  objects are valid values for MUI's `sx` prop.
*/
import type {
  SxProps,
  Theme,
  SelectChangeEvent,
} from "@mui/material";

import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

import dayjs from "dayjs";

/*
  Dayjs is imported only as a TypeScript type.

  The MUI DatePicker uses Dayjs because we are using:
    AdapterDayjs
*/
import type { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Search,
  School,
  Groups,
  Person,
  CalendarMonth,
  Wifi,
  WifiOff,
} from "@mui/icons-material";


/*
  This represents one option in the Course Autocomplete.

  Example:

    {
      label: "Full Stack Development",
      id: "67abc123..."
    }
*/
interface CourseOption {
  label: string;
  id: string;
}


/*
  Our React state stores normal JavaScript Date objects.

  Either value may be null when the user has not selected a date.
*/
interface DateRange {
  from: Date | null;
  to: Date | null;
}


/*
  Props received from StudentFilter.tsx.

  Notice how the type of every state value matches
  the type of its corresponding React setter.
*/
interface FilterFieldsProps {
  // -----------------------------
  // Course
  // -----------------------------

  uniqueCourses: CourseOption[];

  selectedCourse: CourseOption | null;

  setSelectedCourse: Dispatch<
    SetStateAction<CourseOption | null>
  >;

  courseInput: string;

  setCourseInput: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Batch
  // -----------------------------

  batchStatus: string;

  setBatchStatus: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Student
  // -----------------------------

  studentName: string;

  setStudentName: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Gender
  // -----------------------------

  genderFilter: string;

  setGenderFilter: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Date
  // -----------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;


  // -----------------------------
  // Session Type
  // -----------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;
}


/*
  Small type used by getBatchStatusColor().

  Both properties are CSS colour strings.
*/
interface StatusColor {
  bg: string;
  text: string;
}


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
    dateRange should always exist because its state is typed
    as DateRange.

    We keep this fallback because the old JavaScript code had it,
    but TypeScript now knows safeDateRange definitely has:

      from
      to
  */
  const safeDateRange: DateRange =
    dateRange ?? {
      from: null,
      to: null,
    };


  /*
    TypeScript infers this as boolean.

    isCustom === true
    only when datePreset is "custom".
  */
  const isCustom =
    datePreset === "custom";


  /*
    `value` must be a string.

    Examples:
      ""
      "today"
      "7d"
      "30d"
      "month"
      "year"
      "custom"
  */
  const handleDatePresetChange = (
    value: string
  ): void => {
    setDatePreset(value);

    /*
      If the user leaves custom mode,
      clear any manually selected dates.
    */
    if (value !== "custom") {
      setDateRange({
        from: null,
        to: null,
      });
    }
  };


  /*
    MUI Select provides a SelectChangeEvent.

    `SelectChangeEvent<string>` tells TypeScript that:

      event.target.value

    is expected to contain a string.
  */
  const handleBatchStatusChange = (
    event: SelectChangeEvent<string>
  ): void => {
    setBatchStatus(event.target.value);
  };


  const handleGenderChange = (
    event: SelectChangeEvent<string>
  ): void => {
    setGenderFilter(event.target.value);
  };


  const handleSessionTypeChange = (
    event: SelectChangeEvent<string>
  ): void => {
    setSessionType(event.target.value);
  };


  const handleDatePresetSelectChange = (
    event: SelectChangeEvent<string>
  ): void => {
    handleDatePresetChange(
      event.target.value
    );
  };


  /*
    These are MUI `sx` style objects.

    SxProps<Theme> tells TypeScript:
      "this object must be valid MUI styling."
  */
  const labelSx: SxProps<Theme> = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.1,
    color: "#475569",
    letterSpacing: "0.025em",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };


  const inputSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      transition: "all 0.2s ease",

      "&:hover": {
        backgroundColor: "#f8fafc",

        "& .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#3b82f6",
          },
      },

      "&.Mui-focused": {
        backgroundColor: "#ffffff",

        "& .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#3b82f6",
            borderWidth: "2px",
          },
      },
    },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "#e2e8f0",
      },
  };


  const selectSx: SxProps<Theme> = {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#f8fafc",

      "& .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "#3b82f6",
        },
    },

    "&.Mui-focused": {
      backgroundColor: "#ffffff",

      "& .MuiOutlinedInput-notchedOutline":
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


  /*
    Record<string, StatusColor> means:

      every key is a string

      and every value must look like:

        {
          bg: string,
          text: string
        }
  */
  const getBatchStatusColor = (
    status: string
  ): StatusColor => {
    const colors: Record<
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


    /*
      If the supplied status does not exist in `colors`,
      return our default colour.
    */
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
        {/* =====================================
            Student Name
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography sx={labelSx}>
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

            /*
              Because this is a TextField,
              TypeScript understands `event.target.value`
              is a string.

              Therefore it can safely be passed into:
                setStudentName(...)
            */
            onChange={(event) =>
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
                      color: "#94a3b8",
                      fontSize: 18,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>


        {/* =====================================
            Course Name
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
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
            /*
              `freeSolo` means the user is allowed
              to type text that is NOT one of the options.

              Because of that, Autocomplete may give us:

                CourseOption
                string
                null

              rather than only CourseOption.
            */
            freeSolo

            options={
              uniqueCourses ?? []
            }

            /*
              `option` can be:

                string
                OR
                CourseOption

              because freeSolo is enabled.
            */
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : option.label
            }

            value={selectedCourse}

            inputValue={courseInput}


            /*
              `value` here is simply the text currently
              displayed inside the input box.
            */
            onInputChange={(
              _event,
              value
            ) => {
              setCourseInput(value);
            }}


            /*
              Because freeSolo is enabled,
              `value` can be:

                CourseOption
                string
                null

              Our selectedCourse state accepts only:

                CourseOption | null

              Therefore we explicitly handle strings.

              If the user types their own text:
                - keep it in courseInput
                - selectedCourse becomes null

              matchesSelectedCourse() can then filter using
              the typed courseInput text.
            */
            onChange={(
              _event,
              value
            ) => {
              if (
                typeof value === "string"
              ) {
                setCourseInput(value);
                setSelectedCourse(null);
                return;
              }

              setSelectedCourse(value);
            }}


            renderInput={(params) => (
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
                  color: "#94a3b8",
                },
            }}
          />
        </Grid>


        {/* =====================================
            Batch Status
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography sx={labelSx}>
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
              value={batchStatus}

              /*
                We created a properly typed
                SelectChangeEvent handler above.
              */
              onChange={
                handleBatchStatusChange
              }

              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
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

                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
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

                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
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

                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
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

                    fontWeight: 600,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* =====================================
            Gender
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography sx={labelSx}>
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
              value={genderFilter}
              onChange={
                handleGenderChange
              }
              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
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


        {/* =====================================
            Session Type
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
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
              value={sessionType}
              onChange={
                handleSessionTypeChange
              }
              sx={selectSx}
            >
              <MenuItem value="">
                <em
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  All Types
                </em>
              </MenuItem>


              <MenuItem value="Online">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Wifi
                    sx={{
                      fontSize: 16,
                      color: "#059669",
                    }}
                  />

                  Online
                </Box>
              </MenuItem>


              <MenuItem value="Offline">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <WifiOff
                    sx={{
                      fontSize: 16,
                      color: "#dc2626",
                    }}
                  />

                  Offline
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* =====================================
            Created Date Preset
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <Typography sx={labelSx}>
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
              value={datePreset || ""}
              onChange={
                handleDatePresetSelectChange
              }
              sx={selectSx}
              displayEmpty
            >
              <MenuItem value="">
                <em
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
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


        {/* =====================================
            Custom Date Range - FROM
        ====================================== */}

        {isCustom && (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 2.4,
            }}
          >
            <Typography sx={labelSx}>
              <CalendarMonth
                sx={{
                  fontSize: 16,
                }}
              />

              From Date
            </Typography>


            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <DatePicker
                /*
                  MUI DatePicker expects Dayjs because
                  we're using AdapterDayjs.

                  Our application state stores Date.

                  Therefore:

                    Date
                      ↓
                    dayjs(Date)
                      ↓
                    Dayjs
                */
                value={
                  safeDateRange.from
                    ? dayjs(
                        safeDateRange.from
                      )
                    : null
                }

                /*
                  The DatePicker gives us:
                    Dayjs | null

                  But our React state wants:
                    Date | null

                  Therefore:
                    value.toDate()

                  converts Dayjs → normal JavaScript Date.
                */
                onChange={(
                  value: Dayjs | null
                ) => {
                  setDateRange(
                    (previousRange) => ({
                      ...previousRange,

                      from: value
                        ? value.toDate()
                        : null,
                    })
                  );
                }}

                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
                    placeholder:
                      "Start date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}


        {/* =====================================
            Custom Date Range - TO
        ====================================== */}

        {isCustom && (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 2.4,
            }}
          >
            <Typography sx={labelSx}>
              <CalendarMonth
                sx={{
                  fontSize: 16,
                }}
              />

              To Date
            </Typography>


            <LocalizationProvider
              dateAdapter={AdapterDayjs}
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
                  value: Dayjs | null
                ) => {
                  setDateRange(
                    (previousRange) => ({
                      ...previousRange,

                      to: value
                        ? value.toDate()
                        : null,
                    })
                  );
                }}

                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputSx,
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