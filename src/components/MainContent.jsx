import React from 'react';
import SecureVideoPlayer from './SecureVideoPlayer';
import RatingForm from './RatingForm';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Outlet } from 'react-router-dom';


const MainContent = ({ selectedLecture, user, handleRate, handleComment, rating, setRating, comment, setComment, course }) =>{ 

  return (
  <main className="md:w-3/4 p-6">
   
    <Outlet context={{ selectedLecture }} />
    {user && (
      <section className="mt-6 bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-md">
        <RatingForm rating={rating} setRating={setRating} handleRate={handleRate} />
        <CommentForm comment={comment} setComment={setComment} handleComment={handleComment} />
        <CommentList comments={course.comments} />
      </section>
    )}
  </main>
)
}
export default MainContent;