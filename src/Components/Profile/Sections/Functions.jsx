import { Box, Typography, Divider } from "@mui/material";

// Returns a fallback string if the value is empty/null/undefined
export const safeText = (v, fallback = "-") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
};

// Generates 2-letter initials from user data
export const makeInitials = (userData) => {
  const fn = safeText(userData?.firstName, "").trim();
  const ln = safeText(userData?.lastName, "").trim();
  const fromFL = (fn ? fn[0] : "") + (ln ? ln[0] : "");
  if (fromFL.trim().length) return fromFL.toUpperCase();
  const full = safeText(userData?.name, "").trim();
  if (full.length >= 1) return full.slice(0, 2).toUpperCase();
  return "U";
};

// Card with a coloured icon badge in the header
export const AccentCard = ({ title, subtitle, iconBg, icon, children }) => (
  <Box sx={{
    background: "#fff", borderRadius: 3,
    border: "1px solid #e9eef4",
    boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
    overflow: "hidden",
  }}>
    <Box sx={{
      px: 3, pt: 2.5, pb: 1.5,
      borderBottom: "1px solid #f1f5f9",
      display: "flex", alignItems: "center", gap: 1.5,
    }}>
      {icon && (
        <Box sx={{
          width: 34, height: 34, borderRadius: 2,
          background: iconBg, display: "grid", placeItems: "center",
          flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          {icon}
        </Box>
      )}
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#0f172a", lineHeight: 1.2 }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>{subtitle}</Typography>}
      </Box>
    </Box>
    <Box sx={{ px: 1 }}>{children}</Box>
  </Box>
);

// Single row used in the left sidebar quick-info card
export const QuickRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2 }}>
    <Box sx={{ color: "#94a3b8", flexShrink: 0, display: "flex" }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: "#334155", fontWeight: 600, mt: 0.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</Typography>
    </Box>
  </Box>
);