import { useEffect, useState } from "react"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"
import NavBar from "../../../HomePage/NavBar"
import CustomisedBatchTables from "./CustomisedBatchTables"
import { url } from "../../utils/constant"
import axios from "axios"
import ModalAddBatch from "./ModalAddBatch"

function viewBatch(){
    const [batchData,setBatchData] = useState([])
    const [isAuthenticated,setIsAuthenticated]=useState(false)

    const [show,setShow] = useState(false)
    
    const token = sessionStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}

    const getBatchData = async()=>{
        console.log("Batch data is called.....") //checking if useEffect is working or not
        let res = await axios.get(`${url}/allbatch`,config)
        console.log("BatchData",res.data.batchData)
        setBatchData(res.data.batchData)
    }
    useEffect(()=>{
        getBatchData()
    },[])
    console.log(batchData)

    return(
        <>
        {/* <h1>View Batch</h1> */}
        <div className="d-flex">
        <SideBar/>
        <Box sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar/>

        <div className="btn  py-auto px-auto mt-3"  onClick={()=>setShow(true)} style={{backgroundColor:"#4e73df",color:"white",width:"10%",marginLeft:"88%"}}>Add Batch</div>

        <div className="m-4" style={{border:"2px solid #e3e6f0",borderRadius:"7px"}}>
            <div className="px-2 py-2 fw-bold" style={{color:"#4e73df",borderBottom:"2px solid #e3e6f0"}}>All Batch
            </div>
            {<CustomisedBatchTables batchData = {batchData}/>}
            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}

            {/* {< HoverCustomisedTable />} */}
        </div>
        </Box>
        {show && <ModalAddBatch show={show} setShow={setShow}/>}
        </div>
        </>
    )
}
export default viewBatch