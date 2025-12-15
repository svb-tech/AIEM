import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = authService.getToken();
        
        
        if (token && authService.validateToken()) {
        
          const result = await authService.me();
       
          
          if (result.success && result.user) {
           
            setUser(result.user);
          } else {
            console.log("me() failed, clearing token");
            authService.removeToken();
            setUser(null);
          }
        } else {
          console.log("No valid token found");
          setUser(null);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        authService.removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  // Login function in AuthContext.jsx
const login = async (email, password) => {
  setLoading(true);
  setError("");
  
  try {
   
    
    // Step 1: Authenticate and get token
    const loginResult = await authService.login({ email, password });
 
    
    if (!loginResult.success || !loginResult.token) {
      console.log("Login failed:", loginResult.message);
      setError(loginResult.message || "Login failed");
      setLoading(false);
      return { 
        success: false, 
        message: loginResult.message || "Login failed" 
      };
    }
    
    

    
    // Step 2: Save the token
    authService.setToken(loginResult.token);
    
    // Wait a moment to ensure token is saved
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Step 3: Get user data using the new token
    
    const userResult = await authService.me();
   
    
    if (userResult.success && userResult.user) {
      setUser(userResult.user);
      setLoading(false);
      return { 
        success: true, 
        user: userResult.user 
      };
    } else {
      // If we got token but can't fetch user
      console.log("Failed to fetch user after login:", userResult.message);
      authService.removeToken();
      setUser(null);
      setError("Failed to load user profile");
      setLoading(false);
      return { 
        success: false, 
        message: "Failed to load user profile" 
      };
    }
  } catch (err) {
    console.error("Login error in AuthContext:", err);
    authService.removeToken();
    setUser(null);
    setError("Login failed. Please try again.");
    setLoading(false);
    return { 
      success: false, 
      message: "Login failed. Please try again." 
    };
  }
};
  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError("");
    
    try {
   
      const result = await authService.register(userData);
      
      
      if (result.success) {
        console.log("Registration successful, auto-login...");
        // Auto-login after successful registration
        return await login(userData.email, userData.password);
      } else {
        setError(result.message || "Registration failed");
        setLoading(false);
        return { 
          success: false, 
          message: result.message || "Registration failed" 
        };
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      setLoading(false);
      return { 
        success: false, 
        message: "Registration failed. Please try again." 
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out user");
    authService.removeToken();
    setUser(null);
    setError("");
  };

  // Clear error function
  const clearError = () => setError("");

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user && !!authService.getToken(),
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};