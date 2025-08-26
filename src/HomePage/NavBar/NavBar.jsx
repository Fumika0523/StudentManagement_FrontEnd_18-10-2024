import { styled, alpha } from '@mui/material/styles';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image'
import {Link, useNavigate} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import { IconButton } from '@mui/material';
import { IoMdNotifications } from "react-icons/io";
import Paper from '@mui/material/Paper';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import "../NavBar/NavBar.css"
import { FaEnvelope } from "react-icons/fa";

export default function NavBar() {
  
  const navigate = useNavigate()
  
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
  const  userId = localStorage.getItem('_id')
  console.log(userId)

const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  console.log("token", token,username)


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
  

const handleLogOut = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  navigate('/')
}


  return (
    <>
<Navbar expand="lg" sticky="top" bg="light"  data-bs-theme="light">
  <Container className="border-danger  d-flex align-items-center flex-nowrap">
    
    {/* Desktop Search (on left for sm and up) */}
    <Form className="d-none d-sm-flex align-items-center me-auto">
      <Form.Control
        type="text"
        placeholder="Search for..."
        className="ms-3"
        style={{
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
          border: "0",
          width:"250px",
          backgroundColor: "#efeff5"
        }}
      />
      <Button
        type="submit"
        className=' p-1'
        style={{
          backgroundColor: "#4e73df",
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0"
        }}
      >
        <SearchIcon className='fs-4 '/>
      </Button>
    </Form>

{/* Icons section (right side) */}
<Nav className="d-flex flex-row align-items-center gap-3 ms-auto">

  {/* Mobile Search Icon - only visible on mobile */}
  <Nav.Link 
    href="#home" 
    className="d-flex d-sm-none"
    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
  >
    <SearchIcon className="fs-2" />
  </Nav.Link>

    {/* Mobile popup search */}
    {mobileSearchOpen && (
      <div
        className="d-flex flex-row position-absolute bg-white p-2 rounded shadow"
        style={{ top: "50px", zIndex: 1000, width: "90%", left: "5%" }}
      >
        <Form.Control
          type="text"
          placeholder="Search"
          style={{
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            border: "0",
            backgroundColor: "#efeff5"
          }}
          className="me-2"
        />
        <Button
          type="submit"
          style={{
            backgroundColor: "#4e73df",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0"
          }}
        >
          <SearchIcon  />
        </Button>
      </div>
    )}
 
    {/* Icons section (right side) */}
    {/* <Nav className="d-flex flex-row align-items-center gap-3"> */}
      <Nav.Link href="#home">
        <IoMdNotifications className="fs-3" />
      </Nav.Link>
      {/* Email icon */}
      <Nav.Link href="#home">
        <FaEnvelope className="fs-4" />
      </Nav.Link>

      <div style={{ borderRight: "1px solid #a4a6adff", height: "30px" }}
        className="topbar-divider d-none d-sm-block"
      ></div>
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
        <NavDropdown.Item
          className="d-flex align-items-center gap-2"
          onClick={() => handleLogOut()}
        >
          <PiSignOutBold className="fs-5 iconStyle" />
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Container>
</Navbar>

    </>
  );
}
