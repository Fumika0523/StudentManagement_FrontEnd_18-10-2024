import EarningCardDisplay from "./FirstRow/EarningCardDisplay"
import ChartDisplay from "./SecondRow/ChartDisplay"
import { useEffect, useState } from "react"
import SelectCourseModal from "../../Components/Dashboard/StudentData/SelectCourseModal";

function DashboardCard() {
  //  const [isAuthenticated,setIsAuthenticated]=useState(false)
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token')
  //console.log(token)

  useEffect(() => {
    if (token) {
      setShowModal(true); // show the modal
    }
  }, []);


  return (
    <>
  <div className="backgroundDesign d-flex flex-column">
      {/* First Row */}
    <EarningCardDisplay />
      {/* Second Row */}
    <ChartDisplay />
  </div>
      {/* Modal overlay */}
   {showModal && <SelectCourseModal show={showModal} setShow={setShowModal} />}
  </>
  )
}
export default DashboardCard
