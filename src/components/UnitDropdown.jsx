import React from 'react';
import LectureItem from './LectureItem';

const UnitDropdown = ({ unit, openUnits, toggleUnit, setSelectedLecture, navigate, progress, courseId, selectedLecture }) => {
  const isOpen = openUnits[unit._id] || false;


  return (
    <div className="mb-4">
      <button
        onClick={() => {
          toggleUnit(unit._id);
          if (unit.introduction) {
            setSelectedLecture(unit);
            navigate(`/course/${courseId}`);
          }
        }}
        className="w-full text-left p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg font-semibold text-gray-800 hover:bg-blue-200 transition duration-300 flex justify-between items-center"
      >
        <span>{unit.title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          {unit.lectures.map((lecture) => (
            <LectureItem
              key={lecture._id}
              lecture={lecture}
              setSelectedLecture={setSelectedLecture}
              navigate={navigate}
              progress={progress}
              courseId={courseId}
              unitId={unit._id}
              selectedLecture={selectedLecture}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnitDropdown;