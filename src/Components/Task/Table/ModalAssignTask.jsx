import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import RBButton from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FiClipboard } from "react-icons/fi";

const ModalAssignTask = ({ show, onClose, task, batchData, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  useEffect(() => {
    if (!show) {
      setLoading(false);
      setSelectedBatchId("");
    }
  }, [show]);

  const courseName = task?.courseName || "";
  const allocatedDay = task?.allocatedDay ?? "-";

  const filteredBatches = (batchData || []).filter(
    (b) => b?.courseName === courseName && b?.status === "In Progress"
  );

  const selectedBatch = filteredBatches.find((b) => b?._id === selectedBatchId);
  const selectedBatchNumber =
    selectedBatch?.batchNumber || selectedBatch?.batchNo || selectedBatch?.batchName || "";

  const handleConfirm = async () => {
    if (!onConfirm || loading || !task || !selectedBatchId) return;
    try {
      setLoading(true);
      await onConfirm({
        taskDetailId: task.taskId,       
        courseName,
        allocatedDay,
        batchId: selectedBatchId,       
        batchNumber: selectedBatchNumber 
      });
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const noBatches = courseName && filteredBatches.length === 0;

  return (
    <Modal show={show} 
    onHide={onClose} 
    centered  
    size="lg"
      style={{ "--bs-modal-border-radius": "16px" }}>
         <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #1f3fbf 0%, #1b2f7a 100%)",
          color: "white",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
          padding: "20px 24px",
        }}
      >
        <Modal.Title className="d-flex align-items-center gap-2">
          <FiClipboard />
          Assign Task
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            padding: 14,
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
          {/* Allocated Day */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Allocated Day</div>
              <div>{allocatedDay === "-" ? "-" : `Day ${allocatedDay}`}</div>
            </div>
            {/* Course Name */}
              <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Course</div>
              <div>{courseName || "-"}</div>
            </div>
            {/* Task Question */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Task Question</div>
              <div style={{ lineHeight: 1.5 }}>{task?.taskQuestion || "-"}</div>
            </div>
            {/* Select Batch Number */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Select Batch Number</div>

              <Form.Select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                disabled={!courseName || noBatches}
              >
                <option value="">
                  {noBatches ? "No 'In Progress' batch for this course" : "Select a batch..."}
                </option>

                {filteredBatches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchNumber || b.batchNo || b.batchName || b._id}
                  </option>
                ))}
              </Form.Select>

              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
                Current assigned batches:{" "}
                {task?.batchNumbers?.length ? task.batchNumbers.join(", ") : "-"}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <RBButton variant="secondary" onClick={onClose} disabled={loading}>
          Close
        </RBButton>

        <RBButton
          variant="primary"
          onClick={handleConfirm}
          disabled={loading || !selectedBatchId}
        >
          {loading ? "Assigning..." : "Confirm Assign"}
        </RBButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignTask;


//Only inprogress batch should show
//Improve the UI
