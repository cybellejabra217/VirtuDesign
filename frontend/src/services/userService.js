import http from "../http-common";

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await http.get(`/api/user/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Get user ID by username
export const getUserIdByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/id/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Get username by user ID
export const getUsernameByUserId = async (userId) => {
  try {
    const response = await http.get(`/api/user/username/id/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Get username by user ID
export const updateUserPreferences = async (username, preferences) => {
  try {
    const response = await http.post(`/api/user/preferences`, preferences);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUserPreferences = async (username) => {
  try {
    const response = await http.get(`/api/user/preferences`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const recommendDesigns = async (username) => {
  try {
    const response = await http.get(`/api/designs`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const searchGeneratedDesigns = async () => {
  try {
    const response = await http.get(`/api/designs/search`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Get user join date by username
export const getUserJoinDateByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/join-date/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

