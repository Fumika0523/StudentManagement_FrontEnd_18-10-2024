import {
  useEffect,
  useState,
} from "react";

import type {
  CSSProperties,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";

import {
  IoIosArrowRoundBack,
  IoIosInformationCircle,
} from "react-icons/io";

import {
  url,
} from "../../utils/constant";

import type {
  Batch,
} from "../../../types/batch";


// ========================================
// API RESPONSE TYPES
// ========================================

/*
 * Backend GET /batch/:id returns:
 *
 * {
 *   message: "...",
 *   singleBatch: { ... }
 * }
 */
interface SingleBatchResponse {
  message: string;
  singleBatch: Batch;
}


/*
 * Approve / decline endpoints return a message
 * and may also return the updated Batch.
 */
interface ApprovalResponse {
  message: string;
  batch?: Batch;
}


// ========================================
// APPROVAL ACTION TYPE
// ========================================

/*
 * TypeScript:
 * Only these two actions are valid.
 *
 * This prevents accidental values such as:
 *
 * handleDecision("accept")
 */
type ApprovalAction =
  | "approve"
  | "decline";


function ApprovePage() {
  // ========================================
  // URL / AUTH DATA
  // ========================================

  /*
   * Important:
   * In the old JSX version, batchId was used in the
   * login redirect BEFORE batchId had been declared.
   *
   * JavaScript can throw a ReferenceError in that case.
   *
   * We calculate it first here.
   */
  const searchParams =
    new URLSearchParams(
      window.location.search
    );

  const batchId =
    searchParams.get(
      "batchId"
    );

  const token =
    localStorage.getItem(
      "token"
    );

  const role =
    localStorage.getItem(
      "role"
    );


  // ========================================
  // COMPONENT STATE
  // ========================================

  /*
   * TypeScript:
   * We store the actual Batch object here rather than
   * the entire API response wrapper.
   */
  const [batch, setBatch] =
    useState<Batch | null>(
      null
    );

  const [loading, setLoading] =
    useState<boolean>(true);

  /*
   * Prevents double-clicking Approve / Decline
   * while the API request is running.
   */
  const [
    processing,
    setProcessing,
  ] = useState<boolean>(false);

  const [error, setError] =
    useState<string>("");


  // ========================================
  // AUTH CONFIG
  // ========================================

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };


  // ========================================
  // FETCH BATCH
  // ========================================

  useEffect(() => {
    /*
     * Not logged in:
     * redirect to Staff Sign In while preserving
     * the approval Batch ID.
     */
    if (!token) {
      const redirectBatchId =
        batchId
          ? `&batchId=${encodeURIComponent(
              batchId
            )}`
          : "";

      window.location.href =
        `/staff-signin?redirect=/approve${redirectBatchId}`;

      return;
    }


    const fetchBatch =
      async (): Promise<void> => {
        try {
          if (!batchId) {
            setError(
              "Invalid approval link. Missing batch ID."
            );

            setLoading(false);

            return;
          }


          if (
            role !== "admin"
          ) {
            setError(
              "You must be logged in as Admin to approve this batch."
            );

            setLoading(false);

            return;
          }


          /*
           * TypeScript:
           * Axios now knows the exact response structure.
           */
          const response =
            await axios.get<SingleBatchResponse>(
              `${url}/batch/${batchId}`,
              config
            );


          /*
           * The old JSX did this twice:
           *
           * setBatch(res.data.getSingleBatch)
           * setBatch(res.data)
           *
           * But the backend actually returns:
           *
           * res.data.singleBatch
           *
           * Store only the real Batch object.
           */
          setBatch(
            response.data.singleBatch
          );

          setLoading(false);
        } catch (
          caughtError: unknown
        ) {
          let message =
            "Failed to load batch details. The link may be invalid.";


          /*
           * TypeScript:
           * catch values are unknown.
           * Narrow to AxiosError before reading response.data.
           */
          if (
            axios.isAxiosError(
              caughtError
            )
          ) {
            const responseData =
              caughtError.response
                ?.data as
                | {
                    message?: string;
                  }
                | undefined;

            message =
              responseData?.message ??
              message;
          }


          setError(message);

          setLoading(false);
        }
      };


    void fetchBatch();

    // config is derived only from token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    batchId,
    token,
    role,
  ]);


  // ========================================
  // APPROVE / DECLINE
  // ========================================

  const handleDecision =
    async (
      action: ApprovalAction
    ): Promise<void> => {
      try {
        setProcessing(true);

        setError("");


        if (!batchId) {
          toast.error(
            "Missing batch ID."
          );

          return;
        }


        /*
         * TypeScript:
         * Because action can only be approve | decline,
         * choosing the endpoint is straightforward.
         */
        const endpoint =
          action === "approve"
            ? `${url}/approve/${batchId}`
            : `${url}/decline/${batchId}`;


        /*
         * PATCH is appropriate here because the approval
         * action updates only part of the Batch record
         * instead of replacing the whole Batch.
         */
        const response =
          await axios.patch<ApprovalResponse>(
            endpoint,
            {},
            config
          );


        toast.success(
          response.data.message
        );


        /*
         * Update the local UI immediately.
         *
         * TypeScript:
         * prev may be null, so keep null unchanged.
         */
        setBatch(
          (previous) => {
            if (!previous) {
              return previous;
            }

            return {
              ...previous,

              approvalStatus:
                action ===
                "approve"
                  ? "approved"
                  : "declined",
            };
          }
        );


        /*
         * Preserve the existing behaviour:
         * return to the Batch page shortly after success.
         */
        setTimeout(() => {
          window.location.href =
            "/batchdata";
        }, 800);
      } catch (
        caughtError: unknown
      ) {
        let message =
          "Something went wrong while processing this request.";


        if (
          axios.isAxiosError(
            caughtError
          )
        ) {
          const responseData =
            caughtError.response
              ?.data as
              | {
                  message?: string;
                }
              | undefined;

          message =
            responseData?.message ??
            message;
        }


        setError(message);

        toast.error(message);
      } finally {
        setProcessing(false);
      }
    };


  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2>
            Loading batch details...
          </h2>
        </div>
      </div>
    );
  }


  // ========================================
  // ERROR STATE
  // ========================================

  if (error) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              color: "#b91c1c",
            }}
          >
            {error}
          </h2>

          <button
            type="button"
            style={primaryBtn}
            onClick={() => {
              window.location.href =
                "/batchdata";
            }}
          >
            <IoIosArrowRoundBack />

            Go to Batch Page
          </button>
        </div>
      </div>
    );
  }


  // ========================================
  // APPROVAL PAGE
  // ========================================

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 className="mb-3 text-center">
          <IoIosInformationCircle />

          Batch Approval Request
        </h2>


        <p
          style={{
            color: "#6b7280",
            marginBottom:
              "20px",
          }}
        >
          Please review the batch
          details carefully before
          approving or declining.
        </p>


        {/* ========================================
            BATCH INFORMATION
        ======================================== */}

        <div style={infoRow}>
          <span style={label}>
            Batch No:
          </span>

          <span style={value}>
            {batch?.batchNumber ??
              "-"}
          </span>
        </div>


        <div style={infoRow}>
          <span style={label}>
            Course:
          </span>

          <span style={value}>
            {batch?.courseName ??
              "-"}
          </span>
        </div>


        <div style={infoRow}>
          <span style={label}>
            Requested By:
          </span>

          <span style={value}>
            {batch?.requestedBy ??
              "-"}
          </span>
        </div>


        <div style={infoRow}>
          <span style={label}>
            Status:
          </span>

          <span style={value}>
            {batch?.status ?? "-"}
          </span>
        </div>


        <div style={infoRow}>
          <span style={label}>
            Session Type:
          </span>

          <span style={value}>
            {batch?.sessionType ??
              "-"}
          </span>
        </div>


        <div style={infoRow}>
          <span style={label}>
            Location:
          </span>

          <span style={value}>
            {batch?.location ??
              "-"}
          </span>
        </div>


        {/* ========================================
            APPROVE / DECLINE BUTTONS
        ======================================== */}

        <div
          style={{
            marginTop: "24px",

            display: "flex",

            gap: "12px",

            justifyContent:
              "center",
          }}
        >
          <button
            type="button"
            style={{
              ...primaryBtn,

              opacity:
                processing
                  ? 0.7
                  : 1,

              cursor:
                processing
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() =>
              void handleDecision(
                "approve"
              )
            }
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : "Approve"}
          </button>


          <button
            type="button"
            style={{
              ...secondaryBtn,

              opacity:
                processing
                  ? 0.7
                  : 1,

              cursor:
                processing
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() =>
              void handleDecision(
                "decline"
              )
            }
            disabled={processing}
          >
            Decline
          </button>
        </div>


        {/* Back button */}
        <button
          type="button"
          style={{
            ...linkBtn,
            marginTop:
              "25px",
          }}
          onClick={() => {
            window.location.href =
              "/batchdata";
          }}
        >
          <IoIosArrowRoundBack className="fs-4" />

          Back to Batch Page
        </button>
      </div>
    </div>
  );
}


