import Paper from "@mui/material/Paper";

import {
  DataGrid,
} from "@mui/x-data-grid";

import type {
  GridColDef,
} from "@mui/x-data-grid";


// ========================================
// DEMO ROW TYPE
// ========================================

/*
 * TypeScript:
 * This component currently contains hard-coded
 * demo Student rows rather than real API data.
 *
 * Several rows have different fields, so optional
 * properties accurately represent that structure.
 */
interface DemoStudentRow {
  id: number;

  studentName?: string;

  username?: string;

  email?: string;

  phoneNumber?: string;

  gender?: string;

  firstName?:
    string | null;

  lastName?: string;

  age?:
    number | null;
}


// ========================================
// DATA GRID COLUMNS
// ========================================

/*
 * GridColDef<DemoStudentRow> connects each column
 * definition to the row type used by DataGrid.
 */
const columns:
  GridColDef<DemoStudentRow>[] = [
  {
    field: "id",
    headerName: "Student ID",
    width: 200,
  },

  {
    field: "studentName",
    headerName: "Student name",
    width: 200,
  },

  {
    field: "username",
    headerName: "User name",
    width: 200,
  },

  {
    field: "email",
    headerName: "Email",
    width: 200,
  },

  {
    field: "phoneNumber",
    headerName: "Phone No.",
    width: 200,
  },

  {
    field: "gender",
    headerName: "Gender",
    width: 200,
  },
];


// ========================================
// DEMO ROWS
// ========================================

const rows:
  DemoStudentRow[] = [
  {
    id: 1,
    studentName: "Snow",
    firstName: "Jon",
    age: 35,
  },

  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
  },

  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 45,
  },

  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    age: 16,
  },

  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
  },

  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    age: 150,
  },

  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
  },

  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
  },

  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    age: 65,
  },
];


// ========================================
// INITIAL PAGINATION
// ========================================

const paginationModel = {
  page: 0,

  pageSize: 5,
};


// ========================================
// COMPONENT
// ========================================

const HoverCustomisedTable = () => {
  return (
    <Paper
      sx={{
        height: 400,

        width: "100%",
      }}
    >
      <DataGrid<DemoStudentRow>
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        pageSizeOptions={[
          5,
          10,
        ]}
        sx={{
          border: 0,
        }}
      />
    </Paper>
  );
};

export default HoverCustomisedTable;