import { useNavigate } from "react-router-dom";
import * as React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import SearchIcon from "@mui/icons-material/Search";
import { MdMenu } from "react-icons/md";
import Image from "react-bootstrap/Image";
import "../NavBar/NavBar.css";

export default function NavBar({ toggleSidebar }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || user?.name;
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);


  const getGoogleProfile=async()=>{
    try{
      console.log("Google data is calling...");
      const res = await fetch("http://localhost:8000/",{
        method:"GET",
        credentials:"include",
      })
      const data = await res.json()
       console.log('getGoogleProfile', data);

      setLoggedIn(res.data.loggedIn);

      if (res.data.loggedIn) {
        setUser(res.data.user);
      }
    }catch(e){
      console.log("Error",e)
      return resizeBy.send("Error",e)
    }
  }
  
  useEffect(() => {
    getGoogleProfile();
  }, []); // run once


  const UserMenu = (
    <>
    <span className='d-flex flex-row align-items-center text-secondary'>
      {username}
    <Image
      src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
      alt="UserName profile image"
      roundedCircle
      style={{ width: '35px' }}
      className='ms-2 '
    />
    </span>
    </>
  )

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Navbar expand="lg" sticky="top"  bg="light" className="shadow-sm" 
    >
      <Container fluid className="d-flex align-items-center flex-nowrap justify-content-between" >
        {/* Hamburger icon for mobile */}
        <MdMenu
          className="d-flex d-sm-block d-md-none"
          size={30}
          style={{ cursor: "pointer", color: "#4e73df"  , position:"absolute", left:"15px"}}
          onClick={toggleSidebar}
        />

        {/* Right Side Icons */}
        <Nav className="d-flex flex-row align-items-center gap-3 ms-auto">
     
          {/* User Dropdown */}
          <NavDropdown
            align="end"
            id="basic-nav-dropdown"
            title={UserMenu}
            className="text-center user-dropdown"
          >
            <NavDropdown.Item
              href="/profile"
              className="d-flex align-items-center gap-2"
            >
              <FaUser className="fs-5 iconStyle" /> Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            
            {/* Logout */}
            <NavDropdown.Item
            as="button" 
            className="d-flex align-items-center gap-2"
            onClick={handleLogOut}
          >
            <PiSignOutBold className="fs-5 iconStyle" />
            Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
