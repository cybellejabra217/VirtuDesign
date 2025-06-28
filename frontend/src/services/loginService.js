import http from "../http-common";

export const sendVerificationCode = async ({ email }) => {
  console.log("Sending verification code request with email:", email, "Type:", typeof email);
  try {
    const response = await http.post('/api/auth/send-verification-code', { email });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to send verification code");
  }
};

export const verifyUser = async (email, verificationCode) => {
  try {
    const response = await http.post('/api/auth/verify-user', { email, verificationCode });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const registerUser = async (email, username, password, confirmPassword, latitude, longitude) => {
  try {
    const response = await http.post('/api/auth/register', {
      email,
      username,
      password,
      confirmPassword,
      UserLocationX: latitude,
      UserLocationY: longitude,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await http.post('/api/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const completeRegistration = async (email, username, password, confirmPassword) => {
  try {
    const response = await http.post('/api/auth/complete-registration', {
      email,
      username,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await http.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// ✅ Reset Password
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await http.post('/api/auth/reset-password', { resetToken, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await http.post('/api/auth/check-email', { email });
    return response.data.exists;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const checkUsernameExists = async (username) => {
  try {
    const response = await http.post('/api/auth/check-username', { username });
    return response.data.exists;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};
