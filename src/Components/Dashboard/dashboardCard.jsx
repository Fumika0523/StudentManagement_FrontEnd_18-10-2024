import EarningCardDisplay from "./FirstRow/EarningCardDisplay";
import ChartDisplay from "./SecondRow/ChartDisplay";
import { useEffect, useState } from "react";
import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";

function DashboardCard() {
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");

  // Show modal only if token exists
  useEffect(() => {
    if (token) {
      setShowModal(true);
    }
  }, [token]);

  console.log("Dashboard, role:", role);

  return (
    <>
      <div className="backgroundDesign d-flex flex-column">
        {/* Only show dashboard cards if NOT a student */}
        {role !== "student" && (
          <>
            <EarningCardDisplay />
            <ChartDisplay />
          </>
        )}
      </div>

      {/* Modal overlay (can show for students or anyone with token) */}
      {showModal && <SelectCourseModal show={showModal} setShow={setShowModal} />}
    </>
  );
}

export default DashboardCard;
