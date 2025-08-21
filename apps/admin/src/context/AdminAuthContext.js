// contexts/AdminAuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

const initialState = {
  admin: null,
  token: localStorage.getItem("adminToken"),
  loading: true,
  error: null,
};

const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      localStorage.setItem("adminToken", action.payload.token);
      return {
        ...state,
        loading: false,
        admin: action.payload.admin,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_FAILURE":
      localStorage.removeItem("adminToken");
      return {
        ...state,
        loading: false,
        admin: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("adminToken");
      return {
        ...state,
        admin: null,
        token: null,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await axios.get("/api/auth/me");

          // Check if user is actually an admin
          if (res.data.role !== "admin") {
            throw new Error("Access denied. Admin privileges required.");
          }

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { admin: res.data, token },
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

    checkAdminAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const { user, token } = res.data;

      // Verify admin role
      if (user.role !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { admin: user, token },
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload:
          error.response?.data?.message || error.message || "Login failed",
      });
      throw error;
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const value = {
    admin: state.admin,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
    isAuthenticated: !!state.admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
