import React, { useMemo, useState , useEffect} from "react";
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Button, Stack,  Divider, Alert, Chip,
  Card,
  InputAdornment,
} from "@mui/material";
import {
  AttachFile,
  Send,
  Category,
  Subject,
  Message,
  Close,
  EventAvailable,
  Payment,
  MenuBook,
  CardMembership,
  AccountCircle,
  Build,
  MoreHoriz,
  Email,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../utils/constant";

const RaiseQuery = () => {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const {
    username = "-",
    email = "-",
    phoneNumber = "-",
    gender = "-",
    birthdate,
    role="-"
  } = userData || {};

  const studentId = localStorage.getItem("studentId") || "";

  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }),
    [token]
  );

  const resetForm = () => {
    setCategory("");
    setPriority("Normal");
    setSubject("");
    setMessage("");
    setAttachment(null);
  };

  const validate = () => {
    if (!category) return "Please choose a category.";
    if (!subject.trim()) return "Subject is required.";
    if (subject.trim().length < 4) return "Subject is too short (min 4 chars).";
    if (!message.trim()) return "Message is required.";
    if (message.trim().length < 10) return "Message is too short (min 10 chars).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("subject", subject.trim());
      formData.append("message", message.trim());
      formData.append("username", username);
      formData.append("email", email);
      formData.append("studentId", studentId);
      if (attachment) formData.append("attachment", attachment);

      const res = await axios.post(`${url}/queries`, formData, config);

      toast.success(res?.data?.message || "Your inquiry has been sent to staff!");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to send inquiry. Try again.");
    } finally {
      setLoading(false);
    }
  };

   const getUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/users/profile`, config);
        console.log("response Get user data from raiseQuery:",res.data.userData)
        setUserData(res.data.userData || {});
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      getUserData();
    }, []);

  return (
   <Box sx={{ 
      p: { xs: 1.5, md: 3}, 
      mx: "auto", 
      height: "100vh",
    }}>
      {!token && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          You're not logged in (token missing). Please log in again.
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/*  Card Title INSIDE */}
     <Box sx={{ 
          p: { xs: 2, md: 2.5 }, 
          background: "linear-gradient(180deg, #1f3fbf 0%, #1b2f7a 100%)",
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Message sx={{ fontSize: 24, color: "white" }} />
            <Box>
              <Typography fontWeight={700} sx={{ color: "white", lineHeight: 1.1, fontSize: 22 }}>
                Raise an Inquiry
              </Typography>
              <Typography variant="body2" sx={{ color: "#afbed3", mt: 0.3, fontSize: 12 }}>
                Send a question or issue to staff/admin
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Divider />
        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 2.5 } }}>

          {/*Section label aligned tighter */}
          {/* <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Category sx={{ fontSize: 18, color: "#3b82f6" }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0f172a" }}>
              Inquiry Details
            </Typography>
          </Stack> */}

          <Grid container spacing={2} alignItems="stretch">
             {/* Student Username */}
            <Grid item  size={{ xs: 6, md: 6 }}>
              <TextField
              disabled
                label="Username *"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                               

                placeholder="e.g. Attendance marked absent by mistake"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: 13,
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { fontSize: 13 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: "#3b82f6", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item  size={{ xs: 6, md: 6 }}>
              <TextField
              disabled
              fullWidth
                label="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: 13,
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { fontSize: 13 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#3b82f6", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item size={{ xs: 6, md: 6 }}>
                   <FormControl fullWidth >
                <InputLabel sx={{ fontSize: 13 }}>Category *</InputLabel>
                <Select
                  label="Category *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                      borderRadius: 1.5,
                    fontSize: 13,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  }}
                >
                  <MenuItem value="Attendance">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <EventAvailable sx={{ fontSize: 18, color: "#3b82f6" }} />
                      <span>Attendance</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Payment">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Payment sx={{ fontSize: 18, color: "#10b981" }} />
                      <span>Payment</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Course">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <MenuBook sx={{ fontSize: 18, color: "#8b5cf6" }} />
                      <span>Course / Batch</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Certificate">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CardMembership sx={{ fontSize: 18, color: "#f59e0b" }} />
                      <span>Certificate</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Account">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <AccountCircle sx={{ fontSize: 18, color: "#06b6d4" }} />
                      <span>Account / Profile</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Technical">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Build sx={{ fontSize: 18, color: "#ef4444" }} />
                      <span>Technical Issue</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Other">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <MoreHoriz sx={{ fontSize: 18, color: "#64748b" }} />
                      <span>Other</span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Subject */}
            <Grid item  size={{ xs: 6, md: 6 }}>
              <TextField
                label="Subject *"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                  
                placeholder="e.g. Attendance marked absent by mistake"
                sx={{
                  "& .MuiOutlinedInput-root": {
                       borderRadius: 1.5,
                    fontSize: 13,
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject sx={{ color: "#3b82f6", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Message: remove startAdornment for better alignment */}
            <Grid item  size={{ xs: 12}}>
              <TextField
                label="Message *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                multiline
                minRows={6}
                placeholder="Explain what happened, date, course/batch, and what you want staff to do."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                }}
              />
            </Grid>

            {/* Attachment */}
            <Grid item size={{xs:12}}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AttachFile sx={{ fontSize: 18, color: "#3b82f6" }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0f172a" }}>
                  Attachment (Optional)
                </Typography>
              </Stack>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: attachment ? "#3b82f6" : "#cbd5e1",
                  borderRadius: 2,
                  p: 1,
                  textAlign: "center",
                  background: attachment ? "#eff6ff" : "#f8fafc",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "#3b82f6", background: "#f0f9ff" },
                }}
              >
                {attachment ? (
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Chip
                      label={attachment.name}
                      onDelete={() => setAttachment(null)}
                      deleteIcon={<Close />}
                      sx={{
                        maxWidth: 360,
                        bgcolor: "#3b82f6",
                        color: "white",
                        fontWeight: 600,
                        "& .MuiChip-deleteIcon": { color: "white" },
                      }}
                    />
                  </Stack>
                ) : (
                  <Stack spacing={1.5} alignItems="center">
                    <AttachFile sx={{ fontSize: 40, color: "#3b82f6", opacity: 0.5 }} />
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        borderRadius: 2,
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { borderColor: "#2563eb", background: "#eff6ff" },
                      }}
                    >
                      Choose File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: PDF, JPG, PNG (Max 10MB)
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Grid>

            {/* Actions */}
            <Grid item size={{xs:12}}>
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                {/* Reset */}
                <Button
                  type="button"
                  variant="outlined"
                  onClick={resetForm}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.4,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    borderColor: "#cbd5e1",
                    color: "#64748b",
                    "&:hover": { borderColor: "#94a3b8", background: "#f8fafc" },
                  }}
                >
                  Reset Form
                </Button>
                  {/* Send */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !token}
                  startIcon={<Send />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.4,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    boxShadow: "0 6px 18px rgba(37, 99, 235, 0.25)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      boxShadow: "0 10px 22px rgba(37, 99, 235, 0.32)",
                    },
                    "&:disabled": { background: "#cbd5e1", color: "#94a3b8" },
                  }}
                >
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default RaiseQuery;
