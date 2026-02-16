import { Paper, Box, Typography, Divider } from "@mui/material";

export default function ProfileCard({ title, hint, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e9eaf0",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 10px 22px rgba(17, 24, 39, 0.06)",
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
          {hint}
        </Typography>
      </Box>
      <Divider />
      {children}
    </Paper>
  );
}
