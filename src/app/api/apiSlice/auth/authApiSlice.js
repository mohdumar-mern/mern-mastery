import { apiSlice } from "../../apiSlice";
import { logout, setCredentials } from "./authSlice";


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
            authenticated.error(err);
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
            authenticated.error(err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(logout());
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token }));
        } catch (err) {
          dispatch(logout());
          authenticated.error(err)
        }
      },
    }),
       
})
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useRefreshTokenMutation } = authApiSlice;