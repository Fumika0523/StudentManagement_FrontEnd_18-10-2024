import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ApprovePage() {
  const [message, setMessage] = useState("Processing your request...");
  const [isProcessed, setIsProcessed] = useState(false);

  // Extract batchId + action from URL
  const searchParams = new URLSearchParams(window.location.search);
  const batchId = searchParams.get("batchId");
  const action = searchParams.get("action");

  useEffect(() => {
    const handleApproval = async () => {
      try {
        // Prevent double processing
        if (!batchId || !action) {
          setMessage("Invalid approval link.");
          setIsProcessed(true);
          return;
        }

        let response;

        if (action === "approve") {
          response = await axios.patch(
            `http://localhost:8001/batch/approve/${batchId}`
          );
        } else if (action === "decline") {
          response = await axios.patch(
            `http://localhost:8001/batch/decline/${batchId}`
          );
        } else {
          setMessage("Invalid approval link.");
          return;
        }

        setMessage(response.data.message);
        toast.success(response.data.message);
        setIsProcessed(true);

      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          "Something went wrong. This link might be expired.";

        setMessage(errorMsg);
        toast.error(errorMsg);
        setIsProcessed(true);
      }
    };

    handleApproval();
  }, [batchId, action]);

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "80px",
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>{message}</h2>

        {isProcessed && (
          <button
            onClick={() => (window.location.href = "/batchdata")}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#4e73df",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go to Batch Page
          </button>
        )}
      </div>
    </div>
  );
}

export default ApprovePage;
