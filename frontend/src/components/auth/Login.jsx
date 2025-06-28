import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/loginService";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  TextField,
  Typography,
  Fade,
  Zoom,
  Stack,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Person,
  Lock,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 400,
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
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

const LoginTextField = styled(TextField)(({ theme }) => ({
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

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [lockTime, setLockTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a lock time stored
    const storedLockTime = localStorage.getItem("lockTime");
    if (storedLockTime) {
      const lockTime = parseInt(storedLockTime);
      const timeLeft = lockTime - Date.now();
      if (timeLeft > 0) {
        setLockTime(lockTime);
        setAttemptsLeft(0);
        setTimeLeft(Math.ceil(timeLeft / 1000));
      } else {
        localStorage.removeItem("lockTime");
        setLockTime(null);
        setAttemptsLeft(5);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
  };

  const validateInputs = () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    if (lockTime && Date.now() < lockTime) {
      const remainingTime = Math.ceil((lockTime - Date.now()) / 1000);
      toast.error(`Please retry in ${formatTime(remainingTime)}`);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(username, password);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setIsLoggedIn(true);
        navigate("/homepage");
        toast.success("Login successful, redirecting to homepage...");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
      if (attemptsLeft === 1) {
        const lockUntil = Date.now() + 10 * 60 * 1000;
        setLockTime(lockUntil);
        localStorage.setItem("lockTime", lockUntil);
        setAttemptsLeft(0);
        setTimeLeft(10 * 60);
        toast.error("Too many attempts. You've been locked out for 10 minutes.");
      } else if (attemptsLeft > 1) {
        setAttemptsLeft(attemptsLeft - 1);
        toast.error(`Username or password is incorrect. ${attemptsLeft - 1} attempts left.`);
      } else {
        toast.error("No more attempts left. Try again later.");
      }
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
          <LoginCard>
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
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to continue to your account
                </Typography>
              </Box>

              <Stack spacing={2}>
                <LoginTextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || attemptsLeft === 0}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <LoginTextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || attemptsLeft === 0}
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
              </Stack>

              {attemptsLeft === 0 && timeLeft > 0 && (
                <Typography
                  color="error"
                  variant="body2"
                  align="center"
                  sx={{
                    bgcolor: "error.light",
                    color: "error.contrastText",
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                  }}
                >
                  Account locked. Please retry in {formatTime(timeLeft)}.
                </Typography>
              )}

              <LoginButton
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={loading || attemptsLeft === 0}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              >
                {loading ? "Signing in..." : "Sign In"}
              </LoginButton>

              <Stack spacing={1}>
                <Link
                  href="/signup"
                  variant="body2"
                  underline="hover"
                  sx={{
                    textAlign: "center",
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  Don't have an account? Sign up
                </Link>

                <Link
                  href="/forgotpassword"
                  variant="body2"
                  underline="hover"
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  Forgot your password?
                </Link>
              </Stack>
            </Stack>
          </LoginCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default Login;
