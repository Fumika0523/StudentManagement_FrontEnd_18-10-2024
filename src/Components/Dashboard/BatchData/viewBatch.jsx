import { useEffect, useState } from "react"
import SideBar from "../../../HomePage/SideBar"
import { Box } from "@mui/material"
import NavBar from "../../../HomePage/NavBar"
import CustomisedBatchTables from "./CustomisedBatchTables"
import { url } from "../../utils/constant"
import axios from "axios"
import ModalAddBatch from "./ModalAddBatch"
import { Button } from "react-bootstrap"

function viewBatch(){
    const [batchData,setBatchData] = useState([])
    const [show,setShow] = useState(false)
    
    const token = sessionStorage.getItem('token')
    let config = {
        headers:{
            Authorization:`Bearer ${token}`
        }}
    //original Main batch data
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
        <div className="d-flex" >
        <SideBar/>
        <Box  sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} >
        <NavBar 
        // style={{ positon:"sticky",top:"0"}}
        />

        <div className="d-flex justify-content-end border-warning border-3 pe-4 py-3">
        {/* ADD BUTTON  */}
        <Button className="fs-5 commonButton"
         onClick={()=>setShow(true)}>Add Batch</Button>
        </div>

        {/* Buttom Table */}
        <div className="d-flex  border-black border-4 justify-content-center">
        {/* Table */}
        <div  style={{border:"2px solid #e3e6f0",borderRadius:"7px", minWidth:"95%"}}>
            {/* <div className="tableTitle">All Batch</div> */}
            {<CustomisedBatchTables setBatchData={setBatchData} batchData = {batchData}/>}
            {/* We cannot pass the studentData cant be passed, because in HoverCust... component, the row is above the function. so we cannot use it. so we have to api call in hover.. component */}

            {/* {< HoverCustomisedTable />} */}
        </div>
        </div>
        </Box>
        {show && <ModalAddBatch show={show} setShow={setShow}
        setBatchData={setBatchData}
        />}
        </div>
        </>
    )
}
export default viewBatch