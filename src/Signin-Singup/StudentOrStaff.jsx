import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { FcReading, FcVoicePresentation } from "react-icons/fc";

function StudentOrStaff() {
  const navigate = useNavigate();

  return (
    <>
      <div className="signInStyle container-fluid min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            {/* Main Card */}
            <div className="col-12 col-sm-10 col-md-9 col-lg-7 col-xl-6">
              <div className="studentLogin p-3 p-sm-4 p-md-5">
                <div className="text-center mb-1 fs-3 fw-bold">
                  Welcome Back
                </div>
                <div className="text-center text-muted mb-4" style={{ fontSize: "15px" }}>
  Please select your role to continue
</div>
                {/* Student + Staff columns */}
                <div className="row g-4 align-items-stretch">
                  {/* Student */}
                  <div className="col-12 col-md-6 d-flex">
                    <div className="d-flex flex-column w-100 align-items-center">
                      <Image
                        className="mb-3"
                        src="https://img.freepik.com/premium-vector/woman-working-with-computer_113065-11.jpg"
                        style={{ height: "185px", width: "200px" }}
                        roundedCircle
                      />
                      <Button
                        className="fs-5 w-100 mt-auto"
                        onClick={() => navigate("/student-signin")}
                      >
                       Continue as Student
                      </Button>
                    </div>
                  </div>

                  {/* Staff */}
                  <div className="col-12 col-md-6 d-flex">
                    <div className="d-flex flex-column w-100 align-items-center">
                      <Image
                        className="mb-3 object-fit-cover"
                        src="https://media.istockphoto.com/id/1231898401/vector/%C3%B0%C3%B1%C3%B0%C3%B0%C3%B0%C3%B0%C3%B1%C3%B0%C2%B5-rgb.jpg?s=612x612&w=0&k=20&c=OpAH1-b7qULawK00Kia-uB9Y8IjBdQ9SuZ_hMph4VS4="
                        style={{ height: "180px", width: "200px" }}
                        roundedCircle
                      />
                      <Button
                        className="fs-5 w-100 mt-auto"
                        onClick={() => navigate("/staff-signin")}
                      >
                        Continue as Staff
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Create account section */}
                <div className="text-center message mt-4 mb-3" style={{ fontSize: "18px" }}>
                  New here?
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Button
                      variant="outline-primary"
                      className="w-100 d-flex justify-content-center align-items-center gap-2 text-nowrap"
                      onClick={() => navigate("/student-signup")}
                    >
                      <FcReading className="fs-2" />
                      Register as Student

                    </Button>
                  </div>

                  <div className="col-12 col-md-6">
                    <Button
                      variant="outline-primary"
                      className="w-100 d-flex justify-content-center align-items-center gap-2 text-nowrap"
                      onClick={() => navigate("/staff-signup")}
                    >
                      <FcVoicePresentation className="fs-2" />
                      Register as Staff
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentOrStaff;
