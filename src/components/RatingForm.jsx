import React from 'react';

const RatingForm = ({ rating, setRating, handleRate }) => (
  <>
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Rate this Course</h3>
    <form onSubmit={handleRate} className="mb-6 flex items-center">
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
        placeholder="1-5"
      />
      <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Submit Rating
      </button>
    </form>
  </>
);

export default RatingForm;