// ========================================
// STYLES
// ========================================

/*
 * TypeScript:
 * CSSProperties checks that our inline React styles
 * use valid CSS property/value combinations.
 */

const wrapperStyle:
  CSSProperties = {
  textAlign: "center",

  paddingTop: "80px",

  minHeight: "100vh",

  background: "#f8f9fa",
};


const cardStyle:
  CSSProperties = {
  maxWidth: "520px",

  margin: "0 auto",

  background: "white",

  padding: "32px",

  borderRadius: "12px",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.08)",

  textAlign: "left",
};


const infoRow:
  CSSProperties = {
  display: "flex",

  justifyContent:
    "space-between",

  marginBottom: "8px",
};


const label:
  CSSProperties = {
  fontWeight: 600,

  color: "#4b5563",
};


const value:
  CSSProperties = {
  color: "#111827",
};


const primaryBtn:
  CSSProperties = {
  padding: "10px 18px",

  border: "none",

  borderRadius: "6px",

  backgroundColor:
    "#2c51c1",

  color: "white",

  cursor: "pointer",

  fontSize: "14px",

  fontWeight: 600,
};


const secondaryBtn:
  CSSProperties = {
  padding: "10px 18px",

  borderRadius: "6px",

  border:
    "1.5px solid #dc2626",

  backgroundColor:
    "white",

  color: "#dc2626",

  cursor: "pointer",

  fontSize: "14px",

  fontWeight: 600,
};


const linkBtn:
  CSSProperties = {
  background: "none",

  border: "none",

  color: "#4b5563",

  textDecoration:
    "underline",

  cursor: "pointer",

  fontSize: "13px",
};


export default ApprovePage;