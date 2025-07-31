import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const HomePage = memo(() => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center animate-fade-in">
      <div
        className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md transform transition-all duration-500 hover:scale-105"
        role="main"
        aria-label="Welcome to MERN Mastery Home Page"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6 animate-pulse-once">
          Welcome to MERN Mastery
        </h1>
        <p className="text-gray-600 mb-8 text-lg md:text-xl leading-relaxed">
          Explore our secure video courses with high-quality streaming and encrypted content. Start your learning journey
          today!
        </p>
        <Link
          to="/courses"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="View available courses"
        >
          View Courses
        </Link>
      </div>
    </div>
  );
});

// Custom animation keyframes (add to your CSS or use inline styles if needed)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulseOnce {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .animate-fade-in { animation: fadeIn 1s ease-in-out; }
  .animate-pulse-once { animation: pulseOnce 1.5s ease-in-out 1; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default HomePage;