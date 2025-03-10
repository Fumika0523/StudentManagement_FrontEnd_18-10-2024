import React from 'react'
import Button from 'react-bootstrap/Button';
import {Link, useNavigate} from 'react-router-dom'
import Image from 'react-bootstrap/Image';
import { FcReading } from "react-icons/fc";
import { FcVoicePresentation } from "react-icons/fc";


function StudentOrStaff() {

    const navigate = useNavigate()

  return (
    <>
     <div className='signInStyle  justify-content-center d-flex container-fluid min-vh-100 align-items-center'>
        <div className='row justify-content-center w-100 d-flex align-items-center mx-auto border-warning'>
          {/* Left Student */}
          <div className='col-12 py-md-4 py-2 col-sm-8 col-md-8 col-lg-6 studentLogin '>
          <div className='text-center mx-auto mb-5 fs-3 fw-bold'>Sign into Your Account</div>
              <div className='d-flex flex-row  row  mx-auto'>
                <div className='d-flex col-md-6 flex-column'>
                <Image  className="mb-3 mx-auto"src="https://img.freepik.com/premium-vector/woman-working-with-computer_113065-11.jpg" style={{height:"180px",width:"200px"}}  roundedCircle />
                <Button className='fs-5 w-100 mb-5 mx-auto' 
                    onClick={()=>{navigate('/student-signin')}}
                    >I am Student</Button>
                </div>

                {/* Staff*/}
                <div className='d-flex col-md-6 flex-column'>
                <Image className="mb-3 object-fit-cover mx-auto"src="https://media.istockphoto.com/id/1231898401/vector/%C3%B0%C3%B1%C3%B0%C3%B0%C3%B0%C3%B0%C3%B1%C3%B0%C2%B5-rgb.jpg?s=612x612&w=0&k=20&c=OpAH1-b7qULawK00Kia-uB9Y8IjBdQ9SuZ_hMph4VS4=" style={{height:"180px",width:"200px",}}  roundedCircle />
                <Button className='fs-5 mb-5 mx-auto w-100'  onClick={()=>{navigate('/staff-signin')}}>I am Staff</Button>
                </div>
              </div>
              <div className='text-center message mb-5' style={{fontSize:"18px"}} >Don't have account? </div>
              <div className='row mx-auto d-flex justify-content-evenly'>
              <div className='col-md-6 col-12 '>
              <Button variant="outline-primary" className='text-nowrap w-100 mb-sm-2 mb-2 mx-auto d-flex justify-content-center align-items-center ' to='/student-signup' onClick={()=>{navigate('/student-signup')}} ><FcReading className='fs-2'/>Create Student Account</Button>
              </div>
              <div  className='col-md-6 col-12'>
              <Button variant="outline-primary" className='w-100 mx-auto d-flex text-nowrap justify-content-center align-items-center' to='/staff-signup' onClick={()=>{navigate('/staff-signup')}} ><FcVoicePresentation className='fs-2'/> Create Staff Account</Button>
              </div>
              </div>
          </div>
            
          {/* Right STaff */}           
           {/* <div className='staffLogin col-lg-6  col-md-5 col-sm-8 py-lg-5 py-3'>
              <div className='row mb-lg-5 mb-3 mx-auto'>
                <Image className="object-fit-cover mx-auto"src="https://media.istockphoto.com/id/1231898401/vector/%C3%B0%C3%B1%C3%B0%C3%B0%C3%B0%C3%B0%C3%B1%C3%B0%C2%B5-rgb.jpg?s=612x612&w=0&k=20&c=OpAH1-b7qULawK00Kia-uB9Y8IjBdQ9SuZ_hMph4VS4=" style={{height:"180px",width:"200px",}}  roundedCircle />
              </div>
              <div className='row text-center mx-auto mb-md-4 mb-2'>
                <Button className='col-10 mx-auto fs-5'>Sign in</Button>
              </div>
              <div className='text-center message ' style={{fontSize:"15px"}} >Don't have account? &nbsp;
              <Link className='link-underline link-underline-opacity-0 text-center' to='/signup' >Create an account</Link>
              </div>
              </div> */}
            </div>
       
        </div> 
    </>
  )
}

export default StudentOrStaff