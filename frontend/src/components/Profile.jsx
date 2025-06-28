import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  MobileStepper,
  Fade,
  Zoom,
  Stack,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Palette,
  Style,
  Update,
  CalendarToday,
  Email,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { updateUserPreferences } from "../services/userService";
import {
  getUserByUsername,
  getUserPreferences,
  recommendDesigns,
} from "../services/userService";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

// Styled Components
const ProfileCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const PreferenceSelect = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

const ImageCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [vibePreference, setVibePreference] = useState("None");
  const [colorPreference, setColorPreference] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = recommendations.length;
  const theme = useTheme();
  const swiperRef = useRef(null);
  const handleNext = () => {
    if (swiperRef.current && activeStep < maxSteps - 1) {
      swiperRef.current.slideNext();
    }
  };
  
  const handleBack = () => {
    if (swiperRef.current && activeStep > 0) {
      swiperRef.current.slidePrev();
    }
  };

  const vibeOptions = [
    "None",
    "Minimalist",
    "Rustic",
    "Modern",
    "Bohemian",
    "Industrial",
    "Traditional",
  ];
  const colorOptions = [
    "Neutral",
    "Bold",
    "Pastel",
    "Monochromatic",
    "Earthy",
    "Vibrant",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        const user = await getUserByUsername(username);
        if (user) {
          setUser(user);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        setError("An error occurred while fetching user data.");
      }
    };

    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      try {
        const settings = await getUserPreferences(username);
        if (settings) {
          setVibePreference(settings.VibePreference || "None");
          setColorPreference(settings.ColorPreferences || "");
        }
      } catch (error) {
        setVibePreference("None");
        setColorPreference("");
      }
    };

    const recommendedDesigns = async () => {
      try {
        const designs = await recommendDesigns();
        setRecommendations(designs);
      } catch (error) {
        setVibePreference("None");
        setColorPreference("");
      }
    };

    fetchPreferences();
    fetchUser();
    recommendedDesigns();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      await updateUserPreferences(user.Username, {
        VibePreference: vibePreference,
        ColorPreferences: colorPreference,
      });
      setSuccess("Preferences updated successfully!");
    } catch (err) {
      setError("Failed to update preferences.");
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Box textAlign="center">
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Profile
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Manage your preferences and view your generated designs
              </Typography>
            </Box>

            {user ? (
              <Zoom in timeout={500}>
                <ProfileCard>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "primary.main",
                            fontSize: "2rem",
                          }}
                        >
                          {user.Username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight={700}>
                            {user.Username}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                            >
                              <Email fontSize="small" />
                              {user.Email}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                            >
                              <CalendarToday fontSize="small" />
                              {new Date(user.JoinDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>

                      <Stack spacing={3}>
                        <PreferenceSelect fullWidth variant="outlined">
                          <InputLabel>Vibe Preference</InputLabel>
                          <Select
                            value={vibePreference}
                            onChange={(e) => setVibePreference(e.target.value)}
                            label="Vibe Preference"
                            startAdornment={
                              <Style sx={{ mr: 1, color: "primary.main" }} />
                            }
                          >
                            {vibeOptions.map((vibe) => (
                              <MenuItem key={vibe} value={vibe}>
                                {vibe}
                              </MenuItem>
                            ))}
                          </Select>
                        </PreferenceSelect>

                        <PreferenceSelect fullWidth variant="outlined">
                          <InputLabel>Color Preference</InputLabel>
                          <Select
                            value={colorPreference}
                            onChange={(e) => setColorPreference(e.target.value)}
                            label="Color Preference"
                            startAdornment={
                              <Palette sx={{ mr: 1, color: "primary.main" }} />
                            }
                          >
                            {colorOptions.map((color) => (
                              <MenuItem key={color} value={color}>
                                {color}
                              </MenuItem>
                            ))}
                          </Select>
                        </PreferenceSelect>

                        <UpdateButton
                          variant="contained"
                          fullWidth
                          startIcon={<Update />}
                          onClick={handleUpdate}
                        >
                          Update Preferences
                        </UpdateButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </ProfileCard>
              </Zoom>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            )}

            {user && recommendations.length > 0 && (
              <Box>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Generated Designs
                </Typography>

                <Swiper
  onSwiper={(swiper) => (swiperRef.current = swiper)}
  onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
>
                  {recommendations.map((rec, index) => (
                   <SwiperSlide>
                     <Zoom
                      in
                      timeout={500}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      key={rec._id}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 4,
                          py: 4,
                        }}
                      >
                        <ImageCard>
                          <img
                            src={`http://localhost:3001${rec.ModelURL}`}
                            alt="Generated Model"
                            style={{
                              width: "320px",
                              height: "320px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{ mt: 2, fontWeight: 600 }}
                          >
                            Generated Model
                          </Typography>
                        </ImageCard>

                        <ImageCard>
                          <img
                            src={rec.FurnitureUsedID?.FurniturePicture}
                            alt="Furniture"
                            style={{
                              width: "320px",
                              height: "320px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                          <Stack spacing={1} sx={{ mt: 2 }}>
                            <Typography variant="h6" align="center" fontWeight={700}>
                              {rec.FurnitureUsedID?.FurnitureName}
                            </Typography>
                            <Typography
                              variant="body2"
                              align="center"
                              color="text.secondary"
                            >
                              Material: {rec.MaterialsUsedID?.MaterialName}
                            </Typography>
                          </Stack>
                        </ImageCard>
                      </Box>
                    </Zoom>
                   </SwiperSlide>
                  ))}
                </Swiper>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                      <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        sx={{ minWidth: "auto", px: 2, fontWeight: 600 }}
                      >
                        Next <KeyboardArrowRight />
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{ minWidth: "auto", px: 2, fontWeight: 600 }}
                      >
                        <KeyboardArrowLeft />
                        Back
                      </Button>
                    }
                    sx={{
                      width: "fit-content",
                      background: "transparent",
                      "& .MuiMobileStepper-dot": {
                        width: 10,
                        height: 10,
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 28 },
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 28 },
                }}
              >
                {success}
              </Alert>
            )}
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default Profile;
