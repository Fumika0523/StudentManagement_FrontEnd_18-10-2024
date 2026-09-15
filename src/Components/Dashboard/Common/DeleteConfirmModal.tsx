import {
  useEffect,
  useState,
} from "react";

import Modal from "react-bootstrap/Modal";
import RBButton from "react-bootstrap/Button";

import {
  FiAlertTriangle,
} from "react-icons/fi";


// ========================================
// COMPONENT PROPS
// ========================================

interface DeleteConfirmModalProps {
  /*
   * Controls whether the modal is visible.
   */
  show: boolean;

  /*
   * Called when the user closes/cancels the modal.
   *
   * Keep this optional because the original
   * component already used optional chaining.
   */
  onClose?: () => void;

  /*
   * Modal heading.
   */
  title?: string;

  /*
   * Delete action supplied by the parent.
   *
   * It may either be synchronous or asynchronous.
   */
  onConfirm?: () =>
    void | Promise<void>;

  confirmText?: string;

  cancelText?: string;
}


// ========================================
// COMPONENT
// ========================================

const DeleteConfirmModal = ({
  show,
  onClose,
  title = "Delete confirmation",
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmModalProps) => {
  // ========================================
  // LOADING STATE
  // ========================================

  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      false
    );


  // ========================================
  // HOVER STATES
  // ========================================

  const [
    isDeleteHover,
    setIsDeleteHover,
  ] =
    useState<boolean>(
      false
    );


  const [
    isCancelHover,
    setIsCancelHover,
  ] =
    useState<boolean>(
      false
    );


  // ========================================
  // RESET WHEN MODAL CLOSES
  // ========================================

  useEffect(() => {
    /*
     * Reset temporary UI state whenever
     * the modal is closed.
     */
    if (!show) {
      setLoading(false);

      setIsDeleteHover(false);

      setIsCancelHover(false);
    }
  }, [
    show,
  ]);


  // ========================================
  // CONFIRM DELETE
  // ========================================

  const handleConfirm =
    async (): Promise<void> => {
      /*
       * Prevent duplicate requests while an
       * existing delete operation is running.
       */
      if (
        !onConfirm ||
        loading
      ) {
        return;
      }


      try {
        setLoading(
          true
        );


        /*
         * `await` works with both:
         *
         * () => void
         * () => Promise<void>
         */
        await onConfirm();


        onClose?.();
      } finally {
        /*
         * Always clear loading even if the
         * parent delete action throws an error.
         */
        setLoading(
          false
        );
      }
    };


  // ========================================
  // BUTTON COLOURS
  // ========================================

  const deleteBaseBg =
    "#960910";

  const deleteHoverBg =
    "#7b070d";


  const cancelBaseBg =
    "#ffffff";

  const cancelHoverBg =
    "#e4e4e6";

  const cancelBorder =
    "#bcbdbf";

  const cancelTextColor =
    "#111827";


  return (
    <Modal
      show={
        show
      }
      onHide={
        loading
          ? undefined
          : onClose
      }
      centered
      backdrop={
        loading
          ? "static"
          : true
      }
      keyboard={
        !loading
      }
    >
      <Modal.Body
        style={{
          padding:
            18,
        }}
      >
        {/* ========================================
            ICON + TITLE
        ======================================== */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              12,

            marginBottom:
              14,
          }}
        >
          <span
            style={{
              width:
                44,

              height:
                44,

              borderRadius:
                999,

              background:
                "#fff4f4",

              display:
                "grid",

              placeItems:
                "center",

              border:
                "1px solid #ffe0e0",

              flex:
                "0 0 auto",
            }}
          >
            <FiAlertTriangle
              size={
                20
              }
              style={{
                color:
                  "#d32f2f",
              }}
            />
          </span>


          <div
            style={{
              textAlign:
                "left",
            }}
          >
            <div
              style={{
                fontSize:
                  18,

                fontWeight:
                  700,

                color:
                  "#111827",

                lineHeight:
                  1.2,
              }}
            >
              {title}
            </div>
          </div>
        </div>


        {/* ========================================
            ACTION BUTTONS
        ======================================== */}

        <div
          style={{
            display:
              "flex",

            gap:
              10,

            justifyContent:
              "flex-end",
          }}
        >
          {/* Cancel */}

          <RBButton
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading
            }
            onMouseEnter={() => {
              if (
                !loading
              ) {
                setIsCancelHover(
                  true
                );
              }
            }}
            onMouseLeave={() =>
              setIsCancelHover(
                false
              )
            }
            style={{
              borderRadius:
                10,

              padding:
                "8px 14px",

              minWidth:
                110,

              backgroundColor:
                isCancelHover
                  ? cancelHoverBg
                  : cancelBaseBg,

              border:
                `1.5px solid ${cancelBorder}`,

              color:
                cancelTextColor,

              boxShadow:
                isCancelHover
                  ? "0 6px 16px rgba(17, 24, 39, 0.08)"
                  : "none",

              transition:
                "all 140ms ease",

              opacity:
                loading
                  ? 0.75
                  : 1,
            }}
          >
            {cancelText}
          </RBButton>


          {/* Delete */}

          <RBButton
            type="button"
            onClick={() =>
              void handleConfirm()
            }
            disabled={
              loading
            }
            onMouseEnter={() => {
              if (
                !loading
              ) {
                setIsDeleteHover(
                  true
                );
              }
            }}
            onMouseLeave={() =>
              setIsDeleteHover(
                false
              )
            }
            style={{
              borderRadius:
                10,

              padding:
                "8px 14px",

              minWidth:
                110,

              backgroundColor:
                isDeleteHover
                  ? deleteHoverBg
                  : deleteBaseBg,

              border:
                "none",

              boxShadow:
                isDeleteHover
                  ? "0 10px 22px rgba(150, 9, 16, 0.35)"
                  : "0 6px 18px rgba(150, 9, 16, 0.25)",

              transition:
                "all 140ms ease",

              opacity:
                loading
                  ? 0.75
                  : 1,
            }}
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </RBButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;