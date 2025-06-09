import { api } from "./baseApi";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}
interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<Student, void>({
      query: () => "/api/students/me",
      providesTags: ["Students"],
    }),
    updateMe: builder.mutation<Student, Partial<Student>>({
      query: (body) => ({ url: "/api/students/me", method: "PATCH", body }),
      invalidatesTags: ["Students"],
    }),
    listStudents: builder.query<
      Paginated<Student>,
      { page: number; size: number }
    >({
      query: ({ page, size }) => `/api/students?page=${page}&size=${size}`,
      providesTags: ["Students"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useListStudentsQuery,
} = studentsApi;
