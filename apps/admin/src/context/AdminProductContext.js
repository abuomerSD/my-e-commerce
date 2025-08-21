// contexts/AdminProductContext.js
import React, { createContext, useReducer, useContext } from "react";
import axios from "axios";

const AdminProductContext = createContext();

const initialState = {
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
  filters: {
    page: 1,
    limit: 10,
    search: "",
    category: "",
  },
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
  },
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case "SET_CURRENT_PRODUCT":
      return { ...state, currentProduct: action.payload, loading: false };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
        error: null,
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        currentProduct:
          state.currentProduct?._id === action.payload._id
            ? action.payload
            : state.currentProduct,
        error: null,
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
        error: null,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AdminProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async (filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const params = new URLSearchParams({
        ...state.filters,
        ...filters,
      }).toString();

      const res = await axios.get(`/api/admin/products?${params}`);
      dispatch({
        type: "SET_PRODUCTS",
        payload: {
          products: res.data.products,
          pagination: res.data.pagination,
        },
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to fetch products",
      });
    }
  };

  const fetchProductById = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await axios.get(`/api/admin/products/${id}`);
      dispatch({ type: "SET_CURRENT_PRODUCT", payload: res.data });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to fetch product",
      });
    }
  };

  const createProduct = async (productData) => {
    try {
      const res = await axios.post("/api/admin/products", productData);
      dispatch({ type: "ADD_PRODUCT", payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to create product",
      });
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await axios.put(`/api/admin/products/${id}`, productData);
      dispatch({ type: "UPDATE_PRODUCT", payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to update product",
      });
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin/products/${id}`);
      dispatch({ type: "DELETE_PRODUCT", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to delete product",
      });
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    clearError,
  };

  return (
    <AdminProductContext.Provider value={value}>
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProducts = () => {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error(
      "useAdminProducts must be used within an AdminProductProvider"
    );
  }
  return context;
};
