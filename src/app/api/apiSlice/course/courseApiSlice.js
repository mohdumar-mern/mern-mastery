import { apiSlice } from "../../apiSlice";


export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: ({ page = 1, limit = 10, search = '', category = '' }) => ({
                url: '/courses',
                params: { page, limit, search, category },
            }),
        }),
        getCourseById: builder.query({
            query: (id) => `/courses/${id}`,
        }),
        getSignedUrl: builder.query({
            query: ({ publicId, fileType }) => ({
                url: '/courses/signed-url',
                method: 'POST',
                body: { publicId, fileType },
            }),
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: '/courses',
                method: 'POST',
                body: data,
            }),
        }),
        addUnit: builder.mutation({
            query: ({ courseId, data, file }) => {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('introductionFile', file);
                return {
                    url: `/courses/${courseId}/units`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        addLecture: builder.mutation({
            query: ({ courseId, unitId, data, file }) => {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('order', data.order);
                formData.append('lectureFile', file);
                return {
                    url: `/courses/${courseId}/units/${unitId}/lectures`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        markLectureCompleted: builder.mutation({
            query: (data) => ({
                url: '/progress/mark-completed',
                method: 'POST',
                body: data,
            }),
        }),
        getProgress: builder.query({
            query: () => '/progress',
        }),
        rateCourse: builder.mutation({
            query: ({ courseId, data }) => ({
                url: `/courses/${courseId}/rate`,
                method: 'POST',
                body: data,
            }),
        }),
        commentCourse: builder.mutation({
            query: ({ courseId, data }) => ({
                url: `/courses/${courseId}/comment`,
                method: 'POST',
                body: data,
            }),
        }),

    })
})


export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useGetSignedUrlQuery,
    useCreateCourseMutation,
    useAddUnitMutation,
    useAddLectureMutation,
    useMarkLectureCompletedMutation,
    useGetProgressQuery,
    useRateCourseMutation,
    useCommentCourseMutation,
} = courseApiSlice
