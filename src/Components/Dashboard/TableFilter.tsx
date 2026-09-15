// `Dispatch` and `SetStateAction` are used to type a React setState function.
// `ReactNode` represents anything React can render, such as JSX, text, or components.
import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

import {
  Box,
  Button,
  Collapse,
  Paper,
} from "@mui/material";

import {
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";

/*
  TypeScript interface describing all props
  that TableFilter expects from its parent component.
*/
interface TableFilterProps {
  // Controls whether the filter section is currently open.
  open: boolean;

  /*
    This component receives the setter from:
      const [open, setOpen] = useState(false);

    Dispatch<SetStateAction<boolean>>
    is the proper React type for that setter function.
    setOpen is the React function responsible for updating a boolean state.
  */
  setOpen: Dispatch<SetStateAction<boolean>>;

  /*
    ReactNode allows JSX/components to be placed inside:

      <TableFilter>
        <TextField />
        <Select />
      </TableFilter>
  */
  children: ReactNode;

  // Function called when the user clicks Apply.
  onApply: () => void;

  // Function called when the user clicks Reset.
  onReset: () => void;
}

const TableFilter = ({
  open,
  setOpen,
  children,
  onApply,
  onReset,
}: TableFilterProps) => {
  return (
    <Box
      sx={{
        minWidth: 320,
        maxWidth: 520,
      }}
    >
      {/* Opens or closes the filter section. */}
      <Button
        variant="contained"
        size="small"

        /*
          Because `open` is boolean, !open is also boolean.
          TypeScript therefore knows setOpen receives
          the correct value.
        */
          onClick={() =>
            setOpen((previousOpen) => !previousOpen)
          }
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderRadius: open
            ? "4px 4px 0 0"
            : "4px",
          backgroundColor: "#2c51c1",
        }}
      >
        Filter{" "}
        {open ? (
          <AiOutlineMinus />
        ) : (
          <AiOutlinePlus />
        )}
      </Button>

      {/* MUI Collapse uses the boolean `open` value. */}
      <Collapse in={open}>
        <Paper
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: 3,
          }}
        >
          {/* Render filter controls supplied by the parent. */}
          {children}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              size="small"

              /*
                onApply has type:
                  () => void

                So TypeScript knows it is a callable function
                that does not require arguments.
              */
              onClick={onApply}
              sx={{
                backgroundColor: "#2c51c1",
              }}
            >
              Apply
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={onReset}
              sx={{
                borderColor: "#2c51c1",
                color: "#2c51c1",
              }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TableFilter;