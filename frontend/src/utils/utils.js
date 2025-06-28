
const getToken = () => {
    return localStorage.getItem("token"); 
  };
  
  const getTokenBearer = () => {
    const token = getToken();
    console.log("Retrieved Token:", token);
    return token ? `Bearer ${token}` : "";
  };
  
  
  module.exports = {
      getToken,
      getTokenBearer,
  }