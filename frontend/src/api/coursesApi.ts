import { api } from "./baseApi";

export interface Course {
  id: string;
  name: string;
}
interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listCourses: builder.query<
      Paginated<Course>,
      { page: number; size: number }
    >({
      query: ({ page, size }) => `/api/courses?page=${page}&size=${size}`,
      providesTags: ["Courses"],
    }),
    createCourse: builder.mutation<Course, { name: string }>({
      query: (body) => ({ url: "/api/courses", method: "POST", body }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/courses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useListCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
