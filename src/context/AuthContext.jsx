// context/AuthContext.js
import React, { createContext, useReducer, useEffect } from "react";
import {
  isAuthenticated,
  clearTokens,
  getCurrentProfile,
} from "../service/auth-service";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOADING: "LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });

        if (isAuthenticated()) {
          // Nếu có token, lấy thông tin user
          const userProfile = (await getCurrentProfile())?.data.data;

          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: userProfile,
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Nếu lỗi khi lấy profile, có thể token đã hết hạn
        clearTokens();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    checkAuth();
  }, []);

  // Actions
  const login = (user) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
  };

  const logout = () => {
    clearTokens();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const setUser = (user) => {
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
  };

  const setError = (error) => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const setLoading = (loading) => {
    dispatch({ type: AUTH_ACTIONS.LOADING, payload: loading });
  };

  const value = {
    ...state,
    login,
    logout,
    setUser,
    setError,
    clearError,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
