import apiSlice from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  lastSeen?: string;
}

export const userApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/api/user",
        method: "GET",
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/api/user/me",
        method: "GET",
        providesTags:["User"],
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMeQuery,
} = userApis;