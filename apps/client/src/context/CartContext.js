// contexts/CartContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        loading: false,
        error: null,
      };
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        error: null,
      };
    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    case "UPDATE_QUANTITY":
      const quantityUpdatedItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: quantityUpdatedItems,
        total: quantityUpdatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [], total: 0, error: null };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from server if authenticated, or from localStorage if guest
  useEffect(() => {
    const loadCart = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        if (isAuthenticated) {
          // Load cart from database
          const res = await axios.get("/api/cart");
          dispatch({ type: "SET_CART", payload: { items: res.data.items } });
        } else {
          // Load cart from localStorage
          const savedCart = localStorage.getItem("guestCart");
          if (savedCart) {
            const items = JSON.parse(savedCart);
            dispatch({ type: "SET_CART", payload: { items } });
          }
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data?.message || "Failed to load cart",
        });
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to server if authenticated, or to localStorage if guest
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("guestCart", JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        inStock: product.inStock,
      };

      if (isAuthenticated) {
        await axios.post("/api/cart/add", cartItem);
      }

      dispatch({ type: "ADD_ITEM", payload: cartItem });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to add item to cart",
      });
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        await axios.delete(`/api/cart/remove/${productId}`);
      }

      dispatch({ type: "REMOVE_ITEM", payload: productId });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to remove item from cart",
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      if (isAuthenticated) {
        await axios.put(`/api/cart/update/${productId}`, { quantity });
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to update quantity",
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("guestCart");
  };

  const value = {
    items: state.items,
    total: state.total,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount: state.items.reduce((count, item) => count + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
