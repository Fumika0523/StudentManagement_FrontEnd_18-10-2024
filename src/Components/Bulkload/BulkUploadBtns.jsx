import React, { useRef, useState } from "react";
import {
  Box, Button, Divider, Typography, Stack, Chip, CircularProgress,
} from "@mui/material";
import {
  FiDownload, FiUpload, FiTrash2, FiChevronDown, FiFileText, FiAlertTriangle, FiX, FiCheck,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed", inset: 0, zIndex: 1300,
        bgcolor: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <Box onClick={(e) => e.stopPropagation()} sx={{ width: "100%", maxWidth: 460, mx: 2 }}>
        {children}
      </Box>
    </Box>
  );
};


const BulkUploadBtns = ({
  templateUrl,
  importUrl,
  deleteUrl,       // NEW: endpoint for bulk delete
  modalTitle = "Bulk Upload",
  onRefresh,
}) => {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeModal, setActiveModal]     = useState(null); // "upload" | "delete"
  const [file, setFile]                   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [dragOver, setDragOver]           = useState(false);
  const fileInputRef                      = useRef(null);
  const menuRef                           = useRef(null);
const token = localStorage.getItem("token");

  const openModal  = (type) => { setMenuOpen(false); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const downloadTemplate = () => {
    try { window.open(templateUrl, "_blank"); setMenuOpen(false); }
    catch (e) { toast.error("Failed to download template"); }
  };

  const onFilePicked = (e) => setFile(e.target.files?.[0] || null);

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && /\.(xlsx|xls|csv)$/i.test(f.name)) setFile(f);
    else toast.error("Please drop an .xlsx, .xls, or .csv file");
  };

  const uploadExcel = async () => {
    if (!file) return toast.error("Please choose an Excel file first");
    try {

      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(importUrl, formData, {headers:{"Content-Type":"multipart/form-data"}});
      const { inserted = 0, updated = 0, failed = 0 } = res.data || {};
      toast.success(`Done! ${inserted} added · ${updated} updated${failed ? ` · ${failed} failed` : ""}`);
      if (onRefresh) await onRefresh();
      closeModal();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };


  const deleteExcel = async () => {
    if (!file) return toast.error("Please choose an Excel file first");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(deleteUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { deleted = 0, failed = 0 } = res.data || {};
      toast.success(`Done! ${deleted} deleted${failed ? ` · ${failed} failed` : ""}`);
      if (onRefresh) await onRefresh();
      closeModal();
} catch (e) {
  console.log("AXIOS ERROR FULL:", e);
  console.log("STATUS:", e?.response?.status);
  console.log("DATA:", e?.response?.data);
  console.log("HEADERS:", e?.response?.headers);
  toast.error(e?.response?.data?.message || e.message || "Request failed");
}

  };

  const DropZone = () => (
    <Box
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      sx={{
        border: "2px dashed",
        borderColor: dragOver ? "#3b82f6" : file ? "#3b82f6" : "#d1d5db",
        borderRadius: "8px",
        p: 3,
        textAlign: "center",
        bgcolor: dragOver ? "#eff6ff" : file ? "#f0f9ff" : "#f9fafb",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": { borderColor: "#3b82f6", bgcolor: "#f0f9ff" },
      }}
    >
      {file ? (
        <Stack spacing={1} alignItems="center">
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiCheck size={20} color="#3b82f6" />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
            {file.name}
          </Typography>
          <Chip
            label={`${(file.size / 1024).toFixed(1)} KB`}
            size="small"
            sx={{ fontSize: 11, bgcolor: "#dbeafe", color: "#3b82f6", height: 20 }}
          />
          <Typography
            onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            sx={{ fontSize: 11, color: "#ef4444", cursor: "pointer", textDecoration: "underline", mt: 0.5 }}
          >
            Remove
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1} alignItems="center">
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiFileText size={20} color="#64748b" />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
            Drop file here or <span style={{ color: "#3b82f6" }}>browse</span>
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
            .xlsx · .xls · .csv supported
          </Typography>
        </Stack>
      )}
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={onFilePicked} style={{ display: "none" }} />
    </Box>
  );

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────────────────────── */}
      <Box sx={{ position: "relative", display: "inline-block" }} ref={menuRef}>
        <Button
          variant="outlined"
          endIcon={<FiChevronDown size={14} style={{ transition: "transform 0.2s", transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />}
          onClick={() => setMenuOpen((p) => !p)}
          sx={{
            borderRadius: "8px",
            borderColor: "#1f3fbf",
            color: "#1f3fbf",
            fontWeight: 600,
            fontSize: 13,
            textTransform: "none",
            px: 2,
            py: 0.8,
            "&:hover": { bgcolor: "#eff6ff", borderColor: "#1b2f7a" },
          }}
        >
          Bulk Actions
        </Button>

        {/* ── Dropdown Menu ─────────────────────────────────────────────────── */}
        {menuOpen && (
          <>
            {/* click-away */}
            <Box onClick={() => setMenuOpen(false)} sx={{ position: "fixed", inset: 0, zIndex: 1200 }} />

            <Box
              sx={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                zIndex: 1300, width: 260,
                bgcolor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box sx={{ px: 2, py: 1.5, bgcolor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Bulk Actions
                </Typography>
              </Box>

              {/* Download Template */}
              <Box
                onClick={downloadTemplate}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.4, cursor: "pointer",
                  "&:hover": { bgcolor: "#f8fafc" },
                  transition: "background 0.15s",
                }}
              >
                <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FiDownload size={14} color="#3b82f6" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Download Template</Typography>
                  <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Get the Excel format</Typography>
                </Box>
              </Box>

              <Divider sx={{ mx: 2, borderColor: "#f1f5f9" }} />

              {/* Upload */}
              <Box
                onClick={() => openModal("upload")}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.4, cursor: "pointer",
                  "&:hover": { bgcolor: "#f8fafc" },
                  transition: "background 0.15s",
                }}
              >
                <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FiUpload size={14} color="#10b981" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Upload & Add / Update</Typography>
                  <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Insert or update records</Typography>
                </Box>
              </Box>

              <Divider sx={{ mx: 2, borderColor: "#f1f5f9" }} />

              {/* Delete */}
              <Box
                onClick={() => openModal("delete")}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.4, cursor: "pointer",
                  "&:hover": { bgcolor: "#fff5f5" },
                  transition: "background 0.15s",
                }}
              >
                <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FiTrash2 size={14} color="#ef4444" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Upload & Delete</Typography>
                  <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Remove records by file</Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* ── Upload Modal ───────────────────────────────────────────────────── */}
      <Modal open={activeModal === "upload"} onClose={closeModal}>
        <Box sx={{ bgcolor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          {/* Header */}
          <Box sx={{ background: "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiUpload size={18} color="white" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                  {modalTitle}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", mt: 0.3 }}>
                  Add or update records from Excel
                </Typography>
              </Box>
            </Stack>
            <Box onClick={closeModal} sx={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}>
              <FiX size={20} />
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ p: 3, bgcolor: "#f9fafb" }}>
            <DropZone />

            {/* Info note */}
            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 2, p: 1.5, bgcolor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
              <FiFileText size={14} color="#3b82f6" style={{ marginTop: 1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, color: "#3b82f6", lineHeight: 1.6 }}>
                Existing records matched by email will be <strong>updated</strong>. New emails will be <strong>inserted</strong>.
              </Typography>
            </Stack>
          </Box>

          {/* Footer */}
          <Box sx={{ px: 3, py: 2, bgcolor: "white", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button onClick={closeModal} disabled={loading} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: 13, px: 2.5, color: "#64748b", border: "1px solid #d1d5db", "&:hover": { bgcolor: "#f8fafc" } }}>
              Cancel
            </Button>
            <Button
              onClick={uploadExcel}
              disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <FiUpload size={14} />}
              sx={{
                borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: 13, px: 2.5,
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
                "&:disabled": { bgcolor: "#d1d5db", color: "#9ca3af", background: "none" },
              }}
            >
              {loading ? "Uploading..." : "Upload & Process"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
      <Modal open={activeModal === "delete"} onClose={closeModal}>
        <Box sx={{ bgcolor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          {/* Header */}
          <Box sx={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiTrash2 size={18} color="white" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                  Bulk Delete
                </Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", mt: 0.3 }}>
                  Remove records using an Excel file
                </Typography>
              </Box>
            </Stack>
            <Box onClick={closeModal} sx={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}>
              <FiX size={20} />
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ p: 3, bgcolor: "#f9fafb" }}>
            <DropZone />

            {/* Warning */}
            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 2, p: 1.5, bgcolor: "#fff5f5", borderRadius: "8px", border: "1px solid #fecaca" }}>
              <FiAlertTriangle size={14} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, color: "#ef4444", lineHeight: 1.6 }}>
                <strong>Warning:</strong> Records matched by email in the file will be <strong>permanently deleted</strong>. This action cannot be undone.
              </Typography>
            </Stack>
          </Box>

          {/* Footer */}
          <Box sx={{ px: 3, py: 2, bgcolor: "white", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button onClick={closeModal} disabled={loading} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: 13, px: 2.5, color: "#64748b", border: "1px solid #d1d5db", "&:hover": { bgcolor: "#f8fafc" } }}>
              Cancel
            </Button>
            <Button
              onClick={deleteExcel}
              disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <FiTrash2 size={14} />}
              sx={{
                borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: 13, px: 2.5,
                background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                color: "white",
                "&:hover": { background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" },
                "&:disabled": { bgcolor: "#d1d5db", color: "#9ca3af", background: "none" },
              }}
            >
              {loading ? "Deleting..." : "Delete Records"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BulkUploadBtns;