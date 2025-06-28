import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography
} from '@mui/material';

const Sidebar = ({ setIsLoggedIn }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [locationError, setLocationError] = useState(null);
  const handleLogout = () => setShowLogoutPopup(true);

  const confirmLogout = () => {
    toast.success('Logging out...', { autoClose: 2000 });
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/login')
      setIsLoggedIn(false);
    }, 2500);
    
  };

  const cancelLogout = () => setShowLogoutPopup(false);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });

            localStorage.setItem('userLocation', JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }));
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  })
  const menuItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'My Profile', path: '/profile' },
    { label: 'Search Designs', path: '/search-designs' },
    { label: 'Generate Designs', path: '/generate-designs' },
    { label: 'Nearest Stores', path: '/nearest-stores' },
    { label: 'Contact Us', path: '/contactus' },
    { label: 'AR Modeling', path: '/image-3d-viewer' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1E1E2F',
            color: 'white',
          },
        }}
      >
        <List>
          <Typography variant="h6" sx={{ color: 'white', padding: '16px 0 16px 16px' }}>
            <img src={process.env.PUBLIC_URL + 'logo.png'} alt="Logo" style={{ width: '150px', marginBottom: '16px' }} />
          </Typography>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? '#333' : 'transparent',
                '&:hover': { backgroundColor: '#444' },
              }}
            >
              <ListItemText primary={item.label} sx={{ color: location.pathname === item.path ? 'white' : '#ccc' }} />
            </ListItem>
          ))}
          <Divider sx={{ backgroundColor: '#ccc' }} />
          <ListItem button onClick={handleLogout} sx={{ backgroundColor: '#e57373', color: '#fff' }}>
            <ListItemText primary="Logout" />
          </ListItem>

          <ListItem>
            {userLocation.lat && userLocation.lon ? (
              <Typography variant="body2" color="white">
                📍 You are at {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                ⚠️ {locationError}
              </Typography>
            )}
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutPopup} onClose={cancelLogout}>
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogActions>
          <Button onClick={confirmLogout} variant="contained" color="error">
            Yes
          </Button>
          <Button onClick={cancelLogout} variant="outlined">
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/* Display User Location or Error */}
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
