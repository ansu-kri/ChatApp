import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  user_id: string;
  email: string;
  exp: number;
}

export interface User {
  userId: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");

        return {
          token: null,
          user: null,
          isAuthenticated: false,
        };
      }

      return {
        token,
        user: {
          userId: decoded.user_id,
          email: decoded.email,
        },
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem("token");

      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
    },

    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;