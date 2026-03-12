import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FiClipboard, FiBook, FiCalendar, FiLayers, FiCheckCircle } from "react-icons/fi";

const ModalAssignTask = ({ show, onClose, task, batchData, onConfirm, setTaskData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  useEffect(() => {
    if (!show) {
      setLoading(false);
      setSelectedBatchId("");
    }
  }, [show]);

  const courseName   = task?.courseName || "";
  const allocatedDay = task?.allocatedDay ?? "-";

  // Only show "In Progress" batches matching the task's course
  const filteredBatches = (batchData || []).filter(
    (b) => b?.courseName === courseName && b?.status === "In Progress"
  );

  const selectedBatch = filteredBatches.find((b) => b?._id === selectedBatchId);
  const selectedBatchNumber =
    selectedBatch?.batchNumber || selectedBatch?.batchNo || selectedBatch?.batchName || "";

  const noBatches = courseName && filteredBatches.length === 0;

  
  const handleConfirm = async () => {
    if (!onConfirm || loading || !task || !selectedBatchId) return;
    try {
      setLoading(true);
      await onConfirm({
        taskDetailId: task.taskId,
        courseName,
        allocatedDay,
        batchId: selectedBatchId,
        batchNumber: selectedBatchNumber,
      });
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  // ── Styles 
  const infoCardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px 18px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  };

  const iconWrapStyle = (color) => ({
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    backgroundColor: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "2px",
  };

  const valueStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  };

  const selectStyle = {
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
    backgroundColor: noBatches ? "#f8fafc" : "#fff",
    color: noBatches ? "#94a3b8" : "#1e293b",
    cursor: noBatches ? "not-allowed" : "pointer",
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      style={{ "--bs-modal-border-radius": "16px" }}
    >
      {/* Header */}
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(180deg, #1f3fbf 0%, #1b2f7a 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
        }}
      >
        <Modal.Title style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", fontWeight: 700 }}>
          <FiClipboard size={22} />
          Assign Task to Batch
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "20px 24px", backgroundColor: "#f9fafb" }}>

        {/* Allocated Day */}
        <div style={infoCardStyle}>
          <div style={iconWrapStyle("#eff6ff")}>
            <FiCalendar size={16} color="#3b82f6" />
          </div>
          <div>
            <div style={labelStyle}>Allocated Day</div>
            <div style={valueStyle}>
              {allocatedDay === "-" ? "—" : `Day ${allocatedDay}`}
            </div>
          </div>
        </div>

        {/* Course Name */}
        <div style={infoCardStyle}>
          <div style={iconWrapStyle("#f0fdf4")}>
            <FiBook size={16} color="#22c55e" />
          </div>
          <div>
            <div style={labelStyle}>Course</div>
            <div style={valueStyle}>{courseName || "—"}</div>
          </div>
        </div>

        {/* Task Question */}
        <div style={infoCardStyle}>
          <div style={iconWrapStyle("#fefce8")}>
            <FiClipboard size={16} color="#eab308" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Task Question</div>
            <div style={{ fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
              {task?.taskQuestion || "—"}
            </div>
          </div>
        </div>

        {/* Select Batch */}
        <div style={{ ...infoCardStyle, flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={iconWrapStyle("#f5f3ff")}>
              <FiLayers size={16} color="#8b5cf6" />
            </div>
            <div style={labelStyle}>Select Batch (In Progress only)</div>
          </div>

          <Form.Select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            disabled={!courseName || noBatches}
            style={selectStyle}
          >
            <option value="">
              {noBatches
                ? "No 'In Progress' batch available for this course"
                : "Select a batch..."}
            </option>
            {filteredBatches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.batchNumber || b.batchNo || b.batchName || b._id}
              </option>
            ))}
          </Form.Select>

          {/* Already assigned batches */}
          {task?.batchNumbers?.length > 0 && (
            <div style={{
              fontSize: "12px",
              color: "#64748b",
              backgroundColor: "#f1f5f9",
              borderRadius: "6px",
              padding: "8px 10px",
            }}>
              <span style={{ fontWeight: 600 }}>Already assigned: </span>
              {task.batchNumbers.join(", ")}
            </div>
          )}
        </div>

        {/* Warning if no batches */}
        {noBatches && (
          <div style={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#c2410c",
            marginTop: "4px",
          }}>
            ⚠️ No batch with status <strong>"In Progress"</strong> found for <strong>{courseName}</strong>.
          </div>
        )}

      </Modal.Body>

      {/* Footer */}
      <Modal.Footer style={{
        borderTop: "1px solid #e5e7eb",
        padding: "14px 24px",
        backgroundColor: "#ffffff",
        borderRadius: "0 0 16px 16px",
        gap: "8px",
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #d1d5db",
            color: "#6b7280",
            fontWeight: 600,
            fontSize: "13px",
            padding: "7px 18px",
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={loading || !selectedBatchId}
          style={{
            background: !selectedBatchId
              ? "#e2e8f0"
              : "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
            border: "none",
            fontWeight: 700,
            fontSize: "13px",
            padding: "7px 22px",
            borderRadius: "8px",
            color: !selectedBatchId ? "#94a3b8" : "#fff",
            boxShadow: !selectedBatchId ? "none" : "0 2px 8px rgba(31,63,191,0.3)",
            cursor: !selectedBatchId ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FiCheckCircle size={15} />
          {loading ? "Assigning..." : "Confirm Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignTask;