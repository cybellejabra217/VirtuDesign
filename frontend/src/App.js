// src/App.js
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/SignUp";
import Homepage from "./components/Home";
import Verification from "./components/auth/Verification";
import ContactUs from "./components/ContactUs";
import GenerateDesigns from "./components/create-design/GenerateDesigns";
import Profile from "./components/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import NearestStores from "./components/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { 
  Container, 
  Box, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  useMediaQuery
} from "@mui/material";
import SearchDesigns from "./components/SearchDesigns";
import Image3dViewer from "./components/model-viewer/Image3dViewer";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {isLoggedIn && (
          <Box
            sx={{
              width: { xs: '100%', md: 'auto' },
              position: { xs: 'fixed', md: 'sticky' },
              top: 0,
              left: 0,
              height: { xs: 'auto', md: '100vh' },
              zIndex: 1200,
              bgcolor: 'background.paper',
              boxShadow: { xs: 2, md: 1 },
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
            }}
          >
            <Navbar setIsLoggedIn={setIsLoggedIn} />
          </Box>
        )}
        <Box 
          sx={{ 
            flexGrow: 1,
            width: { xs: '100%', md: isLoggedIn ? 'calc(100% - 280px)' : '100%' },
            transition: 'margin 0.2s ease-in-out',
          }}
        >
          <Container 
            maxWidth="xl" 
            sx={{ 
              py: 3,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Routes>
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/generate-designs" element={<GenerateDesigns />} />
              <Route path="/search-designs" element={<SearchDesigns />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/nearest-stores" element={<NearestStores />} />
              <Route path="/image-3d-viewer" element={<Image3dViewer />} />
            </Routes>
          </Container>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
