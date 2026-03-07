import {
  Box, Typography, Divider, Stack, Chip,
  Modal, IconButton, TextField, Button, InputAdornment, Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { FcLeft } from "react-icons/fc";


// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const safeText = (v, fallback = "-") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
};

const makeInitials = (userData) => {
  const fn = safeText(userData?.firstName, "").trim();
  const ln = safeText(userData?.lastName, "").trim();
  const full = safeText(userData?.name, "").trim();
  const fromFL = (fn ? fn[0] : "") + (ln ? ln[0] : "");
  if (fromFL.trim().length) return fromFL.toUpperCase();
  if (full.length >= 2) return full.slice(0, 2).toUpperCase();
  if (full.length === 1) return full.toUpperCase();
  return "U";
};

// ─────────────────────────────────────────────────────────────
// Edit Modal
// ─────────────────────────────────────────────────────────────
const EditModal = ({ open, onClose, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setIsEditing(false);
      setValue(field?.value || "");
    }
  }, [open, field?.key]);

  const handleSave = () => {
    // TODO: PUT /api/users/profile → { [field.key]: value }
    console.log(`PUT /users/profile → { ${field?.key}: "${value}" }`);
    setIsEditing(false);
    onClose();
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Box sx={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 32px 80px rgba(15,23,42,0.2)",
        width: "100%", maxWidth: 400, overflow: "hidden", outline: "none",
      }}>
        {/* Header */}
        <Box sx={{
          px: 3, py: 2.5,
          background: "linear-gradient(135deg, #1a3bbd 0%, #0d1f8a 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: "8px", background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center" }}>
              {field?.icon && (
                <Box sx={{ color: "#fff", display: "flex", "& .MuiSvgIcon-root": { fontSize: 17 } }}>{field.icon}</Box>
              )}
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{field?.label}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff", background: "rgba(255,255,255,0.1)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px",
            px: 2, py: 1.5, mb: 2.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Box>
              <Typography sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Current value
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#334155", fontWeight: 600, mt: 0.3 }}>
                {field?.value || "—"}
              </Typography>
            </Box>
            {!field?.disabled && (
              <IconButton
                size="small"
                onClick={() => setIsEditing((p) => !p)}
                sx={{
                  background: isEditing ? "#eff6ff" : "transparent",
                  color: isEditing ? "#2563eb" : "#94a3b8",
                  border: "1px solid", borderColor: isEditing ? "#bfdbfe" : "#e2e8f0",
                  "&:hover": { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" },
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {isEditing && !field?.disabled && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#475569", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                New value
              </Typography>
              <TextField
                fullWidth autoFocus value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter new ${field?.label?.toLowerCase()}…`}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleSave} sx={{ color: "#16a34a" }}>
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "8px", fontSize: 14, background: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                  }
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setIsEditing(false); }}
              />
              <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.8 }}>
                Press Enter to save · Escape to cancel
              </Typography>
            </Box>
          )}

          {field?.disabled && (
            <Box sx={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", px: 2, py: 1.5, mb: 2 }}>
              <Typography sx={{ fontSize: 12, color: "#c2410c", fontWeight: 600 }}>
                ⚠️ This field cannot be changed directly. Please contact support.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 1 }}>
            <Button onClick={handleClose} sx={{
              fontSize: 13, fontWeight: 700, px: 2.5, py: 1, borderRadius: "8px",
              color: "#64748b", background: "#f1f5f9", "&:hover": { background: "#e2e8f0" }, textTransform: "none",
            }}>Cancel</Button>
            {isEditing && !field?.disabled && (
              <Button onClick={handleSave} variant="contained" sx={{
                fontSize: 13, fontWeight: 700, px: 2.5, py: 1, borderRadius: "8px",
                background: "linear-gradient(135deg, #1a3bbd, #0d1f8a)",
                boxShadow: "0 4px 12px rgba(26,59,189,0.35)",
                "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #1a3bbd)" },
                textTransform: "none",
              }}>Save changes</Button>
            )}
          </Box>
        </Box>

        <Box sx={{ px: 3, py: 1.2, background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
          <Typography sx={{ fontSize: 10, color: "#cbd5e1", fontFamily: "monospace" }}>
            PUT /users/profile → &#123; {field?.key}: value &#125;
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────
// Section heading
// ─────────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <Typography sx={{
    fontSize: 11, fontWeight: 800, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.12em", mb: 1.5,
    display: "flex", alignItems: "center", gap: 1,
    "&::after": {
      content: '""', flex: 1, height: "1px",
      background: "linear-gradient(to right, #f1f5f9, transparent)",
    }
  }}>
    {children}
  </Typography>
);

// ─────────────────────────────────────────────────────────────
// Field row
// ─────────────────────────────────────────────────────────────
const FieldRow = ({ label, value, disabled, onClick, icon }) => (
  <Box
    onClick={!disabled ? onClick : undefined}
    sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      px: 1.5, py: 1.6,
      cursor: disabled ? "default" : "pointer",
      borderRadius: "10px",
      transition: "background 0.12s",
      "&:hover": !disabled ? { background: "#f8fafc" } : {},
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <Box sx={{
        width: 32, height: 32, borderRadius: "9px",
        background: disabled ? "#f8fafc" : "#f1f5f9",
        display: "grid", placeItems: "center", flexShrink: 0,
        color: disabled ? "#cbd5e1" : "#64748b",
        "& svg": { fontSize: 17 },
      }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </Typography>
        <Typography sx={{
          fontSize: 13.5, fontWeight: 500, mt: 0.15,
          color: disabled ? "#cbd5e1" : "#1e293b",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {value}
        </Typography>
      </Box>
    </Box>
    {!disabled ? (
      <Box sx={{
        flexShrink: 0, ml: 1,
        width: 28, height: 28, borderRadius: "8px",
        border: "1px solid #e9eef4",
        display: "grid", placeItems: "center",
        color: "#94a3b8",
        transition: "all 0.12s",
        ".MuiBox-root:hover > &": { borderColor: "#bfdbfe", color: "#2563eb", background: "#eff6ff" },
      }}>
        <EditIcon sx={{ fontSize: 14 }} />
      </Box>
    ) : (
      <Box sx={{ width: 28, flexShrink: 0 }} />
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
export default function ProfileSections({
  navigate,
  loading,
  userData,
  setOpenBirthModal,
  setOpenPhoneModal,
  icons,
}) {
  const { PersonIcon, CakeIcon, EmailIcon, PhoneIcon, WcIcon, LockIcon, PublicOutlined, PhotoCameraIcon } = icons;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const openModal = (field) => { setActiveField(field); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setActiveField(null); };

  const initials = makeInitials(userData);
  const displayName =
    safeText(userData?.name, "").trim() ||
    `${safeText(userData?.firstName, "").trim()} ${safeText(userData?.lastName, "").trim()}`.trim() || "-";

  const email       = safeText(userData?.email);
  const firstName   = safeText(userData?.firstName);
  const lastName    = safeText(userData?.lastName);
  const gender      = safeText(userData?.gender);
  const role        = safeText(userData?.role);
  const country     = safeText(userData?.country);
  const phoneNumber = safeText(userData?.phoneNumber);
  const isActive    = Boolean(userData?.isActive);
  const isStudent   = userData?.role === "student";

  const basicFields = [
    { key: "firstName",   label: "First Name",   icon: <PersonIcon />,    value: firstName,   disabled: false },
    { key: "lastName",    label: "Last Name",    icon: <PersonIcon />,    value: lastName,    disabled: false },
    { key: "displayName", label: "Display Name", icon: <PersonIcon />,    value: displayName, disabled: false },
    { key: "gender",      label: "Gender",       icon: <WcIcon />,         value: gender,      disabled: false },
    { key: "country",     label: "Country",      icon: <PublicOutlined />, value: country,     disabled: false },
    ...(isStudent ? [{ key: "birthday", label: "Birthday", icon: <CakeIcon />, value: safeText(userData?.birthdate), disabled: false }] : []),
  ];

  const contactFields = [
    { key: "email", label: "Email",        icon: <EmailIcon />, value: email,       disabled: false  },
    { key: "phone", label: "Phone Number", icon: <PhoneIcon />, value: phoneNumber, disabled: false },
  ];

  return (
    <Box sx={{
      width: "100%",
      maxWidth: 680,   /* ✅ tighter, more focused width */
      mx: "auto",
      px: { xs: 2, sm: 3 },
      py: { xs: 2.5, md: 3 },
    }}>
      <EditModal open={modalOpen} onClose={closeModal} field={activeField} />

      {/* Back button */}
      <Box sx={{ mb: 2.5 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
            padding: "6px 14px", fontSize: 13, fontWeight: 700, color: "#475569",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
        >
          <FcLeft className="fs-6" /> Back to Dashboard
        </button>
      </Box>

      {/* Main card */}
      <Box sx={{
        background: "#fff",
        borderRadius: "18px",
        border: "1px solid #e9eef4",
        boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
        overflow: "hidden",
      }}>

        {/* ── Avatar section ── */}
        <Box sx={{
          position: "relative",
          background: "#fff",
          px: { xs: 2.5, sm: 3 }, pt: 3, pb: 2.5,
          borderBottom: "1px solid #f1f5f9",
        }}>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
            {/* Avatar with camera button */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{
                width: { xs: 64, sm: 76 }, height: { xs: 64, sm: 76 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #60a5fa, #2563eb)",
                display: "grid", placeItems: "center",
                color: "#fff", fontWeight: 900,
                fontSize: { xs: 22, sm: 26 },
                boxShadow: "0 0 0 3px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.3)",
              }}>
                {loading ? "…" : initials}
              </Box>

              {/* Camera icon button */}
              <Tooltip title="Change photo" placement="bottom">
                <Box sx={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#fff",
                  display: "grid", placeItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  "&:hover": { transform: "scale(1.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" },
                }}>
                  <PhotoCameraIcon sx={{ fontSize: 13, color: "#1a3bbd" }} />
                </Box>
              </Tooltip>
            </Box>

            {/* Name + email + chips */}
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, sm: 17 }, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {loading ? "Loading…" : displayName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.4, mb: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email}
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={isActive ? "Active" : "Inactive"} sx={{
                  fontSize: 10.5, fontWeight: 700, height: 20, borderRadius: "5px",
                  bgcolor: isActive ? "#f0fdf4" : "#fef2f2",
                  color: isActive ? "#16a34a" : "#dc2626",
                  border: isActive ? "1px solid #bbf7d0" : "1px solid #fecaca",
                }} />
                <Chip size="small" label={role} sx={{
                  fontSize: 10.5, fontWeight: 700, height: 20, borderRadius: "5px",
                  bgcolor: "#eff6ff", color: "#1a3bbd", border: "1px solid #bfdbfe",
                }} />
              </Stack>
            </Box>

            {/* ✅ Redesigned avatar action buttons — icon-only with tooltips */}
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0, pt: 0.5 }}>
              <Tooltip title="Upload new photo" placement="bottom">
                <Box
                  component="label"
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.8,
                    px: 1.5, py: 0.9,
                    borderRadius: "10px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1a3bbd",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { background: "#dbeafe", borderColor: "#93c5fd" },
                    userSelect: "none",
                  }}
                >
                  <FileUploadOutlinedIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a3bbd", display: { xs: "none", sm: "block" } }}>
                    Upload
                  </Typography>
                  <input type="file" accept="image/*" hidden />
                </Box>
              </Tooltip>

              <Tooltip title="Remove photo" placement="bottom">
                <Box
                  sx={{
                    display: "flex", alignItems: "center",
                    px: 1.2, py: 0.9,
                    borderRadius: "10px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { background: "#fee2e2", borderColor: "#fca5a5" },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Fields panel — pulled up to overlap the banner slightly ── */}
        <Box sx={{
          mx: { xs: 2, sm: 3 },
          mt: 0,
          mb: 0,
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
        }}>

          {/* Personal Info */}
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
            <SectionHeading>Personal Information</SectionHeading>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0 }}>
              {basicFields.map((f, idx) => (
                <Box key={f.key}>
                  <FieldRow
                    label={f.label}
                    icon={f.icon}
                    value={loading ? "Loading..." : f.value}
                    disabled={f.disabled}
                    onClick={() => openModal({ ...f, value: loading ? "" : f.value })}
                  />
                  {/* divider between pairs on mobile */}
                  {idx < basicFields.length - 1 && (
                    <Divider sx={{ borderColor: "#f8fafc", display: { xs: "block", sm: "none" } }} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#f1f5f9", mx: 2.5 }} />

          {/* Contact */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
            <SectionHeading>Contact</SectionHeading>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0 }}>
              {contactFields.map((f) => (
                <FieldRow
                  key={f.key}
                  label={f.label}
                  icon={f.icon}
                  value={loading ? "Loading..." : f.value}
                  disabled={f.disabled}
                  onClick={() => openModal({ ...f, value: loading ? "" : f.value })}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#f1f5f9", mx: 2.5 }} />

          {/* Security */}
          <Box sx={{ px: 2.5, pt: 2, pb: 2 }}>
            <SectionHeading>Security</SectionHeading>
            <FieldRow
              label="Password"
              icon={<LockIcon />}
              value="••••••••••••"
              disabled={false}
              onClick={() => navigate("/passwordform")}
            />
          </Box>
        </Box>

        {/* Save button */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2.5, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              fontSize: 13.5, fontWeight: 700,
              px: { xs: 3, sm: 4 }, py: 1.3,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1a3bbd, #0d1f8a)",
              boxShadow: "0 4px 14px rgba(26,59,189,0.3)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #1a3bbd)",
                boxShadow: "0 6px 20px rgba(26,59,189,0.4)",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}