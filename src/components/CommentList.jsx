import React from 'react';

const CommentList = ({ comments }) => (
  <>
    {comments.map((c) => (
      <div key={c._id} className="p-3 bg-gray-50 rounded-lg mb-2 shadow-sm">
        <p className="text-gray-800">{c.comment}</p>
        <p className="text-sm text-gray-500">
          By {c.userId.username} on {new Date(c.createdAt).toLocaleDateString()}
        </p>
      </div>
    ))}
  </>
);

export default CommentList;