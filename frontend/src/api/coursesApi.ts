import { api } from "./baseApi";

export interface Course {
  id: string;
  name: string;
}

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listCourses: builder.query<Course[], { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 } = {}) =>
        `/api/courses?page=${page}&size=${size}`,
      providesTags: ["Courses"],
    }),
    createCourse: builder.mutation<Course, { name: string }>({
      query: (body) => ({
        url: "/api/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useListCoursesQuery,
  useCreateCourseMutation,
} = coursesApi;
