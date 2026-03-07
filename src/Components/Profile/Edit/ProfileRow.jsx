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
        display: "flex",
        justifyContent:"space-between",
        alignItems: "center", 
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { backgroundColor: "#f8fafc" } : undefined,
       // border:"2px solid red"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 , 
      //border:"2px solid blue"
}}>
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
          // width: "100%",
          //border:"2px solid blue"
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
