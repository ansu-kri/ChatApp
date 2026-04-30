import api from "../app/api.jsx";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ================= SIGNUP =================
    signup: builder.mutation({
      query: (formData) => ({
        url: '/signup',
        method: 'POST',
      }),
    }),

    // ================= LOGIN =================
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

    // ================= LOGOUT =================
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;