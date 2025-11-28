import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {url} from '../../../utils/constant'

function ApprovePage() {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // preventing double-click, repeating API calls,
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const config = {
    headers: {
      Authorization:`Bearer ${token}`
    },
  };

  if (!token) {
  // Not logged in → redirect automatically
  window.location.href = `/staff-signin?redirect=/approve&batchId=${batchId}`;
  return null;
}


  const searchParams = new URLSearchParams(window.location.search);
  const batchId = searchParams.get("batchId");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        if (!batchId) {
          console.log("Error invalid approval link")
          setError("Invalid approval link. Missing batch ID.");
          setLoading(false);
          return;
        }

        if (!token || role !== "admin") {
          setError("You must be logged in as Admin to approve this batch.");
          setLoading(false);
          return;
        }

        // call backend to get single batch details
       const res = await axios.get(`${url}/batch/${batchId}`, config);
        setBatch(res.data.getSingleBatch);
        console.log("batch",res.data);
        setBatch(res.data)
        setLoading(false)
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Failed to load batch details. The link may be invalid.";
        setError(msg);
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId, token, role ]); 

const handleDecision = async (action) => {
  try {
    setProcessing(true);
    setError("");

    if (!batchId) {
      toast.error("Missing batch ID.");
      setProcessing(false);
      return;
    }

    let endpoint = "";

    if (action === "approve") {
      endpoint = `${url}/approve/${batchId}`;
    } else if (action === "decline") {
      endpoint = `${url}/decline/${batchId}`;
    } else {
      toast.error("Unknown action.");
      setProcessing(false);
      return;
    }
    //PUT replaces the entire resource, while PATCH updates only the specified fields. For approval actions like “approve/decline,” we don’t want to overwrite the batch, we only update 1–2 fields, so PATCH is the correct and safer method.

    const res = await axios.patch(endpoint, {}, config);

    toast.success(res.data.message);

    // Update UI
    setBatch((prev) => ({
      ...prev,
      approvalStatus: action === "approve" ? "approved" : "declined",
    }));

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      "Something went wrong while processing this request.";

    setError(msg);
    toast.error(msg);
  } finally {
    setProcessing(false);
  }
};


  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2>Loading batch details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#b91c1c" }}>{error}</h2>
          <button
            style={primaryBtn}
            onClick={() => (window.location.href = "/batchdata")}
          >
            Go to Batch Page
          </button>
        </div>
      </div>
    );
  }

  // if (!batch) {
  //   return (
  //     <div style={wrapperStyle}>
  //       <div style={cardStyle}>
  //         <h2>No batch found for this link.</h2>
  //         <button
  //           style={primaryBtn}
  //           onClick={() => (window.location.href = "/batchdata")}
  //         >
  //           Go to Batch Page
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "10px" }}>Review Batch Approval Request</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Please review the batch details carefully before approving or declining.
        </p>

        {/* ---------- BATCH INFO ---------- */}
        <div style={infoRow}>
          <span style={label}>Batch No:</span>
          <span style={value}>{batch?.singleBatch?.batchNumber}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Course:</span>
          <span style={value}>{batch?.singleBatch?.courseName}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Requested By:</span>
          <span style={value}>{batch?.singleBatch?.requestedBy}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Status:</span>
          <span style={value}>{batch?.singleBatch?.status}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Session Type:</span>
          <span style={value}>{batch?.singleBatch?.sessionType}</span>
        </div>

        <div style={infoRow}>
          <span style={label}>Location:</span>
          <span style={value}>{batch?.singleBatch?.location}</span>
        </div>


        {/* ---------- ACTION BUTTONS ---------- */}
        <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            style={{
              ...primaryBtn,
              opacity: processing ? 0.7 : 1,
              cursor: processing ? "not-allowed" : "pointer",
            }}
            onClick={() => handleDecision("approve")}
            disabled={processing}
          >
            {processing ? "Processing..." : "Approve"}
          </button>

          <button
            style={{
              ...secondaryBtn,
              opacity: processing ? 0.7 : 1,
              cursor: processing ? "not-allowed" : "pointer",
            }}
            onClick={() => handleDecision("decline")}
            disabled={processing}
          >
            Decline
          </button>
        </div>

        {/* ---------- BACK LINK ---------- */}
        <button
          style={{ ...linkBtn, marginTop: "18px" }}
          onClick={() => (window.location.href = "/batchdata")}
        >
          ← Back to Batch Page
        </button>
      </div>
    </div>
  );
}

/* ---------- SIMPLE INLINE STYLES ---------- */
const wrapperStyle = {
  textAlign: "center",
  paddingTop: "80px",
  minHeight: "100vh",
  background: "#f8f9fa",
};

const cardStyle = {
  maxWidth: "520px",
  margin: "0 auto",
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  textAlign: "left",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const label = {
  fontWeight: 600,
  color: "#4b5563",
};

const value = {
  color: "#111827",
};

const primaryBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#4e73df",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const secondaryBtn = {
  padding: "10px 18px",
  borderRadius: "6px",
  border: "1px solid #dc2626",
  backgroundColor: "white",
  color: "#dc2626",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#4b5563",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "13px",
};

export default ApprovePage;
