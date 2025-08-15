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
  console.log("token", token)

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.
      palette.info.light),
    '&:hover': {
      backgroundColor: alpha(theme.
      palette.info.light),
    },
    marginLeft: 0,
    width: '50%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '50%',
    },
  }));


  const UserMenu = (
    <Image
      src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
      alt="UserName profile image"
      roundedCircle
      style={{ width: '35px' }}
      className='ms-2 '
    />
  )
  

const handleLogOut = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  navigate('/')
}
  return (
    <>
    <Navbar   expand="lg" sticky="top"  bg="light" data-bs-theme="light" className=''>
    <Container className=" border-danger mx-4">
      <Form className=' d-flex flex-row  border-2'>
        <Row className=''>
          <Col  className='d-flex flex-row' >
            <Form.Control
              type="text"
              placeholder="Search"
              className=" ms-3"
              style={{borderTopRightRadius:"0",borderBottomRightRadius: "0",border:"0",backgroundColor:"#efeff5"}}
            />
            <Button type="submit" style={{backgroundColor:"#4e73df",borderTopLeftRadius:"0",borderBottomLeftRadius: "0"}}><SearchIcon/></Button>
          </Col>
        </Row>
      </Form>
        {/* ICONS */}
          <Nav className="ms-auto d-flex flex-row align-items-center justify-content-center gap-2">
            {/* Notification */}
          <Nav.Link href="#home"><IoMdNotifications className=' fs-3' /></Nav.Link>
          {/* Email */}
          <Nav.Link className='border-end pe-4' href="#home">
            <FaEnvelope className='fs-4 '  /></Nav.Link>
          {/*  */}
        <NavDropdown
          align="end"
          id="basic-nav-dropdown"
          title={UserMenu}
          className='text-center user-dropdown'  // <- add this
>            {/* PROFILE */}
              <NavDropdown.Item href="/profile" className='d-flex align-items-center gap-1' >
              <FaUser className='fs-5 iconStyle'/>Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className='d-flex align-items-center gap-1' onClick={()=>handleLogOut()}>
                <PiSignOutBold className='fs-5 iconStyle' />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

      </Container>
    </Navbar>
    </>
  );
}
