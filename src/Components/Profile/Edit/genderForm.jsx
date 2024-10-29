import * as Yup from "yup";
import { useFormik } from 'formik'
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';



function genderForm({userData}){

    const navigate = useNavigate()

    const formSchema = Yup.object().shape({
        gender:Yup.string()
    })
    
    const formik=useFormik({
        initialValues:{
            username:userData?.gender
        },
        onSubmit:(values)=>{
            console.log(values)
            updateProfile(values)
        }})

    return(
        <>
        <div className="border border-secondary-subtle rounded m-5 p-3">
        <div>Gender</div>
                        <div className='form-check form-check-inline'>                 
                        <Form.Check type="radio" name="gender" label={`Male`}
                            value="male"
                            onChange={formik.handleChange} /></div>
                         <div className='form-check form-check-inline'>
                            <Form.Check type="radio" name="gender" label={`Female`}
                            value="female"
                            onChange={formik.handleChange} /></div>
                             <div className="mt-3 text-end" >
    {/* Cancel */}
    <button className="btn text-primary" style={{fontSize:"90%"}}
    onClick={()=>{
        navigate('/profile')
    }}>
        Cancel
    </button>

    {/* Save */}
    <button className="btn btn-secondary px-3"
    style={{fontSize:"90%",borderRadius:"16px"}}
     onClick={()=>{
        updateProfile()
    }}>Save</button>
    </div>
        </div>
        </>
    )
}
export default genderForm