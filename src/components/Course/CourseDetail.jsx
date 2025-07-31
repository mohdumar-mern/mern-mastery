import React, { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useCommentCourseMutation,
  useGetCourseByIdQuery,
  useGetProgressQuery,
  useRateCourseMutation,
} from '../../app/api/apiSlice/course/courseApiSlice';
import Sidebar from '../Sidebar';
import MainContent from '../MainContent';


function CourseDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id);
  const { data: progress, isLoading: progressLoading } = useGetProgressQuery();
  const [rateCourse] = useRateCourseMutation();
  const [commentCourse] = useCommentCourseMutation();

  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openUnits, setOpenUnits] = useState({});

  useEffect(() => {
    if (!course || selectedLecture) return;

    const firstUnit = course.units?.[0];
    if (firstUnit?.introduction) {
      setSelectedLecture(firstUnit.introduction);
    } else if (firstUnit?.lectures?.[0]) {
      setSelectedLecture(firstUnit.lectures[0]);
    }
  }, [course, selectedLecture]);

  const handleRate = async (e) => {
    e.preventDefault();
    try {
      await rateCourse({ courseId: id, data: { rating: Number(rating) } }).unwrap();
      toast.success('Rating submitted');
      setRating('');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit rating');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await commentCourse({ courseId: id, data: { comment } }).unwrap();
      toast.success('Comment submitted');
      setComment('');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit comment');
    }
  };

  const toggleUnit = (unitId) => {
    setOpenUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  if (courseLoading || progressLoading) return <div className="text-center p-4">Loading...</div>;
  if (!course) return <div className="text-center p-4">Course not found</div>;

  return (
    <div className="flex flex-col md:flex-row h-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-white">
      <Sidebar
        course={course}
        openUnits={openUnits}
        toggleUnit={toggleUnit}
        setSelectedLecture={setSelectedLecture}
        navigate={navigate}
        progress={progress}
        id={id}
        selectedLecture={selectedLecture}
      />
      <MainContent
        selectedLecture={selectedLecture}
        user={user}
        handleRate={handleRate}
        handleComment={handleComment}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        course={course}
      />
    </div>
  );
}

export default CourseDetail;