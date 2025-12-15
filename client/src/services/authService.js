import { api } from './api';

export const authService = {
  // Sign up
  register: async (userData) => {
    try {
     
      const data = await api.post('/auth/signup', userData); // Direct data, not response object
    //   console.log('Register response data:', data);
      
      // BACKEND returns: { message: "Signup Successful" }
      if (data.message === "Signup Successful") {
        return { 
          success: true, 
          message: data.message 
        };
      }
      
      // If backend returns error
      return { 
        success: false, 
        message: data.message || "Registration failed" 
      };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.message || "Registration failed" 
      };
    }
  },

  // Login
  login: async (credentials) => {
    try {
    //   console.log('Login attempt with:', credentials);
      const data = await api.post('/auth/signin', credentials); // Direct data
    //   console.log('Login response data:', data);
      
      // BACKEND returns: { token: token, success: true }
      if (data.success && data.token) {
        // console.log('Login successful, token:', data.token);
        return {
          success: true,
          token: data.token,
          message: 'Login successful'
        };
      }
      
      // If login fails
      return { 
        success: false, 
        message: data.message || "Login failed" 
      };
    } catch (error) {
      console.error('Login error details:', error);
      return { 
        success: false, 
        message: error.message || "Login failed" 
      };
    }
  },

  me: async () => {
    try {
      const data = await api.get("/auth/me"); // Direct data
    //   console.log("me api response data:", data);
      
      // BACKEND returns: { user: {...}, success: true }
      if (data.success && data.user) {
        // console.log("User data received:", data.user);
        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        message: data.message || "User not authenticated",
      };
    } catch (error) {
      console.error("me api error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch user",
      };
    }
  },

  // Save token 
  setToken: (token) => {
    localStorage.setItem('token', token);
  
  },

  // Read token 
  getToken: () => {
    const token = localStorage.getItem('token');
    
    return token;
  },

  // Remove token on logout
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  validateToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const isValid = token.split('.').length === 3;
  
    return isValid;
  }
};