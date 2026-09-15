import {
  useMemo,
  type Dispatch,
  type SetStateAction,
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

/*
  MUI provides its own event type for Select components.

  We also type our sx style objects with SxProps<Theme>.
*/
import type {
  SelectChangeEvent,
  SxProps,
  Theme,
} from "@mui/material";

import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Search,
  School,
  CalendarMonth,
  Wifi,
  WifiOff,
} from "@mui/icons-material";

/*
  Reuse our shared Course interface.

  We do NOT define Course again inside this component.
*/
import type {
  Course,
} from "../../../../types/course";

/*
  Reuse the DateRange type already shared by:
    ViewCourse
    Header
    CourseFilter
    FilterFields
*/
import type {
  DateRange,
} from "../../../utils/filterUtils";


/* =========================================================
   Props
========================================================= */

/*
  This interface describes everything FilterFields
  receives from CourseFilter.tsx.
*/
interface FilterFieldsProps {
  // -----------------------------
  // Course Name
  // -----------------------------

  courseName: string;

  setCourseName: Dispatch<
    SetStateAction<string>
  >;

  /*
    Course data comes from the backend
    and is already typed as Course[].
  */
  courseData: Course[];


  // -----------------------------
  // Session Type
  // -----------------------------

  sessionType: string;

  setSessionType: Dispatch<
    SetStateAction<string>
  >;


  // -----------------------------
  // Date Filter
  // -----------------------------

  datePreset: string;

  setDatePreset: Dispatch<
    SetStateAction<string>
  >;

  dateRange: DateRange;

  setDateRange: Dispatch<
    SetStateAction<DateRange>
  >;
}


const FilterFields = ({
  courseName,
  setCourseName,

  courseData,

  sessionType,
  setSessionType,

  datePreset,
  setDatePreset,

  dateRange,
  setDateRange,
}: FilterFieldsProps) => {
  /*
    TypeScript already knows dateRange follows DateRange,
    so we don't really need:

      dateRange || { ... }

    anymore.

    We can use it directly.
  */
  const safeDateRange = dateRange;


  /*
    TypeScript infers boolean here.

    true when:
      datePreset === "custom"
  */
  const isCustom =
    datePreset === "custom";


  /* =========================================================
     Date Preset
  ========================================================= */

  /*
    The function accepts a string and returns nothing useful,
    therefore the return type is void.
  */
  const handleDatePresetChange = (
    value: string
  ): void => {
    setDatePreset(value);

    /*
      When the user switches away from Custom,
      clear the manually selected dates.
    */
    if (value !== "custom") {
      setDateRange({
        from: null,
        to: null,
      });
    }
  };


  /*
    MUI Select provides SelectChangeEvent<string>.

    This tells TypeScript:
      event.target.value is a string.
  */
  const handleSessionTypeChange = (
    event: SelectChangeEvent<string>
  ): void => {
    setSessionType(
      event.target.value
    );
  };


  const handleDatePresetSelectChange = (
    event: SelectChangeEvent<string>
  ): void => {
    handleDatePresetChange(
      event.target.value
    );
  };


  /* =========================================================
     Unique Course Names
  ========================================================= */

  /*
    useMemo<string[]> means this calculation must return
    an array of strings.

    Example:

      [
        "Full Stack Development",
        "Java",
        "Python"
      ]

    Because Course.courseName is already typed as string,
    we no longer need:
      c?.courseName
      .filter(Boolean)
  */
  const uniqueCourseNames =
    useMemo<string[]>(() => {
      /*
        Set automatically removes duplicate course names.

        Example:

          ["Java", "Java", "React"]

        becomes:

          ["Java", "React"]
      */
      const uniqueNames =
        new Set(
          courseData.map(
            (course) =>
              course.courseName
          )
        );

      /*
        Convert Set back into an array
        and sort alphabetically.
      */
      return Array.from(
        uniqueNames
      ).sort((a, b) =>
        a.localeCompare(b)
      );
    }, [courseData]);


  /* =========================================================
     MUI Styles
  ========================================================= */

  /*
    SxProps<Theme> tells TypeScript that these objects
    are valid values for MUI's `sx` property.
  */
  const labelSx: SxProps<Theme> = {
    fontSize: 12,
    fontWeight: 600,
    mb: 0.5,
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


  return (
    <Box>
      <Grid
        container
        spacing={1.5}
      >
        {/* =====================================
            Course Name
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
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
              freeSolo means the user can either:

                choose an existing course

              OR

                type any course name manually.
            */
            freeSolo

            /*
              uniqueCourseNames is string[].

              Therefore our autocomplete options
              are simple strings rather than objects.
            */
            options={uniqueCourseNames}

            /*
              courseName itself is also a string.
            */
            value={courseName}


            /*
              newValue can be:

                string
                null

              because the selection may also be cleared.

              If it is null, store "".
            */
            onChange={(
              _event,
              newValue
            ) => {
              setCourseName(
                newValue ?? ""
              );
            }}


            /*
              onInputChange runs while the user types.

              newInputValue is always the current text,
              so it is a string.
            */
            onInputChange={(
              _event,
              newInputValue
            ) => {
              setCourseName(
                newInputValue
              );
            }}


            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select or type course name..."
                fullWidth
                sx={inputSx}

                /*
                  Keep the Autocomplete's original
                  InputProps and add our Search icon.
                */
                InputProps={{
                  ...params.InputProps,

                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color:
                              "#94a3b8",
                            fontSize: 18,
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

            sx={{
              "& .MuiAutocomplete-popupIndicator":
                {
                  color: "#94a3b8",
                },

              "& .MuiAutocomplete-clearIndicator":
                {
                  color: "#94a3b8",
                },
            }}
          />
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

              /*
                This handler is explicitly typed as:

                  SelectChangeEvent<string>
              */
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

              /*
                MUI Select event is now typed instead of:

                  onChange={(e) => ...}

                where JavaScript didn't know what `e` was.
              */
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
                  Our React DateRange may contain:
                    Date
                    string
                    null
                    undefined

                  dayjs(...) converts a valid Date/string
                  into the Dayjs object that DatePicker expects.
                */
                value={
                  safeDateRange.from
                    ? dayjs(
                        safeDateRange.from
                      )
                    : null
                }


                /*
                  MUI DatePicker gives us:

                    Dayjs | null

                  Our application state wants DateValue,
                  so we convert Dayjs → JavaScript Date.
                */
                onChange={(
                  value: Dayjs | null
                ) => {
                  setDateRange(
                    (
                      previousRange
                    ) => ({
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
                    (
                      previousRange
                    ) => ({
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