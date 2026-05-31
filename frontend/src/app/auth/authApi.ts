import apiSlice from "../api";
import { clearCredentials } from "./authSlice";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}
export interface SignupResponse {
  message: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //signup
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    //Login (from data required)
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (userData) => {
        const formData = new URLSearchParams();

        formData.append("username", userData.email);
        formData.append("password", userData.password);

        return {
          url: "/auth/login",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),

    // logout: builder.mutation<{ message: string }, void>({
    //   query: () => ({
    //     url: "/api/auth/logout",
    //     method: "POST",
    //   }),
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       await queryFulfilled;
    //     } catch (error) {
    //       console.log("Logout failed", error);
    //     } finally {
    //       dispatch(clearCredentials());
    //       dispatch(apiSlice.util.resetApiState());
    //     }
    //   },
    //   invalidatesTags: ["Auth"],
    // }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Logout failed", error);
        }

        // Clear auth state
        dispatch(clearCredentials());

        // Reset ALL RTK Query cache
        dispatch(apiSlice.util.resetApiState());

        // Clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        //reset UI state manually (you are missing this)
        dispatch({ type: "chat/reset" });

        //Close sockets (VERY IMPORTANT)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("logout"));
        }
      },
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApis;
