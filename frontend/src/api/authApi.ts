import { api } from "./baseApi";

type LoginReq = { username: string; password: string };
type LoginRes = { access_token: string; token_type: string };

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, LoginReq>({
      query: (body) => ({
        url: "/auth/jwt/login",
        method: "POST",
        body,
        formData: true,           // FastAPI-Users expects form encoded
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation } = authApi;
