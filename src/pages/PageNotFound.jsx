import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = memo(() => {
  const navigate = useNavigate();

  // Memoized navigation handler
  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-yellow-50 to-white text-gray-800 px-6 animate-fade-in"
      role="main"
      aria-label="Page Not Found"
    >
      <img
        src="https://illustrations.popsy.co/white/resistance-band.svg"
        alt="404 Illustration - A visual representation of a lost page"
        className="w-full max-w-md mb-8 object-contain transition-opacity duration-500 hover:opacity-90"
        onError={(e) => {
          e.target.style.display = 'none'; // Hide on error
          // console.error('Image failed to load');
        }}
      />
      <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-4 animate-pulse-once">404</h1>
      <p className="text-xl md:text-2xl font-semibold mb-6 text-gray-700">Oops! Page not found.</p>
      <p className="text-gray-600 mb-8 text-center max-w-md leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={handleBackToHome}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label="Go back to Home page"
      >
        {/* Placeholder for icon - Uncomment and import if using */}
        {/* <FaArrowLeft className="w-4 h-4" /> */}
        Back to Home
      </button>
    </div>
  );
});

// Custom animation keyframes (move to global CSS in production)
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

export default PageNotFound;