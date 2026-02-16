import { Box, Typography } from "@mui/material";

export default function ProfileRow({
  label,
  value,
  icon,
  onClick,
  right,
  loading
}) {
  return (
    <Box
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "120px 1fr", sm: "160px 1fr" },
        gap: 1.5,
        px: 2,
        py: 1.75,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { backgroundColor: "#f8fafc" } : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#111827" }}>
          {loading ? "Loading..." : value}
        </Typography>

        {right}
      </Box>
    </Box>
  );
}
