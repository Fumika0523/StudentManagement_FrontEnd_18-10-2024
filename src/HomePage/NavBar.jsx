import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/image'
import {Link} from 'react-router-dom';
import ProfileForm from '../Components/Profile/ProfileForm';


export default function NavBar() {
  return (
    <>
    <div>
      {/* <Box sx={{ flexGrow: 1, display:"flex", flexDirection:"column" }} > */}
      <AppBar position="static" style={{backgroundColor:"white"}} >
      <Toolbar>
        <Dropdown className='d-flex justify-content-end' >
        <Dropdown.Toggle style={{width:"4%",backgroundColor:"transparent",padding:"0.1%",border:"none"}} >
        <Image src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' roundedCircle style={{width:"100%"}}/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item  ><Link to="/profile">Profile</Link></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item >Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </Toolbar>
      </AppBar>

    </div>
    </>
  );
}
