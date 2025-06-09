import { api } from "./baseApi";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listStudents: builder.query<Student[], { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 } = {}) =>
        `/api/students?page=${page}&size=${size}`,
      providesTags: ["Students"],
    }),
  }),
});

export const { useListStudentsQuery } = studentsApi;
