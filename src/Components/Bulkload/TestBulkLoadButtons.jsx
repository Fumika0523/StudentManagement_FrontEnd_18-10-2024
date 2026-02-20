import axios from 'axios'
import React, { useState } from 'react'

const BulkLoadButtons = () => {
    const [file,setFile] = useState(null) // holds the selected excel file - starting as null since no file is selected yet
    const [loading, setLoading] = useState(false) //boolean to track upload in progress, useful for disabling buttons or showing spinner

    //download excel template
    const downloadTemplate = async()=>{
       try{
      // console.log("downloadTemplate is clicked")    
       window.open("http://localhost:8001/api/excel/template","_blank")        
        }catch(e){
            alert("Download failed")
            console.error(e)
        }
    }

    // upload updated excel
    //api call
    const uploadExcel = async()=>{
        try{
       console.log("uploadExcel is clicked") 
       const formData = new FormData()
       formData.append("file",file)
       console.log("formData",formData)

        const res = await axios.post("http://localhost:8001/api/excel/import",formData,{headers:{"Content-Type":"multipart/form-data"}})
        console.log(res.data)
        alert('Uploaded success!\nInserted:')
        }catch(e){
            alert("Upload failed")
            console.error(e)
        }
    }

    //take 1 component. create 1 folder >> file.

  return (
    <>
    <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
    <h1>Excel Import</h1>
    <button onClick={downloadTemplate}>Download Excel Template</button>
    <br />
    <input type="file" accept=".xlsx,.xls, .csv"
    onChange={(e)=>setFile(e.target.files[0])}/>
    <button onClick={uploadExcel} disabled={loading}
   > {loading ? "Updating ..":"Upload Updated Excel"}</button>
    </div>
    </>
  )
}

export default BulkLoadButtons