import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Fade,
  Zoom,
  Stack,
  Button,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Email,
  Phone,
  WhatsApp,
  LinkedIn,
  GitHub,
  LocationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const ContactButton = styled(Button)(({ theme }) => ({
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

const ContactIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ContactUs = () => {
  const contactInfo = {
    company: {
      phone: "+961 70602073",
      email: "virtudesign2025@outlook.com",
      location: "Beirut, Lebanon",
    },
    creators: [
      {
        name: "Aya Kobtan",
        role: "Product Manager",
        email: "aya.kobtan@gmail.com",
        linkedin: "https://linkedin.com/in/aya-kobtan",
        github: "https://github.com/ayakobtan",
      },
      {
        name: "Majd Hammoud",
        role: "Lead Developer",
        email: "majd.hammoud@gmail.com",
        linkedin: "https://linkedin.com/in/majd-hammoud",
        github: "https://github.com/majdhammoud",
      },
      {
        name: "Cybelle Jabra",
        role: "Creative Director",
        email: "cjabra217@outlook.com",
        linkedin: "https://linkedin.com/in/cybelle-jabra",
        github: "https://github.com/cybellejabra",
      },
    ],
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
                Contact Us
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Get in touch with our team
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Company Contact Information */}
              <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                <Zoom in timeout={500}>
                  <ContactCard>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Company Contact
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          We're here to help and answer any questions you might have
                        </Typography>
                      </Box>

                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <Phone />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Phone
                            </Typography>
                            <ContactButton
                              variant="outlined"
                              startIcon={<WhatsApp />}
                              href={`https://wa.me/96170602073`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {contactInfo.company.phone}
                            </ContactButton>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <Email />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Email
                            </Typography>
                            <ContactButton
                              variant="outlined"
                              startIcon={<Email />}
                              href={`mailto:${contactInfo.company.email}`}
                            >
                              {contactInfo.company.email}
                            </ContactButton>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <ContactIcon>
                            <LocationOn />
                          </ContactIcon>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Location
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {contactInfo.company.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Stack>
                  </ContactCard>
                </Zoom>
              </Grid>

              {/* Creator Information */}
              <Grid gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                <Zoom in timeout={500} style={{ transitionDelay: "200ms" }}>
                  <ContactCard>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Meet the Team
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Get in touch with our talented creators
                        </Typography>
                      </Box>

                      <Stack spacing={3}>
                        {contactInfo.creators.map((creator, index) => (
                          <Box key={creator.name}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {creator.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {creator.role}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <IconButton
                                size="small"
                                href={`mailto:${creator.email}`}
                                sx={{ color: "primary.main" }}
                              >
                                <Email />
                              </IconButton>
                              <IconButton
                                size="small"
                                href={creator.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "primary.main" }}
                              >
                                <LinkedIn />
                              </IconButton>
                              <IconButton
                                size="small"
                                href={creator.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "primary.main" }}
                              >
                                <GitHub />
                              </IconButton>
                            </Stack>
                            {index < contactInfo.creators.length - 1 && (
                              <Divider sx={{ my: 2 }} />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </ContactCard>
                </Zoom>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Fade>
  );
};

export default ContactUs;
