import React from 'react';

const LectureItem = ({ lecture, setSelectedLecture, navigate, progress, courseId, unitId, selectedLecture }) => {
  const isCompleted = progress?.some(
    (p) => p.courseId === courseId && p.unitId === unitId && p.lectureId === lecture._id && p.completed
  );

  return (
    <div className="ml-4">
      <button
        onClick={() => {
          setSelectedLecture(lecture);
          navigate(`/course/${courseId}/lecture/${lecture._id}`);
        }}
        className={`w-full text-left p-2 rounded-lg text-sm transition duration-200 ${
          selectedLecture?._id === lecture._id ? 'bg-blue-500 text-white' : 'bg-gray-50 hover:bg-gray-100'
        } ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}
      >
        {lecture.title} {isCompleted && <span className="text-xs">(Completed)</span>}
      </button>
    </div>
  );
};

export default LectureItem;