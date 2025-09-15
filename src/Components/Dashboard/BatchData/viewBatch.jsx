import { useEffect, useState } from "react"
import SideBar from "../../../HomePage/SideBar/SideBar"
import NavBar from "../../../HomePage/NavBar/NavBar"
import CustomisedBatchTables from "./CustomisedBatchTables"
import { url } from "../../utils/constant"
import axios from "axios"
import ModalAddBatch from "./ModalAddBatch"
import { Button } from "react-bootstrap"

function viewBatch(){
    const [batchData,setBatchData] = useState([])
    const [show,setShow] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState (true)
    
    const token = localStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}
    //original Main batch data
    const getBatchData = async()=>{
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }
    useEffect(()=>{
        getBatchData()
    },[])


    return(
        <>
    <div className="d-flex flex-row ">
        <SideBar/>
        <div className="backgroundDesign d-flex flex-column" style={{minWidth:isSidebarOpen ?"75%":"88%"}}>
        <NavBar/>
        <div className="d-flex justify-content-end border-warning border-3 pe-4 py-3">
        {/* ADD BUTTON  */}
        <Button className=" commonButton"
         onClick={()=>setShow(true)}>Add Batch</Button>
        </div>

        {/* Buttom Table */}
        <div className="d-flex  border-black border-4  px-3 justify-content-center">
        {/* Table */}
        <div  style={{borderRadius:"7px", minWidth:"95%"}}>
            {/* <div className="tableTitle">All Batch</div> */}
            {<CustomisedBatchTables setBatchData={setBatchData} batchData = {batchData}/>}
            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}
        </div>
        </div>
        </div>
        {show && <ModalAddBatch show={show} setShow={setShow}
        setBatchData={setBatchData}
        />}
        </div>
        </>
    )
}
export default viewBatch