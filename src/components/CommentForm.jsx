import React from 'react';

const CommentForm = ({ comment, setComment, handleComment }) => (
  <>
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>
    <form onSubmit={handleComment} className="mb-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add a comment"
      />
      <button
        type="submit"
        className="mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Submit Comment
      </button>
    </form>
  </>
);

export default CommentForm;