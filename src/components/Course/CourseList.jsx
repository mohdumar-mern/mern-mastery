import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery } from '../../app/api/apiSlice/course/courseApiSlice';
import LoadingSpinner from '../LoadingSpinner';


function CourseList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetCoursesQuery({ page, limit: 10 }, {
    refetchOnMountOrArgChange: true, // Refetch on mount or param change
  });

  // Memoized handler to prevent re-creation
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage > 0 && (!data?.totalPages || newPage <= data.totalPages)) {
        setPage(newPage);
      }
    },
    [data?.totalPages]
  );

  // Memoized course list to prevent re-rendering
  const courseList = useMemo(() => {
    return data?.courses.map((course) => (
      <Link
        to={`/course/${course._id}`}
        key={course._id}
        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
        <p className="text-gray-600 line-clamp-2">{course.description}</p>
        <p className="text-sm text-gray-500">{course.category}</p>
      </Link>
    ));
  }, [data?.courses]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="text-center p-4 text-red-500">Error: {error?.data?.message || 'Failed to load courses'}</div>;
  if (!data?.courses?.length) return <div className="text-center p-4 text-gray-500">No courses available</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courseList}
      </div>
      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {data.totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data.totalPages}
          className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CourseList;