import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { sendVerificationCode, verifyUser } from "../../services/loginService";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  CircularProgress,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import {
  Email,
  ArrowBack,
  Send,
  VerifiedUser,
  Timer,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled Components
const VerificationCard = styled(Paper)(({ theme }) => ({
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

const VerifyButton = styled(Button)(({ theme }) => ({
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

const CodeTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontSize: "1.5rem",
    letterSpacing: "0.5em",
    textAlign: "center",
    "& input": {
      textAlign: "center",
    },
  },
}));

const Verification = () => {
  const { state } = useLocation();
  const { email, username, password, confirmPassword } = state || {};
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [lockTime, setLockTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Load lock time and attempts from localStorage
  useEffect(() => {
    const storedLockTime = localStorage.getItem("lockTime");
    const storedAttemptsLeft = localStorage.getItem("attemptsLeft");

    if (storedLockTime && storedAttemptsLeft) {
      const lockTime = parseInt(storedLockTime);
      const attemptsLeft = parseInt(storedAttemptsLeft);
      const timeLeft = lockTime - Date.now();

      if (timeLeft > 0) {
        setLockTime(lockTime);
        setAttemptsLeft(attemptsLeft);
        setTimeLeft(Math.ceil(timeLeft / 1000));
      } else {
        localStorage.removeItem("lockTime");
        localStorage.removeItem("attemptsLeft");
        setLockTime(null);
        setAttemptsLeft(5);
        setTimeLeft(null);
      }
    }
  }, []);

  // Countdown timer for lockout
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendVerificationCode = async () => {
    if (!email) {
      toast.error("Email is missing!");
      return;
    }

    if (attemptsLeft === 0) {
      const remainingTime = Math.ceil((lockTime - Date.now()) / 1000);
      toast.error(`Please retry in ${formatTime(remainingTime)}.`);
      return;
    }

    setLoading(true);
    try {
      const response = await sendVerificationCode({ email });
      toast.success(response.message || "Verification code sent!");

      setAttemptsLeft(attemptsLeft - 1);
      localStorage.setItem("attemptsLeft", attemptsLeft - 1);

      if (attemptsLeft - 1 === 0) {
        const lockTime = Date.now() + 10 * 60 * 1000;
        setLockTime(lockTime);
        localStorage.setItem("lockTime", lockTime);
        setTimeLeft(10 * 60);
      }
    } catch (error) {
      toast.error(`Failed to send verification code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyUser(email, verificationCode);
      toast.success(result.message || "Verification successful!");
      navigate("/login");
    } catch (error) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
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
          <VerificationCard>
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
                  Verify Your Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter the verification code sent to:
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Email fontSize="small" />
                  {email}
                </Typography>
              </Box>

              {attemptsLeft === 0 && (
                <Alert
                  severity="warning"
                  icon={<Timer />}
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  Please wait {formatTime(timeLeft)} before trying again
                </Alert>
              )}

              <Stack spacing={2}>
                <VerifyButton
                  variant="contained"
                  fullWidth
                  onClick={handleSendVerificationCode}
                  disabled={loading || attemptsLeft === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </VerifyButton>

                <CodeTextField
                  fullWidth
                  label="Verification Code"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  disabled={loading}
                  inputProps={{
                    maxLength: 6,
                    pattern: "[0-9]*",
                    inputMode: "numeric",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {verificationCode.length}/6
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography variant="caption" color="text.secondary" align="center">
                  {attemptsLeft > 0
                    ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining`
                    : "No attempts remaining"}
                </Typography>

                <VerifyButton
                  variant="contained"
                  fullWidth
                  onClick={handleVerifyCode}
                  disabled={loading || !verificationCode}
                  endIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </VerifyButton>

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
          </VerificationCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default Verification;
