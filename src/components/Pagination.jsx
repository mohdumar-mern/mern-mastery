import { useCallback } from "react";



const Pagination = ({ currentPage, totalPages,hasNextPage,nextPage,hasPrevPage,pagingCounter, onPageChange, disabled }) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="mt-6 flex justify-center items-center space-x-4">
      <button
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination