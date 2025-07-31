import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to MERN Mastery</h1>
        <p className="text-gray-600 mb-6">
          Explore our secure video courses with high-quality streaming and encrypted content. Start learning today!
        </p>
        <Link
          to="/courses"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          View Courses
        </Link>
      </div>
    </div>
  );
};

export default HomePage;