import { styled, alpha } from '@mui/material/styles';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/image'
import {Link, useNavigate} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import { IconButton } from '@mui/material';
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
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

export default function NavBar() {
  
  const navigate = useNavigate()
  
  const token = sessionStorage.getItem('token')
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

  const iconStyle={
    // fontSize:"150%",
     color:"#dddfeb",
  }

  const UserMenu = (
    <Image
      src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
      alt="UserName profile image"
      roundedCircle
      style={{ width: '40px' }}
      className='ms-2'
    />
  )
  

const handleLogOut = ()=>{
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('username')
  navigate('/')
}
  return (
    <>
    <Navbar   expand="lg" sticky="top"  bg="light" data-bs-theme="light" className='sticky-top col-12 shadow bg-body'>
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

        <Navbar.Toggle  aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='border-primary' style={{width:"10px",padding:"0px"}}>
        {/* ICONS */}
          <Nav className="ms-auto d-flex align-items-center justify-content-center gap-2">
          <Nav.Link href="#home"><IoMdNotifications className='fs-2' style={iconStyle}/></Nav.Link>
          <Nav.Link className='border-end pe-4' href="#home"><MdOutlineMail className='fs-2' style={iconStyle} /></Nav.Link>
         
            <NavDropdown  id="basic-nav-dropdown" title={UserMenu} className='text-center '>
            {/* PROFILE */}
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item  onClick={()=>handleLogOut()}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}
