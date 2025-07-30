// src/components/CourseList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery } from '../../app/api/apiSlice/course/courseApiSlice';
// import { useGetCoursesQuery } from '../api/apiSlice';

function CourseList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCoursesQuery({ page, limit: 10 });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.courses.map((course) => (
          <Link to={`/courses/${course._id}`} key={course._id} className="p-4 bg-white rounded shadow">
            <h3 className="text-xl">{course.title}</h3>
            <p>{course.description}</p>
            <p className="text-sm text-gray-500">{course.category}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === data?.totalPages}
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CourseList;