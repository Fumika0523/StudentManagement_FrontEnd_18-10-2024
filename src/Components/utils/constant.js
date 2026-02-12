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

//static data
export const url = "http://localhost:8001"  
export const earningCardList = [
    {
        title:"EARNINGS (MONTHLY)",
        totalRevenue:"$40,000",
        icon:TfiBag,
        color:"#4e73df"
    },
    {   
        title:"EARNINGS (ANNUAL)",
        totalRevenue:"$215,000",
        icon:FaDollarSign,
        color:"#1cc88a"
    },
    {
        title:"Total Batches",
        totalRevenue:"50%",
        icon:FaClipboardList,
        color:"#36b9cc"
    },
    {
        title:"Total Enrollment",
        totalRevenue:"18",
        icon:IoIosChatbubbles,
        color:"#f6c23e"
    }
]

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

// // Additional menu items for admin/staff (outside Component submenu)
// export const adminAdditionalMenus = [
//     { title: "Task", icon: FiTool, route: null },
//     { title: "Update Attendance", icon: MdDateRange, route: "/attendance" },
// ];

// // Additional menu items for student (outside Component submenu)
// export const studentAdditionalMenus = [
//     { title: "Raise Query", icon: IoIosChatbubbles, route: null },
//     { title: "Download Certificate", icon: TfiBag, route: null },
//     { title: "Invoice Download", icon: FaClipboardList, route: null },
// ];