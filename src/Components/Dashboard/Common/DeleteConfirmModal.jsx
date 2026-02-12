import Modal from "react-bootstrap/Modal";
import RBButton from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmModal = ({
  show,
  onClose,
  title = "Delete confirmation",
  onConfirm, // async () => {}
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const [loading, setLoading] = useState(false);

  const [isDeleteHover, setIsDeleteHover] = useState(false);
  const [isCancelHover, setIsCancelHover] = useState(false);

  useEffect(() => {
    if (!show) {
      setLoading(false);
      setIsDeleteHover(false);
      setIsCancelHover(false);
    }
  }, [show]);

  const handleConfirm = async () => {
    if (!onConfirm || loading) return;
    try {
      setLoading(true);
      await onConfirm();
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  // Delete button styles
  const deleteBaseBg = "#960910";
  const deleteHoverBg = "#7b070d";

  // Cancel button styles (soft outline look)
  const cancelBaseBg = "#ffffff";
  const cancelHoverBg = "#e4e4e6";
  const cancelBorder = "#bcbdbf";
  const cancelTextColor = "#111827";

  return (
    <Modal
      show={show}
      onHide={loading ? undefined : onClose}
      centered
      backdrop={loading ? "static" : true}
      keyboard={!loading}
    >
      <Modal.Body style={{ padding: 18 }}>
        {/* Top row (icon + title) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#fff4f4",
              display: "grid",
              placeItems: "center",
              border: "1px solid #ffe0e0",
              flex: "0 0 auto",
            }}
          >
            <FiAlertTriangle size={20} style={{ color: "#d32f2f" }} />
          </span>

          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              {title}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {/* Cancel */}
          <RBButton
            onClick={onClose}
            disabled={loading}
            onMouseEnter={() => !loading && setIsCancelHover(true)}
            onMouseLeave={() => setIsCancelHover(false)}
            style={{
              borderRadius: 10,
              padding: "8px 14px",
              minWidth: 110,
              backgroundColor: isCancelHover ? cancelHoverBg : cancelBaseBg,
              border: `1.5px solid ${cancelBorder}`,
              color: cancelTextColor,
              boxShadow: isCancelHover ? "0 6px 16px rgba(17, 24, 39, 0.08)" : "none",
              // transform: isCancelHover ? "translateY(-1px)" : "translateY(0)",
              transition: "all 140ms ease",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {cancelText}
          </RBButton>

          {/* Delete */}
          <RBButton
            onClick={handleConfirm}
            disabled={loading}
            onMouseEnter={() => !loading && setIsDeleteHover(true)}
            onMouseLeave={() => setIsDeleteHover(false)}
            style={{
              borderRadius: 10,
              padding: "8px 14px",
              minWidth: 110,
              backgroundColor: isDeleteHover ? deleteHoverBg : deleteBaseBg,
              border: "none",
              boxShadow: isDeleteHover
                ? "0 10px 22px rgba(150, 9, 16, 0.35)"
                : "0 6px 18px rgba(150, 9, 16, 0.25)",
              // transform: isDeleteHover ? "translateY(-1px)" : "translateY(0)",
              transition: "all 140ms ease",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Deleting..." : confirmText}
          </RBButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;
