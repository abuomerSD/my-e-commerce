// contexts/AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_FAILURE":
      localStorage.removeItem("token");
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Set default auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Verify token with backend
          const res = await axios.get("/api/auth/me");
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: res.data, token },
          });
        } catch (error) {
          dispatch({
            type: "LOGIN_FAILURE",
            payload: error.response?.data?.message || "Authentication failed",
          });
        }
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const { user, token } = res.data;

      // Set default auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
  };

  // Clear errors
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
    isAuthenticated: !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
