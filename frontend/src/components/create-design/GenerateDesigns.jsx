import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  CardMedia,
  Snackbar,
  Alert,
  useMediaQuery,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Divider,
  Fade,
  Zoom,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { 
  UploadFile, 
  Delete, 
  Image, 
  DesignServices,
  PriceCheck,
  Category
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import http from "../../http-common";
import { toast } from "react-toastify";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  margin: 'auto',
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  }
}));

const ImagePreviewCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  height: 100,
  width: '100%',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const UploadButton = styled(Button)(({ theme }) => ({
  height: 48,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
  }
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  height: 56,
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  }
}));

const GenerateDesigns = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [roomType, setRoomType] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [price, setPrice] = useState(0);

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append("prompt", prompt);
    formData.append("roomType", roomType);
    formData.append("price", price);
    images.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token");
      const res = await http.post("/api/designs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(res.data);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error generating designs:", error);
      toast.error(error.response?.data?.error || "Failed to generate design");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await http.get("/api/room", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomTypes(res.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  return (
    <Fade in timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <StyledPaper>
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Generate Stunning Room Designs
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                  Transform your space with AI-powered interior design
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={4}>
                <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel id="room-type-label">Room Type</InputLabel>
                        <Select
                          labelId="room-type-label"
                          value={roomType}
                          onChange={handleRoomTypeChange}
                          label="Room Type"
                          startAdornment={<Category sx={{ mr: 1, color: 'primary.main' }} />}
                        >
                          {roomTypes.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                              {option.RoomName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Price Range"
                        type="number"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        InputProps={{
                          startAdornment: <PriceCheck sx={{ mr: 1, color: 'primary.main' }} />,
                        }}
                      />

                      <UploadButton
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFile />}
                        disabled={loading}
                      >
                        Upload Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </UploadButton>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Image fontSize="small" />
                        {images.length > 0
                          ? `${images.length} image(s) selected`
                          : "No images selected"}
                      </Typography>

                      {images.length > 0 && (
                        <Grid
                          container
                          spacing={1}
                          sx={{
                            maxHeight: 200,
                            overflowY: "auto",
                            p: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                          }}
                        >
                          {images.map((file, index) => (
                            <Grid gridColumn={{ xs: 'span 4', sm: 'span 3', md: 'span 2' }} key={index}>
                              <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                                <ImagePreviewCard>
                                  <CardMedia
                                    component="img"
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    sx={{
                                      height: '100%',
                                      width: '100%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => removeImage(index)}
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      right: 4,
                                      bgcolor: 'rgba(255,255,255,0.9)',
                                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </ImagePreviewCard>
                              </Zoom>
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      <GenerateButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DesignServices />}
                      >
                        {loading ? "Generating..." : "Generate Design"}
                      </GenerateButton>
                    </Stack>
                  </form>
                </Grid>

                <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      p: 2,
                      minHeight: 400,
                    }}
                  >
                    {response?.imageUrl ? (
                      <Zoom in timeout={500}>
                        <CardMedia
                          component="img"
                          src={`http://localhost:3001${response.imageUrl}`}
                          alt="Generated Design"
                          sx={{
                            borderRadius: 2,
                            maxHeight: 400,
                            width: '100%',
                            objectFit: 'contain',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          }}
                        />
                      </Zoom>
                    ) : (
                      <Stack spacing={2} alignItems="center" textAlign="center">
                        <DesignServices sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ opacity: 0.7 }}
                        >
                          No design generated yet
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ opacity: 0.5 }}
                        >
                          Upload images and click "Generate Design" to create your design
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </StyledPaper>
        </Container>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            sx={{ width: '100%' }}
          >
            Design generated successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default GenerateDesigns;
