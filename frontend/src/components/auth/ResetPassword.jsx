import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/loginService";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
  Zoom,
  useTheme,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const ResetPasswordCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 500,
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
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

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

const PasswordRequirement = styled(Typography)(({ theme, valid }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: valid ? theme.palette.success.main : theme.palette.text.secondary,
  transition: "all 0.3s ease",
}));

const ResetPassword = () => {
  const { state } = useLocation();
  const { email } = state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    setPasswordChecks({
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[@#$%^&*!]/.test(pwd),
    });
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill out both password fields.");
      return;
    }

    if (!Object.values(passwordChecks).every((check) => check)) {
      toast.error("Password does not meet all the required criteria.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email, password);
      toast.success(response.message || "Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(`Error resetting password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          py: 4,
        }}
      >
        <Zoom in timeout={500}>
          <ResetPasswordCard>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
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
                  Reset Password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create a new password for your account
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Password Requirements:
                </Typography>
                <Stack spacing={1}>
                  <PasswordRequirement valid={passwordChecks.minLength}>
                    <CheckCircle fontSize="small" />
                    Minimum 8 characters
                  </PasswordRequirement>
                  <PasswordRequirement valid={passwordChecks.uppercase}>
                    <CheckCircle fontSize="small" />
                    At least one uppercase letter
                  </PasswordRequirement>
                  <PasswordRequirement valid={passwordChecks.lowercase}>
                    <CheckCircle fontSize="small" />
                    At least one lowercase letter
                  </PasswordRequirement>
                  <PasswordRequirement valid={passwordChecks.number}>
                    <CheckCircle fontSize="small" />
                    At least one number
                  </PasswordRequirement>
                  <PasswordRequirement valid={passwordChecks.specialChar}>
                    <CheckCircle fontSize="small" />
                    At least one special character (@#$%^&*!)
                  </PasswordRequirement>
                </Stack>
              </Box>

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack spacing={2}>
                <ResetButton
                  variant="contained"
                  fullWidth
                  onClick={handleResetPassword}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </ResetButton>

                <BackButton
                  variant="outlined"
                  fullWidth
                  onClick={handleGoBack}
                  disabled={loading}
                  startIcon={<ArrowBack />}
                >
                  Go Back
                </BackButton>
              </Stack>
            </Stack>
          </ResetPasswordCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default ResetPassword;
