import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  SxProps,
  Theme,
} from "@mui/material";

import type {
  SelectChangeEvent,
} from "@mui/material/Select";

import Grid from "@mui/material/Grid";

import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  CalendarMonth,
  School,
  Search,
  Tag,
} from "@mui/icons-material";

import type {
  CourseOption,
  DateRange,
  DateValue,
} from "../../../utils/filterUtils";


// ========================================
// COMPONENT PROPS
// ========================================

interface TaskFilterFieldsProps {
  uniqueCourses: CourseOption[];

  selectedCourse:
    CourseOption | null;

  setSelectedCourse:
    Dispatch<
      SetStateAction<
        CourseOption | null
      >
    >;

  courseInput: string;

  setCourseInput:
    Dispatch<
      SetStateAction<string>
    >;

  batchNumberFilter:
    string;

  setBatchNumberFilter:
    Dispatch<
      SetStateAction<string>
    >;

  datePreset:
    string;

  setDatePreset:
    Dispatch<
      SetStateAction<string>
    >;

  dateRange:
    DateRange;

  setDateRange:
    Dispatch<
      SetStateAction<DateRange>
    >;
}


// ========================================
// DATE DISPLAY HELPER
// ========================================

const formatDateForInput = (
  value: DateValue
): string => {
  /*
   * DateRange can contain either Date objects,
   * strings, null, or undefined.
   */
  if (
    !value
  ) {
    return "";
  }


  const date =
    value instanceof Date
      ? value
      : new Date(
          value
        );


  /*
   * Avoid calling toISOString() on an invalid
   * Date because that would throw at runtime.
   */
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date
    .toISOString()
    .split(
      "T"
    )[0];
};


// ========================================
// COMPONENT
// ========================================

const TaskFilterFields = ({
  uniqueCourses,
  selectedCourse,
  setSelectedCourse,
  courseInput,
  setCourseInput,
  batchNumberFilter,
  setBatchNumberFilter,
  datePreset,
  setDatePreset,
  dateRange,
  setDateRange,
}: TaskFilterFieldsProps) => {
  // ========================================
  // SHARED MUI STYLES
  // ========================================

  const labelSx:
    SxProps<Theme> = {
    fontSize:
      12,

    fontWeight:
      600,

    mb:
      0.5,

    color:
      "#475569",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      0.5,
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

        "&:hover .MuiOutlinedInput-notchedOutline":
          {
            borderColor:
              "#3b82f6",
          },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
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


  const selectSx:
    SxProps<Theme> = {
    borderRadius:
      "8px",

    backgroundColor:
      "#ffffff",

    fontSize:
      "14px",

    "&:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "#3b82f6",
      },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "#3b82f6",

        borderWidth:
          "2px",
      },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "#e2e8f0",
      },
  };


  // ========================================
  // DATE PRESET CHANGE
  // ========================================

  const handleDatePresetChange = (
    event:
      SelectChangeEvent<string>
  ): void => {
    const nextValue =
      event.target.value;


    setDatePreset(
      nextValue
    );


    /*
     * Clear the manual range whenever the user
     * switches away from Custom Range.
     */
    if (
      nextValue !==
      "custom"
    ) {
      setDateRange({
        from:
          null,

        to:
          null,
      });
    }
  };


  return (
    <Box>
      <Grid
        container
        spacing={
          1.5
        }
      >
        {/* ========================================
            COURSE NAME
        ======================================== */}

        <Grid
          size={{
            xs:
              12,

            sm:
              6,

            md:
              3,
          }}
        >
          <Typography
            sx={
              labelSx
            }
          >
            <School
              sx={{
                fontSize:
                  16,
              }}
            />

            Course Name
          </Typography>


          <Autocomplete<
            string,
            false,
            false,
            true
          >
            freeSolo
            options={
              uniqueCourses.map(
                (
                  course
                ) =>
                  course.label
              )
            }
            value={
              selectedCourse?.label ??
              courseInput
            }
            onChange={(
              _event,
              newValue
            ) => {
              /*
               * With freeSolo enabled, newValue
               * can be either a string or null.
               */
              const value =
                newValue ??
                "";


              const match =
                uniqueCourses.find(
                  (
                    course
                  ) =>
                    course.label ===
                    value
                );


              if (
                match
              ) {
                setSelectedCourse(
                  match
                );

                setCourseInput(
                  match.label
                );

                return;
              }


              setSelectedCourse(
                null
              );

              setCourseInput(
                value
              );
            }}
            onInputChange={(
              _event,
              newInputValue
            ) => {
              setCourseInput(
                newInputValue
              );


              if (
                !newInputValue
              ) {
                setSelectedCourse(
                  null
                );
              }
            }}
            renderInput={(
              params
            ) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select or type course..."
                fullWidth
                sx={
                  inputSx
                }
                InputProps={{
                  ...params.InputProps,

                  startAdornment: (
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
            BATCH NUMBER
        ======================================== */}

        <Grid
          size={{
            xs:
              12,

            sm:
              6,

            md:
              3,
          }}
        >
          <Typography
            sx={
              labelSx
            }
          >
            <Tag
              sx={{
                fontSize:
                  16,
              }}
            />

            Batch Number
          </Typography>


          <TextField
            size="small"
            fullWidth
            value={
              batchNumberFilter
            }
            onChange={(
              event
            ) =>
              setBatchNumberFilter(
                event.target.value
              )
            }
            placeholder="Search batch number..."
            sx={
              inputSx
            }
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
            DATE PRESET
        ======================================== */}

        <Grid
          size={{
            xs:
              12,

            sm:
              6,

            md:
              3,
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

            Date Range
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
                handleDatePresetChange
              }
              sx={
                selectSx
              }
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
                📅 Last 7 Days
              </MenuItem>

              <MenuItem value="30d">
                📅 Last 30 Days
              </MenuItem>

              <MenuItem value="month">
                📅 This Month
              </MenuItem>

              <MenuItem value="year">
                📅 This Year
              </MenuItem>

              <MenuItem value="custom">
                ✏️ Custom Range
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>


        {/* ========================================
            CUSTOM DATE RANGE
        ======================================== */}

        {datePreset ===
          "custom" && (
          <>
            {/* FROM DATE */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
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

                From
              </Typography>


              <TextField
                type="date"
                size="small"
                fullWidth
                value={
                  formatDateForInput(
                    dateRange.from
                  )
                }
                onChange={(
                  event
                ) =>
                  setDateRange(
                    (
                      previous
                    ) => ({
                      ...previous,

                      from:
                        event
                          .target
                          .value
                          ? new Date(
                              event.target.value
                            )
                          : null,
                    })
                  )
                }
                sx={
                  inputSx
                }
                InputLabelProps={{
                  shrink:
                    true,
                }}
              />
            </Grid>


            {/* TO DATE */}

            <Grid
              size={{
                xs:
                  12,

                sm:
                  6,

                md:
                  3,
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

                To
              </Typography>


              <TextField
                type="date"
                size="small"
                fullWidth
                value={
                  formatDateForInput(
                    dateRange.to
                  )
                }
                onChange={(
                  event
                ) =>
                  setDateRange(
                    (
                      previous
                    ) => ({
                      ...previous,

                      to:
                        event
                          .target
                          .value
                          ? new Date(
                              event.target.value
                            )
                          : null,
                    })
                  )
                }
                sx={
                  inputSx
                }
                InputLabelProps={{
                  shrink:
                    true,
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default TaskFilterFields;