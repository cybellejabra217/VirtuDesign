import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Fade,
  Zoom,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn,
  Language,
  Phone,
  Directions,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { getAllStores } from "../services/storeService";

// Styled Components
const StoreCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const StoreImage = styled(Box)(({ theme }) => ({
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
  },
}));

const DistanceChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
  },
}));

const NearestStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAllStores();
        setStores(response);
      } catch (error) {
        console.error("Error fetching nearest stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const calculateDistance = (store) => {
    const userLocation = JSON.parse(localStorage.getItem("userLocation"));
    const userLat = userLocation ? userLocation.lat : 35.5018;
    const userLon = userLocation ? userLocation.lon : 33.8938;
    if (!store.Location || !store.Location.Coordinates) {
      return null; // No coordinates available
    }
    const storeLat = store.Location.Coordinates[1];
    const storeLon = store.Location.Coordinates[0];
    const R = 6371; // Radius of the Earth in km
    const dLat = (storeLat - userLat) * Math.PI / 180;
    const dLon = (storeLon - userLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(storeLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return (distance * 111).toFixed(1); // Convert to kilometers
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Box textAlign="center">
              <Typography
                variant="h3"
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
                Nearest Stores
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Find the closest furniture stores to your location
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {stores
                .sort((a, b) => {
                  const distanceA = calculateDistance(a);
                  const distanceB = calculateDistance(b);
                  return distanceA - distanceB;
                })
                .map((store, index) => (
                  <Grid gridColumn={{ xs: 'span 12', sm: 'span 6', md: 'span 4' }} key={store._id}>
                    <Zoom in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                      <StoreCard>
                        <StoreImage
                          sx={{
                            backgroundImage: `url(${store.StoreImage || "https://source.unsplash.com/random/800x600/?furniture-store"})`,
                          }}
                        >
                          <DistanceChip
                            icon={<LocationOn />}
                            label={`${calculateDistance(store)} km`}
                          />
                        </StoreImage>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="h5" fontWeight={700} gutterBottom>
                                {store.StoreName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <LocationOn fontSize="small" />
                                {store.Address}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {store.Website && (
                                <ActionButton
                                  variant="outlined"
                                  startIcon={<Language />}
                                  href={store.Website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="small"
                                >
                                  Website
                                </ActionButton>
                              )}
                              {store.Phone && (
                                <ActionButton
                                  variant="outlined"
                                  startIcon={<Phone />}
                                  href={`tel:${store.Phone}`}
                                  size="small"
                                >
                                  Call
                                </ActionButton>
                              )}
                              <ActionButton
                                variant="contained"
                                startIcon={<Directions />}
                                href={`https://www.google.com/maps/dir/?api=1&destination=${store.Location.Coordinates[1]},${store.Location.Coordinates[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                              >
                                Directions
                              </ActionButton>
                            </Box>
                          </Stack>
                        </CardContent>
                      </StoreCard>
                    </Zoom>
                  </Grid>
                ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default NearestStores;
