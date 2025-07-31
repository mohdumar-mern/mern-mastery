// import React, { useState, useEffect } from 'react';
// import { useParams, Outlet, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import {
//   useCommentCourseMutation,
//   useGetCourseByIdQuery,
//   useGetProgressQuery,
//   useRateCourseMutation,
// } from '../../app/api/apiSlice/course/courseApiSlice';
// import SecureVideoPlayer from '../SecureVideoPlayer';

// function CourseDetail() {
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id);
//   const { data: progress, isLoading: progressLoading } = useGetProgressQuery();
//   const [rateCourse] = useRateCourseMutation();
//   const [commentCourse] = useCommentCourseMutation();

//   const [rating, setRating] = useState('');
//   const [comment, setComment] = useState('');
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [openUnits, setOpenUnits] = useState({});

//   useEffect(() => {
//     if (!course || selectedLecture) return;

//     const firstUnit = course.units?.[0];
//     if (firstUnit?.introduction) {
//       setSelectedLecture(firstUnit.introduction);
//     } else if (firstUnit?.lectures?.[0]) {
//       setSelectedLecture(firstUnit.lectures[0]);
//     }
//   }, [course, selectedLecture]);

//   const handleRate = async (e) => {
//     e.preventDefault();
//     try {
//       await rateCourse({ courseId: id, data: { rating: Number(rating) } }).unwrap();
//       toast.success('Rating submitted');
//       setRating('');
//     } catch (err) {
//       toast.error(err.data?.message || 'Failed to submit rating');
//     }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     try {
//       await commentCourse({ courseId: id, data: { comment } }).unwrap();
//       toast.success('Comment submitted');
//       setComment('');
//     } catch (err) {
//       toast.error(err.data?.message || 'Failed to submit comment');
//     }
//   };

//   const toggleUnit = (unitId) => {
//     setOpenUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
//   };

//   if (courseLoading || progressLoading) return <div className="text-center p-4">Loading...</div>;
//   if (!course) return <div className="text-center p-4">Course not found</div>;

//   return (
//     <div className="flex flex-col md:flex-row h-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-white">
//       {/* Sidebar */}
//       <aside className="md:w-1/4 bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-xl overflow-y-auto border-r border-gray-200">
//         <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
//           {course.title}
//         </h2>
//         <p className="text-gray-600 mb-6 text-sm">{course.description}</p>

//         {course.units.map((unit) => (
//           <div key={unit._id} className="mb-4">
//             <button
//               onClick={() => {
//                 toggleUnit(unit._id);
//                 if (unit.introduction) {
//                   setSelectedLecture(unit.introduction);
//                   navigate('');
//                 }
//               }}
//               className="w-full text-left p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg font-semibold text-gray-800 hover:bg-blue-200 transition duration-300 flex justify-between items-center"
//             >
//               <span>{unit.title}</span>
//               <span>{openUnits[unit._id] ? '▲' : '▼'}</span>
//             </button>

//             {openUnits[unit._id] && (
//               <div className="mt-2 space-y-2">
//                 {unit.lectures.map((lecture) => {
//                   const isCompleted = progress?.some(
//                     (p) =>
//                       p.courseId === id &&
//                       p.unitId === unit._id &&
//                       p.lectureId === lecture._id &&
//                       p.completed
//                   );

//                   return (
//                     <div key={lecture._id} className="ml-4">
//                       <button
//                         onClick={() => {
//                           setSelectedLecture(lecture);
//                           navigate(`lecture/${lecture._id}`);
//                         }}
//                         className={`w-full text-left p-2 rounded-lg text-sm transition duration-200 ${
//                           selectedLecture?._id === lecture._id
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-50 hover:bg-gray-100'
//                         } ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}
//                       >
//                         {lecture.title} {isCompleted && <span className="text-xs">(Completed)</span>}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </aside>

//       {/* Main Content */}
//       <main className="md:w-3/4 p-6">
//         {selectedLecture && (
//           <SecureVideoPlayer
//             publicId={selectedLecture.publicId}
//             fileType={selectedLecture.fileType}
//             version={selectedLecture.version}
//           />
//         )}

//         <Outlet context={{ selectedLecture }} />

//         {user && (
//           <section className="mt-6 bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Rate this Course</h3>
//             <form onSubmit={handleRate} className="mb-6">
//               <input
//                 type="number"
//                 min="1"
//                 max="5"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Rating (1-5)"
//               />
//               <button
//                 type="submit"
//                 className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Submit Rating
//               </button>
//             </form>

//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>
//             <form onSubmit={handleComment} className="mb-6">
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Add a comment"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Submit Comment
//               </button>
//             </form>

//             {course.comments.map((c) => (
//               <div key={c._id} className="p-3 bg-gray-50 rounded-lg mb-2 shadow-sm">
//                 <p className="text-gray-800">{c.comment}</p>
//                 <p className="text-sm text-gray-500">
//                   By {c.userId.username} on {new Date(c.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             ))}
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// export default CourseDetail;




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
  console.log("course", course);
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
