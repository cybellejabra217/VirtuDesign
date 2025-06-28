import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
  Link,
  Fade,
  Zoom,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  CheckCircle,
  Cancel,
  ArrowForward,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  checkEmailExists,
  checkUsernameExists,
  registerUser,
} from "../../services/loginService";

// Styled Components
const SignupCard = styled(Paper)(({ theme }) => ({
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

const SignupButton = styled(Button)(({ theme }) => ({
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

const SignupTextField = styled(TextField)(({ theme }) => ({
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

const PasswordCheckItem = styled(ListItem)(({ theme, valid }) => ({
  color: valid ? theme.palette.success.main : theme.palette.error.main,
  transition: "all 0.3s ease",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
  },
}));

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const validatePassword = (pwd) => {
    setPasswordChecks({
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      specialChar: /[@#$%^&*!]/.test(pwd),
    });
  };

  const validateInputs = () => {
    if (!username || !password || !confirmPassword || !email) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!Object.values(passwordChecks).every((check) => check)) {
      toast.error("Password does not meet all the required criteria.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.error("Email is already registered");
        return;
      }

      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        toast.error("Username is already taken");
        return;
      }

      await registerUser(
        email,
        username,
        password,
        confirmPassword,
        location.latitude,
        location.longitude
      );

      navigate("/verification", {
        state: { email, username, password, confirmPassword },
      });
    } catch (error) {
      toast.error(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          <SignupCard>
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
                  Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join us and start your design journey
                </Typography>
              </Box>

              <Stack spacing={2}>
                <SignupTextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <SignupTextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <SignupTextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
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
                  <List dense>
                    <PasswordCheckItem valid={passwordChecks.minLength}>
                      {passwordChecks.minLength ? <CheckCircle /> : <Cancel />}
                      Minimum 8 characters
                    </PasswordCheckItem>
                    <PasswordCheckItem valid={passwordChecks.uppercase}>
                      {passwordChecks.uppercase ? <CheckCircle /> : <Cancel />}
                      At least one uppercase letter
                    </PasswordCheckItem>
                    <PasswordCheckItem valid={passwordChecks.lowercase}>
                      {passwordChecks.lowercase ? <CheckCircle /> : <Cancel />}
                      At least one lowercase letter
                    </PasswordCheckItem>
                    <PasswordCheckItem valid={passwordChecks.number}>
                      {passwordChecks.number ? <CheckCircle /> : <Cancel />}
                      At least one number
                    </PasswordCheckItem>
                    <PasswordCheckItem valid={passwordChecks.specialChar}>
                      {passwordChecks.specialChar ? <CheckCircle /> : <Cancel />}
                      At least one special character (@#$%^&*!)
                    </PasswordCheckItem>
                  </List>
                </Box>

                <SignupTextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
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
              </Stack>

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{" "}
                    <Link href="#" color="primary" underline="hover">
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
              />

              <SignupButton
                variant="contained"
                fullWidth
                onClick={handleSignup}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </SignupButton>

              <Stack spacing={1}>
                <Typography variant="body2" align="center" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": {
                        color: "primary.dark",
                      },
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </SignupCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default SignUp;
