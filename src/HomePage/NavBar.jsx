import { styled, alpha } from '@mui/material/styles';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/image'
import {Link, useNavigate} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import { Box, IconButton } from '@mui/material';
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import Paper from '@mui/material/Paper';


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
    fontSize:"150%",
     color:"#dddfeb",
  }
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'info',
//   // width: '100%',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     [theme.breakpoints.up('sm')]: {
//       width: '12ch',
//       '&:focus': {
//         width: '200ch',
//       },
//     },
//   },
// }));

const handleLogOut = ()=>{
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('username')
  navigate('/')
}

// let username = sessionStorage.getItem('username')

  return (
    <>
    {/* <div > */}
    {/* <Box className="border border-3 d-flex flex-column" style={{position:"sticky",top:"0px"}} > */}
      <AppBar position="static" style={{backgroundColor:"white"}} >
      <Toolbar>
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',  }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      
      </Paper>

        {/* ICONS */}
        <Dropdown className='d-flex justify-content-end ' >
        <div className='me-3 border-end'>
        <IoMdNotifications className='my-2 mx-3' style={iconStyle}/>
        <MdOutlineMail className='my-2 me-3' style={iconStyle} />
        </div>

        <Dropdown.Toggle style={{width:"4%",backgroundColor:"transparent",padding:"0.1%",border:"none"}} >
        <Image src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' roundedCircle style={{width:"100%"}}/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/* PROFILE */}
          <Dropdown.Item style={{backgroundColor:"white"}}  ><Link to="/profile" className='link-offset-2 link-underline link-underline-opacity-0 text-decoration-none' style={{ color:"#5a5c69"}}>Profile</Link></Dropdown.Item>
          <Dropdown.Divider />

          {/* LOGOUT */}
          <Dropdown.Item style={{ color:"#5a5c69",backgroundColor:"white"}} onClick={()=>handleLogOut()} >Log out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </Toolbar>
      </AppBar>
      {/* </Box> */}
    {/* </div> */}
    </>
  );
}
