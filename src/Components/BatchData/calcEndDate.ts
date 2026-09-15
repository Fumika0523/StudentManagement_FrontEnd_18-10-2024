/**
 * Calculates the batch end date from:
 * - the selected start date
 * - the number of course days
 *
 * TypeScript:
 * startDate is always expected to be a string from the form.
 *
 * noOfDays can be missing while the user has not yet
 * selected a course, so we allow undefined/null here.
 */
export const calcEndDate = (
  startDate: string,
  noOfDays?: number | string | null
): string => {
  // If either input is missing, there is nothing to calculate.
  if (!startDate || !noOfDays) {
    return "";
  }

  const start = new Date(startDate);

  /*
   * TypeScript:
   * noOfDays may arrive from the API as either a number
   * or a numeric-looking string, so convert it explicitly.
   */
  const days = Number(noOfDays);

  // Make sure both values are valid before calculating.
  if (
    Number.isNaN(start.getTime()) ||
    !Number.isFinite(days) ||
    days <= 0
  ) {
    return "";
  }

  /*
   * Add the number of course days to the start date.
   *
   * 24 hours
   * × 60 minutes
   * × 60 seconds
   * × 1000 milliseconds
   */
  const end = new Date(
    start.getTime() +
      days * 24 * 60 * 60 * 1000
  );

  /*
   * Convert the result to YYYY-MM-DD,
   * which is the format required by:
   *
   * <input type="date" />
   */
  return end
    .toISOString()
    .split("T")[0];
};