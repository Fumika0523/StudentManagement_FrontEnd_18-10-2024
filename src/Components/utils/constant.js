import { TfiBag } from "react-icons/tfi";
import { FaDollarSign } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

import { AiFillDashboard } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { FaUsersViewfinder } from "react-icons/fa6";
import { MdMenuBook, MdGridView } from "react-icons/md";
import { GiEntryDoor } from "react-icons/gi";
import {
  TableCell,
  TableRow,
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from '@mui/material/styles';

// ==================== STATIC DATA ====================

export const url = "http://localhost:8001";

export const earningCardList = [
  {
    title: "EARNINGS (MONTHLY)",
    totalRevenue: "$40,000",
    icon: TfiBag,
    color: "#4e73df"
  },
  {
    title: "EARNINGS (ANNUAL)",
    totalRevenue: "$215,000",
    icon: FaDollarSign,
    color: "#1cc88a"
  },
  {
    title: "Total Batches",
    totalRevenue: "50%",
    icon: FaClipboardList,
    color: "#36b9cc"
  },
  {
    title: "Total Enrollment",
    totalRevenue: "18",
    icon: IoIosChatbubbles,
    color: "#f6c23e"
  }
];

// ==================== MENU ITEMS ====================

// Menu items for admin/staff (inside Component submenu)
export const adminMenuItems = [
  { title: "Student", icon: PiStudent, route: "/studentdata" },
  { title: "Batch", icon: FaUsersViewfinder, route: "/batchdata" },
  { title: "Course", icon: MdMenuBook, route: "/coursedata" },
  { title: "Admission", icon: GiEntryDoor, route: "/admissiondata" },
];

// Menu items for student (inside Component submenu)
export const studentMenuItems = [
  { title: "View Batch", icon: FaUsersViewfinder, route: "/batchdata" },
  { title: "View Attendance", icon: MdMenuBook, route: "/coursedata" },
  { title: "Submit Task", icon: MdMenuBook, route: "/coursedata" },
];

// ==================== TABLE STYLES ====================

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f3f4f6",
    color: "#5a5c69",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "14.5px",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    textAlign: "center",
    padding: "10px 15px",
    whiteSpace: "nowrap",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#b3e5fc",
  },
}));

export const tableContainerStyles = {
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  border: "1px solid #ebe5e7",
  overflow: "hidden",
};

// ==================== COLOR SCHEMES ====================

/**
 * Primary Color Scheme (used for Student, Batch components)
 * Deep blue theme
 */
export const primaryColors = {
  main: "#1f3fbf",
  hover: "#1b50c2",
  dark: "#1e40af",
};

/**
 * Secondary Color Scheme (alternative)
 * Lighter blue theme
 */
export const secondaryColors = {
  main: "#3b82f6",
  hover: "#2563eb",
  dark: "#1e40af",
};

// ==================== REUSABLE FILTER STYLES ====================

/**
 * Filter Toggle Button Styles (Primary - Student/Batch style)
 * Used in all filter components
 * @param {boolean} openFilters - Whether filters are open
 * @returns {object} MUI sx styles
 */
export const filterToggleButtonStyles = (openFilters) => ({
  width: "100%",
  borderRadius: openFilters ? "10px 10px 0 0" : "10px",
  backgroundColor: openFilters ? primaryColors.main : primaryColors.dark,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "14px",
  px: 2.5,
  py: 1,
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: primaryColors.hover,
  },
});

/**
 * Filter Panel Container Styles
 * Used for the collapsible filter panel
 */
export const filterPanelStyles = {
  borderRadius: "0 0 10px 10px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
  overflow: "hidden",
};

/**
 * Filter Fields Container Styles
 * Used for the box containing filter inputs
 */
export const filterFieldsContainerStyles = {
  p: 2,
  backgroundColor: "#f9fafb",
};

/**
 * Filter Action Buttons Container Styles
 * Used for the box containing Apply/Reset buttons
 */
export const filterActionsContainerStyles = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 1.5,
  px: 2,
  py: 1.5,
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e5e7eb",
};

/**
 * Reset Button Styles
 * Used for all filter reset buttons
 */
export const resetButtonStyles = {
  borderColor: "#d1d5db",
  color: "#6b7280",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "13px",
  px: 2.5,
  borderRadius: "7px",
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f9fafb",
  },
};

/**
 * Apply Button Styles
 * Used for all filter apply buttons
 */
export const applyButtonStyles = {
  backgroundColor: primaryColors.main,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "13px",
  px: 3,
  borderRadius: "7px",
  "&:hover": {
    backgroundColor: primaryColors.hover,
  },
};

// ==================== REUSABLE ACTION BUTTON STYLES ====================

/**
 * Primary Action Button Styles (Add Course, Add Batch, Add Student, etc.)
 * Used for main action buttons in headers
 */
export const primaryActionButtonStyles = {
  backgroundColor: primaryColors.main,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "14px",
  px: 2.5,
  py: 1,
  borderRadius: "8px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: primaryColors.hover,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-1px)",
  },
};

/**
 * Secondary Action Button Styles
 * Used for secondary actions
 */
export const secondaryActionButtonStyles = {
  backgroundColor: "transparent",
  border: "1px solid #d1d5db",
  color: "#6b7280",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "14px",
  px: 2.5,
  py: 1,
  borderRadius: "8px",
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f9fafb",
  },
};

// ==================== REUSABLE PLACEHOLDER STYLES ====================

/**
 * Empty State Placeholder Styles
 * Used when no filters are applied or no data found
 */
export const emptyStatePlaceholderStyles = {
  mt: 3,
  p: 4,
  textAlign: "center",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "2px dashed #cbd5e1",
};

/**
 * Placeholder Title Styles
 */
export const placeholderTitleStyles = {
  color: "#64748b",
  mb: 1,
  fontWeight: 600,
};

/**
 * Placeholder Description Styles
 */
export const placeholderDescriptionStyles = {
  color: "#94a3b8",
};