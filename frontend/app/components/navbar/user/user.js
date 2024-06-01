import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Settings, Logout } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from "firebase/storage";





export default function User () {



  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [profilePicture, setProfilePicture] = React.useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnderConstruction = () => {
    alert("This is currently under construction")
    handleClose();
  }

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/'); // Redirect to the landing page after logout
      });
  }

  const getProfilePicture = () => {
    // Create a reference with an initial file path and name
    const storage = getStorage();
    const pathRef = ref(storage, `profile-pictures/${user.email}`);

    getDownloadURL(pathRef)
    .then((url) => {
      console.log('Profile pic: found! Here: ', url)
      setProfilePicture(url)
    })
    .catch((error) => {
      console.log('Error getting profile pic: ', error)
      setProfilePicture(null)
    })

  }

  React.useEffect(() => {
    getProfilePicture(); // Run only on first render
  }, []); // Empty dependency array means it runs only once after initial render



  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
        <Tooltip title="Account control">
          <IconButton
            onClick={handleClick}
            size="large"
            sx={{ ml: 2, mr: 2,  }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {
              profilePicture ?
              (
                <Avatar src={profilePicture} sx={{ width: 50, height: 50, backgroundColor: '#C7E6F8', color: grey['800'] }}></Avatar>
              )
              :
              (    
                <Avatar sx={{ width: 50, height: 50, backgroundColor: '#C7E6F8', color: grey['800'] }}>{user.displayName[0]}</Avatar>
              )
            }
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            backgroundColor: grey['900'],
            color: grey['400'],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleUnderConstruction}>
          <Avatar /> Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleUnderConstruction}>
          <ListItemIcon>
            <Settings 
              fontSize="small" 
              sx={{color: grey[400] }}
            />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout 
              fontSize="small" 
              sx={{color: grey[400] }}
            />
          </ListItemIcon>
          Logout
        </MenuItem>

      </Menu>
    </React.Fragment>
  );
}