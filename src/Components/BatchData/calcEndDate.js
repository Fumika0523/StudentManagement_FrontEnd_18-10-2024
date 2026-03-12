/**
 * Calculates the end date based on start date and number of course days.
 * 
 * @param {string} startDate - ISO date string e.g. "2024-01-15"
 * @param {number} noOfDays  - number of days the course runs
 * @returns {string} - end date formatted as "YYYY-MM-DD", or "" if inputs are invalid
 */
export const calcEndDate = (startDate, noOfDays) => {
  if (!startDate || !noOfDays) return "";

  const start = new Date(startDate);
  const days = Number(noOfDays);

  // Return empty string if either value is invalid
  if (isNaN(start.getTime()) || !Number.isFinite(days) || days <= 0) return "";

  // Add the course days to the start date
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

  // Return as YYYY-MM-DD string for the date input field
  return end.toISOString().split("T")[0];
};