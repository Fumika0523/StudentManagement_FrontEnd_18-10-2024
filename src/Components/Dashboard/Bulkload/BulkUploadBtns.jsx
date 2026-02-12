import React, { useRef, useState } from "react";
import { Box, Button, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FiDownload, FiUpload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import RBButton from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

const BulkUploadBtns = ({
  templateUrl,
  importUrl,
  modalTitle = "Bulk Upload",
  onRefresh, // async () => refetch data
}) => {
  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const openUploadModal = () => {
    closeMenu();
    setShowUploadModal(true);
  };
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // upload state
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const downloadTemplate = () => {
    try {
      window.open(templateUrl, "_blank");
    } catch (e) {
      toast.error("Downloading Excel Template failed");
      console.error(e);
    }
  };

  const onFilePicked = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const uploadExcel = async () => {
    if (!file) {
      toast.error("Please choose an Excel file first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(importUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Uploaded successfully!");
      if (onRefresh) await onRefresh();

      closeUploadModal();
    } catch (e) {
      toast.error("Upload failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Actions dropdown */}
      <Button
        variant="outlined"
        startIcon={<MoreVertIcon size={18} />}
        onClick={openMenu}
        sx={{ borderRadius: 2, color: "#2c51c1", borderColor: "#2c51c1" }}
      >
        Actions
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 260 } }}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            downloadTemplate();
          }}
        >
          <ListItemIcon>
            <FiDownload size={18} />
          </ListItemIcon>
          <ListItemText primary="Download Excel Template" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={openUploadModal}>
          <ListItemIcon>
            <FiUpload size={18} />
          </ListItemIcon>
          <ListItemText primary="Upload a file" />
        </MenuItem>
      </Menu>

      {/* Upload modal */}
      <Modal show={showUploadModal} onHide={closeUploadModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Upload Excel (.xlsx / .xls / .csv)
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={onFilePicked}
              style={{ display: "none" }}
            />

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <RBButton
                variant="outline-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Choose file
              </RBButton>

              <div style={{ fontSize: 13 }}>
                {file?.name ? file.name : <span style={{ color: "#9ca3af" }}>No file selected</span>}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2">
              <RBButton variant="secondary" onClick={closeUploadModal} disabled={loading}>
                Cancel
              </RBButton>

              <RBButton variant="primary" disabled={!file || loading} onClick={uploadExcel}>
                {loading ? "Uploading..." : "Upload"}
              </RBButton>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BulkUploadBtns;
