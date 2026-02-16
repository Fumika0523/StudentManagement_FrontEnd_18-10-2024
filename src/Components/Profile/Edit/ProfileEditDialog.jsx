import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField
} from "@mui/material";
import { Button } from "react-bootstrap";

export default function ProfileEditDialog({
  open,
  onClose,
  title,
  description,
  formik,
  fieldName,
  type = "text",
  label
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>

          <Typography sx={{ mb: 2, fontSize: 14, color: "#6b7280" }}>
            {description}
          </Typography>

          <TextField
            fullWidth
            type={type}
            label={label}
            name={fieldName}
            value={formik.values[fieldName]}
            onChange={formik.handleChange}
            error={
              formik.touched[fieldName] &&
              Boolean(formik.errors[fieldName])
            }
            helperText={
              formik.touched[fieldName] &&
              formik.errors[fieldName]
            }
            size="small"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="secondary"
            type="submit"
            style={{ borderRadius: "16px" }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
