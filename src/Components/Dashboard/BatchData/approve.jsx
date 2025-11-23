import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function ApprovePage() {
  const [params] = useSearchParams();
  const batchId = params.get("batchId");
  const action = params.get("action");

  useEffect(() => {
    if (action === "decline") {
      axios.patch(`${url}/batch/decline/${batchId}`);
      alert("Batch Declined");
    } else {
      axios.patch(`${url}/batch/approve/${batchId}`);
      alert("Batch Approved");
    }
  }, []);

  return <h2>Processing...</h2>;
}
